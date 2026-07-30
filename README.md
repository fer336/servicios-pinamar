# Servicios Pinamar — Astro

Landing page estática, responsive y preparada para SEO local.

## Ejecutar

```bash
npm install
npm run dev
```

Abrí `http://localhost:4321`.

## Compilar

```bash
npm run build
npm run preview
```

## Deploy

El deploy productivo usa GitHub Actions, GHCR y Portainer.

- Imagen: `ghcr.io/fer336/servicios-pinamar-web`.
- Stack: `docker-compose.yml`, conectado a la red externa `network_public`.
- Dominio principal: `www.serviciospinamar.com`.
- El dominio apex `serviciospinamar.com` redirige a `https://www.serviciospinamar.com/` desde Traefik.

Para publicar:

1. Crear una release con tag `vX.Y.Z` — por ejemplo `v1.0.0`. No usar prefijo `web-`.
2. GitHub Actions compila y publica la imagen con tags `X.Y.Z` y `latest`.
3. El workflow fija `docker-compose.yml` a la versión publicada y pushea ese cambio a `main`.
4. El workflow llama al webhook de Portainer para redeployar el stack.

Secret requerido en GitHub:

- `PORTAINER_WEBHOOK`: URL del webhook del stack en Portainer.

DNS esperado:

- `www.serviciospinamar.com` apuntando al Traefik del servidor.
- `serviciospinamar.com` apuntando al mismo servidor para emitir certificado y redirigir a `www`.

## Estructura

- `src/pages/index.astro`: página principal.
- `src/layouts/BaseLayout.astro`: metadatos, fuentes y schema.
- `src/components/`: header, footer, tarjetas e íconos.
- `src/styles/global.css`: diseño responsive completo.
- `public/images/`: imágenes WebP optimizadas usadas por la landing.

## Personalización rápida

- Número de WhatsApp: buscá `5492267521448`.
- Dominio: `astro.config.mjs` y `BaseLayout.astro`.
- Paleta: variables CSS al inicio de `src/styles/global.css`.
