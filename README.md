# Blueprint

![Logo](https://i.ibb.co/Yk4tGGd/blueprint-mini.webp)

Blueprint is the central hub for Create Mod content, bringing together community-made addons and player-designed schematics in one place.

## Features

- **Addon Directory**: Browse, search and manage Create Mod addons
- **Schematics Platform**: Share and discover Create Mod contraption designs
- **OAuth Authentication**: Login with Discord, GitHub, or Google
- **Collections**: Create personalized addon collections
- **Version Filtering**: Find addons compatible with your Minecraft version
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS
- Shadcn/UI
- i18next
- Appwrite

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/blueprint-site/blueprint-site.github.io.git
cd blueprint-site.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with:
APP_REACT_APP_SUPABASE_URL=your_supabase_url
APP_REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
APP_ADDONSAPI_URL=addons_api_endpoint
```

4. Start development server:
```bash
npm run dev
```

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components and routes
- `/src/stores` - Zustand state management
- `/src/hooks` - Custom React hooks
- `/src/assets` - Static assets and images
- `/src/styles` - Global styles and Tailwind config

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript strictly typed
- Follow project's ESLint configuration
- Use only Tailwind core utilities (no arbitrary values)
- Ensure responsive design
- Maintain accessibility standards
- Add tests for new features

## Get in Touch

- Join our [Discord server](https://discord.gg/blueprint)
- Report issues on [GitHub](https://github.com/blueprint-site/blueprint-site.github.io/issues)
- Email us at blueprint-site@proton.me

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Create Mod Team](https://github.com/Creators-of-Create/Create) for the amazing mod
- All our [contributors](https://github.com/blueprint-site/blueprint-site.github.io/graphs/contributors)
- The Minecraft modding community