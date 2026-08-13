# Estrategia SEO — Servicios Pinamar

| Campo | Valor |
|---|---|
| Sitio | https://www.serviciospinamar.com |
| Negocio | Mantenimiento de propiedades en Pinamar, Buenos Aires (pintura, hidrolavado, gas, plomería, planos) |
| Mercado | Local (Pinamar, Cariló, Valeria del Mar, Ostende) + nacional de búsqueda (veraneantes y propietarios) |
| Fecha | 2026-08-12 |
| Estado | Plan aprobado; implementación por fases (ver IMPLEMENTATION-ROADMAP.md) |
| Documentos relacionados | COMPETITOR-ANALYSIS.md · CONTENT-CALENDAR.md · IMPLEMENTATION-ROADMAP.md · SITE-STRUCTURE.md |

---

## 1. Resumen ejecutivo

El sitio ya tiene una base sólida y poco común en el rubro: páginas de servicio con copy de calidad, marca de datos estructurados (LocalBusiness + Service + BreadcrumbList + FAQPage en home), credenciales reales de gasista matriculado publicadas y arquitectura Astro con sitemap y robots.txt. La oportunidad principal no es técnica, sino de **precisión de targeting y cobertura de contenido**:

1. **Falta la frase exacta "gasista matriculado" en el title y el h1 de /servicios/gas/** (hoy solo aparece en el bloque de credenciales). Es el ajuste de mayor impacto del plan.
2. **No existe una página de "planos"** (de gas, sanitarios, de agua corriente), un cluster con demanda verificable y competencia local casi nula.
3. **No existen páginas por localidad** (/zonas/pinamar/, /zonas/carilo/, etc.): todo el toponimio está concentrado en un solo índice.
4. **Falta el ecosistema señal local**: Google Business Profile, Search Console, GA4, reseñas y consistencia NAP.
5. **Los FAQ de las páginas de servicio existen en código (src/data/service-pages.ts) pero no se renderizan ni se emiten como FAQPage schema** en /servicios/[slug].

La competencia local es extraordinariamente débil: el único jugador cercano es una página-directorio de dpinamar.com.ar sin schema, sin E-E-A-T y sin estructura. La ventana de oportunidad es amplia y acotada en el tiempo.

---

## 2. Descubrimiento (Discovery)

### 2.1 El negocio
Servicios Pinamar ofrece mantenimiento integral de propiedades en la costa: pintura, hidrolavado, gas y plomería, con responsable técnico identificado (Soliz Guido Angel, gasista matriculado de primera; Matrícula 7040, ENARGAS 3316-SG, Habilitación 21012 FG2802). Modelo de captación actual: WhatsApp (https://wa.me/5492267416252 y https://wa.me/5492267521448, este último como CTA principal de presupuesto). No hay local comercial a la calle; el negocio opera como *Service Area Business* (SAB).

### 2.2 Audiencia
| Segmento | Intención de búsqueda | Dispositivo |
|---|---|---|
| Propietarios de propiedades en Pinamar (residentes y no residentes) | "gasista matriculado", "plomero en pinamar", "planos de gas" | Mobile (mayoría, desde la costa o remoto) |
| Inmobiliarias y administradores | mantenimiento pre-temporada, planos y trámites | Desktop/mobile mixto |
| Veraneantes que alquilan | "pintores en pinamar", "hidrolavado pinamar" | Mobile |
| Arquitectos/constructores | "planos sanitarios", "planos de agua corriente" | Desktop |

### 2.3 Objetivos
- **Directos**: posicionar las 7 keywords objetivo en el top 10 de Google local (ver §4).
- **De negocio**: consultas y cotizaciones por WhatsApp desde búsqueda orgánica; llamadas telefónicas; oportunidades de planos/trámites como puerta de entrada a trabajos mayores.
- **De autoridad (12 meses)**: ser la referencia de "mantenimiento de propiedades en Pinamar" citada en listas curadas, prensa local y respuestas de IA generativa.

### 2.4 Recursos y restricciones
- Sitio Astro (static + SSR on-demand para /trabajos); páginas de servicio prerenderizadas vía `getStaticPaths`.
- **Sin baseline de datos**: Search Console y GA4 aún no están configurados. Todas las metas de tráfico son relativas a un baseline a medir en las semanas 1‑2.
- Sin dirección pública verificable → negocio tipo SAB: la estrategia local se apoya en contenido, schema y reseñas, no en un mapa físico.
- **No inventar señales falsas**: no hay reseñas reales publicables, por lo que AggregateRating queda fuera hasta que existan reseñas verificables (ver §9).

---

## 3. Panorama competitivo (resumen)

| Tipo | Ejemplos | Impacto real en Pinamar |
|---|---|---|
| Portales nacionales de gasista/plomería | gasista.com.ar, plomerogasistaurgente.com.ar, gasista.net.ar | Alto volumen genérico, **cero localización**; compiten por "gasista" a secas, no por "gasista matriculado pinamar". No son amenaza directa. |
| Sitios regionales de otras provincias | gasistacba.com (Córdoba), plomero-gasistalaplatamatricul.godaddysites.com (La Plata) | Demuestran el patrón ganador (keyword geolocalizada + matrícula), pero no compiten por nuestra zona. |
| Directorios | Páginas Amarillas, Mi Guía Argentina | Útiles como citaciones locales (NAP), no como competencia de captación. |
| **Competidor local directo** | dpinamar.com.ar/gasistas-en-pinamar-valeria-ostende-carilo/ | Página-directorio con listados de nombres y teléfonos, sin schema, sin contenido, sin E-E-A-T. **Superable con la página de gas actual + ajustes del plan.** |
| Contexto autoridad (no competidor) | tramites.pinamar.gob.ar (Obras Particulares), litoral-gas.com.ar (planos digitales NAG 200 / IRAM 4504) | Fuentes a citar y enlazar para el cluster de planos; validan el lenguaje técnico correcto. |

Conclusión: **posicionamiento prácticamente libre en local**. El riesgo real es entrada tardía de terceros; por eso las fases 1‑2 (Foundation/Expansion) tienen prioridad absoluta. Detalle completo: COMPETITOR-ANALYSIS.md.

---

## 4. Matriz de cobertura de keywords (7 objetivos)

| # | Keyword | Página objetivo | Fijación concreta | Prioridad |
|---|---|---|---|---|
| 1 | gasista matriculado | `/servicios/gas/` | **Poner la frase exacta "gasista matriculado" al inicio del `<title>` y del `<h1>`** (hoy ausente en ambos; solo aparece en credenciales). Añadir FAQ "¿Qué es un gasista matriculado?" + FAQPage schema. | **P0 — impacto máximo** |
| 2 | plomeros en pinamar / plomero en pinamar | `/servicios/plomeria/` | Title ya cubre "Plomero Pinamar y Plomería en Pinamar". Ajustar h1 a "Plomeros en Pinamar para reparaciones, instalaciones y mantenimiento" (plural) y citar ambos en copys/FAQ. FAQPage schema on-page (datos ya existen en `service-pages.ts`). | P0 |
| 3 | pintores en pinamar | `/servicios/pintura/` | Ya cubierta (title + description). Ajustar h1 a "Pintores en Pinamar para casas, locales y propiedades de la costa" para alinear title/h1 en la keyword. | P1 |
| 4 | hidrolavados pinamar | `/servicios/hidrolavado/` | Title ya cubre "Hidrolavado en Pinamar". Incorporar el plural "hidrolavados en Pinamar" una vez en description/lead/situations (intención de uso real coloquial). | P2 |
| 5 | planos de gas | **Nueva página `/servicios/planos/`** + sección ancla y FAQ en `/servicios/gas/` | Página hub con secciones por tipo de plano; FAQ "¿Qué son los planos de gas?" (NAG 200, IRAM 4504, escala 1:100, presentación ante Obras Particulares). FAQPage schema en hub y en gas. | **P0** |
| 6 | planos sanitarios | `/servicios/planos/` + sección en `/servicios/plomeria/` | Página hub + FAQ "¿Qué son los planos sanitarios?"; reforzar covers existente de plomería ("Presentación de planos sanitarios y bajadas de luz y agua corriente"). | P0 |
| 7 | planos de agua corriente | `/servicios/planos/` + sección en `/servicios/plomeria/` | Idem; incluir el término coloquial "bajadas de luz y agua corriente" ya presente en covers. | P0 |

### Decisiones clave (registradas también en §12)
- **URL del hub**: `/servicios/planos/` (consistente con la nomenclatura de servicios existente; se implementa como nuevo slug en `src/data/service-pages.ts` + indexado por `getStaticPaths`).
- **Title y h1 recomendados para la página de gas** (texto exacto propuesto):
  - `<title>`: `Gasista matriculado en Pinamar | Servicios Pinamar`
  - `<h1>`: `Gasista matriculado en Pinamar para instalaciones, revisiones y planos de gas`
  - `meta description` sugerida: `Gasista matriculado en Pinamar para instalaciones, revisiones, mantenimiento y planos de gas. Matrícula 7040 · ENARGAS 3316-SG. Presupuesto por WhatsApp.`
- **Title del hub de planos**: `Planos de Gas, Planos Sanitarios y de Agua Corriente en Pinamar | Servicios Pinamar` (acepta truncado en SERP; prioriza las 3 keywords en los primeros 60 caracteres).
- El hub de planos se posiciona deliberadamente **cerca de la conversión de trámites** (Obras Particulares) y cross-linkea a gas y plomería; no canibaliza las páginas de servicio porque cada una conserva su keyword primaria única.

---

## 5. Arquitectura (resumen)

- **Crear**: `/servicios/planos/` (hub) y `/zonas/[slug]` × 4 (pinamar, carilo, valeria-del-mar, ostende) con copy único por localidad (no templating plano).
- **Mantener**: los 4 servicios actuales, `/zonas/` (índice), `/servicios/` (índice), `/trabajos/`, `/nosotros/`, `/contacto/`.
- **Enlazado interno**: home → servicios y zonas; cada página de servicio → 4 zonas + 3 servicios relacionados + CTA WhatsApp; cada zona → 5 servicios; hub de planos ↔ gas ↔ plomería; blog (fase 2) → pilar de servicio.
- **Sitemap**: el autogenerado por @astrojs/sitemap incluye todas las páginas estáticas (los servicios ya se prerenderizan vía `getStaticPaths`). **Única excepción verificada: `/trabajos/` tiene `prerender = false` y NO aparece en el sitemap autogenerado**; incorporarla vía `customPages`.
- Compuertas de calidad y detalle de jerarquía: SITE-STRUCTURE.md.

---

## 6. Estrategia de contenido

| Capa | Páginas | Objetivo |
|---|---|---|
| Pilar servicio | 4 existentes + 1 (planos) | Rankear las 7 keywords y capturar trámites |
| Capa local | 4 páginas de zona | Capturar variantes "servicio + localidad" y señales SAB |
| Capa informativa (blog, fase 2) | 2 posts/mes | Intents informativos, citación IA, enlazado interno hacia pilares |

Prioridad de creación/mejora y calendario detallado: CONTENT-CALENDAR.md.

---

## 7. Fundamento técnico

| Ítem | Estado | Acción |
|---|---|---|
| Search Console | **Pendiente** | Crear propiedad, verificar vía tag DNS/HTML en `<head>`; recolectar baseline (semanas 1‑2). |
| GA4 | **Pendiente** | Crear propiedad + tag `gtag.js` en `BaseLayout.astro`; eventos de conversión: clic WhatsApp, clic teléfono. |
| Canonical | OK (auto por URL en `BaseLayout`) | Verificar que no haya duplicados http/https/www en GSC tras la configuración. |
| Sitemap | Parcial | Incluir `/trabajos/` vía `customPages` (verificado 2026-08-12: excluido por `prerender = false`). |
| robots.txt | OK | Ya incluye línea Sitemap hacia sitemap-index.xml. |
| llms.txt | Existe | Añadir entradas de "planos" y de las 4 localidades (ver §10 GEO). |
| Meta title/description | Parcial | Ajustes P0 de gas y planos; revisar longitud y keyword en las demás páginas. |
| Core Web Vitals | Sin medición reciente | Objetivo en URLs clave: LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1 (validar con PageSpeed Insights y CrUX una vez indexado el tráfico rel). Atención a imágenes de obra (los PNG de la carpeta raíz del repo pesan 2–3 MB; usar WebP/AVIF optimizados en sitio y galerías). |
| Schema | Parcial | Ver §8. |

---

## 8. Plan de datos estructurados (schema)

Basado en la implementación existente (`BaseLayout.astro` inyecta `@graph` con `LocalBusiness` + `HomeAndConstructionBusiness` bajo `#localbusiness` en cada página; las páginas de servicio ya emiten `Service` + `BreadcrumbList`):

| Acción | Detalle |
|---|---|
| **Geo + horario** | Añadir `geo` (coordenadas aproximadas de Pinamar, **validar contra Google Maps/GBP antes de publicar**) y `openingHours` (horarios reales del negocio — **placeholder hasta confirmar**). |
| **FAQPage en servicio** | Emitir `FAQPage` en gas, plomería, planos (y opcional pintura/hidrolavado) a partir del campo `faqs` que **ya existe en `service-pages.ts` pero hoy no se usa** en `/servicios/[slug]`. Las preguntas deben estar visibles on-page (estado recomendado: <details> desplegables, como en home). |
| **Service subtypes en planos** | En `/servicios/planos/`, un nodo `Service` por subtipo: planos de gas, planos sanitarios, planos de agua corriente (con `@id` propios). |
| **profilePerson** | Añadir nodo `Person` para el responsable técnico (Soliz Guido Angel) con `jobTitle`, `worksFor: #localbusiness`, `knowsAbout: ["gas", "plomería", "planos"]` y las credenciales reales en `hasCredential`/descripción. No inventar fechas ni antecedentes. |
| **Lo que NO se agrega todavía** | `AggregateRating` y `review` (no existen reseñas verificables). Incluir en hoja de ruta de la fase Authority, cuando el sistema de reseñas provea datos reales. |
| **Sin cambios** | Mantener `#localbusiness` como identidad única de la entidad en todo el sitio. |

---

## 9. SEO local y E-E-A-T (Google Business Profile)

### 9.1 Google Business Profile (guía 2025‑2026)
| Acción | Nota |
|---|---|
| Crear/reclamar perfil | Paso 0 de la fase Foundation. |
| Verificación con video | Google está normalizando la verificación por video (GPS + entorno) para SAB; preparar un video corto mostrando zona de trabajo y credenciales. |
| Categorías | Principal: servicio de reparación/mantenimiento del hogar; secundarias: plomero, gasista, pintor. |
| Horarios correctos | **Factor top‑5 del ranking local**: definir horarios reales de atención y mantenerlos en schema + sitio. |
| Regla SAB | Listar ciudades de servicio (Pinamar, Cariló, Valeria del Mar, Ostende), **no** "provincia de Buenos Aires". |
| WhatsApp como canal principal | Ya es el canal de conversión; confirmar el mensaje automático y usar el mismo número que el sitio. |
| Fotos descriptivas | Fotos de obra reales con descripción; fotos de reseñas como señal adicional. |
| NAP consistente | Nombre, teléfono, localidad idénticos en sitio, schema, GBP y directorios locales (Páginas Amarillas, Mi Guía, cámaras locales). |

### 9.2 E-E-A-T
| Señal | Acción |
|---|---|
| Credenciales visibles | Ya publicadas en `/servicios/gas/` (Matrícula 7040 · ENARGAS 3316-SG · Habilitación 21012 FG2802). Reforzar en `/servicios/planos/`, `/nosotros/` y en el `Person` schema. |
| Página /nosotros/ | Fortalecer: quién es el responsable técnico, qué significa cada credencial, cómo se trabaja, fotos de obra. |
| Evidencia original | Fotos de trabajos realizados (galería existente `/trabajos/`), antes/después, videos cortos por WhatsApp/redes. |
| Proceso de reseñas | Colección sistemática post‑servicio (mensaje de seguimiento por WhatsApp con enlace directo para reseñar). |
| Contenido educativo | Blog técnico (planos NAG 200, matrículas, pre‑temporada) demuestra conocimiento de dominio. |

---

## 10. GEO — optimización para IA generativa (ChatGPT, Perplexity, AI Overviews)

1. **FAQ estructuradas y visibles** on-page (gas, plomería, planos): son el formato más citable. Cada respuesta debe funcionar de pie (auto‑contenida, 2‑3 oraciones, con zona y alcance).
2. **Descripciones de servicio citables**: los `lead` y `covers` ya están bien redactados; ajustar para que contengan la ciudad en la primera oración.
3. **Rango de precios**: agregar texto de expectativa de precio sin inventar números (ej. "presupuesto según alcance, materiales y acceso") — la IA tiende a citar descripciones con parámetros claros.
4. **llms.txt**: completar con servicios (incluidos planos), localidades y datos de contacto estructurados.
5. **Curación en listas**: aparecer en listados como "mejores plomeros en Pinamar" (guías locales, blogs de inmobiliarias, portales de la región).
6. **Nap de citación**: consistencia NAP también en directorios para que los agregadores de IA confluyan en un solo negocio.

---

## 11. KPIs y metas (3 / 6 / 12 meses)

El baseline real se fija en las semanas 1‑2 (GSC + GA4). Las metas de tráfico son relativas a ese baseline.

| Métrica | Baseline | 3 meses | 6 meses | 12 meses |
|---|---|---|---|---|
| Tráfico orgánico mensual | Pendiente (GSC) | ×1,5 del baseline | ×2,5 del baseline | ×3+ del baseline |
| Keywords objetivo en top 10 (de 7) | 0–2 | 3 | 5–6 | 7 |
| Keywords objetivo en top 3 | 0 | 1 | 2–3 | 4+ |
| Páginas indexadas | ~12 actuales | 16–18 | 20–24 | 26–32 |
| Core Web Vitals | Sin medición | Pasar a verde en URLs clave | Verde sostenido (campo y laboratorio) | Verde en el 100 % de páginas con tráfico |
| Consultas por WhatsApp desde orgánico | Sin tracking → implementar | 5–10/mes | 15–30/mes | 30–60/mes |
| Llamadas telefónicas desde orgánico | Sin tracking | Tracking activo; 1–3/mes | 3–8/mes | 8–15/mes |
| Reseñas en GBP | 0 | 5–10 | 15–25 | 30–50 |
| Backlinks locales de calidad | ~0 | 2–3 | 5–8 | 10–15 |
| Citas de IA (mención en respuestas de asistente, muestreo) | Sin medición | Muestreo manual 2/mes | 4/mes | 8/mes |

---

## 12. Log de decisiones clave

| # | Decisión | Justificación |
|---|---|---|
| D1 | Fraza exacta "gasista matriculado" en title + h1 de `/servicios/gas/` | Única keyword con matrícula verificable en el mercado; el sitio ya tiene la credencial publicada, solo faltaba el targeting on-page. Impacto inmediato. |
| D2 | Crear hub `/servicios/planos/` (slug `planos` en `service-pages.ts`) | Cubre 3 de las 7 keywords con una sola página interconectada; los grupos de Facebook que ofrecen planos baratos indican demanda real. |
| D3 | FAQPage schema en páginas de servicio usando el campo `faqs` existente (hoy sin usar) | Cero costo de contenido nuevo; cierre del gap detectado en la auditoría; formato citable para IA. |
| D4 | 4 páginas de zona (`/zonas/[slug]`) con copy único | Señales SAB + cobertura de variantes "servicio + localidad"; volumen total (~20 páginas) muy por debajo del umbral de alerta de páginas de ubicación (<30). |
| D5 | Sin `AggregateRating` hasta tener reseñas reales | Google penaliza datos inventados; la fase Authority incluye el sistema de reseñas que lo habilite. |
| D6 | `/trabajos/` al sitemap vía `customPages` | Verificado 2026-08-12: única página con `prerender = false`; queda fuera del sitemap autogenerado. |
| D7 | Geo y openingHours con marcado de "validar" | No hay coordenadas ni horarios verificados; se publican solo tras confirmación con el negocio/GBP. |