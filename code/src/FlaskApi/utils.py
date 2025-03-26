import re
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