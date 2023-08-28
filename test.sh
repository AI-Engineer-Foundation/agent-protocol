#!/bin/bash

# Check if a URL was provided as an environment variable
if [ -z "$URL" ]; then
  echo "Usage: URL=<url> bash <script>"
  echo "Please provide the URL as an environment variable."
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "npm is not found. Please install Node.js and npm, then run this script again."
  exit 1
fi

# Check if newman is installed
if ! command -v newman &> /dev/null; then
  echo "newman is not found. Installing..."
  npm install -g newman
fi

# Inform the user that the process may take some time
cat << "EOF"


                           _     _____           _                  _ 
     /\                   | |   |  __ \         | |                | |
    /  \   __ _  ___ _ __ | |_  | |__) | __ ___ | |_ ___   ___ ___ | |
   / /\ \ / _` |/ _ \ '_ \| __| |  ___/ '__/ _ \| __/ _ \ / __/ _ \| |
  / ____ \ (_| |  __/ | | | |_  | |   | | | (_) | || (_) | (_| (_) | |
 /_/    \_\__, |\___|_| |_|\__| |_|   |_|  \___/ \__\___/ \___\___/|_|
           __/ |                                                      
          |___/                                                       


Made possible by:
- e2b
- Allen Helton
- Postman
- Auto-GPT

Running the tests, this might take a while. Please wait...

EOF

newman run https://raw.githubusercontent.com/Significant-Gravitas/postman/master/Postman%20Collections/agent_protocol_v0.4.json \
-e https://raw.githubusercontent.com/Significant-Gravitas/postman/master/Postman%20Collections/env_0.4.json \
--env-var "url=$URL" \
-r htmlextra \
--reporter-htmlextra-export report.html
