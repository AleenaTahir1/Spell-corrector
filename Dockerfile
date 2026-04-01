FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY server.js ./
COPY public/ ./public/

EXPOSE 3456

ENV NODE_ENV=production
ENV OLLAMA_HOST=http://host.docker.internal:11434

CMD ["node", "server.js"]
