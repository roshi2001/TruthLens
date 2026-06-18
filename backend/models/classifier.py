import torch
from transformers import RobertaTokenizer, RobertaForSequenceClassification

MODEL_ID = "roshi18/truthlens-roberta"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = None
model = None

def load_model():
    global tokenizer, model
    if model is None:
        print("Loading TruthLens RoBERTa model from HuggingFace...")
        tokenizer = RobertaTokenizer.from_pretrained(MODEL_ID)
        model = RobertaForSequenceClassification.from_pretrained(MODEL_ID)
        model.to(device)
        model.eval()
        print("Model loaded!")

def predict(text: str) -> dict:
    load_model()
    inputs = tokenizer(
        text[:512],
        max_length=256,
        padding='max_length',
        truncation=True,
        return_tensors='pt'
    ).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)
        pred = torch.argmax(probs, dim=1).item()
        confidence = probs[0][pred].item()

    label_map = {0: "FAKE", 1: "REAL"}
    verdict = label_map[pred]

    return {
        "verdict": verdict,
        "confidence": round(confidence * 100, 2),
        "fake_prob": round(probs[0][0].item() * 100, 2),
        "real_prob": round(probs[0][1].item() * 100, 2)
    }