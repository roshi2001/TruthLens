from huggingface_hub import HfApi

api = HfApi()

print("Uploading model.safetensors...")
api.upload_file(
    path_or_fileobj="backend/models/model.safetensors",
    path_in_repo="model.safetensors",
    repo_id="roshi18/truthlens-roberta",
    repo_type="model"
)
print("Uploading config.json...")
api.upload_file(
    path_or_fileobj="backend/models/config.json",
    path_in_repo="config.json",
    repo_id="roshi18/truthlens-roberta",
    repo_type="model"
)
print("Uploading tokenizer.json...")
api.upload_file(
    path_or_fileobj="backend/models/tokenizer.json",
    path_in_repo="tokenizer.json",
    repo_id="roshi18/truthlens-roberta",
    repo_type="model"
)
print("Uploading tokenizer_config.json...")
api.upload_file(
    path_or_fileobj="backend/models/tokenizer_config.json",
    path_in_repo="tokenizer_config.json",
    repo_id="roshi18/truthlens-roberta",
    repo_type="model"
)
print("All files uploaded!")