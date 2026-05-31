import pytest
import sys
sys.path.append('..')
from training.adversarial import ADVERSARIAL_CLAIMS, dummy_predict, run_adversarial_tests

def test_fake_claims_detected():
    fake_claims = [c for c in ADVERSARIAL_CLAIMS if c["expected"] == "FAKE"]
    assert len(fake_claims) >= 3

def test_real_claims_present():
    real_claims = [c for c in ADVERSARIAL_CLAIMS if c["expected"] == "REAL"]
    assert len(real_claims) >= 3

def test_uncertain_claims_present():
    uncertain_claims = [c for c in ADVERSARIAL_CLAIMS if c["expected"] == "UNCERTAIN"]
    assert len(uncertain_claims) >= 2

def test_run_adversarial_returns_accuracy():
    accuracy = run_adversarial_tests(dummy_predict)
    assert isinstance(accuracy, float)
    assert 0 <= accuracy <= 100

def test_no_empty_claims():
    for claim in ADVERSARIAL_CLAIMS:
        assert claim["text"].strip() != ""