import os
import requests
from openaitest import generate_text

CHUNK_SIZE = 1024
url = "https://api.elevenlabs.io/v1/text-to-speech/4eLfPJnUx5enYbF4ZGcJ"

headers = {
  "Accept": "audio/mpeg",
  "Content-Type": "application/json",
  "xi-api-key": os.environ["XI_API_KEY"]
}

data = {
  "text": generate_text(),
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "stability": 0.5,
    "similarity_boost": 0.5
  }
}

response = requests.post(url, json=data, headers=headers)

with open('output.mp3', 'wb') as f:
    for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
        if chunk:
            f.write(chunk)