import re, json
def clean_text(text):
    if not text:
        return ""
    cleaned = re.sub(r"[\"']", "", text)
    return cleaned.strip()

def process_aliases(raw_aliases):
    if not raw_aliases:
        return []
    alias_list = raw_aliases.split(";")
    return [clean_text(alias) for alias in alias_list if alias.strip()]

def extract_json_from_backticks(response_text):
    pattern = r"```(.*?)```"
    match = re.search(pattern, response_text, re.DOTALL)
    
    if match:
        json_str = match.group(1).strip()
        try:
            parsed_json = json.loads(json_str)
            return parsed_json
        except json.JSONDecodeError as e:
            print("Error parsing JSON:", e)
            return None
    else:
        print("No JSON block found between triple backticks.")
        return None