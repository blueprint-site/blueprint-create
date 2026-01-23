## Configuring the .env file
To start using enviroment variables you need to place a `.env` file inside of the root of the folder. (so outside the ./src)

### Contents of a .env file
You need to have these variables
```
VITE_APPWRITE_PROJECT_ID = "projectid"
VITE_APPWRITE_PROJECT_NAME = "projectname"
VITE_APPWRITE_ENDPOINT = "https://reg.cloud.appwrite.io/v1
```
then import them simply by using:
`import.meta.env.VITE_APPWRITE_ENDPOINT`