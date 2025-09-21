from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from dotenv import load_dotenv
import vertexai
from google.cloud import documentai_v1 as documentai
from privacy_layer import privacy_layer  # Import the privacy function from privacy.py
# Import generative model classes lazily inside handlers to avoid init-time issues

load_dotenv()

import tempfile

google_creds_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if google_creds_json:
    temp_dir = tempfile.gettempdir()
    creds_path = os.path.join(temp_dir, "gg.json")

    with open(creds_path, "w") as f:
        f.write(google_creds_json)
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = creds_path

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development. For production, you should restrict this.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load environment variables required for Google APIs
project_id = os.getenv("project_id")
vertex_region = os.getenv("vertex_region")
docai_region = os.getenv("docai_region")
processor_id = os.getenv("processor_id")

# Lazy-initialized clients/objects
_clients = {
    "vertex_initialized": False,
    "docai_client": None,
    "docai_name": None,
}


def ensure_clients():
    """Initialize Vertex AI and Document AI clients lazily.

    This avoids raising during module import when ADC or project ID
    are not configured. Returns a tuple (ok, message). If ok is False,
    message contains a user-facing error description.
    """
    if _clients["vertex_initialized"] and _clients["docai_client"]:
        return True, ""

    # Basic validation
    if not project_id or not vertex_region:
        return False, "Missing GCP project or Vertex region. Set project_id and vertex_region in your environment."

    try:
        # Initialize Vertex AI
        vertexai.init(project=project_id, location=vertex_region)
        _clients["vertex_initialized"] = True
    except Exception as e:
        return False, f"Failed to initialize Vertex AI: {e}"

    try:
        # Initialize Document AI client if processor info is provided
        if processor_id and docai_region:
            docai_client = documentai.DocumentProcessorServiceClient()
            docai_name = docai_client.processor_path(project_id, docai_region, processor_id)
            _clients["docai_client"] = docai_client
            _clients["docai_name"] = docai_name
        else:
            # It's acceptable for some deployments to not use Document AI
            _clients["docai_client"] = None
            _clients["docai_name"] = None
    except Exception as e:
        return False, f"Failed to initialize Document AI client: {e}"

    return True, ""


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file:
        return JSONResponse({"error": "No file uploaded"}, status_code=400)

    file_bytes = await file.read()

    ok, msg = ensure_clients()
    if not ok:
        return JSONResponse({"error": msg}, status_code=500)

    # Extract text with Document AI if available, otherwise decode file to text fallback
    docai_client = _clients.get("docai_client")
    docai_name = _clients.get("docai_name")
    doc_text = ""

    if docai_client and docai_name:
        try:
            raw_document = documentai.RawDocument(content=file_bytes, mime_type=file.content_type)
            request_docai = documentai.ProcessRequest(name=docai_name, raw_document=raw_document)
            result = docai_client.process_document(request=request_docai)
            doc_text = result.document.text
        except Exception:
            # Fall back to raw bytes decode if document AI fails
            try:
                doc_text = file_bytes.decode("utf-8", errors="replace")
            except Exception:
                doc_text = ""
    else:
        try:
            doc_text = file_bytes.decode("utf-8", errors="replace")
        except Exception:
            doc_text = ""
    privacy_text = privacy_layer(doc_text)
    doc_text = privacy_text['masked_text']    

    # Generate Summary, Risks, Pros, and Cons in a single call using Vertex AI
    try:
        # Import model classes lazily to avoid SDK initialization at module import
        from vertexai.generative_models import GenerativeModel, GenerationConfig

        # Create model instance per-request to avoid init-time issues
        gemini_model = GenerativeModel(
            "gemini-2.5-flash",
            generation_config=GenerationConfig(
                temperature=0.2,
                response_mime_type="application/json",
            )
        )
        analysis_prompt = f"""
        Analyze the following document and provide the following in a JSON format:
        1. A "summary" of the document in simple and clear words.
        2. A "risk_score" from 1 (low risk) to 100 (high risk).
        3. A list of "pros" (favorable terms) as an array of strings.
        4. A list of "cons" (risk factors or unfavorable terms) as an array of strings.
        
        Document:
        {doc_text} 
        """

        analysis_response = gemini_model.generate_content(analysis_prompt)

        try:
            response_text = analysis_response.candidates[0].content.parts[0].text
            analysis_data = json.loads(response_text)
        except (ValueError, IndexError, KeyError) as e:
            return JSONResponse({"error": f"Failed to parse analysis from model: {e}"}, status_code=500)

        return JSONResponse({
            "extracted_text": doc_text,
            "summary": analysis_data.get("summary", ""),
            "risk_score": analysis_data.get("risk_score", 0),
            "cons": analysis_data.get("cons", []),
            "pros": analysis_data.get("pros", [])
        })
    except Exception as e:
        return JSONResponse({"error": f"Model error: {e}"}, status_code=500)



@app.post("/ask")
async def ask_question(
    user_question: str = Form(...),
    doc_text: str = Form("")
):
    if not doc_text:
        return JSONResponse({"error": "No document uploaded yet"}, status_code=400)
    ok, msg = ensure_clients()
    if not ok:
        return JSONResponse({"error": msg}, status_code=500)

    prompt = f"Answer the question based on the following document:\n\n{doc_text}\n\nQuestion: {user_question}"
    try:
        from vertexai.generative_models import GenerativeModel

        model = GenerativeModel("gemini-2.5-flash")
        # Use non-streaming generate_content for simpler response handling
        resp = model.generate_content(prompt)
        answer = resp.candidates[0].content.parts[0].text
        return JSONResponse({"answer": answer})
    except Exception as e:
        return JSONResponse({"error": f"Model generation failed: {e}"}, status_code=500)

# Run with:
# uvicorn app:app --reload --host 0.0.0.0 --port 8000
