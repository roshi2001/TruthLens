import os
import sys
from dotenv import load_dotenv
load_dotenv()

from deepeval import evaluate
from deepeval.metrics import FaithfulnessMetric, AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase
import pandas as pd

def run_evaluation(sample_size=50):
    print(f"Running DeepEval faithfulness evaluation on {sample_size} samples...")
    
    # Load test claims
    liar = pd.read_csv("../data/liar_test.tsv", sep="\t", header=None)
    liar.columns = [
        'id', 'label', 'statement', 'subject', 'speaker',
        'job_title', 'state_info', 'party', 'barely_true_count',
        'false_count', 'half_true_count', 'mostly_true_count',
        'pants_on_fire_count', 'context'
    ]
    
    samples = liar.head(sample_size)
    
    faithfulness_metric = FaithfulnessMetric(
        threshold=0.7,
        model="gpt-3.5-turbo",
        include_reason=True
    )
    
    test_cases = []
    for _, row in samples.iterrows():
        test_case = LLMTestCase(
            input=str(row['statement']),
            actual_output=f"This claim is {row['label']} based on available evidence.",
            retrieval_context=[str(row['context']) if pd.notna(row['context']) else "No context available"]
        )
        test_cases.append(test_case)
    
    results = evaluate(test_cases, [faithfulness_metric])
    
    scores = [r.metrics_data[0].score for r in results.test_results if r.metrics_data]
    avg_score = sum(scores) / len(scores) if scores else 0
    
    print(f"\nEvaluation Results:")
    print(f"Average Faithfulness Score: {avg_score:.3f}")
    print(f"Samples evaluated: {len(scores)}")
    print(f"Passed threshold (0.7): {sum(1 for s in scores if s >= 0.7)}/{len(scores)}")
    
    return avg_score

if __name__ == "__main__":
    run_evaluation()