def generate_prompt(raw_data):
    """
    Generates a few-shot prompt that instructs the LLM to convert raw transaction data
    into a canonical JSON format with additional extraction improvements:
    - Extract extra entities from free-text fields (e.g., additional_notes, raw_content).
    - Normalize entity names (e.g., convert abbreviations like 'Acme Corp' to 'Acme Corporation').
    - Flag uncertain or ambiguous extractions with an explanatory note.
    - Preserve context by indicating which field an entity was extracted from.
    - Provide an extra field "risk_evaluation" where you assess potential risk based on the data.

    The canonical JSON format should follow this structure:
    {
        "transaction_id": <string>,
        "timestamp": <string or null>,
        "sender": {
            "name": <string or null>,
            "account": <string or null>,
            "address": <string or null>,
            "notes": <string or null>,
            "metadata": {}
        },
        "receiver": {
            "name": <string or null>,
            "account": <string or null>,
            "address": <string or null>,
            "tax_id": <string or null>,
            "metadata": {}
        },
        "amount": <string or null>,
        "currency_exchange": <string or null>,
        "transaction_type": <string or null>,
        "reference": <string or null>,
        "additional_notes": [<list of strings>],
        "raw_content": <original input text>,
        "extra_fields": {},
        "risk_evaluation": <string or null>
    }
    """
    few_shot_prompt = f"""
You are an expert data extraction assistant. Your task is to convert the provided transaction data into a canonical JSON format with additional extraction improvements:
- Extract extra entities from free-text fields (e.g., additional_notes, raw_content).
- Normalize entity names (e.g., convert abbreviations like 'Acme Corp' to 'Acme Corporation').
- Flag uncertain or ambiguous extractions with an explanatory note.
- Preserve context by indicating which field an entity was extracted from.
- Provide an extra field "risk_evaluation" where you assess potential risk based on the data.
- Provide a field entities: [] containing all the extracted entities (Entities refer to the sender, receiver, intermediaries and any other individuals mentioned in the transaction data).
- Also note that titles like Mr., Mrs., Dr., etc. should not be included in the extracted names.
- For any individuals found as entities, if their "country", or "phone" or "email" is found in transaction data.
The canonical JSON format should follow this structure:
{{
    "transaction_id": <string>,
    "timestamp": <string or null>,
    "sender": {{
        "name": <string or null>,
        "account": <string or null>,
        "address": <string or null>,
        "notes": <string or null>,
        "metadata": {{}}
    }},
    "receiver": {{
        "name": <string or null>,
        "account": <string or null>,
        "address": <string or null>,
        "tax_id": <string or null>,
        "metadata": {{}}
    }},
    "amount": <string or null>,
    "currency_exchange": <string or null>,
    "transaction_type": <string or null>,
    "reference": <string or null>,
    "additional_notes": [<list of strings>],
    "raw_content": <original input text>,
    "extra_fields": {{}},
    "entities": [],
    "risk_evaluation": <string or null>
}}

Below are examples:

Example 1 (Structured Data):
Input:
{{
    "Transaction ID": "TXN001",
    "Payer Name": "Acme Corp",
    "Receiver Name": "SoVCo Capital Partners",
    "Transaction Details": "Payment for services rendered",
    "Amount": "500000",
    "Receiver Country": "USA"
}}
Output:
{{
    "transaction_id": "TXN001",
    "timestamp": null,
    "sender": {{
        "name": "Acme Corporation",
        "account": null,
        "address": null,
        "notes": null,
        "metadata": {{}}
    }},
    "receiver": {{
        "name": "SoVCo Capital Partners",
        "account": null,
        "address": null,
        "tax_id": null,
        "metadata": {{
            "country": "USA"
        }}
    }},
    "amount": "500000",
    "currency_exchange": null,
    "transaction_type": null,
    "reference": null,
    "additional_notes": [],
    "raw_content": "Original input preserved here",
    "entities": [
        {{
            "name": "Acme Corporation",
            "extracted_from": "Payer Name",
            "type": "company"
        }},
        {{
            "name": "SoVCo Capital Partners",
            "extracted_from": "Receiver Name",
            "type": "company"
        }}
    ],
    "extra_fields": {{
        "Transaction Details": "Payment for services rendered"
    }},
    "risk_evaluation": "Based on known data, SoVCo Capital Partners appears as a standard corporation with no immediate red flags."
}}

Example 2 (Unstructured Data):
Input:
Transaction ID: TXN-2023-5A9B
Date: 2023-08-15 14:22:00
Sender:
 - Name: "Global Horizons Consulting LLC"
 - Account: IBAN CH56 0483 5012 346 7800 9 (Swiss bank)
 - Address: Rue du Marche 17, Geneva, Switzerland
 - Notes: "Consulting fees for project Aurora"
Receiver:
 - Name: "Bright Future Nonprofit Inc"
 - Account: 987654321 (Cayman National Bank, KY)
 - Address: P.O. Box 1234, George Town, Cayman Islands
 - Tax ID: KY-45678
Amount: $49,850.00
Currency Exchange: N/A
Transaction Type: Wire Transfer
Reference: "Charitable Donation - Ref #DR-2023-0815"
Additional Notes:
 - "Urgent transfer approved by Mr. Ali Al-Mansoori (Director, ali.almansoori@globalhorizons.com, USA)."
 - "Linked invoice missing. Processed via intermediary Quantum Holdings Ltd (BVI)."
 - "Sender IP: 192.168.89.123 (VPN detected: NordVPN, exit node in Panama)"
Output:
{{
    "transaction_id": "TXN-2023-5A9B",
    "timestamp": "2023-08-15 14:22:00",
    "sender": {{
        "name": "Global Horizons Consulting LLC",
        "account": "IBAN CH56 0483 5012 346 7800 9",
        "address": "Rue du Marche 17, Geneva, Switzerland",
        "notes": "Consulting fees for project Aurora",
        "metadata": {{
            "account_info": "Swiss bank",
            "extracted_from": "Sender section"
        }}
    }},
    "receiver": {{
        "name": "Bright Future Nonprofit Inc",
        "account": "987654321",
        "address": "P.O. Box 1234, George Town, Cayman Islands",
        "tax_id": "KY-45678",
        "metadata": {{
            "bank": "Cayman National Bank, KY",
            "extracted_from": "Receiver section"
        }}
    }},
    "amount": "$49,850.00",
    "currency_exchange": "N/A",
    "transaction_type": "Wire Transfer",
    "reference": "Charitable Donation - Ref #DR-2023-0815",
    "additional_notes": [
        "Urgent transfer approved by Mr. Ali Al-Mansoori (Director, ali.almansoori@globalhorizons.com, USA).",
        "Linked invoice missing. Processed via intermediary Quantum Holdings Ltd (BVI).",
        "Sender IP: 192.168.89.123 (VPN detected: NordVPN, exit node in Panama)"
    ],
    "raw_content": "Original input preserved here",
    "entities": [
        {{
            "name": "Global Horizons Consulting LLC",
            "extracted_from": "Sender section",
            "type": "company",
            "address": "Rue du Marche 17, Geneva, Switzerland",
            "country": "Switzerland"
        }},
        {{
            "name": "Bright Future Nonprofit Inc",
            "extracted_from": "Receiver section",
            "type": "company",
            "address": "P.O. Box 1234, George Town, Cayman Islands",
            "country": "Cayman Islands",
        }},
        {{
            "name": "Ali Al-Mansoori",
            "extracted_from": "additional_notes",
            "type": "individual"
            "country": "USA",
            "email": "ali.almansoori@globalhorizons.com"
        }},
        {{
            "name": "Quantum Holdings Ltd",
            "extracted_from": "additional_notes",
            "type": "company",
            "country": "BVI (British Virgin Islands)"
        }}
    ],
    "extra_fields": {{}},
    "risk_evaluation": "The transaction involves a potential high-risk element as the additional notes mention a PEP, Mr. Ali Al-Mansoori, and the use of VPN exit nodes. Further investigation is advised."
}}

Now, convert the following input into the canonical JSON format (remember to extract extra entities from free-text fields, normalize names, flag uncertain extractions with a note, and include a risk evaluation. Most importantly, do not and I repeat do not provide any comments inside the generated JSON):
{raw_data}
    """
    return few_shot_prompt