# Vite 8 necesita Node 20.19+ o 22.12+
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- Desarrollo (con recarga en caliente) ----------
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------- Compilación ----------
FROM base AS build
COPY . .
RUN npm run build

# ---------- Producción (nginx sirve los archivos ya compilados) ----------
FROM nginx:alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80