# Issue and Pull Request Guidelines

This document outlines how we use GitHub's issue types, labels, and pull request conventions to keep our project organized.

## Issues

### Issue Types

When creating a new issue, please select the appropriate issue type:

- **Hot-Fix**: Critical fixes requiring immediate attention and expedited deployment
- **Bug**: An unexpected problem or behavior
- **Feature**: A request, idea, or new functionality
- **Documentation**: Improvements or additions to documentation, guides, or inline code comments
- **Design**: Changes to user interface, user experience, or visual elements of the project
- **Infrastructure**: Work on development processes, tooling, CI/CD pipelines, or deployment systems
- **Refactor**: Code quality improvements that enhance maintainability without changing user-facing functionality

### Issue Labels

In addition to the issue type, we use the following labels to provide additional context:

#### Priority Labels
- `priority: critical` - Requires immediate attention, blocking other work
- `priority: high` - Important for current iteration/milestone
- `priority: medium` - Should be addressed soon but not urgent
- `priority: low` - Nice to have, can be deferred

#### Special Attention Labels
- `good first issue` - Good for newcomers
- `help wanted` - Extra assistance needed
- `discussion needed` - Requires team input
- `security vulnerability` - Security issue or improvement
- `duplicate` - This issue already exists elsewhere
- `wontfix` - Intentionally not being addressed with explanation
- `user reported` - Issue created by a community member

## Pull Requests

### PR Title Prefixes

Because GitHub pull requests do not support the same type system as issues, we use title prefixes to indicate the type of change:

- `fix:` - Resolves a bug or issue
- `feat:` - Adds a new feature
- `docs:` - Documentation changes only
- `design:` - UI/UX changes
- `infra:` - Infrastructure and tooling changes
- `refactor:` - Code improvements without functional changes
- `hotfix:` - Critical fixes for production

Example PR titles:
- `fix: Resolve authentication timeout on slow connections`
- `feat: Add dark mode support`
- `docs: Update installation instructions`

### PR Labels

The following labels are commonly used for pull requests:

- `do not merge` - This PR is not ready to be merged
- `fixed in next update` - Already addressed in upcoming release
- `help wanted` - Extra assistance needed
- `major update` - Significant change affecting multiple components (typically used for version releases)

## Project Workflow & GitHub Projects

We use GitHub Projects to track the status and progress of our work:

1. **Issues** track work that needs to be done
2. **GitHub Projects** track the status of issues through our workflow
3. **Pull requests** implement solutions to issues
4. **Labels** provide additional context and filtering capabilities

### Project Board Status

Our GitHub Project board replaces the need for status labels by moving issues through columns that represent their current state:

- **Backlog**: Issues that have been created but not yet scheduled
- **To Do**: Issues scheduled for the current cycle
- **In Progress**: Actively being worked on
- **Review**: Work is complete and awaiting review/testing
- **Done**: Completed and deployed

When you start working on an issue, be sure to move it to the appropriate column in the project board rather than adding status labels.

## Templates and Automation

Blueprint uses issue templates and a pull request template to standardize contributions:

### How Issue Templates Work

When you create a new issue:
1. You'll be presented with a selection of issue types
2. After selecting an issue type, a template with predefined fields will load
3. Fill out the required information based on the template
4. Submit your issue

### Using the Pull Request Template

When you create a pull request:
1. A template will automatically load with predefined sections
2. Fill out all relevant sections
3. Use the checklist to ensure your PR meets all requirements
4. Remember to use the appropriate title prefix

## Tips for Contributors

- Always link PRs to their corresponding issues
- Update issue status on the project board as you make progress
- Request reviews from appropriate team members
- Respond promptly to feedback on your PRs
- Follow the established code style and conventions

## Additional Resources

- [Contributing Workflow](./workflow.md) - Detailed Git workflow guidelines
- [Code Standards](./code-standards.md) - Coding standards and practices
