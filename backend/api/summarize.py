import cohere
import os
from dotenv import load_dotenv

load_dotenv()
 
co = cohere.Client(os.getenv("COHERE_API_KEY"))

def summarization(prompt):
    prompt_summarized = co.summarize(prompt, length='short',format='paragraph',)
    return prompt_summarized.summary