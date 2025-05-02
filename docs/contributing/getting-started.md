# Getting Started with Blueprint Development

This guide will help you set up your development environment and prepare for contributing to Blueprint. Follow these steps to get up and running quickly.

## Prerequisites

Before you begin, make sure you have the following installed:

- **[Node.js](https://nodejs.org/)** (version 18.x or later)
- **[Git](https://git-scm.com/)**
- A code editor (we recommend **[Visual Studio Code](https://code.visualstudio.com/)** with the following extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## Environment Setup

### 1. Fork and Clone the Repository

1. Fork the Blueprint repository on GitHub by clicking the "Fork" button
2. Clone your fork to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/blueprint-create.git
cd blueprint-create
```

3. Add the original repository as an upstream remote:

```bash
git remote add upstream https://github.com/blueprint-site/blueprint-create.git
```

### 2. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the variables in `.env` with your own values (see the [Environment Setup](../getting-started/environment.md) page for details)

### 4. Start the Development Server

Start the development server to see the application running locally:

```bash
npm run dev
```

The application should now be running at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

Here's a quick overview of the main directories you'll be working with:

- **`/src`** - Main source code
  - **`/src/components`** - React components
  - **`/src/api`** - API clients and endpoints
  - **`/src/hooks`** - Custom React hooks
  - **`/src/pages`** - Page components
  - **`/src/routes`** - Route definitions
  - **`/src/styles`** - Global styles
  - **`/src/types`** - TypeScript type definitions
- **`/public`** - Static assets
- **`/docs`** - Documentation files

For a more detailed breakdown, see the [Blueprint Project Structure](../architecture/project-structure.md) documentation.

## Making Your First Contribution

### 1. Find an Issue

1. Browse the [GitHub Issues](https://github.com/blueprint-site/blueprint-create/issues) for something you'd like to work on
2. Look for issues labeled `good first issue` if you're new to the project
3. Comment on the issue to let others know you're working on it

### 2. Create a Branch

Create a new branch for your work, following our naming convention:

```bash
git checkout -b type/short-description
```

Where `type` is one of: `feature`, `fix`, `hotfix`, `docs`, `design`, `refactor`, or `infra`.

For example:
```bash
git checkout -b feature/add-schematic-preview
```

### 3. Make Your Changes

Now you can make your changes to the codebase:

1. Write code according to our [Code Standards](./code-standards.md)
2. Test your changes locally
3. Make sure the development server is running to see your changes

### 4. Commit Your Changes

Commit your changes with a descriptive message following our commit convention:

```bash
git add .
git commit -m "feat: add 3D preview for schematics"
```

See the [Workflow](./workflow.md) document for more details on commit message formatting.

### 5. Push Your Changes

Push your branch to your fork:

```bash
git push origin feature/add-schematic-preview
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template with details about your changes
4. Reference any related issues
5. Submit the pull request

## Debugging Tips

### Local Development

- Check the browser console for errors
- Use React DevTools to inspect component state
- Use the Network tab to debug API requests
- Use `console.log()` for quick debugging (remember to remove before committing)

### Common Issues

- **"Module not found" errors**: Make sure all dependencies are installed with `npm install`
- **API connection issues**: Check your environment variables in `.env`
- **TypeScript errors**: Follow the error messages to fix type issues
- **Styling inconsistencies**: Make sure you're using Tailwind classes correctly

## Getting Help

If you're stuck or have questions:

1. Check the existing [documentation](../)
2. Look for similar issues in the [issue tracker](https://github.com/blueprint-site/blueprint-create/issues)
3. Join our [Discord server](https://discord.gg/kDa8YC8u5J) for real-time help
4. Ask in the repository [discussions](https://github.com/blueprint-site/blueprint-create/discussions)

## Next Steps

After making your first contribution, consider:

- Exploring the codebase to understand it better
- Taking on more challenging issues
- Helping review other pull requests
- Improving documentation
- Joining discussions about project direction

Thank you for contributing to Blueprint! Your help makes the Create Mod ecosystem better for everyone.
