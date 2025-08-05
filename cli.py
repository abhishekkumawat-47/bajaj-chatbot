from main import agent_executor
def chat_bot():
    print("Welcome to Bajaj Finserv Virtual Assistant! (type 'exit' to quit)")
    chat_history = []
    while True:
        try:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit"]:
                break
            result = agent_executor.invoke({
                "chat_history": chat_history,
                "input": user_input
            })
            chat_history.append({"role": "user", "content": user_input})
            chat_history.append({"role": "assistant", "content": result["output"]})

            print("Bot:", result["output"])
        except Exception as e:
            print("Error occurred:", e)

if __name__ == "__main__":
    chat_bot()
