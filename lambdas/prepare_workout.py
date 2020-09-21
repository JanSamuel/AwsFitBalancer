import sys
import logging
import json
import os
import psycopg2
import random

goal_multiplier_dict = {'endurance': 0.6, 'cutting': 0.8, 'maintain': 0.75,
                   'bulking': 0.75, 'strenght': 0.85}

goal_repetition_dict = {'endurance': 20, 'cutting': 8, 'maintain': 10,
                   'bulking': 12, 'strenght': 5}

fitness_level_multiplier_dict = {1: 0.65, 2: 0.75, 3: 0.85, 4: 0.95}

category_dict = {'Arms': '8', 'Legs': '9', 'Abs': '10', 'Chest': '11',
                 'Back': '12', 'Shoulders': '13', 'Calves': '14'}

# rds settings
rds_host  = "mydatabase.cv33flw3gf8i.us-east-1.rds.amazonaws.com"
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

logger.info("SUCCESS: Connection to RDS Postgres instance succeeded")

def select_exercise_by_category(category: str):
    query = """select id, name, category, description
            from exercise
            where category = %s
            order by 1"""

    with conn.cursor() as cur:
        rows = []
        cur.execute(query, (category,))
        for row in cur:
            rows.append(row)
       
    return random.choice(rows)

def prepare_workout(goal, bench_now, bench_after, squat_now, squat_after,
                    deadlift_now, deadlift_after, fitness_level):
    workout = []
    for x in category_dict.values():
        exercise = select_exercise_by_category(x)
        if exercise[2] == int(category_dict['Arms']):
            reps = goal_repetition_dict[goal]
            sets = 3
            weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (bench_now / 8 + deadlift_now / 8), 1)
        elif exercise[2] == int(category_dict['Legs']):
            reps = goal_repetition_dict[goal]
            sets = 4
            weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (squat_now / 3 + deadlift_now / 4), 1)
        elif exercise[2] == int(category_dict['Abs']):
            reps = goal_repetition_dict[goal] * 2
            sets = 3
            weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (squat_now / 10 + deadlift_now / 10 + bench_now / 10), 1)
        elif exercise[2] == int(category_dict['Chest']):
            reps = goal_repetition_dict[goal]
            sets = 4
            weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (bench_now / 1.5), 1)
        elif exercise[2] == int(category_dict['Back']):
            reps = goal_repetition_dict[goal]
            sets = 4
            weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (deadlift_now / 2), 1)
        elif exercise[2] == int(category_dict['Shoulders']):
            reps = goal_repetition_dict[goal]
            sets = 3
            weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (bench_now / 3), 1)
        elif exercise[2] == int(category_dict['Calves']):
            reps = goal_repetition_dict[goal]
            sets = 3
            weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (squat_now / 4), 1)
        
        exercise = (exercise, sets, reps, weight)
        workout.append(exercise)
    
    return workout

def handler(event, context):
    try:
        variables = json.loads(event['body'])
        goal = variables['goal']
        bench_now = int(variables['bench_now'])
        deadlift_now = int(variables['deadlift_now'])
        squat_now = int(variables['squat_now'])
        bench_after = int(variables['bench_after'])
        deadlift_after = int(variables['deadlift_after'])
        squat_after = int(variables['squat_after'])
        fitness_level = int(variables['fitness_level'])
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

    workout = prepare_workout(goal, bench_now, bench_after, squat_now, squat_after,
                              deadlift_now, deadlift_after, fitness_level)

    return {
        'statusCode': 200,
        'headers': {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : 'true'
        },
        'body': json.dumps(workout)
    }