from flask import Blueprint, Flask, request, jsonify
import json
import pandas as pd
import os
from analyse import analyse

bp = Blueprint('main', __name__)


@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_ext = os.path.splitext(file.filename)[1].lower()

    try:
        if file_ext == '.json':
            data = json.load(file)
            print(" JSON FILE FORMAT")
            return jsonify({"type": "json", "content": data})
        
        elif file_ext == '.txt':
            data = file.read().decode('utf-8')
            print(" TEXT FILE FORMAT")
            return jsonify({"type": "text", "content": data})
        
        elif file_ext == '.csv':
            df = pd.read_csv(file)
            print(" CSV FILE FORMAT")
            return jsonify({"type": "csv", "content": df.to_dict(orient='records')})
        
        else:
            return jsonify({"error": "Unsupported file type"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# unstructured_input = """Transaction ID: TXN-2023-5A9B
# Date: 2023-08-15 14:22:00
# Sender:
#  - Name: "Digital Marketing Awards FZ LLC"
#  - Account: IBAN CH56 0483 5012 346 7800 9 (Swiss bank)
#  - Address: COMPASS BUILDING FDRK 2508, AL SHOHADA ROAD, AL HAMRA INDUSTRIAL ZONE-FZ, RAS AL KHAIMAH, ARE, United Arab Emirates
#  - Notes: "Consulting fees for project Aurora led by Sanavbari Nikitenko"
# Receiver:
#  - Name: "8808 HOLDING LIMITED"
#  - Account: 987654321 (HongKong National Bank, Hong Kong)
#  - Address: TWC MANAGEMENT LIMITED SUITE D; 19/F RITZ PLAZA122 AUSTIN ROADTSIM SHA TSUI; KOWLOON HONG KONG
#  - Tax ID: HK-45678
# Amount: $49,860.00
# Currency Exchange: N/A
# Transaction Type: Wire Transfer
# Reference: "Charitable Donation - Ref #DR-2023-0815"
# Additional Notes:
#  - "Urgent transfer approved by Mr. Trevor Prescod (India, prescod.trevor@gmail.com)."
#  - "Transfer backed by Mr. Trevor Squirrell (US, tsquirrell@leg.state.vt.us)."
#  - "Will further be taken care of by Mr. Corfiducia Anstalt (Liechtenstein)"
#  - "Linked invoice missing. Processed via intermediary Quantum Holdings Ltd (BVI)."
#  - Sender IP: 192.168.89.123 (VPN detected: NordVPN, exit node in Panama)"""

@bp.route('/jsonortext', methods=['POST'])
def process_input():
    if request.is_json:
        data = request.get_json()
        analyse(data)
        print("JSON"+data)
    else:
        data = request.data.decode('utf-8')
        analyse(data)
        print("TEXT"+data)
    
    # Process the input (optional, for now, we just return success)
    return jsonify(success=True)