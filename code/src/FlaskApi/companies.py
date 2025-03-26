from newsapi import NewsApiClient
from entity_search import entity_db_search

def gather_leaks_company_evidence(company):
    name = company['name']
    fields = company.keys()
    # Leaks-entities
    results = entity_db_search("Leaks-entities", name)
    leaks_ent_evidence, leaks_ent_flag = None, None
    if len(results)==0:
        leaks_ent_evidence = 'Company not found in any of the Panama Papers, Paradise Papers, or Bahamas Leaks'
        leaks_ent_flag = 0
    else:
        sources = ()
        if 'country' in fields:
            for result in results:
                doc = result[0]
                if 'countries' in doc.keys() and company['country'].lower() in doc['countries'].lower():
                    leaks_ent_evidence = f'Company name found in {doc["sourceID"]} and is registered as {doc['status']} in {doc["countries"]}'
                    leaks_ent_flag = 2
                    break
                else:
                    sources.add(doc["sourceID"])
            if leaks_ent_flag!=2:
                leaks_ent_evidence = f'Company name found in {', '.join(sources)} but country does not match'
                leaks_ent_flag = 1
        if 'address' in fields:
            for result in results:
                doc = result[0]
                if 'addresses' in doc.keys() and company['address'].lower() in doc['addresses'].lower():
                    leaks_ent_evidence = f'Company name found in {doc["sourceID"]}, address matches and is registered as {doc['status']} in {doc["countries"]}'
                    leaks_ent_flag = 3
                    break
                else:
                    sources.add(doc["sourceID"])
            if leaks_ent_flag!=3:
                leaks_ent_evidence = f'Company name found in {', '.join(sources)} but address does not match'
                leaks_ent_flag = 1
        else:
            leaks_ent_evidence = f'Company name found in {', '.join(sources)} but no additional data such as address to confirm'
            leaks_ent_flag = 1
    # Leaks-intermediaries
    results = entity_db_search("Leaks-intermediaries", name)
    leaks_inter_evidence, leaks_inter_flag = None, None
    if len(results)==0:
        leaks_inter_evidence = 'Company not found in any of the Panama Papers, Paradise Papers, or Bahamas Leaks'
        leaks_inter_flag = 0
    else:
        sources = ()
        if 'country' in fields:
            for result in results:
                doc = result[0]
                if 'countries' in doc.keys() and company['country'].lower() in doc['countries'].lower():
                    leaks_inter_evidence = f'Company name found in {doc["sourceID"]} and is an intermediary currently {doc['status']} in {doc["countries"]}'
                    leaks_inter_flag = 2
                    break
                else:
                    sources.add(doc["sourceID"])
            if leaks_inter_flag!=2:
                leaks_inter_evidence = f'Company name found in {', '.join(sources)} but country does not match'
                leaks_inter_flag = 1
        else:
            leaks_inter_evidence = f'Company name found in {', '.join(sources)} but no additional data such as country to confirm'
            leaks_inter_flag = 1
    # Leaks-others
    results = entity_db_search("Leaks-others", name)
    leaks_others_evidence, leaks_others_flag = None, None
    if len(results)==0:
        leaks_others_evidence = 'Company not found in any of the Panama Papers, Paradise Papers, or Bahamas Leaks'
        leaks_others_flag = 0
    else:
        sources = ()
        if 'country' in fields:
            for result in results:
                doc = result[0]
                if 'countries' in doc.keys() and company['country'].lower() in doc['countries'].lower():
                    leaks_others_evidence = f'Company name found in {doc["sourceID"]} and is an intermediary currently {doc['status']} in {doc["countries"]}'
                    leaks_others_flag = 2
                    break
                else:
                    sources.add(doc["sourceID"])
            if leaks_others_flag!=2:
                leaks_others_evidence = f'Company name found in {', '.join(sources)} but country does not match'
                leaks_others_flag = 1
        else:
            leaks_others_evidence = f'Company name found in {', '.join(sources)} but no additional data such as country to confirm'
            leaks_others_flag = 1
    return leaks_inter_evidence, leaks_inter_flag, leaks_ent_evidence, leaks_ent_flag, leaks_others_evidence, leaks_others_flag

def gather_cs_evidence(company):
    fields = company.keys()
    name = company['name']
    results = entity_db_search("Consolidated-Sanctions", name)
    cs_evidence, cs_flag, cs_notes = None, None, None
    if len(results) == 0:
        cs_evidence = "Company not found in Consolidated Sanctions database"
        cs_flag = 0
    elif results[0][1] == 100:
        cs_evidence = f"Company found in Consolidated Sanctions database with a perfect match and is sanctioned under {results[0][0]['dataset']}"
        cs_flag = 3
        cs_notes = results[0][0]['sanctions']
    else:
        if 'country' in fields:
            for result in results:
                doc = result[0]
                if 'countries' in doc.keys() and company['country'].lower() in doc['countries'].lower():
                    cs_evidence = f"Company found in Consolidated Sanctions database but not a perfect name match and is sanctioned under {doc['dataset']}"
                    cs_flag = 1
                    cs_notes = doc['sanctions']
                    break
            else:
                cs_evidence = f"Company found in Consolidated Sanctions database but not a perfect name match and also country doesn't match"
                cs_flag = 0
    return cs_evidence, cs_flag, cs_notes

def gather_ce_evidence_on_company(company):
    name = company['name']
    results = entity_db_search("Criminal-entities", name)
    ce_evidence, ce_flag, ce_notes = None, None, None
    if len(results) == 0:
        ce_evidence = "Name not found in Criminal Entities database"
        ce_flag = -1
    elif results[0][1] == 100:
        ce_evidence = "Company found in Criminal Entities database with a perfect match"
        ce_flag = 3
        ce_notes = results[0][0]['sanctions']
    else:
        ce_evidence = "Company found in Criminal Entities database but not a perfect name match"
        ce_flag = 2
        ce_notes = results[0][0]['sanctions']
    return ce_evidence, ce_flag, ce_notes

def gather_news(company):
    newsapi = NewsApiClient(api_key='0969fe7923f74db2ad9610a14a742866')
    all_articles = newsapi.get_everything(q=company['name'],
                                      language='en',
                                      sort_by='publishedAt')
    content = ""
    articlesLimit = 2
    for article in all_articles['articles']:
        if articlesLimit > 0:
            content += f"Title: {article['title']}\nDescription: {article['description']}\n\n"
        articlesLimit -= 1
    if len(content) == 0:
        content = "No news articles found for the company"
    return content

def gather_evidence_on_company(company):
    company['leaks_inter_evidence'], company['leaks_inter_flag'], company['leaks_ent_evidence'], company['leaks_ent_flag'], company['leaks_others_evidence'], company['leaks_others_flag'] = gather_leaks_company_evidence(company)
    company['cs_evidence'], company['cs_flag'], company['cs_notes'] = gather_cs_evidence(company)
    company['ce_evidence'], company['ce_flag'], company['ce_notes'] = gather_ce_evidence_on_company(company)
    company['news_content'] = gather_news(company)
    return company