import pytest
import sys
sys.path.append('..')
from training.adversarial import ADVERSARIAL_CLAIMS, dummy_predict

def test_adversarial_claims_exist():
    assert len(ADVERSARIAL_CLAIMS) >= 10

def test_adversarial_claims_have_required_fields():
    for claim in ADVERSARIAL_CLAIMS:
        assert "text" in claim
        assert "expected" in claim
        assert claim["expected"] in ["REAL", "FAKE", "UNCERTAIN"]

def test_dummy_predict_returns_valid_verdict():
    result = dummy_predict("This is a test claim about politics.")
    assert result in ["REAL", "FAKE", "UNCERTAIN"]

def test_dummy_predict_not_empty():
    result = dummy_predict("test")
    assert result is not None
    assert len(result) > 0

def test_all_claims_are_strings():
    for claim in ADVERSARIAL_CLAIMS:
        assert isinstance(claim["text"], str)
        assert len(claim["text"]) > 10