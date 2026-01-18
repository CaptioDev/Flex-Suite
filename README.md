# Flex Suite

A modern, high-performance office suite featuring a rich text document editor with Markdown and LaTeX support, a robust calculation engine, and a sleek Material 3 Expressive UI.

## 🚀 Features

- **Rich Text Editor**: Built with Tiptap, supporting bold, italic, underline, strikethrough, font family/size, and more.
- **Math & LaTeX**: Integrated LaTeX support with KaTeX for beautiful mathematical typesetting.
- **Tables**: Advanced visual table picker (up to 50x50) with dynamic expansion.
- **Exports**: Export documents to Markdown, DOCX, or PDF/Print.
- **Aesthetics**: Premium Material 3 Expressive design with fluid "bouncy" animations powered by Framer Motion.
- **High Performance**: Core calculation engine written in C++20 for speed.

## 🏗️ Project Structure

The project is organized as a monorepo:

- **`/frontend`**: React web application (Vite, TypeScript, Tiptap, Framer Motion).
- **`/backend`**: Rust API server (Axum, Tokio, Serde).
- **`/calc_engine`**: C++ calculation engine (C++20, CMake).

## 📦 Deployment

There are two primary ways to deploy the application for production use: using Docker (Recommended) or building manually.

### Option 1: Docker (Pre-built Images)

Pull and run the latest stable version from Docker Hub or GitHub Container Registry:

```bash
# From Docker Hub
docker pull maskedmatters/flex-suite:latest
docker run -p 3000:3000 maskedmatters/flex-suite:latest

# From GitHub Container Registry
docker pull ghcr.io/maskedmatters/flex-suite:latest
docker run -p 3000:3000 ghcr.io/maskedmatters/flex-suite:latest
```

### Option 2: Manual Production Build

You can build and run the production binary directly on your machine without Docker:

1.  **Build Frontend**:
    ```bash
    cd frontend
    npm install
    npm run build
    ```
    This creates a `dist` folder with the compiled assets.

2.  **Run Backend**:
    ```bash
    cd ../backend
    cargo run --release
    ```
    The backend will automatically serve the `dist` folder from the frontend directory. Access the app at `http://localhost:3000`.

## 🛠️ Local Development

Choose the workflow that best fits your needs.

### Prerequisites

- **Node.js**: (Version 18 or higher)
- **Rust**: (Latest stable version)
- **C++ Compiler** & **CMake**: (For the calculation engine)
- **Docker** (Optional, for container testing)

### Option 1: Interactive Workflow (Recommended)

Use this method for active development with Hot Module Replacement (HMR) and fast iteration.

1.  **Frontend** (Terminal 1):
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *   Runs at `http://localhost:5173`.
    *   Proxies API requests to port 3000.

2.  **Backend** (Terminal 2):
    ```bash
    cd backend
    cargo run
    ```
    *   Runs API at `http://localhost:3000`.
    *   Recompiles Rust/C++ changes on restart.

### Option 2: Docker Compose

Use this to verify that your local changes build correctly in the container environment.

```bash
docker compose up --build
```
This builds the application from your *current source code* and serves it at `http://localhost:3000`.

---
Built by [CaptioDev](https://github.com/CaptioDev).
