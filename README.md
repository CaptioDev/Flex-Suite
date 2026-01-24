# Boron Docs (BD)

A modern, high-performance web-based document editor featuring Markdown and LaTeX support, a sleek Material 3 Expressive UI, and persistent workspace management.

## 🚀 Features

- **Rich Text Editor**: Built with Tiptap, supporting bold, italic, underline, strikethrough, font family/size, and more.
- **Math & LaTeX**: High-performance LaTeX rendering with KaTeX.
- **Workspace Management**: Auto-saving and manual "Save to Workspace" functionality with local persistence.
- **Tables**: Intuitive visual table picker for structured data.
- **Exports**: Export to Markdown, DOCX, or PDF/Print.
- **Design**: Premium Material 3 Expressive UI with fluid neumorphic elements and bouncy animations.

## 🏗️ Project Structure

- **`/frontend`**: React web application (Vite, TypeScript, Tiptap, Framer Motion).
- **`/backend`**: Rust API server (Axum, Tokio).

## 📦 Deployment

### Option 1: Docker (Recommended)
Build and run the entire suite using Docker Compose:
```bash
docker compose up --build
```
The application will be available at `http://localhost:3000`.

### Option 2: Pre-built Docker Images
Pull and run the latest stable version from Docker Hub:
```bash
docker pull maskedmatters/flex-suite:latest
docker run -p 3000:3000 maskedmatters/flex-suite:latest
```

### Option 3: Manual Build
1. **Frontend**: `cd frontend && npm install && npm run build`
2. **Backend**: `cd backend && cargo run --release`
   (The backend serves the built frontend from `frontend/dist`)

## 🛠️ Local Development

### Prerequisites
- **Node.js**: Version 18 or higher.
- **Rust**: Latest stable version.
- **Docker**: For container testing.

### Workflow (Hot Reload)
1. **Frontend**: `cd frontend && npm run dev` (Runs at `http://localhost:5173`)
2. **Backend**: `cd backend && cargo run` (Runs at `http://localhost:3000`)

---
Built by [CaptioDev](https://github.com/CaptioDev).
