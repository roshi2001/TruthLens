# TruthLens — Real-Time Misinformation Detection Platform

![Python](https://img.shields.io/badge/Python-3.11-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.136-green) ![Neo4j](https://img.shields.io/badge/Neo4j-5.18-blue) ![Kafka](https://img.shields.io/badge/Kafka-7.4-red) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![F1](https://img.shields.io/badge/F1%20Score-98.78%25-brightgreen)

An end-to-end AI-powered misinformation detection platform that streams, processes, and verifies 708K+ real news articles in real time using a knowledge graph, fine-tuned RoBERTa, and hallucination-grounded evaluation.

## Live Links
- 🌐 Frontend: https://truthlens-pied-phi.vercel.app
- 🔗 API Docs: https://truthlens-production-2160.up.railway.app/docs
- 🤗 Model: https://huggingface.co/roshi18/truthlens-roberta
- 📊 W&B: https://wandb.ai/troshitha6-northeastern-university/truthlens
- 💻 GitHub: https://github.com/roshi2001/TruthLens

## Results
| Metric | Score |
|---|---|
| Test F1 (weighted) | **98.78%** |
| Test Accuracy | **99%** |
| Fake precision / recall | 0.98 / 0.99 |
| Real precision / recall | 0.99 / 0.99 |
| Kafka throughput | 28+ articles/sec |
| Articles indexed | 708,241 |
| Pytest coverage | 17/17 passing |
| Dagster pipeline runtime | 36 seconds |

## Architecture
CC-News (708K articles)

↓

Apache Kafka (streaming, 28+ art/sec)

↓

FastAPI Consumer → Neo4j Knowledge Graph

↓

RoBERTa Classifier (fine-tuned, 98.78% F1)

↓

DeepEval Faithfulness Scoring + W&B Tracking

↓

Dagster Orchestration (6-hour schedule)

↓

FastAPI Backend (Railway) → Next.js Frontend (Vercel)

## Tech Stack
| Layer | Tools |
|---|---|
| ML Model | RoBERTa, HuggingFace Transformers, PyTorch |
| Streaming | Apache Kafka (Confluent) |
| Knowledge Graph | Neo4j 5.18 |
| Evaluation | DeepEval, Weights & Biases |
| Orchestration | Dagster |
| Backend | FastAPI, Docker |
| Frontend | Next.js 16, Tailwind CSS, shadcn/ui, Framer Motion |
| Cloud | Railway (backend), Vercel (frontend) |
| Model Hosting | HuggingFace Hub |
| Testing | pytest (17/17), adversarial test suite |

## Setup

```bash
git clone https://github.com/roshi2001/TruthLens.git
cd TruthLens

python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt

docker-compose up -d

cd backend && uvicorn main:app --reload --port 8000
cd frontend && npm install && npm run dev
```

## Project Structure
truthlens/

├── backend/          # FastAPI REST API + RoBERTa classifier

├── frontend/         # Next.js dashboard (Analyze, Dashboard, Performance)

├── pipeline/         # Kafka producer/consumer + Dagster DAGs

├── training/         # RoBERTa fine-tuning + DeepEval evaluation

├── graph/            # Neo4j schema and queries

├── tests/            # pytest test suite (17/17)

└── docker-compose.yml
## Author
Roshitha Tiruveedhula — MS Data Science, Northeastern University  
[LinkedIn](https://linkedin.com/in/roshithatiruveedhulala-b46a64340) | [GitHub](https://github.com/roshi2001)



