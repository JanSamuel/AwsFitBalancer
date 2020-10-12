import sys
import logging
import json
import os
import psycopg2
import random
import boto3


goal_multiplier_dict = {'endurance': 0.6, 'cutting': 0.8, 'maintain': 0.75,
                   'bulking': 0.75, 'strenght': 0.85}

goal_repetition_dict = {'endurance': 20, 'cutting': 8, 'maintain': 10,
                   'bulking': 12, 'strenght': 5}

fitness_level_multiplier_dict = {1: 0.65, 2: 0.75, 3: 0.85, 4: 0.95}

category_dict = {'Arms': '8', 'Legs': '9', 'Abs': '10', 'Chest': '11',
                 'Back': '12', 'Shoulders': '13', 'Calves': '14'}

days_dict = {3: ['Monday', 'Wednesday', 'Friday'],
             4: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
             5: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
             6: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}

week_days = ("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday")

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

def update_user_profile(user: str, goal: int, bench_now: float, squat_now: float, deadlift_now: float, fitness_level: int, days: int):
    with conn.cursor() as cur:
        try:
            query = """
                INSERT INTO users(username, goal, bench, squat, deadlift, level, days)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (username) DO UPDATE SET
                (goal, bench, squat, deadlift, level, days)
                = (EXCLUDED.goal, EXCLUDED.bench, EXCLUDED.squat, EXCLUDED.deadlift, EXCLUDED.level, EXCLUDED.days)
                """

            cur.execute(query, (user, goal, bench_now, squat_now, deadlift_now, fitness_level, days))
        except psycopg2.IntegrityError:
            conn.rollback()
        else:
            conn.commit()

    return

def update_user_workout_plan(user, workout_plan):
    with conn.cursor() as cur:
        query = """
            INSERT INTO workoutplan(username, day, exercise_id, sets, reps, weight)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
    
        for x, day in enumerate(week_days):
            if workout_plan[x][day]:
                for exercise in workout_plan[x][day]:
                    for category in exercise:
                        print('trying to query data...')
                        try:
                            cur.execute(query, (user, day, exercise[category]['id'], exercise[category]['sets'], exercise[category]['reps'], exercise[category]['weight']))

                        except psycopg2.IntegrityError as e:
                            print(e)
                            conn.rollback()
                        else:
                            conn.commit()
                            
    return

def generate_exercise_properties(exercise, goal, bench_now, bench_after, squat_now, squat_after,
                    deadlift_now, deadlift_after, fitness_level):
    if exercise[2] == int(category_dict['Arms']):
        reps = goal_repetition_dict[goal]
        sets = 3
        weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (bench_now / 6. + deadlift_now / 6.), 1)
    elif exercise[2] == int(category_dict['Legs']):
        reps = goal_repetition_dict[goal]
        sets = 4
        weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (squat_now / 2. + deadlift_now / 2.), 1)
    elif exercise[2] == int(category_dict['Abs']):
        reps = goal_repetition_dict[goal] * 2
        sets = 3
        weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (squat_now / 10. + deadlift_now / 10. + bench_now / 10), 1)
    elif exercise[2] == int(category_dict['Chest']):
        reps = goal_repetition_dict[goal]
        sets = 4
        weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (bench_now / 1.5), 1)
    elif exercise[2] == int(category_dict['Back']):
        reps = goal_repetition_dict[goal]
        sets = 4
        weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (deadlift_now / 2.), 1)
    elif exercise[2] == int(category_dict['Shoulders']):
        reps = goal_repetition_dict[goal]
        sets = 3
        weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (bench_now / 3.), 1)
    elif exercise[2] == int(category_dict['Calves']):
        reps = goal_repetition_dict[goal]
        sets = 3
        weight = round(goal_multiplier_dict[goal] * fitness_level_multiplier_dict[fitness_level] * (squat_now / 4.), 1)

    return sets, reps, weight

def prepare_workout_plan(goal, bench_now, bench_after, squat_now, squat_after,
                    deadlift_now, deadlift_after, fitness_level, days):
    workout_plan = []
    for day in week_days:
        workout = []
        if day in days_dict[days]:
            for x in category_dict.values():
                exercise = select_exercise_by_category(x)
                sets, reps, weight = generate_exercise_properties(
                    exercise, goal, bench_now, bench_after, squat_now, squat_after, 
                    deadlift_now, deadlift_after, fitness_level)
                exercise_category = list(category_dict.keys())[list(category_dict.values()).index(str(exercise[2]))]
                exercise_data = {"name": exercise[1],
                                "description": exercise[3],
                                "sets": sets,
                                "reps": reps,
                                "weight": weight,
                                "id": exercise[0]}
                exercise_json = {exercise_category: exercise_data}

                workout.append(exercise_json)

        workout_plan.append({day: workout})
        
    return workout_plan

def handler(event, context):
    try:
        variables = json.loads(event['body'])
        goal = variables['goal']
        bench_now = float(variables['bench_now'])
        deadlift_now = float(variables['deadlift_now'])
        squat_now = float(variables['squat_now'])
        bench_after = float(variables['bench_after'])
        deadlift_after = float(variables['deadlift_after'])
        squat_after = float(variables['squat_after'])
        fitness_level = int(variables['fitness_level'])
        days = int(variables['days'])
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

    update_user_profile(user, goal, bench_now, squat_now, deadlift_now, fitness_level, days)

    workout_plan = prepare_workout_plan(goal, bench_now, bench_after, squat_now, squat_after,
                              deadlift_now, deadlift_after, fitness_level, days)
    
    update_user_workout_plan(user, workout_plan)

    return {
        'statusCode': 200,
        'headers': {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : 'true'
        },
        'body': json.dumps(workout_plan)
    }

if __name__ == "__main__":
    json_string = {"body": "{\"goal\":\"strenght\",\"bench_now\":\"100\",\"squat_now\":\"100\",\"deadlift_now\":\"100\",\"bench_after\":\"120\",\"squat_after\":\"120\",\"deadlift_after\":\"120\",\"fitness_level\":\"2\",\"days\":\"3\",\"user\":\"user1\"}"}
    workout_plan = handler(json_string, None)
    # workout_plan = json.loads(workout_plan)
    # print(workout_plan["Arms"])