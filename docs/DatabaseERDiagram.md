# Database ER Diagram

Users
------
id (PK)
tenant_id (FK)
name
email
password
role

Tenants
--------
id (PK)
name
subscription_plan

Surveys
--------
id (PK)
tenant_id (FK)
question
is_public
approved

SurveyAnswers
--------------
id (PK)
survey_id (FK)
answer
frequency
points

Games
------
id (PK)
tenant_id (FK)
title
configuration_json
status

GameRounds
-----------
id (PK)
game_id (FK)
survey_id (FK)
multiplier
round_order

Halls
------
id (PK)
game_id (FK)
unique_slug
join_code
status

Teams
------
id (PK)
hall_id (FK)
name
score

Players
--------
id (PK)
hall_id (FK)
team_id (FK)
nickname
jwt_token
is_active

BuzzEvents
-----------
id (PK)
hall_id (FK)
player_id (FK)
timestamp

Relationships:
- Tenant has many Users
- Tenant has many Surveys
- Survey has many SurveyAnswers
- Game belongs to Tenant
- Game has many Rounds
- Hall belongs to Game
- Hall has many Teams
- Team has many Players
- Hall has many BuzzEvents
