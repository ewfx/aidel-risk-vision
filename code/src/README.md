# RiskVision AI Local Setup for Flask API and React Frontend

This guide provides instructions to set up the Flask API for ML processing and the React frontend to display the results.

---

## Prerequisites

Ensure you have the following installed on your system:
- Python 3.8 or higher
- Node.js (LTS version recommended)
- npm or yarn
- Git

---

## Setting Up the Flask API

1. Navigate to the Flask API directory:
   ```bash
   cd code/src/FlaskApi

2.Create a virtual environment:
```
python3 -m venv venv
```

3.Activate the virtual environment:
On macOS/Linux:


On Windows:
```
env\Scripts\activate
```

4.Install the required dependencies:
```
pip install -r requirements.txt
```

5.Run the Flask API:
Go to the folder FlaskAPI
```
Python run.py
```

By default, the API will be available at http://127.0.0.1:5000.

## Setting Up the React Frontend
1.Navigate to the React frontend directory:
```
cd code/src/RiskVisionReactUI
```

2.Install the required dependencies:
```
npm install
```

3.Start the development server:
```
npm start
```