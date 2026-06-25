FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ARG BACKEND_PORT
ENV NODE_ENV=production
ENV PORT=${BACKEND_PORT}
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY data ./data
COPY media ./media
EXPOSE ${BACKEND_PORT}
CMD ["npm", "run", "start"]
