import requests, json, re
from pymongo import MongoClient
from rapidfuzz import fuzz
from entity_extraction import extract_from_transaction_data
from utils import clean_text, process_aliases, extract_json_from_backticks
from individual import gather_evidence_on_individual
from prompts import generate_classification_prompt

def classify_with_llm(transaction_data, enriched_entities):
    prompt = generate_classification_prompt(enriched_entities, transaction_data)
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


def analyse(transaction_data):
    extracted_json = extract_from_transaction_data(unstructured_input)
    entities = extracted_json['entities']
    
    individuals = []
    for x in entities:
        if 'individual' in x['type']:
            individuals.append(x)
    for idx, individual in enumerate(individuals):
        individual[idx]= gather_evidence_on_individual(individual)

    companies = []
    for x in entities:
        if 'company' in x['type']:
            companies.append(x.copy())

    for idx, company in enumerate(companies):
        companies[idx]= gather_evidence_on_individual(company)
    
    final_entities = individuals + companies

    keys_to_remove = {'extracted_from', 'type', 'address', 'country', 'email', 'phone', 'note'}
    for index, ent in enumerate(final_entities):
        final_entities[index] = {k : v for k,v in ent.items() if k not in keys_to_remove}

    res = classify_with_llm(unstructured_input, final_entities)
    response_text = res.json()['choices'][0]['message']['content']
    result = extract_json_from_backticks(response_text)