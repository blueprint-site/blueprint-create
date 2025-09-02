@echo off
echo Deploying NBT Parser function to Appwrite...

echo Please login to Appwrite first:
appwrite login

echo Configuring client...
appwrite client --project-id "683770670016d1661c37" --endpoint "https://api.blueprint-create.com/v1"

echo Creating deployment...
appwrite functions create-deployment --function-id="parse-nbt-schematic" --code="." --activate --entrypoint="src/main.js"

echo Deployment complete!
pause