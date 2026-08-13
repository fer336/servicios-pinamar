# Calendario de Contenido — Servicios Pinamar

| Campo | Valor |
|---|---|
| Objetivo | Cubrir las 7 keywords objetivo con páginas optimizadas + capa informativa que genere autoridad y citas de IA |
| Fecha | 2026-08-12 |
| Cadencia sostenible | 2 piezas de blog por mes (mínimo 1); páginas de servicio/zonas según fases del roadmap |
| Relación con fases | CONTENT-CALENDAR.md se ejecuta en paralelo a IMPLEMENTATION-ROADMAP.md |

---

## 1. Prioridades de páginas (crear / mejorar)

| Prioridad | Página | Acción | Keyword primaria | Momento |
|---|---|---|---|---|
| **P0** | /servicios/gas/ | Title + h1 con "gasista matriculado" exacto; FAQ "¿Qué es un gasista matriculado?"; FAQPage schema on-page | gasista matriculado | Semana 1 |
| **P0** | /servicios/planos/ (nueva) | Hub con 3 secciones (gas / sanitarios / agua corriente); FAQPage por subtipo; Service schema por subtipo; citar Obras Particulares (tramites.pinamar.gob.ar) | planos de gas · planos sanitarios · planos de agua corriente | Semana 2–3 |
| **P0** | /servicios/plomeria/ | H1 plural "Plomeros en Pinamar…"; sección ancla de planos; FAQPage on-page (faqs ya existen en código) | plomeros en pinamar | Semana 2 |
| P1 | /zonas/pinamar/ /zonas/carilo/ /zonas/valeria-del-mar/ /zonas/ostende/ | 4 páginas con copy único por localidad, enlazando a los 5 servicios | servicio + localidad (long-tail) | Semanas 5–8 |
| P1 | /servicios/ | Tile "Planos" en el índice | navegación + contexto | Semana 3 |
| P1 | /nosotros/ | Refuerzo E‑E‑A‑T: responsable técnico, credenciales explicadas, fotos de obra | marca | Semana 6 |
| P2 | /servicios/pintura/ | H1 alineado a "Pintores en Pinamar"; FAQPage opcional | pintores en pinamar | Semana 9 |
| P2 | /servicios/hidrolavado/ | Incluir plural "hidrolavados en Pinamar" en copy | hidrolavados pinamar | Semana 10 |

---

## 2. Calendario editorial (blog / recursos)

Los títulos se listan en español neutro; se recomienda mantener la voz del sitio (es‑AR) en la redacción final. Cada post enlaza internamente a su pilar de servicio y a una o dos zonas.

| Mes | Tema | Keyword / intent | Tipo | Pilar destino | Notas |
|---|---|---|---|---|---|
| Mes 2 (sem. 6) | "Qué es un gasista matriculado y por qué contratarlo" | gasista matriculado (informativo) | Definición + checklist | /servicios/gas/ | Explicar ENARGAS y matrícula; contenido citable por IA |
| Mes 2 (sem. 8) | "Planos de gas: qué son, cuándo se necesitan y cómo se presentan" | planos de gas (informativo) | Guía | /servicios/planos/ | Mencionar NAG 200, IRAM 4504, escala 1:100 y Obras Particulares Pinamar |
| Mes 3 | "Planos sanitarios y bajadas de luz y agua corriente: guía para propietarios" | planos sanitarios / agua corriente | Guía | /servicios/planos/ | Definir cada tipo y su trámite |
| Mes 3 | "Cómo elegir un pintor en Pinamar: salitre, humedad y preparación de superficies" | pintores en pinamar | Guía de compra | /servicios/pintura/ | Clima costero como diferenciador |
| Mes 4 | "Por qué hidrolavar antes de pintar: exteriores en la costa" | hidrolavado pinamar | Explicativo + caso | /servicios/hidrolavado/ | Enlazar proceso antes/después |
| Mes 4 | "Pérdidas de agua: qué revisar antes de que aparezcan" | plomero en pinamar (urgencia) | Checklist | /servicios/plomeria/ | Intento de urgencia; CTA WhatsApp destacado |
| Mes 5 | "Mantenimiento pre‑temporada: checklist para propiedades de la costa" | estacional (nov–dic) | Checklist descargable | /servicios/ (índice) | Candidato a lead magnet en el futuro |
| Mes 5 | "Gas en propiedades de alquiler temporario: responsabilidades del propietario" | gasista matriculado (legal) | Guía legal | /servicios/gas/ | Apunta a propietarios no residentes |
| Mes 6 | "Cariló, Valeria del Mar u Ostende: qué mantenimiento necesita cada localidad" | localidades (long-tail) | Post de zona | /zonas/ (índice) | Reforzar capa local y enlaces a zonas |
| Mes 6+ | 1–2 posts/mes según demanda detectada en GSC | long-tail real de GSC | Mixto | Variable | Revisión trimestral de queries |

### Estacionalidad (temas recurrentes)
| Época | Tema | Timing |
|---|---|---|
| Pre‑temporada | Checklist de mantenimiento, pintura exterior, revisión de gas | Sep–Nov |
| Temporada alta | Servicios para propietarios ausentes, alquiler temporario | Dic–Feb |
| Post‑temporada | Limpieza e hidrolavado post‑alquiler, reparaciones de invierno | Mar–Abr |
| Invierno | Plomería en propiedades cerradas (pérdidas por heladas), gas | Jun–Ago |

---

## 3. Contenido técnico / formato (por pieza)

- **Título H1** con keyword geolocalizada (patrón: keyword + "en Pinamar").
- **FAQ on-page** (visible, <details> como en home) + FAQPage schema.
- **Cita de fuentes oficiales** en el cluster de planos (tramites.pinamar.gob.ar, normativa ENARGAS).
- **Rango de precios** con lenguaje de expectativa (sin números inventados): "presupuesto según alcance, materiales y acceso a la propiedad".
- **CTA por WhatsApp** con mensaje precargado por servicio (ya existe `whatsappMessage` en el código).
- **Imágenes originales** de obra (nunca stock genérico) con alt descriptivo.

---

## 4. Acciones de E‑E‑A‑T (paralelas al contenido)

| Acción | Frecuencia | Responsable |
|---|---|---|
| Fotos de obra con descripción (alt + texto) | Con cada trabajo | Equipo |
| Casos antes/después (2 por trimestre como mínimo) | Trimestral | Equipo |
| Solicitud de reseña post‑servicio (mensaje WhatsApp con enlace) | Con cada trabajo | Equipo |
| Respuesta a reseñas en GBP | Dentro de 48 h | Responsable |
| Actualización de llms.txt (servicios + localidades) | Con cada cambio de contenido | Dev |

---

## 5. Métricas de seguimiento del contenido

| Métrica | Herramienta | Frecuencia |
|---|---|---|
| Posiciones de las 7 keywords objetivo | GSC (queries) | Mensual |
| Páginas indexadas nuevas | GSC → Páginas | Mensual |
| Clics orgánicos por página | GA4 + GSC | Mensual |
| Tiempo de permanencia en posts | GA4 | Trimestral |
| Citas en respuestas de IA (muestreo manual) | Perplexity / ChatGPT / AI Overviews | Trimestral |
| Reseñas nuevas | GBP | Mensual |