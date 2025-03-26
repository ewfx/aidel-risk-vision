# Risk Vision AI Architecture

## 1. Overview
The system processes input in the form of files, text, or JSON via a Flask API. It extracts and enriches entity data, classifies entities based on predefined rules, and generates a risk score along with a confidence score.

## 2. System Components

### 2.1 Input Handling
- **Flask API**: Accepts file uploads (JSON, CSV, text).
- **Parsing Module**: Extracts relevant transaction data from uploaded files.

### 2.2 Entity Extraction
- **Prompt Construction**: Constructs a structured prompt using extracted transaction data.
- **LLM Inference**: Uses an LLM to extract entities from the transaction data.

### 2.3 Data Enrichment
- **Entity Categorization**: Entities are classified as individuals or companies.
- **Lookups & Search**:
  - **Individuals**:
    - PEP (Politically Exposed Persons) Collection
    - Criminal Entities Collection
    - Leaks Collection
  - **Companies**:
    - Consolidated Sanctions Collection
    - Criminal Entities Collection
    - Leaks Collection
- **News Extraction**:
  - Fetches news related to each entity.
  - Stores summarized descriptions for further evaluation.

### 2.4 Classification and Score Calculation
- **LLM-Based Inference**:
  - Uses enriched entity data to infer risk classification.
- **Risk and Confidence Scoring**:
  - Risk score and confidence score are computed based on predefined rules.
  - Justification for risk classification is generated using LLM inference.

## 3. Architecture Diagram (Conceptual)

![Alt text](RiskVisionAI.svg)


## 4. Technology Stack
- **Backend**: Flask (Python)
- **LLM**: OpenAI API / Llama / Local LLM
- **Databases**:
  - NoSQL (MongoDB) for entity lookups
- **External APIs**:
  - PEP/Crime Databases
  - News Aggregation APIs
  
## 5. Workflow Summary
1. **Input**: User uploads a file or provides raw text/JSON.
2. **Parsing**: Extracts transaction details.
3. **Entity Extraction**: Uses LLM to extract entities.
4. **Enrichment**: Categorizes and searches entities in various collections.
5. **Classification**: LLM-based classification of entities.
6. **Scoring**: Risk score and confidence score computation.
7. **Response**: Returns results with justification.

This architecture ensures a robust pipeline for risk analysis while leveraging LLM for entity extraction, classification, and scoring.
