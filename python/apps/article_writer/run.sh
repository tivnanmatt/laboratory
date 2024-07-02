#!/bin/bash

# Default port
PORT=80

# Parse command line arguments for --port
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --port) PORT="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

export FLASK_APP=app.py
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=$PORT