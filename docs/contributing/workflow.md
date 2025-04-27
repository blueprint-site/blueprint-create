# Contribution Workflow

This guide outlines the contribution workflow for the Blueprint project, including Git practices, issue management, pull request processes, and code review guidelines.

> **Note:** For specific details about issue templates and pull request formatting, see the [Issue Guidelines](./issue-guidelines.md) document.

## Getting Started

Before you start contributing to Blueprint, make sure you have:

1. Created a [GitHub account](https://github.com/signup)
2. [Cloned the repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
3. Set up the development environment as described in the [Installation Guide](../getting-started/installation.md)

## Git Workflow

Blueprint follows a branch-based workflow for contributions:

### Setting Up Your Repository

1. Clone the repository locally:
   ```bash
   git clone https://github.com/blueprint-site/blueprint-create.git
   cd blueprint-create
   ```

2. Verify your remote:
   ```bash
   git remote -v
   ```

### Branch Naming Convention

When creating branches, follow these naming conventions that align with our issue types:

- `feature/short-description` - For new features
- `fix/issue-description` - For bug fixes
- `hotfix/critical-issue` - For critical fixes requiring immediate attention
- `docs/what-changed` - For documentation changes
- `design/what-changed` - For UI/UX changes
- `refactor/component-name` - For code refactoring
- `infra/what-changed` - For infrastructure or tooling changes
- `test/what-tested` - For adding tests

Examples:
- `feature/addon-collections`
- `fix/broken-image-upload`
- `hotfix/security-vulnerability`
- `docs/api-endpoints`
- `design/dark-mode-colors`
- `refactor/search-component`
- `infra/github-actions`

Ensure your branch name corresponds to the type of issue you're addressing.

### Development Workflow

1. **Sync your local repository** with the remote:
   ```bash
   git checkout develop
   git pull
   ```

2. **Create a new branch** for your work:
   ```bash
   git checkout -b prefix/your-feature-name
   ```

3. **Make your changes**:
   - Follow the [code standards](./code-standards.md)
   - Write tests if applicable
   - Update documentation as needed

4. **Commit your changes** using conventional commit messages:
   ```bash
   git add .
   git commit -m "feat: add user collections feature"
   ```

5. **Push your branch** to the repository:
   ```bash
   git push origin feature/your-feature-name
   ```

### Conventional Commits

Blueprint uses the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This helps with automated versioning and changelog generation.

Format: `type(scope): message`

Types (aligned with our issue types and PR prefixes):
- `feat`: A new feature
- `fix`: A bug fix
- `hotfix`: A critical fix requiring immediate attention
- `docs`: Documentation changes
- `design`: UI/UX changes
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or correcting tests
- `infra`: Changes to infrastructure, build process, or tools (combines traditional `build` and `ci`)
- `style`: Changes that don't affect code functionality (formatting, etc.)

Examples:
- `feat(auth): add oauth login with discord`
- `fix(upload): resolve image upload error`
- `hotfix(security): patch authentication vulnerability`
- `docs(api): update endpoint documentation`
- `design(theme): implement dark mode toggle`
- `refactor(search): improve search component performance`
- `infra(ci): add github actions workflow`

> **Note:** These commit types should align with your branch naming convention and PR title prefixes for consistency. See the [Issue Guidelines](./issue-guidelines.md) for more details on PR title prefixes.

### Handling Multiple Changes

If you're working on multiple changes:

1. Create separate branches for each change
2. Submit separate pull requests for each change
3. Reference related pull requests in your comments

## Pull Request Process

### Creating a Pull Request

1. Go to the [repository](https://github.com/blueprint-site/blueprint-create)
2. Click "Pull Requests" > "New Pull Request"
3. Select your branch as the source and `develop` as the target branch
4. Click "Create Pull Request"

### Writing a Good Pull Request Description

Include the following in your PR description:

1. **What does this PR do?** - Brief description of the changes
2. **Related issue** - Link to the GitHub issue (if applicable)
3. **Screenshots** - For UI changes
4. **Testing instructions** - How to test the changes
5. **Additional context** - Any other relevant information

We now use a standardized PR template that is automatically applied when you create a pull request. The template includes:

- Description of changes
- Testing information
- Comprehensive checklist
- Related issues section
- Space for screenshots or clips

Make sure to follow the PR title format described in the [Issue Guidelines](./issue-guidelines.md) document (e.g., `fix: Resolve authentication timeout`).

### Code Review Process

#### For Contributors

1. **Be responsive** to review comments
2. **Address all feedback** before requesting a re-review
3. **Explain your reasoning** when you disagree with a suggestion
4. **Test your changes** thoroughly before submitting

#### For Reviewers

1. **Be respectful and constructive** in your feedback
2. **Focus on important issues** rather than minor style preferences
3. **Explain your reasoning** when requesting changes
4. **Approve when ready** rather than leaving PRs in limbo

### Resolving Conflicts

If your PR has conflicts:

1. Sync your local develop branch:
   ```bash
   git checkout develop
   git pull
   ```

2. Rebase your feature branch:
   ```bash
   git checkout feature/your-feature-name
   git rebase develop
   ```

3. Resolve conflicts in each file
4. Continue the rebase:
   ```bash
   git add .
   git rebase --continue
   ```

5. Force push your updated branch:
   ```bash
   git push --force origin feature/your-feature-name
   ```

## Handling Feedback

### Addressing Review Comments

1. Make the requested changes in your local branch
2. Commit the changes (consider using `fixup` commits)
3. Push to your feature branch
4. Respond to the comment in the PR

### Using Fixup Commits

For addressing review feedback, consider using fixup commits:

```bash
git add .
git commit --fixup HEAD
git push origin feature/your-feature-name
```

Before final merge, squash the fixups:

```bash
git rebase -i --autosquash develop
git push --force origin feature/your-feature-name
```

## Continuous Integration

Blueprint uses GitHub Actions for continuous integration:

1. **Linting**: ESLint checks code quality
2. **Type Checking**: TypeScript validation
3. **Build Check**: Ensures the project builds successfully
4. **Test Runners**: Runs automated tests

All CI checks must pass before a PR can be merged.

## After Merge

After your PR is merged:

1. Delete your feature branch:
   ```bash
   git checkout develop
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. Update your local develop branch:
   ```bash
   git pull
   ```

3. Celebrate your contribution! 🎉

## Issue Management

### Creating an Issue

1. Navigate to the [Issues page](https://github.com/blueprint-site/blueprint-create/issues)
2. Click "New Issue"
3. Select the appropriate issue template based on the type of issue
4. Fill out all required fields in the template
5. Submit the issue

### Issue Labeling

Our project uses labels to prioritize and categorize issues:

- Priority labels indicate urgency (`priority: critical`, `priority: high`, etc.)
- Type labels indicate the kind of issue (`bug`, `feature`, etc.)
- Special attention labels provide additional context (`good first issue`, `help wanted`, etc.)

See the [Issue Guidelines](./issue-guidelines.md) for a complete list of labels.

### Working with the Project Board

We use GitHub Projects to track issue progress:

1. Issues start in the "Backlog" or "To Do" columns
2. Move issues to "In Progress" when you start working on them
3. Move issues to "Review" when ready for review
4. Issues are moved to "Done" when completed and deployed

## Troubleshooting

### Common Issues

1. **CI Failures**:
   - Check the CI logs for specific errors
   - Run linting and tests locally before pushing

2. **Merge Conflicts**:
   - Follow the conflict resolution steps above
   - If complex, consult with maintainers

3. **Stale PRs**:
   - If your PR becomes outdated, rebase on the latest develop branch

4. **Rejected PRs**:
   - Read the feedback carefully
   - Address all concerns before resubmitting

5. **Issue Template Problems**:
   - If the issue template isn't loading correctly, try a different browser
   - Ensure you've selected the correct issue type

## Special Workflows

### Hotfix Process

For critical bug fixes:

1. Create a branch from develop: `git checkout -b hotfix/critical-issue`
2. Fix the issue with minimal changes
3. Submit a PR with the prefix `hotfix:` in the title (e.g., `hotfix: Fix critical security vulnerability`)  
4. Add the `priority: critical` label
5. Request expedited review

### Documentation-Only Changes

For documentation changes:

1. Create a branch: `git checkout -b docs/update-readme`
2. Make documentation changes
3. Submit a PR with the prefix `docs:` in the title (e.g., `docs: Update API documentation`)
4. The PR will follow an abbreviated review process

## Release Process

Blueprint follows semantic versioning:

1. **Major**: Breaking changes
2. **Minor**: New features, non-breaking
3. **Patch**: Bug fixes, non-breaking

The release process is handled by maintainers, who will:
1. Merge PRs into develop
2. Merge develop into main when ready for release
3. Create a new version tag
4. Generate release notes
5. Deploy to production

## Additional Resources

- [Issue Guidelines](./issue-guidelines.md) - Detailed documentation on our issue templates and PR formatting
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Documentation](https://git-scm.com/doc)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## Questions and Support

If you have questions about contributing:

1. Check the [documentation](../)
2. Search for existing [issues](https://github.com/blueprint-site/blueprint-create/issues)
3. Join our [Discord server](https://discord.gg/kDa8YC8u5J)
4. Ask in the repository [discussions](https://github.com/blueprint-site/blueprint-create/discussions)
