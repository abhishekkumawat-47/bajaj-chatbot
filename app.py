import streamlit as st
from main import agent_executor
from langchain.document_loaders import PyPDFLoader, UnstructuredWordDocumentLoader
import tempfile
import os

# Set Streamlit page config
st.set_page_config(page_title="🧠 Bajaj Finserv Chatbot", layout="wide")
st.title("🧠 Bajaj Finserv Chatbot")

# Initialize session state for chat history
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# User message input
user_question = st.text_input("Ask a question:")

# File uploader for PDF/Word
uploaded_files = st.file_uploader(
    "Upload PDF or Word files to include in the context (optional)",
    type=["pdf", "docx"],
    accept_multiple_files=True
)

# Process uploaded documents
all_docs = []
if uploaded_files:
    for uploaded_file in uploaded_files:
        suffix = "." + uploaded_file.name.split('.')[-1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
            tmp_file.write(uploaded_file.read())
            tmp_path = tmp_file.name

        # Load based on type
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

# Display chat history
st.markdown("### 🗂️ Chat History")
for i, (user, bot) in enumerate(st.session_state.chat_history):
    st.markdown(f"**You:** {user}")
    st.markdown(f"**Bot:** {bot}")

# Ask button
if st.button("Ask") and user_question:
    try:
        # Construct chat_history format expected by LangChain: list of messages
        lc_chat_history = [{"role": "user", "content": u} if i % 2 == 0 else {"role": "assistant", "content": u}
                           for i, pair in enumerate(st.session_state.chat_history)
                           for u in pair]

        # Run the agent
        result = agent_executor.invoke({
            "input": user_question,
            "chat_history": lc_chat_history,
            "user_docs": all_docs if all_docs else None
        })

        answer = result["output"]
        st.session_state.chat_history.append((user_question, answer))

        # Show the result
        st.markdown("### 🤖 Answer")
        st.markdown(answer)

    except Exception as e:
        st.error(f"Error: {e}")
