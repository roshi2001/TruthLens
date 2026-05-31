import torch
import wandb
import numpy as np
from torch.utils.data import DataLoader
from transformers import RobertaForSequenceClassification, RobertaTokenizer
from sklearn.metrics import f1_score, classification_report
from dotenv import load_dotenv
from dataset import LiarDataset
import os

load_dotenv()

def train():
    wandb.init(
        project="truthlens",
        name="roberta-liar-run1",
        config={
            "model": "roberta-base",
            "epochs": 3,
            "batch_size": 16,
            "learning_rate": 2e-5,
            "max_length": 256,
            "num_labels": 3
        }
    )
    config = wandb.config

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    tokenizer = RobertaTokenizer.from_pretrained("roberta-base")
    model = RobertaForSequenceClassification.from_pretrained(
        "roberta-base", num_labels=3
    ).to(device)

    train_dataset = LiarDataset("../data/liar_train.tsv", tokenizer)
    val_dataset = LiarDataset("../data/liar_valid.tsv", tokenizer)

    train_loader = DataLoader(train_dataset, batch_size=config.batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=config.batch_size)

    optimizer = torch.optim.AdamW(model.parameters(), lr=config.learning_rate)

    for epoch in range(config.epochs):
        model.train()
        total_loss = 0
        for batch_idx, batch in enumerate(train_loader):
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['label'].to(device)

            outputs = model(input_ids=input_ids,
                          attention_mask=attention_mask,
                          labels=labels)
            loss = outputs.loss
            loss.backward()
            optimizer.step()
            optimizer.zero_grad()
            total_loss += loss.item()

            if batch_idx % 50 == 0:
                print(f"Epoch {epoch+1} | Batch {batch_idx} | Loss: {loss.item():.4f}")
                wandb.log({"train_loss": loss.item(), "epoch": epoch+1})

        # Validation
        model.eval()
        all_preds, all_labels = [], []
        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                labels = batch['label'].to(device)
                outputs = model(input_ids=input_ids, attention_mask=attention_mask)
                preds = torch.argmax(outputs.logits, dim=1)
                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())

        f1 = f1_score(all_labels, all_preds, average='weighted')
        print(f"\nEpoch {epoch+1} | Val F1: {f1:.4f}")
        print(classification_report(all_labels, all_preds,
              target_names=['true', 'half-true', 'false']))
        wandb.log({"val_f1": f1, "epoch": epoch+1})

    # Save model
    os.makedirs("../models", exist_ok=True)
    model.save_pretrained("../models/roberta-truthlens")
    tokenizer.save_pretrained("../models/roberta-truthlens")
    print("Model saved to ../models/roberta-truthlens")
    wandb.finish()

if __name__ == "__main__":
    train()