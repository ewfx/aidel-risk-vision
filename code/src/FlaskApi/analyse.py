import requests, json, re
from pymongo import MongoClient
from rapidfuzz import fuzz
from newsapi import NewsApiClient
from entity_extraction import extract_from_transaction_data
from utils import clean_text, process_aliases

unstructured_input = """Transaction ID: TXN-2023-5A9B
Date: 2023-08-15 14:22:00
Sender:
 - Name: "Digital Marketing Awards FZ LLC"
 - Account: IBAN CH56 0483 5012 346 7800 9 (Swiss bank)
 - Address: COMPASS BUILDING FDRK 2508, AL SHOHADA ROAD, AL HAMRA INDUSTRIAL ZONE-FZ, RAS AL KHAIMAH, ARE, United Arab Emirates
 - Notes: "Consulting fees for project Aurora led by Sanavbari Nikitenko"
Receiver:
 - Name: "8808 HOLDING LIMITED"
 - Account: 987654321 (HongKong National Bank, Hong Kong)
 - Address: TWC MANAGEMENT LIMITED SUITE D; 19/F RITZ PLAZA122 AUSTIN ROADTSIM SHA TSUI; KOWLOON HONG KONG
 - Tax ID: HK-45678
Amount: $49,860.00
Currency Exchange: N/A
Transaction Type: Wire Transfer
Reference: "Charitable Donation - Ref #DR-2023-0815"
Additional Notes:
 - "Urgent transfer approved by Mr. Trevor Prescod (India, prescod.trevor@gmail.com)."
 - "Transfer backed by Mr. Trevor Squirrell (US, tsquirrell@leg.state.vt.us)."
 - "Will further be taken care of by Mr. Corfiducia Anstalt (Liechtenstein)"
 - "Linked invoice missing. Processed via intermediary Quantum Holdings Ltd (BVI)."
 - Sender IP: 192.168.89.123 (VPN detected: NordVPN, exit node in Panama)"""


def analyse(transaction_data):
    extracted_json = extract_from_transaction_data(unstructured_input)
    entities = extracted_json['entities']

    client = MongoClient('mongodb://localhost:27017')
    db = client['local']
