from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
import requests

app = Flask(__name__)

db = SQLAlchemy()

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:CaesarSaleh!4@db.whcngrytqsmqbneqjlqs.supabase.co:5432/postgres'

db.init_app(app)


class Pairs(db.Model):
    id = db.Column(db.Integer, primary_key=True)


with app.app_context():
    db.create_all()

SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY25ncnl0cXNtcWJuZXFqbHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1MzY5MDEsImV4cCI6MjAyMDExMjkwMX0.oDmXYe3WGiT7mIUNM_P9wZf2GIUzYtzH5T1HQX8MOjc'
SUPABASE_API_URL = 'https://whcngrytqsmqbneqjlqs.supabase.co'


def upload_file():
    file = request.files['file']
    if file:
        # Construct the upload URL
        upload_url = f'{SUPABASE_API_URL}/storage/v1/object/images/{file.filename}'

        # Set up headers with Supabase API key
        headers = {
            'Content-Type': 'application/octet-stream',
            'Authorization': f'Bearer {SUPABASE_API_KEY}'
        }

        # Upload the file to Supabase Media Storage
        with open(file.filename, 'rb') as f:
            response = requests.post(
                upload_url, headers=headers, data=f.read())

        # Check the response and handle accordingly
        if response.status_code == 200:
            return 'File uploaded successfully'
        else:
            return f'Error uploading file: {response.status_code} - {response.text}'


def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response


@app.route('/')
def index():
    return "Hello World!"


@app.route('/test', methods=['GET'])
def test(input):
    return input + "!"

# @app.route('/get_from_db', methods=['GET'])
# def add_to_db():
#     return

# @app.route('/add_to_db', methods=['POST'])
# def add_to_db():
#     return


# @app.route('/moonshot', methods=['GET'])
# def classify_moonshot():
#     return


# @app.route('/ontopic', methods=['GET'])
# def classify_ontopic():
#     return

if __name__ == '__main__':
    app.after_request(add_cors_headers)
    app.run(port=4000, debug=True)
