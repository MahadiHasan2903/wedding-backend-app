# ---- build + compile ----
    FROM node:22-bullseye-slim AS build
    WORKDIR /workspace
    
    # Native build deps for packages like bcrypt, pg, etc.
    RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 build-essential ca-certificates \
        && rm -rf /var/lib/apt/lists/*
    
    # Copy project and install deps (this will also run your "postinstall": "npm run build")
    COPY package*.json ./
    COPY . .
    RUN npm ci \
        && npm prune --omit=dev
    
    # ---- runtime ----
    FROM node:22-bullseye-slim AS runner
    WORKDIR /workspace
    ENV NODE_ENV=production
    # optional: run as non-root
    RUN useradd -m app && chown -R app:app /workspace
    USER app
    
    COPY --from=build /workspace/node_modules ./node_modules
    COPY --from=build /workspace/dist ./dist
    COPY package*.json ./
    
    # your app uses PORT=8080 in .env
    EXPOSE 8080
    CMD ["node", "dist/main.js"]