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
            return analyse(data)
        
        elif file_ext == '.txt':
            data = file.read().decode('utf-8')
            print(" TEXT FILE FORMAT")
            return analyse(data)
        
        elif file_ext == '.csv':
            df = pd.read_csv(file)
            print(" CSV FILE FORMAT")
            return analyse(data)
        
        else:
            return jsonify({"error": "Unsupported file type"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/jsonortext', methods=['POST'])
def process_input():
    if request.is_json:
        data = request.get_json()
        # analyse(data['data'])
        # print("JSON"+data)
    else:
        data = request.data.decode('utf-8')
        # analyse(data['data'])
        # print("TEXT"+data)
    
    # Process the input (optional, for now, we just return success)
    return analyse(data)