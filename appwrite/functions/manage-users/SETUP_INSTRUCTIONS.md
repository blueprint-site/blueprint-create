# Setup Instructions for User Management Function

## Function Deployment Status

✅ Function created: `manage-users`
✅ Code deployed successfully
✅ Function scopes configured:

- `users.read`
- `users.write`
- `teams.read`
- `teams.write`
- `sessions.write`
  ✅ Environment variables configured:
- APPWRITE_ENDPOINT: https://cloud.appwrite.io/v1
- APPWRITE_PROJECT_ID: 66bff7f20031a646e8b8
- ADMIN_TEAM_ID: admin

## 🎉 No Manual Steps Required!

The function is now fully configured and ready to use. Appwrite automatically provides the `APPWRITE_FUNCTION_API_KEY` environment variable with the scopes we defined, so no manual API key creation is needed.

### Update Client Configuration (Optional)

If you want to use a custom function ID, update your `.env` file:

```env
APPWRITE_MANAGE_USERS_FUNCTION_ID=manage-users
```

Otherwise, the default `manage-users` ID will be used.

## Testing the Function

Once the API key is configured, test the function:

```javascript
// Test from browser console
const response = await fetch('/api/functions/manage-users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Appwrite-JWT': 'YOUR_JWT_TOKEN',
  },
  body: JSON.stringify({
    action: 'listUsers',
    payload: { limit: 10 },
  }),
});
const data = await response.json();
console.log(data);
```

## Security Notes

- The function checks if the requesting user is in the admin team
- All operations require a valid JWT token
- The API key should have minimal required permissions
- Consider implementing rate limiting for production use
