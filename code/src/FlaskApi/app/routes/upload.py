from flask import Blueprint, Flask, request, jsonify
import json
import pandas as pd
import os

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