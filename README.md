# Blueprint

<div align="center">
  <img src="/src/assets/logo.webp" alt="Blueprint Logo" width="200" />
  <h1>Blueprint</h1>
  <p>The central hub for Create Mod content</p>
</div>

## About

Blueprint is a modern web platform that serves as the central hub for Create Mod content, bringing together community-made addons and player-designed schematics in one place. Our mission is to make Create Mod content more discoverable and manageable for the community.

### Key Features

- **🔍 Addon Discovery**: Browse, search and filter Create Mod addons with real-time updates
- **📁 Schematic Sharing**: Upload and discover Create Mod contraption designs
- **👥 User Collections**: Create and manage personalized addon collections
- **🔄 Version Compatibility**: Smart filtering for Minecraft and Create Mod versions
- **🌐 Multi-Platform**: Support for multiple mod loaders (Forge, Fabric, NeoForge)
- **🔒 Secure Authentication**: OAuth integration with Discord, GitHub, and Google
- **🌙 Theme Support**: Toggle between light and dark modes
- **🌍 Internationalization**: Multi-language support with i18next
- **📱 Responsive Design**: Optimized for all screen sizes

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI components
- **State Management**: 
  - TanStack Query for server state
  - Zustand for local state
  - Signals for reactive state
- **Backend Integration**: Appwrite
- **Search**: Meilisearch
- **Authentication**: OAuth 2.0 with multiple providers
- **Build Tool**: Vite
- **Testing**: TBD

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Git

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/blueprint-site/blueprint-site.github.io.git
cd blueprint-site.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
(Contact us on Discord for access)
```bash
# Create .env file with required variables
APP_APPWRITE_URL=your_appwrite_url
APP_APPWRITE_PROJECT_ID=your_project_id
APP_MEILISEARCH_URL=your_meilisearch_url
APP_MEILISEARCH_API_KEY=your_api_key
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Project Structure

```
src/
├── api/                 # API integration hooks and utilities
├── assets/             # Static assets (images, icons, fonts)
├── components/         # React components
│   ├── common/         # Shared components
│   ├── features/       # Feature-specific components
│   ├── layout/         # Layout components
│   └── ui/             # UI components (shadcn)
├── config/             # Configuration files
├── context/            # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries and functions
├── pages/             # Page components
├── routes/            # Route definitions
├── schemas/           # Type definitions and schemas
├── stores/            # State management stores
└── styles/            # Global styles and Tailwind config
```

## Development Guidelines

### Component Structure

- Use TypeScript for all components
- Follow React 19 best practices
- Implement proper prop validation
- Include error boundaries where needed
- Add loading states for async operations

### Styling Guidelines

- Use Tailwind CSS core utilities only
- Avoid arbitrary values in utility classes
- Follow responsive design patterns
- Maintain dark mode compatibility
- Use Shadcn/UI components when possible

### Code Quality

- Follow ESLint configuration
- Write clear component documentation
- Include type definitions
- Maintain accessibility standards
- Use meaningful component names

### Git Workflow

1. Create feature branch from develop
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and commit using conventional commits
```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue"
```

3. Push changes and create pull request
```bash
git push origin feature/your-feature-name
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and development process.

## Community

- Join our [Discord Server](https://discord.gg/blueprint)
- Follow us on [GitHub](https://github.com/blueprint-site)
- Report issues [here](https://github.com/blueprint-site/blueprint-site.github.io/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Email: blueprint-site@proton.me
- Discord: [Blueprint Server](https://discord.gg/blueprint)
- GitHub: [@blueprint-site](https://github.com/blueprint-site)

## Acknowledgments

- [Create Mod Team](https://github.com/Creators-of-Create/Create)
- [Minecraft Modding Community](https://modrinth.com)
- All our [contributors](https://github.com/blueprint-site/blueprint-site.github.io/graphs/contributors)
