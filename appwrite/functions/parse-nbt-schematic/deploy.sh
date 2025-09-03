#!/bin/bash

echo "Deploying NBT Parser function to Appwrite..."

# Login to Appwrite (interactive)
echo "Please login to Appwrite first:"
appwrite login

# Configure client
echo "Configuring client..."
appwrite client --project-id "683770670016d1661c37" --endpoint "https://api.blueprint-create.com/v1"

# Deploy function
echo "Creating deployment..."
appwrite functions create-deployment --function-id="parse-nbt-schematic" --code="." --activate --entrypoint="src/main.js"

echo "Deployment complete!"