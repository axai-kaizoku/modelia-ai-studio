# Modelia AI Studio

Modelia AI Studio is a modern web application for AI-powered image generation and management. Built with Next.js 15, it provides a seamless experience for creating, managing, and exploring AI-generated images with style customization.

![Tests](https://github.com/YOUR_USERNAME/modelia-ai-studio/workflows/Run%20Tests/badge.svg?branch=axai/test-cases)
![CI](https://github.com/YOUR_USERNAME/modelia-ai-studio/workflows/CI/badge.svg)

## ✨ Features

- 🎨 **AI Image Generation** - Generate images with custom prompts and styles
- 🔐 **Authentication** - Secure signup/signin flow with NextAuth.js
- 📜 **Generation History** - Track and restore previous generations
- 🎭 **Multiple Styles** - Fashion, Casual, Elegant, Street, and Minimalist
- 🌓 **Dark Mode** - Full light/dark theme support
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔄 **Auto Token Refresh** - Automatic session management
- ✅ **Comprehensive Tests** - Full test coverage with Jest and React Testing Library

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or 20.x
- **pnpm** 9.7.1 or higher
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/modelia-ai-studio.git
   cd modelia-ai-studio
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Authentication
   AUTH_SECRET="your-secret-key-here"

   # API Configuration
   BASEURL_API="https://your-api-url.com"

   # Node Environment
   NODE_ENV="development"
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbo
pnpm build            # Build for production
pnpm start            # Start production server
pnpm preview          # Build and start production server

# Code Quality
pnpm check            # Run Biome linter
pnpm check:write      # Run Biome linter and fix issues
pnpm check:unsafe     # Run Biome linter with unsafe fixes
pnpm typecheck        # Run TypeScript type checking

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage report
```

## 🏗️ Project Structure

```
modelia-ai-studio/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (landing)/           # Landing pages
│   │   ├── (protected)/         # Protected routes (requires auth)
│   │   │   └── studio/          # AI Studio interface
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components
│   │   ├── common/              # Shared components
│   │   ├── ui/                  # UI components
│   │   └── __tests__/           # Component tests
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   ├── server/                  # Server-side code
│   │   ├── api/                 # API actions
│   │   ├── auth/                # Authentication config
│   │   └── helper.ts            # API helpers
│   └── styles/                  # Global styles
├── .github/
│   └── workflows/               # GitHub Actions CI/CD
├── public/                      # Static assets
├── jest.config.mjs              # Jest configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── package.json                 # Dependencies and scripts
```

## 🧪 Testing

The project includes comprehensive test coverage using Jest and React Testing Library.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Test Coverage

- **Studio Component**: Upload, generation flow, error handling, abort functionality
- **Form Components**: Login and signup validation
- **UI Components**: Image upload, generation history, results display

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## 🔐 Authentication

The app uses NextAuth.js v5 with credentials provider:

- **Signup**: Create account with name, email, and password
- **Login**: Email and password authentication
- **Session Management**: JWT-based sessions with automatic token refresh
- **Protected Routes**: Automatic redirect for unauthenticated users

## 🎨 Styling

- **Tailwind CSS 4.0** - Utility-first CSS framework
- **CSS Variables** - Theme customization
- **Dark Mode** - System preference detection with manual toggle
- **Responsive Design** - Mobile-first approach

## 🔄 API Integration

The app integrates with a backend API for:

- User authentication (signup/login)
- Image generation
- Generation history

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality

Before submitting a PR:

```bash
# Run linter
pnpm check

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Fix linting issues
pnpm check:write
```

## 📝 Environment Variables

| Variable      | Description                          | Required |
| ------------- | ------------------------------------ | -------- |
| `AUTH_SECRET` | Secret key for NextAuth.js           | Yes      |
| `BASEURL_API` | Backend API URL                      | Yes      |
| `NODE_ENV`    | Environment (development/production) | Yes      |

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.3
- **React**: 19.0.0
- **Authentication**: NextAuth.js 5.0.0-beta.25
- **Styling**: Tailwind CSS 4.0.15
- **State Management**: TanStack Query 5.90.7
- **HTTP Client**: Axios 1.13.2
- **Form Validation**: Zod 3.24.2
- **Testing**: Jest 29.7.0 + React Testing Library 14.3.1
- **Linting**: Biome 2.2.5
- **Package Manager**: pnpm 9.7.1

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors and users

## 📞 Support

For support, email support@modelia.ai or open an issue on GitHub.

---

## ✅ Project Status

- [x] Authentication system
- [x] Signup/signin flow
- [x] Basic UI implementation
- [x] Image generation and storage
- [x] Test cases with Jest
- [x] Theme toggle (light/dark mode)
- [ ] Animations and transitions
- [ ] Advanced image editing
- [ ] Social sharing features

---

**Made with ❤️ for Modelia Team**
