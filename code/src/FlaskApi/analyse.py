import requests, json, re
from pymongo import MongoClient
from rapidfuzz import fuzz
from entity_extraction import extract_from_transaction_data
from utils import clean_text, process_aliases, extract_json_from_backticks, extract_json_objects
from individual import gather_evidence_on_individual
from companies import gather_evidence_on_company
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
    print(transaction_data)
    extracted_json = extract_from_transaction_data(transaction_data)
    entities = extracted_json['entities']
    print("------------------------------------------------------------")
    print(extracted_json)
    print("------------------------------------------------------------")
    print(entities)
    print("------------------------------------------------------------")
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
        companies[idx]= gather_evidence_on_company(company)
    
    final_entities = individuals + companies
    print("------------------------------------------------------------")
    print(final_entities)
    print("------------------------------------------------------------")
    keys_to_remove = {'extracted_from', 'type', 'address', 'country', 'email', 'phone', 'note'}
    for index, ent in enumerate(final_entities):
        final_entities[index] = {k : v for k,v in ent.items() if k not in keys_to_remove}

    res = classify_with_llm(transaction_data, final_entities)
    response_text = res.json()['choices'][0]['message']['content']
    final_json = extract_json_objects(response_text)
    print("------------------------------------------------------------")
    print(final_json)
    print("------------------------------------------------------------")
    result_json = {}
    result_json['Transaction ID'] = extracted_json['transaction_id']
    result_json['Extracted Entity'] = [x['name'] for x in final_json[0]]
    result_json['Entity Types'] = [x['type'] for x in final_json[0]]
    result_json['Risk Score'] = final_json[1]['risk_score']
    result_json['Confidence Score'] = final_json[1]['confidence_score']
    result_json['Supporting Evidence'] = [x['justification'] for x in final_json[0]]
    result_json['Reason'] = extracted_json['risk_evaluation']
    return result_json