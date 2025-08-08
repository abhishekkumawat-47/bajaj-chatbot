import streamlit as st
from main import agent_executor
from langchain.document_loaders import PyPDFLoader, UnstructuredWordDocumentLoader
import tempfile
import os
import json
import requests
from urllib.parse import urlparse

st.set_page_config(page_title="🧠 Bajaj Finserv Chatbot", layout="wide")
st.title("🧠 Bajaj Finserv Chatbot")

tab1, tab2 = st.tabs(["JSON Input", "Interactive Chat"])


def load_document_from_url(url):
    """Load document from URL"""
    try:
        response = requests.get(url)
        response.raise_for_status()

        parsed_url = urlparse(url)
        file_extension = os.path.splitext(parsed_url.path)[1].lower()

        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            tmp_file.write(response.content)
            tmp_path = tmp_file.name

        if file_extension == ".pdf":
            loader = PyPDFLoader(tmp_path)
        elif file_extension == ".docx":
            loader = UnstructuredWordDocumentLoader(tmp_path)
        else:
            st.warning(f"Unsupported file type: {file_extension}")
            return []

        docs = loader.load()
        os.unlink(tmp_path)
        return docs

    except Exception as e:
        st.error(f"Error loading document from URL: {e}")
        return []

def process_json_query(query_json):
    """Process JSON query and return JSON response"""
    try:

        query_data = json.loads(query_json) if isinstance(query_json, str) else query_json

        if "questions" not in query_data:
            return {"error": "Missing 'questions' field in JSON"}

        questions = query_data["questions"]
        if not isinstance(questions, list):
            return {"error": "'questions' must be a list"}

        user_docs = None
        if "documents" in query_data and query_data["documents"]:
            doc_link = query_data["documents"]
            if isinstance(doc_link, str) and doc_link.startswith(('http://', 'https://')):
                loaded_docs = load_document_from_url(doc_link)
                if loaded_docs:
                    user_docs = loaded_docs
            else:
                return {"error": "Document link must be a valid URL"}

        responses = []
        chat_history = []

        for question in questions:
            if not question.strip():
                responses.append("Empty question provided")
                continue

            try:

                lc_chat_history = []
                for i, (user_msg, bot_msg) in enumerate(chat_history):
                    lc_chat_history.append({"role": "user", "content": user_msg})
                    lc_chat_history.append({"role": "assistant", "content": bot_msg})

                context_aware_question = question
                if user_docs is None:
                    context_aware_question = f"[USING BASE DOCS] {question}"

                result = agent_executor.invoke({
                    "input": context_aware_question,
                    "chat_history": lc_chat_history,
                    "user_docs": user_docs
                })

                answer = result["output"]
                responses.append(answer)
                chat_history.append((question, answer))

            except Exception as e:
                responses.append(f"Error processing question: {str(e)}")

        return {"responses": responses}

    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON format: {str(e)}"}
    except Exception as e:
        return {"error": f"Error processing query: {str(e)}"}

with tab1:
    st.markdown("### 📝 JSON Query Input")
    st.markdown("Enter your query in the following JSON format:")

    example_json = {
        "documents": "https://example.com/document.pdf",
        "questions": [
            "What is the main topic of the document?",
            "Can you summarize the key points?",
            "What are the recommendations?",
            "Are there any important deadlines mentioned?"
        ]
    }

    st.code(json.dumps(example_json, indent=2), language="json")

    st.markdown("**Example without documents (uses base docs):**")
    example_json_no_docs = {
        "questions": [
            "What are the loan policies?",
            "What is the eligibility criteria?",
            "What are the interest rates?"
        ]
    }
    st.code(json.dumps(example_json_no_docs, indent=2), language="json")

    json_input = st.text_area(
        "Enter JSON Query:",
        height=200,
        placeholder=json.dumps(example_json, indent=2)
    )

    if st.button("Process JSON Query", key="json_process"):
        if json_input.strip():
            with st.spinner("Processing your query..."):
                result = process_json_query(json_input)

            st.markdown("### 📤 JSON Response")

            st.code(json.dumps(result, indent=2), language="json")

            if "responses" in result:
                st.markdown("### 📋 Readable Format")
                for i, response in enumerate(result["responses"], 1):
                    st.markdown(f"**Answer {i}:** {response}")
            elif "error" in result:
                st.error(f"Error: {result['error']}")
        else:
            st.warning("Please enter a JSON query")

with tab2:
    st.markdown("### 💬 Interactive Chat Mode")

    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    user_question = st.text_area("Ask a question:")

    uploaded_files = st.file_uploader(
        "Upload PDF or Word files to include in the context (optional)",
        type=["pdf", "docx"],
        accept_multiple_files=True,
        key="interactive_uploader"
    )

    user_docs = None
    if uploaded_files:
        all_docs = []
        for uploaded_file in uploaded_files:
            suffix = "." + uploaded_file.name.split('.')[-1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
                tmp_file.write(uploaded_file.read())
                tmp_path = tmp_file.name

            if suffix == ".pdf":
                loader = PyPDFLoader(tmp_path)
            elif suffix == ".docx":
                loader = UnstructuredWordDocumentLoader(tmp_path)
            else:
                st.warning(f"Unsupported file type: {uploaded_file.name}")
                continue

            docs = loader.load()
            all_docs.extend(docs)
            os.unlink(tmp_path)

        if all_docs:
            user_docs = all_docs

    if st.session_state.chat_history:
        st.markdown("### 🗂️ Chat History")
        for i, (user, bot) in enumerate(st.session_state.chat_history):
            st.markdown(f"**You:** {user}")
            st.markdown(f"**Bot:** {bot}")
            st.markdown("---")

    if st.button("Ask", key="interactive_ask") and user_question:
        try:

            lc_chat_history = []
            for user_msg, bot_msg in st.session_state.chat_history:
                lc_chat_history.append({"role": "user", "content": user_msg})
                lc_chat_history.append({"role": "assistant", "content": bot_msg})

            with st.spinner("Processing your question..."):
                result = agent_executor.invoke({
                    "input": user_question,
                    "chat_history": lc_chat_history,
                    "user_docs": user_docs
                })

            answer = result["output"]
            st.session_state.chat_history.append((user_question, answer))

            st.markdown("### 🤖 Answer")
            st.markdown(answer)

        except Exception as e:
            st.error(f"Error: {e}")

    if st.button("Clear Chat History", key="clear_history"):
        st.session_state.chat_history = []
        st.success("Chat history cleared!")

with st.sidebar:
    st.markdown("### 📋 Usage Instructions")
    st.markdown("""
    **JSON Mode:**
    - Use the JSON tab for batch processing
    - Provide document URLs and multiple questions
    - **Documents field is optional** - omit to use base docs
    - Get structured JSON responses

    **Interactive Mode:**
    - Use for single question conversations
    - Upload files directly (optional - uses base docs if none uploaded)
    - Maintains chat history

    **Supported Formats:**
    - PDF files (.pdf)
    - Word documents (.docx)
    - HTTP/HTTPS URLs for documents

    **Base Documents:**
    - When no documents are provided, the system uses its base document collection
    - This allows querying default policies and information
    """)

    st.markdown("### 🔧 JSON Format")
    st.code('''
{
  "documents": "URL_to_document", // Optional
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}

// Without documents (uses base docs):
{
  "questions": [
    "Question 1",
    "Question 2"
  ]
}
    ''', language="json")