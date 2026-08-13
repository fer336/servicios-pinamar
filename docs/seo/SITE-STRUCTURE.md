# Estructura del Sitio — Servicios Pinamar

| Campo | Valor |
|---|---|
| Objetivo | Jerarquía de URLs clara, enlazado interno coherente, sitemap completo y compuertas de calidad para páginas de contenido |
| Fecha | 2026-08-12 |
| Convención de URLs | Minúsculas, kebab‑case, trailing slash final (coincide con la implementación actual: `getServiceUrl` y enlazados internos). |

---

## 1. Jerarquía de URLs

### 1.1 Estado actual (verificado 2026-08-12)
```
/                              Home (FAQPage + LocalBusiness schema)
/servicios/                    Índice de servicios
/servicios/pintura/            Pintura
/servicios/hidrolavado/        Hidrolavado
/servicios/gas/                Gas (credenciales on‑page)
/servicios/plomeria/           Plomería
/zonas/                        Índice único de zonas (sin páginas por localidad)
/trabajos/                     Galería de trabajos (SSR, prerender=false)
/nosotros/
/contacto/
/aviso-legal/
/privacidad/
```

### 1.2 Propuesta ampliada (estado objetivo)
```
/                              Home
/servicios/                    Índice (5 tiles: Pintura, Hidrolavado, Gas, Plomería, Planos)
/servicios/pintura/            ← optimizar copy (P1)
/servicios/hidrolavado/        ← optimizar copy (P2)
/servicios/gas/                ← title/h1 "gasista matriculado" (P0)
/servicios/plomeria/           ← h1 plural + sección planos (P0)
/servicios/planos/             ★ NUEVO hub: gas / sanitarios / agua corriente (P0)
/zonas/                        Índice (4 fichas + descripciones)
/zonas/pinamar/               ★ NUEVO localidad primaria (P1)
/zonas/carilo/                ★ NUEVO (P1)
/zonas/valeria-del-mar/       ★ NUEVO (P1)
/zonas/ostende/               ★ NUEVO (P1)
/trabajos/
/nosotros/                     ← reforzar E‑E‑A‑T (P1)
/contacto/
/aviso-legal/
/privacidad/
/blog/ (o /recursos/)          Capa informativa (fase 2; puede crecer ad hoc con posts top‑level)
```

### 1.3 Implementación técnica
- Los 4 servicios + planos se sirven desde el mismo `[slug].astro` con `getStaticPaths` (ya prerenderizado) → **nuevo slug `planos` en `src/data/service-pages.ts` y nada cambia en la arquitectura**.
- Localidades: nuevo `src/data/zonas.ts` + `src/pages/zonas/[slug].astro` con `getStaticPaths` sobre las 4 localidades (`serviceAreas` ya define la fuente de verdad: Pinamar, Cariló, Valeria del Mar, Ostende).
- Todas las páginas nuevas deben pasar por `BaseLayout` (canonical automático + schema `@graph` con `#localbusiness`).

---

## 2. Plan de enlazado interno

| Desde | Hacia | Notas |
|---|---|---|
| Home | Index servicios · Index zonas · /trabajos/ · /nosotros/ · /contacto/ | Navegación principal (Header) + destacados |
| /servicios/ (índice) | 5 páginas de servicio (tiles) + /zonas/ (índice) | Tile "Planos" nuevo |
| Página de servicio | Breadcrumb (Home > Servicios > X) · 3 servicios relacionados · bloque "Zonas donde trabajamos" (4) · CTA WhatsApp | Reusar `getRelatedServices` |
| /servicios/planos/ | ↔ /servicios/gas/ ↔ /servicios/plomeria/ · /zonas/ · CTA WhatsApp | Hub como puente del cluster "planos/trámites" |
| /zonas/[slug] | 5 servicios (lista) · índice /zonas/ · zonas vecinas (prev/next) | Cada zona enlaza a los mismos servicios pilar |
| /zonas/ (índice) | 4 páginas de zona + servicios | Fichas con título y snippet de geografía |
| Blog post | Pilar de servicio correspondiente + 1–2 zonas | Texto ancla descriptivo (no "haz clic") |
| Footer/Contacto | WhatsApp · /contacto/ · /aviso-legal/ · /privacidad/ | NAP consistente en todo el sitio |

**Patrón de texto ancla**: usar la keyword geolocalizada ("plomería en Pinamar", "planos de gas"), nunca "ver más"/"aquí".

---

## 3. Sitemap

| Página | Inclusión sitemap | Nota |
|---|---|---|
| Home, servicios (×4), planos ★, zonas (índice + ×4) ★, nosotros, contacto | ✅ automática (todas prerenderizadas) | Astro incluye las estáticas por default |
| /trabajos/ | ⚠️ **Excluida hoy** (`prerender = false`) | Agregar vía `customPages` en astro.config para que quede en el sitemap-index |
| /aviso-legal/ · /privacidad/ | Opcional (indexless no requerido; mantener indexados para legal se suele aceptar; decidir en revisión) | Revisar `noindex` si se prefiere |

- robots.txt ya referencia `sitemap-index.xml` (verificado).
- Canonical: `BaseLayout` genera canonical por URL → verificar tras el despliegue que no haya duplicados http/https/www en GSC.

---

## 4. Mapa de pilares de contenido

```
PILAR Gas                         PILAR Plomería                    PILAR Planos/Trámites
├─ /servicios/gas/                ├─ /servicios/plomeria/           ├─ /servicios/planos/
├─ FAQ gasista matriculado        ├─ FAQ pérdidas/instalaciones     ├─ Planos de gas
├─ Post: qué es un gasista        ├─ Post: checklist pérdidas       ├─ Planos sanitarios
\endash (según calendario)             └─ Post: responsabilidad RTA   ├─ Planos de agua corriente
└─ Zonas (implementa servicio)    └─ Zonas (implementa servicio)    └─ Cita Obras Particulares (municipal)

PILAR Pintura                     PILAR Hidrolavado                 CAPA LOCAL (transversal)
├─ /servicios/pintura/            ├─ /servicios/hidrolavado/        /zonas/pinamar/ ... ostende/
├─ Post: elegir pintor            ├─ Post: hidrolavar antes         enlazan a los 5 servicios
└─ Zonas                         └─ Zonas                          + capa informativa: /blog/ (fase 2)
```

Regla: **una página, una keyword primaria** — el hub de planos no compite con gas/plomería porque cada página conserva su intento dominante; el hub se especializa en el cluster "planos/tramitación".

---

## 5. Compuertas de calidad (quality gates)

| Tipo de página | Palabras mínimas | Unicidad mín. de copia | Reglas adicionales |
|---|---|---|---|
| **Service Page** (servicio pilar) | 800 | 100 % (copy a medida) | FAQ visible + FAQPage schema; 1 keyword primaria; CTA por WhatsApp |
| **Primary Location** (zona principal: Pinamar) | 600 | 60 % único vs. otras zonas | Geografía local real (médanos, avenidas, urbanización), servicios relevantes, mención de trámites (Obras Particulares) |
| **Service Area** (zona secundaria: Cariló, Valeria del Mar, Ostende) | 500 | 40 % único | Ídem, con matices locales (bosque/dunas, estilo de construcciones, acceso) |
| Location absoluta | — | — | **Límite < 30 páginas de ubicación** (el plan genera 4; incluso con 4 servicios × 4 zonas ≈ 20 máximo proyectado, siempre bajo el umbral) |
| Página de blog/recursos | 600–900 | — | Enlaza a pilar; FAQ o checklist; y actualizar si baja de tráfico |
| Solo si /zonas/[slug] repite el copy de /servicios/ | — | — | No jugar: auditoría de similitud tras publicar (objetivo de unicidad de la tabla) |

Nota sobre umbrales de palabras: valores de referencia de industria; se aplican por página nueva/recién redactada. Las páginas existentes de servicio ya cumplen holgadamente (copy extenso verificado en `service-pages.ts`).

---

## 6. Verificación al publicar

- [ ] 404 personalizado para slugs inexistentes (el patrón `[slug]` ya gestiona los conocidos).
- [ ] Canonical único por URL (PDF/sitemap/registro GSC sin duplicados).
- [ ] Sitemap re‑generado post‑cambio y re‑envío en GSC.
- [ ] Llms.txt actualizado con servicios y localidades.
- [ ] Validación de schema (Rich Results Test) para heredada + nuevas páginas (FAQPage en gas, plomería, planos; geo/openingHours en LocalBusiness tras confirmar datos).