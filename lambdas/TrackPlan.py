import sys
import logging
import json
import os
import psycopg2
import random
import boto3


category_dict = {'Arms': '8', 'Legs': '9', 'Abs': '10', 'Chest': '11',
                 'Back': '12', 'Shoulders': '13', 'Calves': '14'}

ENDPOINT="mydatabase.cv33flw3gf8i.us-east-1.rds.amazonaws.com"
PORT="5432"
USR="db_userx"
REGION="us-east-1"
DBNAME="postgres"

#gets the credentials from .aws/credentials
session = boto3.Session()
client = boto3.client('rds')

token = client.generate_db_auth_token(DBHostname=ENDPOINT, Port=PORT, DBUsername=USR, Region=REGION)

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn_string = "host=%s user=%s password=%s dbname=%s" % \
                    (ENDPOINT, USR, token, DBNAME)
    conn = psycopg2.connect(conn_string)
    cur = conn.cursor()
    cur.execute("""SELECT now()""")
    query_results = cur.fetchall()
    print(query_results)
except psycopg2.Error as e:
    logger.error("ERROR: Could not connect to Postgres instance.")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS Postgres instance succeeded")

def get_workout_for_user(user: str, day: str):
    query = """select exercise.category, exercise.name, exercise.description, workoutplan.sets, workoutplan.reps, workoutplan.weight
            from workoutplan
            INNER JOIN exercise ON workoutplan.exercise_id=exercise.id
            where username = %s and day = %s
            order by 1"""

    with conn.cursor() as cur:
        rows = []
        cur.execute(query, (user, day))
        for row in cur:
            rows.append(row)
       
    return rows

def parse_workout_plan(workout_plan):
    parsed_workout = []
    for exercise in workout_plan:
        exercise_category = list(category_dict.keys())[list(category_dict.values()).index(str(exercise[0]))]
        exercise_data = {"name": exercise[1],
                        "description": exercise[2],
                        "sets": exercise[3],
                        "reps": exercise[4],
                        "weight": exercise[5]
                        }
        exercise_json = {exercise_category: exercise_data}

        parsed_workout.append(exercise_json)

    return parsed_workout

def handler(event, context):
    try:
        variables = json.loads(event['body'])
        day = variables['day']
        user = variables['user']
    except ValueError as e:
        logger.error("ERROR: Variables passed incorrectly!")
        logger.error(e)
        return {
            'statusCode': 400,
            'headers': {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : 'true'
            },
            'body': json.dumps(e)
        }
    
    workout_plan = get_workout_for_user(user, day)

    workout_plan = parse_workout_plan(workout_plan)

    return {
        'statusCode': 200,
        'headers': {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : 'true'
        },
        'body': json.dumps(workout_plan)
    }


# if __name__ == "__main__":
#     json_string = {"body": "{\"day\":\"Monday\",\"user\":\"user1\"}"}
#     workout_plan = handler(json_string, None)
    