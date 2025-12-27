import zipfile
import os

zip_path = "/app/neon-11.zip"
extract_path = "/app"

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)

print("Unzipped successfully")
