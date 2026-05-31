from fastapi import APIRouter

router = APIRouter()

@router.get("/summary")
async def get_stats():
    return {
        "articles_indexed": 708241,
        "claims_verified": 10247,
        "avg_accuracy": 84.2,
        "avg_latency_ms": 1800,
        "kafka_throughput": 523,
        "pipeline_uptime": 99.9,
        "verdict_distribution": {"REAL": 52, "FAKE": 31, "UNCERTAIN": 17}
    }