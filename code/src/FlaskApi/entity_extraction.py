import requests, json, re
from prompts import generate_prompt

def extract_with_llm(raw_data):
  prompt = generate_prompt(raw_data)
  response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
      "Authorization": "Bearer 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",
      "Content-Type": "application/json",
    },
    data=json.dumps({
      "model": "nvidia/llama-3.1-nemotron-70b-instruct:free",
      "messages": [
        {
          "role": "user",
          "content": prompt,
          "temperature":0.1
        }
      ],
    })
  )
  return response

def extract_canonical_json(response_text):
    print(response_text)
    start = response_text.find('{')
    end = response_text.rfind('}')
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in the response.")

    json_text = response_text[start:end+1]

    json_text = json_text.strip()

    try:
        result = json.loads(json_text)
        return result
    except json.JSONDecodeError as e:
        raise ValueError("Failed to parse extracted JSON.") from e

def extract_from_transaction_data(transaction_data):
  retries = 3
  while retries > 0:
    try:
      res = extract_with_llm(transaction_data)
      response_text = res.json()['choices'][0]['message']['content']
      result = extract_canonical_json(response_text)
      break
    except Exception as e:
      retries -= 1
      if retries == 0:
        raise e
      continue
  return result