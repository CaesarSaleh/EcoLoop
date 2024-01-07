from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import requests

from PyPDF2 import PdfReader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Pinecone

from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
import pinecone
import os
from langchain.schema import Document
from summarize import summarization
from classify import classifier


os.environ["OPENAI_API_KEY"] = "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"

reader = PdfReader('../data/1.pdf')
raw_text = ''
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text:
        raw_text += text


reader = PdfReader('../data/2.pdf')
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text:
        raw_text += text

reader = PdfReader('../data/3.pdf')
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text:
        raw_text += text

reader = PdfReader('../data/Metrics.pdf')
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if text:
        raw_text += text


text_splitter = CharacterTextSplitter(
    separator="\n",
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
)
texts = text_splitter.split_text(raw_text)

embeddings = OpenAIEmbeddings()

pinecone.init(
    api_key="5fceaaa7-664f-41c9-824e-3434ccd7480f",
    environment="gcp-starter"
)
index_name = "ecoloop"
new_texts = [Document(page_content=text) for text in texts]
index = Pinecone.from_documents(new_texts, embeddings, index_name=index_name)

chain = load_qa_chain(OpenAI(), chain_type="stuff")


app = Flask(__name__)

db = SQLAlchemy()

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:CaesarSaleh!4@db.whcngrytqsmqbneqjlqs.supabase.co:5432/postgres'

db.init_app(app)


SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY25ncnl0cXNtcWJuZXFqbHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1MzY5MDEsImV4cCI6MjAyMDExMjkwMX0.oDmXYe3WGiT7mIUNM_P9wZf2GIUzYtzH5T1HQX8MOjc'
SUPABASE_API_URL = 'https://whcngrytqsmqbneqjlqs.supabase.co'

supabase_client = supabase.create_client(supabase_url, supabase_key)


def extract_dictionary(input_string):
    # Use regular expression to find the starting and ending points of the dictionary
    match = re.search(r'{[^{}]*}', input_string)

    if match:
        # Extract the matched dictionary string
        dictionary_str = match.group()

        # Convert the dictionary string to a Python dictionary
        dictionary = json.loads(dictionary_str)

        # Extract the description by removing the dictionary string
        description = input_string.replace(dictionary_str, '').strip()

        return dictionary, description
    else:
        # No dictionary found
        return None, input_string.strip()


def append_db(query):

    table_name = 'data'

    query['id'] = random.randint(100_000_000, 999_999_999)
    query['created_at'] = datetime.datetime.now().isoformat()
    query['problem'] = query['pair']['problem']
    query['solution'] = query['pair']['solution']
    query.pop('pair')
    response = supabase_client.table(table_name).insert([query])

    if response.status_code == 201:
        print("Insertion successful!")
    else:
        print(f"Error: {response.status_code}, {response.text}")


def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response


@app.route('/')
def index():
    return "Hello World!"


@app.route('/test', methods=['GET'])
def test():
    new_token = request.json
    tokenId = new_token.get('input')

    if not tokenId:
        return jsonify({'error': 'Token ID is required'}), 400

    return tokenId


@app.route('/validate', methods=['POST'])
def ask_bot():
    query = request.json.get("query")

    if not query:
        return jsonify({'error': 'query problem'}), 400

    docs = index.similarity_search(query + """NO EXPLANATION! ONLY OUTPUT NUMBERS! NO LABELLING NUMBERS!
    Analyze the {PROBLEM, SOLUTION} pair. Return a dictionary with keys as maturity stage market potential, feasibility, and scalability; mapped to the numerical values given underneath them.

    Maturity Stage
    Given the scope of the project, return a float from 0 (introduction) to 1 (maturity), for the proximity of the maturity stage of the project.

    Market Potential
    Given the scope of the project, return a float from 0 (poor) to 1 (great), for the market potential of the project.
    
    Feasibility
    Given the scope of the project, return a float from 0 (low) to 1 (great), for the feasibility of the project.

    Scalability
    Given the scope of the project, return a float from 0 (poor) to 1 (great), for the scalibility of the project.

    Provide a concise paragraph as to why you chose these values.
    """, 2)
    metrics, validationText = extract_dictionary(
        chain.run(input_documents=docs, question=query))

    return jsonify({"metrics": metrics, "validationText": validationText})


@app.route('/validate_dataset', methods=['POST'])
def ask_bot():
    queries = json.loads(request.json)

    if not queries:
        return jsonify({'error': 'queries problem'}), 400

    for query in queries:
        docs = index.similarity_search(query + """NO EXPLANATION! ONLY OUTPUT NUMBERS! NO LABELLING NUMBERS!
            Analyze the {PROBLEM, SOLUTION} pair. Return a dictionary with keys as maturity stage market potential, feasibility, and scalability; mapped to the numerical values given underneath them.

            Maturity Stage
            Given the scope of the project, return a float from 0 (introduction) to 1 (maturity), for the proximity of the maturity stage of the project.

            Market Potential
            Given the scope of the project, return a float from 0 (poor) to 1 (great), for the market potential of the project.
            
            Feasibility
            Given the scope of the project, return a float from 0 (low) to 1 (great), for the feasibility of the project.

            Scalability
            Given the scope of the project, return a float from 0 (poor) to 1 (great), for the scalibility of the project.

            Provide a concise paragraph as to why you chose these values.
            """, 2)
        metadata = {}
        metrics, validationText = extract_dictionary(
            chain.run(input_documents=docs, question=query))
        sum = 0
        for metric in metrics:
            if metric.lower() == "maturity stage":
                metadata["maturity"] = metrics[metric]
            elif metric.lower() == "market potential":
                metrics["potential"] = metrics[metric]
            elif metric.lower() == "feasibility":
                metrics["feasibility"] = metrics[metric]
            else:
                metrics["scalability"] = metrics[metric]
            sum += metrics[metric]
        metadata["score"] = sum / 4

        metadata["pair"] = query
        metadata["validationText"] = validationText
        metadata["summary"] = summarization(query)
        metadata["moonshot"] = int(round(classify(query)[1]))
        metadata["ontopic"] = int(round(1 - classify(query)[2]))

        append_db(metadata)

    return jsonify({"success": True})


@app.route('/add_to_db', methods=['POST'])
def add_to_db():
    metadata = request.json

    if not metadata:
        return jsonify({'error': 'metadata problem'}), 400

    metadata["summary"] = summarization(query)
    metadata["moonshot"] = int(round(classify(query)[1]))
    metadata["ontopic"] = int(round(1 - classify(query)[2]))

    add_to_db(metadata)
    return jsonify({"success": True})


@app.route('/get_from_db', methods=['POST'])
def get_from_db():
    id = request.json.get("id")

    if not id:
        return jsonify({'error': 'id problem'}), 400

    response = supabase_client.table(
        table_name).select("*").eq("id", id).execute()

    if response.status_code == 200:
        data = response.json()["data"]
        if data:
            return data[0]
        else:
            print("No record found.")
            return None
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None


@app.route('/get_dataset', methods=['GET'])
def get_dataset():
    response = supabase_client.table(table_name).select("*").execute()

    if response.status_code == 200:
        data = response.json()["data"]
        if data:
            return {"dataset": data}
        else:
            print("No records found.")
            return {"dataset": []}
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return {"dataset": []}


if __name__ == '__main__':
    app.after_request(add_cors_headers)
    app.run(port=4000, debug=True)
