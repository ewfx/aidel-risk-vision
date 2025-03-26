from entity_search import entity_db_search

def gather_pep_evidence(individual):
    fields = individual.keys()
    name = individual['name']
    results = entity_db_search("PEP", name)
    pep_evidence, pep_flag, pep_notes = None, None, None
    if len(results)==0:
        pep_evidence = "Name not found in PEP database"
        pep_flag = 0
    else:
        if 'email' in fields:
            email = individual['email']
            for result in results:
                doc = result[0]
                pep_notes = doc['dataset']
                if 'emails' in doc.keys() and email.lower() in doc['emails'].lower():
                    pep_evidence = 'Individual found in Politically Exposed Persons (PEP) database and email matching'
                    pep_flag = 6
                    break
            else:
                pep_evidence = "Name found in PEP database but email not matching"
                pep_flag = 2
        elif 'phone' in fields:
            phone = individual['phone']
            for result in results:
                doc = result[0]
                if 'phones' in doc.keys() and phone in doc['phones']:
                    pep_evidence = 'Individual found in Politically Exposed Persons (PEP) database and phone matching'
                    pep_flag = 6
                    break
            else:
                pep_evidence = "Name found in PEP database but mobile not matching"
                pep_flag = 3
        elif 'country' in fields:
            country = individual['country']
            for result in results:
                doc = result[0]
                if 'countries' in doc.keys() and country.lower() in doc['countries'].lower():
                    pep_evidence = 'Individual found in Politically Exposed Persons (PEP) database and country matching'
                    pep_flag = 4
                    break
            else:
                pep_evidence = "Name found in PEP database but country not matching"
                pep_flag = 1
        else:
            pep_evidence = "Individual found in Politically Exposed Persons (PEP) database but no additional data such as email, phone, or country to confirm"
            pep_flag = 5

    return pep_evidence, pep_flag, pep_notes

def gather_ce_evidence(individual):
    name = individual['name']
    results = entity_db_search("Criminal-entities", name)
    ce_evidence, ce_flag, ce_notes = None, None, None
    if len(results) == 0:
        ce_evidence = "Name not found in Criminal Entities database"
        ce_flag = -1
    elif results[0][1] == 100:
        ce_evidence = "Individual found in Criminal Entities database with a perfect match"
        ce_flag = 3
        ce_notes = results[0][0]['sanctions']
    else:
        ce_evidence = "Individual found in Criminal Entities database but not a perfect name match"
        ce_flag = 2
        ce_notes = results[0][0]['sanctions']
    return ce_evidence, ce_flag, ce_notes

def gather_leaks_indi_evidence(individual):
    fields = individual.keys()
    name = individual['name']
    for col in ['Leaks-intermediaries', 'Leaks-officers']:
        results = entity_db_search(col, name)
        lei_evidence, lei_flag = None, None
        if len(results)==0:
            lei_evidence = "Individual not found in any of the Panama Papers, Paradise Papers, or Bahamas Leaks"
            lei_flag = 0
        else:
            if 'country' in fields:
                sources = []
                for result in results:
                    doc = result[0]
                    if 'countries' in doc.keys() and individual['country'].lower() in doc['countries'].lower():
                        if col == "Leaks-intermediaries":
                            lei_evidence = f"Individual's name found in {doc["sourceID"]} and is an intermediary currently {doc['status']} in {individual["country"]}"
                        else:
                            lei_evidence = f"Individual's name found in {doc["sourceID"]} and is an officer in {individual["country"]}"
                        lei_flag = 3
                        break
                    else:
                        sources.append(doc["sourceID"])
                if lei_flag!=3:
                    # sources_string = ', '.join(sources)
                    lei_evidence = f"Individual's name found in {', '.join(list(set(sources)))} but country doesn't match"
                    lei_flag = 2
            else:
                lei_evidence = f"Individual's name found in {doc["sourceID"]} but no additional data such as country to confirm"
                lei_flag = 1
        return lei_evidence, lei_flag

def gather_evidence_on_individual(individual):
    individual['pep_evidence'], individual['pep_flag'], individual['pep_notes'] = gather_pep_evidence(individual)
    individual['ce_evidence'], individual['ce_flag'], individual['ce_notes'] = gather_ce_evidence(individual)
    individual['lei_evidence'], individual['lei_flag'] = gather_leaks_indi_evidence(individual)
    return individual