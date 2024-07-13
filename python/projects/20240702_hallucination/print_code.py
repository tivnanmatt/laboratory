import os

def print_file_contents(file_path):
    with open(file_path, 'r') as file:
        print(f"Contents of {file_path}:\n")
        print(file.read())
        print("\n" + "-"*40 + "\n")

def list_files_and_print_contents(root_dir='.'):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        print(f"Directory: {dirpath}")
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            print(file_path)
            if filename.endswith(('.py', '.sh', '.yml')):
                print_file_contents(file_path)

if __name__ == "__main__":
    list_files_and_print_contents()