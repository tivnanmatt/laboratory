import os
import openai
from colorama import Fore, Style
import subprocess
import readline

api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("API key not found. Please set the OPENAI_API_KEY environment variable.")

# Instantiate the OpenAI client
client = openai.Client(api_key=api_key)

# Mission statement
MISSION_STATEMENT = """
This app is a virtual assistant for research, designed to edit files automatically. Its main tasks are writing Python code, running medical image reconstruction experiments, and writing LaTeX papers. It uses GPT-3.5 Turbo for high-level explanations and for generating and completing code, including bash commands.
"""

TEMPERATURE = 0.5
MAX_TOKENS = 500
FREQUENCY_PENALTY = 0
PRESENCE_PENALTY = 0.6
MAX_LOG_LENGTH = 10

def gpt3turbo_complete(log):
    messages = [
        {"role": "system", "content": MISSION_STATEMENT},
        {"role": "user", "content": log}
    ]
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=TEMPERATURE,
        max_tokens=MAX_TOKENS,
        top_p=1,
        frequency_penalty=FREQUENCY_PENALTY,
        presence_penalty=PRESENCE_PENALTY,
    )
    return response.choices[0].message.content.strip()

def execute_command(command):
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return result.stdout.strip(), None
    except subprocess.CalledProcessError as e:
        return None, e.stderr.strip()

def log_interaction(log, user_input=None, assistant_response=None, system_message=None):
    """Log the interaction to the history

    Args:
        log: The log of previous interactions
        user_input: The user's input
        assistant_response: The assistant's response
        system_message: Any system messages

    Returns:
        The updated log as a string
    """
    if user_input:
        log += f"\nUser: {user_input}"
    if assistant_response:
        log += f"\nAssistant: {assistant_response}"
    if system_message:
        log += f"\nSystem: {system_message}"
    
    # Ensure the log does not exceed the max length
    log_lines = log.split('\n')
    if len(log_lines) > MAX_LOG_LENGTH:
        log = '\n'.join(log_lines[-MAX_LOG_LENGTH:])
    
    return log

def extract_bash_code_block(response):
    """Extract the bash code block from the response

    Args:
        response: The response from the assistant

    Returns:
        The extracted bash code block as a string
    """
    # reverse search for bash code block start
    start = response.rfind("```bash")
    if start == -1:
        return "No bash code block found in the response."
    # search for bash code block end
    end = response.find("```", start + 7)
    if end == -1:
        return "No bash code block found in the response."
    
    return response[start+7:end].strip()

def main():
    os.system("cls" if os.name == "nt" else "clear")
    interaction_log = ""

    while True:
        new_question = input(Fore.GREEN + Style.BRIGHT + "Enter your thoughts or next steps: " + Style.RESET_ALL)
        interaction_log = log_interaction(interaction_log, user_input=new_question)
        
        analysis_task = "Create a brief analysis of the user's goals, generate a bash command, and explain the logic and the exact command in the response."
        interaction_log = log_interaction(interaction_log, system_message=analysis_task)
        response = gpt3turbo_complete(interaction_log)
        interaction_log = log_interaction(interaction_log, assistant_response=response)
        
        print(Fore.CYAN + Style.BRIGHT + "Assistant: " + Style.NORMAL + response)

        shell_command_generation_task = "Generate the bash code for the command."
        interaction_log = log_interaction(interaction_log, system_message=shell_command_generation_task)
        response = gpt3turbo_complete(interaction_log)

        response = extract_bash_code_block(response)

        print(Fore.CYAN + Style.BRIGHT + "Assistant: " + Style.NORMAL + response)

        readline.set_startup_hook(lambda: readline.insert_text(response))
        try:
            shell_command = input(Fore.YELLOW + Style.BRIGHT + "\n(edit and press enter to execute) $" + Style.RESET_ALL)
        finally:
            readline.set_startup_hook()

        if shell_command == "":
            shell_command = response

        interaction_log = log_interaction(interaction_log, system_message=f'Executing the shell command: {shell_command}')

        output, error = execute_command(shell_command)
        if error:
            print(Fore.RED + Style.BRIGHT + f"\nCommand failed with error: {error}" + Style.RESET_ALL)
            interaction_log = log_interaction(interaction_log, system_message=f'Command failed with error: {error}')
        else:
            print(Fore.BLUE + Style.BRIGHT + f"\nCommand executed successfully. Output: {output}" + Style.RESET_ALL)
            interaction_log = log_interaction(interaction_log, system_message=f'Command executed successfully. Output: {output}')

if __name__ == "__main__":
    main()
