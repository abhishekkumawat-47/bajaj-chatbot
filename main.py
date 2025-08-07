from langchain.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor
from dotenv import load_dotenv
import os

load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY3")

system_prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are a helpful assistant for an intelligent document reasoning system that handles 
natural language queries about insurance policies, contracts, and other official documents.

Your role is to:
- Parse vague or plain-English queries to extract structured details like age, gender, location, 
procedure, and policy duration.
- Retrieve relevant clauses from provided documents(if any) (PDFs, Word, emails) using semantic understanding, 
not just keyword matching.
- Evaluate the query using the retrieved clauses and return a factual response.

Guidelines:
- Only tell the details mentioned in the documents , don't add additional details that are not mentioned in the documents.
- If required info is missing, return `"decision": "needs_clarification"` and explain what’s needed.
- If no relevant clause is found, say so and show the closest matching content.
- Be explainable, traceable, and cautious. Don’t hallucinate.

Only handle insurance/policy/legal document queries. For unrelated questions, redirect via the general_chat tool.
    """),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

llm = ChatGoogleGenerativeAI(
    model="models/gemini-2.0-flash",
    temperature=0.4
)


loader1 = PyPDFLoader(r"C:\Python\Pycharm\Project\bajaj chatbot\Sample1.pdf")
loader2 = PyPDFLoader(r"C:\Python\Pycharm\Project\bajaj chatbot\Sample2.pdf")
loader3 = PyPDFLoader(r"C:\Python\Pycharm\Project\bajaj chatbot\Sample3.pdf")

docs1 = loader1.load()
docs2 = loader2.load()
docs3 = loader3.load()

docs = docs1 + docs2 + docs3

def retriever_from_docs(docs):
    embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)
    vectorstore = Chroma.from_documents(splits, embeddings)
    retriever = vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 10, "fetch_k": 30}
    )
    qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            chain_type="stuff",
            return_source_documents=False,
            verbose=True
        )
    return qa_chain

static_qa_chain = retriever_from_docs(docs)

@tool
def ask_query(query: str,user_docs=None) -> dict:
    """Search documents and return a structured decision based on the policy."""
    if user_docs:
        combined_docs = docs + user_docs
        qa_chain = retriever_from_docs(combined_docs)
        response = qa_chain.invoke({"query": query})
    else:
        response = static_qa_chain.invoke({"query": query})

    return response
@tool
def general_chat(message: str) -> str:
    """Responds to general conversation or small talk and user queries for which other tools are not useful."""
    return str(llm.invoke(message))

tools = [ask_query, general_chat]
agent_executor = AgentExecutor(
    agent=create_tool_calling_agent(llm=llm, prompt=system_prompt, tools=tools),
    tools=tools, verbose=True
)