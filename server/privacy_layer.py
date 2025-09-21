# privacy_layer.py
import re
import torch
from transformers import pipeline

# -------------------------
# Load Hugging Face NER model with auto device detection
# -------------------------
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
