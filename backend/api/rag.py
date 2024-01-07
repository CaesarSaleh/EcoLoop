from PyPDF2 import PdfReader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import ElasticVectorSearch, Pinecone, Weaviate, FAISS

from langchain.chains.question_answering import load_qa_chain
from langchain.llms import OpenAI
import pinecone
import os

os.environ["OPENAI_API_KEY"] = "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"

reader = PdfReader('../data/1.pdf')
raw_text = ''
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
index = Pinecone.from_documents(texts, embeddings, index_name=index_name)


# docsearch = FAISS.from_texts(texts, embeddings)


chain = load_qa_chain(OpenAI(), chain_type="stuff")


def ask_bot(query):
    docs = index.similarity_search_with_score(query, k=k)
    return chain.run(input_documents=docs, question=query)
