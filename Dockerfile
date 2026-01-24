# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Stage 2: Build Backend
FROM rust:1.80-alpine AS backend-builder
RUN apk add --no-cache build-base musl-dev
WORKDIR /usr/src/app
COPY backend ./backend
WORKDIR /usr/src/app/backend
RUN cargo build --release

# Copy Backend Binary
COPY --from=backend-builder /usr/src/app/backend/target/release/backend .

# Copy Frontend Assets
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 3000
CMD ["./backend"]
