from src.agent import create_agent
from langchain_core.messages import HumanMessage


def main():
    agent = create_agent()
    config = {"configurable": {"thread_id": "cli"}}

    print("=" * 50)
    print("  EnzoIA - CLI")
    print("  Digite 'sair' para encerrar")
    print("=" * 50)

    while True:
        user_input = input("\nVocê: ").strip()

        if user_input.lower() == "sair":
            print("\nAté logo!")
            break

        if not user_input:
            continue

        response = agent.invoke(
            {"messages": [HumanMessage(content=user_input)]},
            config=config
        )

        print(f"\nEnzoIA: {response['messages'][-1].content}")


if __name__ == "__main__":
    main()
