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

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: (Version 18 or higher recommended)
- **Rust**: (Latest stable version)
- **C++ Compiler**: (Support for C++20 required)
- **CMake**: (Version 3.10 or higher)

### Setup

1. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend**:
   ```bash
   cd backend
   cargo run
   ```

## ℹ️ Additional Information

### Node.js Installation

For Node.js installation, please visit the [official Node.js website](https://nodejs.org/) and download the recommended LTS version or the latest stable release.

**Note**: The `setup_node.sh` script included in older repository commits is outdated and should not be used. Please install Node.js directly from the official website instead.

---
Built by [CaptioDev](https://github.com/CaptioDev).
