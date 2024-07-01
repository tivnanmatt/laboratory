# /laboratory/python/app.py: Command-line interface for the Laboratory package

import argparse

def main():
    parser = argparse.ArgumentParser(description='Laboratory Command Line Interface')
    subparsers = parser.add_subparsers(dest='command', help='Sub-command help')

    # Define the 'echo' command
    parser_echo = subparsers.add_parser('echo', help='Echo the input string')
    parser_echo.add_argument('message', type=str, help='The message to echo')

    args = parser.parse_args()

    if args.command == 'echo':
        print(args.message)

if __name__ == "__main__":
    main()