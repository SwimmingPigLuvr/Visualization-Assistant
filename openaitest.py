from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)

@app.route('/generate-text', methods=['POST'])
def generate_text():
    user_input = request.json['userInput']
    client = OpenAI()
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a visualization assistant, adept at crafting detailed and immersive scenarios. Your expertise lies in helping users not only see but also feel the nuances of their envisioned futures, making these visualizations feel as real and tangible as possible. By focusing on sensory details and emotional cues, you guide users to experience their dreams vividly, as if they were already true."},
            {"role": "user", "content": "papi zephy is goated?"}
        ]
    )
    
    return jsonify({completion.choices[0].message.content})

if __name__ == "__main__":
    app.run(debug=True)


