import requests
import sys
import logging
import psycopg2
import json
import os

# rds settings
rds_host = "mydatabase.cv33flw3gf8i.us-east-1.rds.amazonaws.com"
rds_username = "postgres"
rds_user_pwd = "kotlecik"
rds_db_name = ""

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn_string = "host=%s user=%s password=%s dbname=%s" % \
                    (rds_host, rds_username, rds_user_pwd, rds_db_name)
    conn = psycopg2.connect(conn_string)
except psycopg2.Error as e:
    logger.error("ERROR: Could not connect to Postgres instance.")
    logger.error(e)
    sys.exit()

def fetch_data_from_api():
    try:
        api_string = 'https://wger.de/api/v2/exercise/?language=2&status=2&limit=224'
        wger_resp = requests.get(api_string)
        wger_data = wger_resp.json()
        return wger_data['results']
    except requests.exceptions.RequestException as e:
        logger.error("ERROR: Could not get result from API.")
        logger.error(e)
        sys.exit()

def clean_descriptions(description: str):
    description = description.replace('</p>', '')
    description = description.replace('<p>', '')
    description = description.replace('\n', '')
    description = description.replace('\xa0', '')
    description = description.replace('</li>', '')
    description = description.replace('</ul>', '')
    description = description.replace('<ul>', '')
    description = description.replace('<li>', '')
    return description


wger_result = fetch_data_from_api()
cur = conn.cursor()
for result in wger_result:
    result['description'] = clean_descriptions(result['description'])
    if len(result['description']) > 999:
        result_dict = {'id': result['id'], 'name': result['name'], 'category': result['category'], 'description': result['description'][:999]}
    else:
        result_dict = {'id': result['id'], 'name': result['name'], 'category': result['category'], 'description': result['description']}

    try:
        print(result_dict)
    except:
        logger.error("ERROR: Could not commit exercise to database")
        sys.exit()

cur.close()
conn.close()