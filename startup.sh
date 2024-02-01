#!/bin/bash
cd backend/restify
sudo apt install python3-virtualenv
virtualenv venv
. venv/bin/activate
sudo apt install python3-pip
pip install -r packages.txt
python3 ./manage.py makemigrations
python3 ./manage.py migrate
python manage.py loaddata P3_final_data.json
cat media.tar.gz.* | tar xzvf -
deactivate
cd ..
cd ..
cd frontend/restify
sudo apt install npm
sudo apt-get update
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
nvm use node
npm install
cd ..
cd ..