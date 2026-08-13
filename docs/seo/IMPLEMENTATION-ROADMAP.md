# Hoja de Ruta de Implementación — Servicios Pinamar

| Campo | Valor |
|---|---|
| Alcance | Ejecución completa del plan SEO (9 keywords objetivo, 20+ páginas, ecosistema local) |
| Fecha | 2026-08-12 |
| Fases | Foundation (W1‑4) → Expansion (W5‑12) → Scale (W13‑24) → Authority (M7‑12) |
| Dependencias | Ver §5 (F) del documento (checklist de dependencias) |

---

## Fase 1 — Foundation (semanas 1‑4): cimientos y ajustes de mayor impacto

### Tareas (ordenadas)

| # | Tarea | Detalle | Resultado verificable |
|---|---|---|---|
| 1.1 | **Title + h1 "gasista matriculado"** en /servicios/gas/ | Title: `Gasista matriculado en Pinamar | Servicios Pinamar`. H1: `Gasista matriculado en Pinamar para instalaciones, revisiones y planos de gas`. Description con "gasista matriculado" + credenciales. | Frase exacta en title y h1; 100 % sin dependencias |
| 1.2 | **FAQPage schema en servicios** | Emitir FAQPage en gas y plomería (reutilizar campo `faqs` existente en `service-pages.ts`, hoy sin emitir); renderizar FAQ on-page visibles (como en home). | Schema válido (validator), preguntas visibles |
| 1.3 | **Hub /servicios/planos/** | Nuevo slug `planos` en `service-pages.ts` (serviceType "Planos y trámites"); 3 secciones (planos de gas / sanitarios / agua corriente); FAQPage + Service por subtipo; tile "Planos" en índice /servicios/; cross‑links a gas y plomería; cita Obras Particulares. | Página publicada + schema válido |
| 1.4 | **GA4 + Search Console** | Crear propiedades; insertar tag en `BaseLayout.astro`; verificación; sin duplicar tags. | Tag activo, GSC con datos |
| 1.5 | **Baseline** | Registrar queries actuales en GSC, páginas indexadas, velocidad (PageSpeed Insights), sitemap. | Documento de baseline (estado 0 de KPIs) |
| 1.6 | **Sitemap: incluir /trabajos/** | Agregar `/trabajos/` vía `customPages` (única página con `prerender=false`, queda fuera del autogenerado). | /trabajos/ en sitemap |
| 1.7 | **llms.txt** | Añadir entradas de planos y localidades; datos de contacto consistentes. | Archivo actualizado |
| 1.8 | **Google Business Profile** | Crear/reclamar; verificación (priorizar video: GPS + entorno); categorías; horarios reales (factor top‑5); ciudades de servicio (regla SAB: Pinamar, Cariló, Valeria del Mar, Ostende); WhatsApp como mensajería; fotos de obra. | Perfil verificado y completo |
| 1.9 | **Plomeria/Pintura/Hidrolavado copy** | H1 plural plomería ("Plomeros en Pinamar…"); h1 pintura alineado ("Pintores en Pinamar…"); plural "hidrolavados" en copy. | Copy desplegado |
| 1.10 | **Consistencia NAP** | Nombre, teléfono y localidad idénticos en sitio, schema, GBP y directorios (Páginas Amarillas, Mi Guía, cámaras locales). | Verificación NAP cruzada |

### Criterios de éxito de la fase
- GSC + GA4 recolectando datos; baseline documentado.
- Frase "gasista matriculado" verificable en title/h1 de la página de gas.
- Hub de planos publicado con schema FAQPage válido.
- GBP verificado y completo; NAP consistente.
- Sitemap incluye /trabajos/; llms.txt actualizado.

---

## Fase 2 — Expansion (semanas 5‑12): capa local y autoridad inicial

### Tareas (ordenadas)

| # | Tarea | Detalle |
|---|---|---|
| 2.1 | **Páginas de zona × 4** | `/zonas/[slug]` con `getStaticPaths` + fuente de datos nueva (`zonas.ts`). Copy único por localidad (≥500 palabras; 60 % único Pinamar, 40 % servicios) — nunca templating plano. Enlazar a los 5 servicios + índice de zonas. |
| 2.2 | **/nosotros/ reforzado** | Responsable técnico + credenciales explicadas (Matrícula 7040, ENARGAS 3316-SG, Habilitación 21012 FG2802), fotos de obra, cómo se trabaja, zonas de cobertura. Person schema. |
| 2.3 | **Blog inicial** | 4 posts (ver CONTENT-CALENDAR.md, meses 2‑3): gasista matriculado, planos de gas, planos sanitarios/agua corriente, elegir pintor. Enlazado interno hacia pilares. |
| 2.4 | **Proceso de reseñas** | Mensaje de seguimiento por WhatsApp post‑servicio con enlace directo para reseñar en GBP. |
| 2.5 | **Fotos y casos antes/después** | Galería /trabajos/ ampliada; primeras piezas antes/después en sitios y GBP. |
| 2.6 | **Core Web Vitals** | Medir con PageSpeed Insights; optimizar imágenes de obra (WebP/AVIF, dimensiones correctas); revisar carga de fuentes (Urbanist/Outfit) y lazy‑loading. |

### Criterios de éxito de la fase
- 4 páginas de zona indexadas, con copy único verificado (auditoría de similitud).
- 6 piezas de contenido publicadas (4 posts blog + nosotros + galería renovada).
- Primeras reseñas en GBP (5–10 acumuladas).
- CWV en verde en las URLs clave.

---

## Fase 3 — Scale (semanas 13‑24): demanda long‑tail y enlaces

### Tareas (ordenadas)

| # | Tarea | Detalle |
|---|---|---|
| 3.1 | **Análisis de queries reales** | Usar GSC: detectar long‑tail real ("termotanque", "pérdida de agua", "planos de gas para ampliación") y crear contenido de respuesta (FAQ/post). |
| 3.2 | **Enlaces locales** | Cámaras empresariales de Pinamar, directorios locales con NAP, guías de la costa, inmobiliarias (cooperación de contenido), prensa local. Objetivo: 5–8 backlinks de calidad. |
| 3.3 | **Contenido estacional** | Pre‑temporada: checklist de mantenimiento, piezas de pintura/hidrolavado (contraportada del calendario). |
| 3.4 | **Video corto de obra** | Reels/Short: antes/después, proceso de planos; incorporar en páginas y GBP. |
| 3.5 | **GEO activo** | Verificar citabilidad de FAQs y descripciones; cultivar la aparición en listas ("mejores plomeros en Pinamar"); muestreo trimestral de respuestas de IA. |

### Criterios de éxito de la fase
- 5–6 de las 7 keywords objetivo en top 10.
- 5–8 backlinks locales de calidad; NAP consistente en todos.
- Al menos 2 menciones en listas curadas locales.
- Sistema de reseñas fluido (15–25 acumuladas); 100 % de reseñas respondidas.

---

## Fase 4 — Authority (meses 7‑12): consolidación y liderazgo local

### Tareas (ordenadas)

| # | Tarea | Detalle |
|---|---|---|
| 4.1 | **Reseñas → AggregateRating** | Solo cuando existan reseñas reales verificables (GBP). Evaluar habilitar `AggregateRating` legítimo (nunca inventado; revisar políticas de Google previamente). |
| 4.2 | **Lead magnet** | "Checklist de mantenimiento pre‑temporada" descargable (email o WhatsApp). |
| 4.3 | **Prensa/comunidad** | Notas en medios locales de la Costa; participación en comunidades de propietarios; respuestas a consultas en foros locales (autoridad). |
| 4.4 | **Refresco de contenido** | Revisión semestral: copys, FAQs, fotos, datos de contacto; actualización de páginas con baja interacción. |
| 4.5 | **Monitoreo continuo** | GSC (trimestral), posiciones de las 7 keywords, CWV sostenido, citas de IA (muestreo), nuevas búsquedas de competidores. |

### Criterios de éxito de la fase
- 7/7 keywords objetivo en top 10, 4+ en top 3.
- 30–50 reseñas; AggregateRating evaluado con datos reales.
- Tráfico orgánico ≥ 3× baseline; 10–15 backlinks locales.
- Vigencia comprobable: contenido actualizado en los últimos 6 meses (señal de freshness).

---

## 3. Recursos necesarios

| Recurso | Necesidad | Costo estimado |
|---|---|---|
| Dev (Astro) | P0–P1, schema, sitemap, analytics | 2–4 h/semana durante las fases 1‑2 |
| Redacción | Copy por zona, blog (2/mes), nosotros | 3–6 h/mes |
| Fotografía | Fotos de obra, antes/después | Equipo propio / 0 |
| Herramientas | GSC, GA4, PageSpeed Insights (gratuitas); credenciales de pago opcionales al mes 6 | 0 (o presupuesto menor) |
| GBP | Horarios, fotos, mensaje de WhatsApp | 0 |
| Backlinks | Outreach local | Tiempo del responsable |

---

## 4. Riesgos y mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Entrada de un competidor local mejor posicionado | Media | Alto | Ejecutar fases 1‑2 sin demora; credenciales reales difíciles de copiar |
| SAB sin dirección: señal local más débil | Alta (inherente) | Medio | Contenido de zona, schema, reseñas aceleradas, consistencia NAP total |
| Google penaliza reseñas o datos inventados | Baja (no los usaremos) | Alto | Regla dura: nada de AggregateRating/reviews falsos; solo datos verificados |
| Grupos de Facebook ofrecen planos baratos | Media | Medio | Comunicar valor: matrícula, presentación formal, responsabilidad técnica |
| Fotos de obra pesadas afectan CWV | Media | Medio | Compresión WebP/AVIF desde la fase 2 |
| Falta de horarios/dirección verificados | Media | Medio | Validar con el negocio antes de publicar geo/openingHours (placeholders marcados) |

---

## 5. dependencias transversales (checklist)

- [ ] Confirmar con el negocio: horarios reales de atención, coordenadas, NAP definitivo (desbloquea 1.8 y schema geo/openingHours).
- [ ] Confirmar rutas de WhatsApp oficiales de conversión (primarias/CTA) — ya definidas en `service-pages.ts`.
- [ ] Confirmar capacidad de fotografía de obra (desbloquea 2.5 y 3.4).
- [ ] GSC activo (desbloquea baseline, 3.1 y todo monitoreo).