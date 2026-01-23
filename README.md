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

### Option 2: Manual Build
1. **Frontend**: `cd frontend && npm install && npm run build`
2. **Backend**: `cd backend && cargo run --release`
   (The backend serves the built frontend from `frontend/dist`)

## 🛠️ Local Development

### Prerequisites

- **Node.js**: Version 18 or higher.
- **Rust**: Latest stable version.

### Setup

1. **Install Dependencies**:
   ```bash
   cd frontend && npm install
   ```

2. **Run Development Server**:
   ```bash
   # From root
   npm run dev --prefix frontend
   ```

3. **Build Project**:
   ```bash
   # From root
   npm run build
   ```

---
Built by [CaptioDev](https://github.com/CaptioDev).
