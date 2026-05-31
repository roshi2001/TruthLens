import pandas as pd
import sys
import os
sys.path.append('..')

ADVERSARIAL_CLAIMS = [
    # Clearly false claims that should be detected
    {"text": "The moon is made of cheese and NASA confirmed this in 2023.", "expected": "FAKE"},
    {"text": "Drinking bleach cures all diseases according to WHO.", "expected": "FAKE"},
    {"text": "The Earth is flat and governments are hiding this fact.", "expected": "FAKE"},
    {"text": "Vaccines contain microchips to track people.", "expected": "FAKE"},
    {"text": "Climate change is a hoax invented by scientists for funding.", "expected": "FAKE"},
    # Clearly true claims
    {"text": "The United States declared independence in 1776.", "expected": "REAL"},
    {"text": "Water is composed of hydrogen and oxygen molecules.", "expected": "REAL"},
    {"text": "The COVID-19 pandemic began in 2019.", "expected": "REAL"},
    {"text": "Barack Obama served as the 44th President of the United States.", "expected": "REAL"},
    {"text": "The Great Wall of China is one of the longest structures ever built.", "expected": "REAL"},
    # Tricky mixed claims
    {"text": "Scientists discovered that coffee causes cancer and also prevents it.", "expected": "UNCERTAIN"},
    {"text": "The government released a report that was immediately classified.", "expected": "UNCERTAIN"},
    {"text": "New study shows exercise is both beneficial and harmful.", "expected": "UNCERTAIN"},
]

def run_adversarial_tests(model_predict_fn):
    print("Running adversarial test suite...")
    print(f"Total adversarial cases: {len(ADVERSARIAL_CLAIMS)}")
    
    results = []
    correct = 0
    
    for i, case in enumerate(ADVERSARIAL_CLAIMS):
        prediction = model_predict_fn(case["text"])
        is_correct = prediction == case["expected"]
        if is_correct:
            correct += 1
        
        results.append({
            "claim": case["text"][:60] + "...",
            "expected": case["expected"],
            "predicted": prediction,
            "correct": is_correct
        })
        
        status = "✓" if is_correct else "✗"
        print(f"{status} [{case['expected']} → {prediction}] {case['text'][:50]}...")
    
    accuracy = correct / len(ADVERSARIAL_CLAIMS) * 100
    print(f"\nAdversarial Accuracy: {accuracy:.1f}% ({correct}/{len(ADVERSARIAL_CLAIMS)})")
    
    df = pd.DataFrame(results)
    output_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'adversarial_results.csv')
    df.to_csv(output_path, index=False)
    print("Results saved to data/adversarial_results.csv")
    
    return accuracy

def dummy_predict(text):
    """Placeholder until model is trained"""
    text_len = len(text)
    if text_len % 3 == 0:
        return "FAKE"
    elif text_len % 3 == 1:
        return "REAL"
    return "UNCERTAIN"

if __name__ == "__main__":
    accuracy = run_adversarial_tests(dummy_predict)
    print(f"\nFinal adversarial detection rate: {accuracy:.1f}%")