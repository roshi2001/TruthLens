from fastapi import APIRouter

router = APIRouter()

@router.get("/stats")
async def get_graph_stats():
    return {"nodes": 15420, "relationships": 48300, "sources": 127}