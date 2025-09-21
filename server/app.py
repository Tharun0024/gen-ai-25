from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import re
import torch
from transformers import pipeline
from dotenv import load_dotenv
import vertexai
from vertexai.preview.generative_models import GenerativeModel
from google.cloud import documentai_v1 as documentai

load_dotenv()

# Set GOOGLE_APPLICATION_CREDENTIALS from .env
cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if cred_path:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = cred_path

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

# Initialize Vertex AI (Gemini)
vertexai.init(project=project_id, location=vertex_region)
gemini_model = GenerativeModel("gemini-2.5-flash")

# Initialize Document AI client
docai_client = documentai.DocumentProcessorServiceClient()
docai_name = docai_client.processor_path(project_id, docai_region, processor_id)


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file:
        return JSONResponse({"error": "No file uploaded"}, status_code=400)

    file_bytes = await file.read()

    # Process document with Document AI
    raw_document = documentai.RawDocument(content=file_bytes, mime_type=file.content_type)
    request_docai = documentai.ProcessRequest(name=docai_name, raw_document=raw_document)
    result = docai_client.process_document(request=request_docai)
    doc_text = result.document.text

    # Generate summary
    summary_prompt = f"Summarize this text in simple and clear words:\n{doc_text}"
    summary_responses = gemini_model.generate_content(summary_prompt, stream=True)
    summary = "".join([r.candidates[0].content.parts[0].text for r in summary_responses])

    # Generate risks and risk score
    risk_prompt = f"""
    Identify and list all potential RISKS or DISADVANTAGEOUS clauses in this document.
    For each risk, explain briefly WHY it may be a problem.
    Additionally, provide a risk score from 1 (low) to 10 (high).
    Format output as bullet points:
    - Risk: [short risk statement]. Reason: [why it's risky].
    Risk score:
    Text:
    {doc_text}
    """
    risk_responses = gemini_model.generate_content(risk_prompt, stream=True)
    risks_and_score = "".join([r.candidates[0].content.parts[0].text for r in risk_responses])

    # Generate pros and cons
    pros_cons_prompt = f"""
    List the PROS and CONS of the following document in bullet points:
    Text:
    {doc_text}
    """
    pros_cons_responses = gemini_model.generate_content(pros_cons_prompt, stream=True)
    pros_cons = "".join([r.candidates[0].content.parts[0].text for r in pros_cons_responses])

    return JSONResponse({
        "extracted_text": doc_text,
        "summary": summary,
        "risks_and_score": risks_and_score,
        "pros_cons": pros_cons
    })


@app.post("/ask")
async def ask_question(
    user_question: str = Form(...),
    doc_text: str = Form("")
):
    if not doc_text:
        return JSONResponse({"error": "No document uploaded yet"}, status_code=400)

    prompt = f"Answer the question based on the following document:\n\n{doc_text}\n\nQuestion: {user_question}"
    responses = gemini_model.generate_content(prompt, stream=True)
    answer = "".join([r.candidates[0].content.parts[0].text for r in responses])

    return JSONResponse({"answer": answer})

# Run with:
# uvicorn app:app --reload --host 0.0.0.0 --port 5000

#privacy layer
device = 0 if torch.cuda.is_available() else -1

ner_pipeline = pipeline(
    "ner",
    model="xlm-roberta-large-finetuned-conll03-english",
    aggregation_strategy="simple",  # groups tokens into full entities
    device=device
)

# -------------------------
# Regex patterns for sensitive info
# -------------------------
regex_patterns = {
    "EMAIL": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
    "PHONE": r"(\+?\d{1,3}[-\s]?)?\(?\d{2,5}\)?[-\s]?\d{3,5}[-\s]?\d{4}",
    "ADDRESS": r"\d{1,5}\s[\w\s.,-]+(Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Block|Sector)",
    #"DATE": r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{1,2},?\s\d{2,4}\b",
    "PAN": r"\b[A-Z]{5}[0-9]{4}[A-Z]\b",
    "AADHAAR": r"\b\d{12}\b",
    "SSN": r"\b\d{3}-\d{2}-\d{4}\b",
    "ACCOUNT": r"\b\d{9,18}\b",
    "IFSC": r"\b[A-Z]{4}0[A-Z0-9]{6}\b",
    "IBAN": r"\b[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}\b",
    #"MONEY": r"(?:₹|\$|Rs\.?)\s?\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?",
    "CONFIDENTIAL": r"\b(Confidential Information|Non[- ]Disclosure Agreement|Proprietary Data)\b"
}

# -------------------------
# Main Privacy Layer Function
# -------------------------
def privacy_layer(text: str):
    original_text = text
    redacted_text = text

    # Step 1: Apply Hugging Face NER
    entities = ner_pipeline(text)
    for ent in entities:
        label = ent["entity_group"]
        word = ent["word"]
        placeholder = f"[REDACTED:{label}]"
        redacted_text = re.sub(rf"\b{re.escape(word)}\b", placeholder, redacted_text)

    # Step 2: Apply Regex patterns
    for label, pattern in regex_patterns.items():
        redacted_text = re.sub(pattern, f"[REDACTED:{label}]", redacted_text, flags=re.IGNORECASE)

    return {
        #"original_text": original_text,
        "masked_text": redacted_text
    }