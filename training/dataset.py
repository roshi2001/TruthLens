import pandas as pd
import torch
from torch.utils.data import Dataset
from transformers import RobertaTokenizer

LIAR_COLUMNS = [
    'id', 'label', 'statement', 'subject', 'speaker',
    'job_title', 'state_info', 'party', 'barely_true_count',
    'false_count', 'half_true_count', 'mostly_true_count',
    'pants_on_fire_count', 'context'
]

LABEL_MAP = {
    'true': 0,
    'mostly-true': 0,
    'half-true': 1,
    'barely-true': 1,
    'false': 2,
    'pants-fire': 2
}

class LiarDataset(Dataset):
    def __init__(self, filepath, tokenizer, max_length=256):
        self.data = pd.read_csv(filepath, sep="\t", 
                               header=None, names=LIAR_COLUMNS)
        self.data['binary_label'] = self.data['label'].map(LABEL_MAP)
        self.data = self.data.dropna(subset=['binary_label'])
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        row = self.data.iloc[idx]
        encoding = self.tokenizer(
            str(row['statement']),
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        return {
            'input_ids': encoding['input_ids'].squeeze(),
            'attention_mask': encoding['attention_mask'].squeeze(),
            'label': torch.tensor(int(row['binary_label']), dtype=torch.long)
        }

if __name__ == "__main__":
    tokenizer = RobertaTokenizer.from_pretrained('roberta-base')
    train_data = LiarDataset("data/liar_train.tsv", tokenizer)
    print(f"Training samples: {len(train_data)}")
    print(f"Sample: {train_data[0]}")
    print("Label distribution:")
    print(train_data.data['binary_label'].value_counts())