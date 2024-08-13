import os
import argparse
import sys
import ast

def should_ignore(path):
    # Ignore .git directories, .png files, .pyc files, and specific files like print_code_output.txt
    ignore_patterns = ['.git', '.gitignore', '.gitmodules', 'print_code_output.txt']
    ignore_extensions = ['.png', '.pyc']
    
    # Check if the path matches any of the ignore patterns
    if any(pattern in path for pattern in ignore_patterns):
        return True
    
    # Check if the path has an extension that should be ignored
    if any(path.endswith(ext) for ext in ignore_extensions):
        return True
    
    return False

def extract_classes_and_functions(file_path):
    with open(file_path, 'r') as file:
        node = ast.parse(file.read())
    
    lines = []
    
    def extract_class_contents(class_node, indent='    '):
        """Recursively extract class methods and subclasses."""
        class_lines = []
        if ast.get_docstring(class_node):
            class_lines.append(f"{indent}\"\"\"{ast.get_docstring(class_node)}\"\"\"")
        for child in ast.iter_child_nodes(class_node):
            if isinstance(child, ast.FunctionDef):
                class_lines.append(f"{indent}def {child.name}():")
                if ast.get_docstring(child):
                    class_lines.append(f"{indent}    \"\"\"{ast.get_docstring(child)}\"\"\"")
            elif isinstance(child, ast.ClassDef):
                class_lines.append(f"{indent}class {child.name}:")
                class_lines.extend(extract_class_contents(child, indent + '    '))
        return class_lines

    for child in ast.iter_child_nodes(node):
        if isinstance(child, ast.ClassDef):
            lines.append(f"class {child.name}:")
            lines.extend(extract_class_contents(child))
        elif isinstance(child, ast.FunctionDef):
            lines.append(f"def {child.name}():")
            if ast.get_docstring(child):
                lines.append(f"    \"\"\"{ast.get_docstring(child)}\"\"\"")
    
    return "\n".join(lines)

def print_file_contents(file_path, output=sys.stdout):
    """Print the full contents of a file."""
    with open(file_path, 'r') as file:
        print(file.read(), file=output)

def print_directories_and_files(base_dir='.', output=sys.stdout):
    print(f"Listing directories and files starting from {base_dir}:\n", file=output)
    for root, dirs, files in os.walk(base_dir):
        # Remove ignored directories from the walk
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]
        for file in files:
            if should_ignore(os.path.join(root, file)):
                continue
            level = root.replace(base_dir, '').count(os.sep)
            indent = ' ' * 4 * level
            print(f"{indent}{os.path.basename(root)}/", file=output)
            subindent = ' ' * 4 * (level + 1)
            print(f"{subindent}{file}", file=output)
    print("\n" + "="*80 + "\n", file=output)

def print_python_files_content(base_dir='.', output=sys.stdout):
    print(f"Printing classes, functions, methods, subclasses, and docstrings from all .py files starting from {base_dir}:\n", file=output)
    for root, dirs, files in os.walk(base_dir):
        # Remove ignored directories from the walk
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]
        for file in files:
            file_path = os.path.join(root, file)
            if file.endswith('.py') and not should_ignore(file_path):
                print(f"\n--- Contents of {file_path} ---\n", file=output)
                content = extract_classes_and_functions(file_path)
                print(content, file=output)
                print("\n" + "="*80 + "\n", file=output)
            elif file.endswith(('.yml', '.sh', '.md')) and not should_ignore(file_path):
                print(f"\n--- Contents of {file_path} ---\n", file=output)
                print_file_contents(file_path, output)
                print("\n" + "="*80 + "\n", file=output)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Print directory structure and contents of Python files.")
    parser.add_argument('-stdout', action='store_true', help="Print output to the console instead of a file.")
    args = parser.parse_args()

    if args.stdout:
        output = sys.stdout
    else:
        output = open('./print_code_output.txt', 'w')

    try:
        base_dir = '.'  # Start from the current directory
        print_directories_and_files(base_dir, output)
        print_python_files_content(base_dir, output)
    finally:
        if output is not sys.stdout:
            output.close()
