from pymongo import MongoClient
from rapidfuzz import fuzz

def entity_db_search(collection_name, search_term, threshold=80):
    client = MongoClient('mongodb://localhost:27017')
    db = client['local']
    collection = db[collection_name]
    search_term = search_term.lower()
    query = { "$text": { "$search": search_term } }
    candidates = list(collection.find(query))
    
    scored_candidates = []
    if collection_name == "PEP":
        for doc in candidates:
            name_value = doc.get("name", "").lower()
            aliases_value = doc.get("aliases", "").lower()
            name_score = fuzz.token_set_ratio(search_term, name_value) if len(name_value)!=0 else -1
            aliases_score = fuzz.token_set_ratio(search_term, aliases_value) if len(aliases_value)!=0 else -1
            best_score = max(name_score, aliases_score)
            if best_score >= threshold:
                scored_candidates.append((doc, best_score))
        
        scored_candidates.sort(key=lambda x : x[1], reverse=True)
        return scored_candidates
    elif collection_name in ["Criminal-entities", "Leaks-intermediaries", "Leaks-others"]:
        for doc in candidates:
            name_value = doc.get("name", "").lower()
            name_score = fuzz.token_set_ratio(search_term, name_value) if len(name_value)!=0 else -1
            if name_score >= threshold:
                scored_candidates.append((doc, name_score))
        
        scored_candidates.sort(key=lambda x : x[1], reverse=True)
        return scored_candidates
    elif collection_name == "Leaks-entities":
        for doc in candidates:
            name_value = doc.get("name","").lower()
            original_name = doc.get("original_name","").lower()
            former_name = doc.get("former_name","").lower()
            name_score = fuzz.token_set_ratio(search_term, name_value) if len(name_value)!=0 else -1
            original_name_score = fuzz.token_set_ratio(search_term, original_name) if len(original_name)!=0 else -1
            former_name_score = fuzz.token_set_ratio(search_term, former_name) if len(former_name)!=0 else -1
            best_score = max(name_score, original_name_score, former_name_score)
            if best_score >= threshold:
                scored_candidates.append((doc, best_score))
        scored_candidates.sort(key=lambda x : x[1], reverse=True)
        return scored_candidates
    elif collection_name == "Consolidated-Sanctions":
        for doc in candidates:
            name = doc.get("name", "")
            aliases = doc.get("aliases", "")
            cleaned_name = clean_text(name)
            cleaned_aliases = process_aliases(aliases)
            cleaned_aliases.append(cleaned_name)
            best_score = -1
            for alias in cleaned_aliases:
                if len(alias)>0:
                    best_score = max(best_score, fuzz.token_set_ratio(search_term, alias))
            if best_score >= threshold:
                scored_candidates.append((doc, best_score))
        scored_candidates.sort(key=lambda x : x[1], reverse=True)
        return scored_candidates