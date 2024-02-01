#!/bin/bash
cd backend/restify
. venv/bin/activate
python3 ./manage.py runserver &
sleep 4
cd ..
cd ..
cd frontend/restify
npm start
