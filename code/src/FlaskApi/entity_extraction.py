import requests, json, re
from prompts import generate_prompt

def extract_with_llm1(raw_data):
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
  print(transaction_data)
  retries = 3
  while retries > 0:
    try:
      res = extract_with_llm1(transaction_data)
      print(res.json())
      response_text = res.json()['choices'][0]['message']['content']
      result = extract_canonical_json(response_text)
      break
    except Exception as e:
      retries -= 1
      if retries == 0:
        raise e
      continue
  return result