# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Stage 2: Build Backend
FROM rust:alpine AS backend-builder
RUN apk add --no-cache build-base
WORKDIR /usr/src/app
COPY calc_engine ./calc_engine
COPY backend ./backend
WORKDIR /usr/src/app/backend
RUN cargo build --release

# Stage 3: Runtime
FROM alpine:latest
RUN apk add --no-cache libstdc++
WORKDIR /app

# Copy Backend Binary
COPY --from=backend-builder /usr/src/app/backend/target/release/backend .

# Copy Frontend Assets
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 3000
CMD ["./backend"]
