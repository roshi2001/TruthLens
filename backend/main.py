from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import claims, stats, graph

app = FastAPI(title="TruthLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(claims.router, prefix="/api/claims", tags=["claims"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app.include_router(graph.router, prefix="/api/graph", tags=["graph"])

@app.get("/")
def health():
    return {"status": "ok", "service": "TruthLens API"}