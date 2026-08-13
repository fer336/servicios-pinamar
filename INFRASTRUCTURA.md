# INFRASTRUCTURE.md

> **Qué es este documento**
> Define la arquitectura, convenciones y reglas obligatorias para construir, configurar y desplegar este proyecto.
>
> **Cómo se usa**
> Se copia tal cual al repositorio. Únicamente se completa la **§0 (Instanciación)**. El resto es invariante.
>
> **Los agentes de IA deben leer este archivo antes de modificar** infraestructura, contenedores, orquestación, CI/CD, configuración, secretos o procesos de deployment.

**Versión del estándar:** 2.1.0 · **Última revisión:** 2026-08-12

---

# 0. Instanciación del proyecto

Única sección editable por proyecto. Debe mantenerse sincronizada con `infra.project.yml`.

| Clave | Valor | Notas |
|---|---|---|
| `<ORG>` | `mi-organizacion` | Organización / owner del repositorio |
| `<PROJECT>` | `mi-proyecto` | Slug en `kebab-case` |
| `<PROJECT_SNAKE>` | `mi_proyecto` | Mismo nombre en `snake_case` — base del nombre del secret |
| `<TRACK>` | `app` / `cms` | Vía. Ver §2 |
| `<PROFILE>` | `A` / `B` / `C` | Topología. Ver §3 |
| `<REGISTRY>` | `ghcr.io` | Registry de imágenes |
| `<IMAGE_BASE>` | `ghcr.io/mi-organizacion/mi-proyecto` | Prefijo de todas las imágenes |
| `<RUNTIME_MANAGER>` | Portainer | Ver §8 para adaptadores admitidos |
| `<SECRET_NAME>` | `mi_proyecto_env` | Ver §6 |
| `<HEALTH_URL>` | `https://mi-proyecto.com` | Verificable desde CI |
| `<RUNTIME_LANG>` | `nodejs` | Determina el adaptador del Anexo B |
| `<UPSTREAM_IMAGE>` | — | Solo vía CMS: imagen base y versión fijada |
| `<SERVICES>` | Ver §0.1 | Servicios con estado o dependencias del stack |

**INF-001 (MUST)** — Ningún otro archivo del repositorio redefine estos valores. Son la única fuente de verdad.

**INF-002 (MUST)** — Los nombres derivados (`<SECRET_NAME>`, `<IMAGE_BASE>`) se calculan a partir de `<PROJECT>`; no se eligen de forma independiente.

**INF-003 (MUST)** — Un proyecto declara exactamente una vía y exactamente un perfil.

## 0.1 Servicios del stack

```yaml
services:
  backend:
    image: <IMAGE_BASE>-backend
    needs_secret: true
    stateful: false

  frontend:
    image: <IMAGE_BASE>-frontend
    needs_secret: false   # El frontend NO monta el secret (§6.5)
    stateful: false

  postgres:
    image: postgres:16.4
    needs_secret: true
    stateful: true
    volume: <PROJECT>_postgres
```

---

# 1. Alcance y niveles normativos

Palabras clave según RFC 2119:

| Nivel | Significado |
|---|---|
| **MUST** | Obligatorio. Su incumplimiento invalida el deployment y bloquea el merge. |
| **SHOULD** | Recomendado. Puede omitirse con justificación registrada (§14). |
| **MAY** | Opcional. Decisión libre del proyecto. |

Cada regla tiene un identificador estable para poder citarla en revisiones de PR y validaciones automáticas.

```text
INF-xxx   Reglas universales
APP-xxx   Reglas adicionales de la vía Aplicación
CMS-xxx   Reglas adicionales o sustitutivas de la vía CMS
```

**Alcance.** Cubre el camino desde el commit hasta producción saludable. No prescribe framework, lenguaje, base de datos ni diseño interno de la aplicación.

---

# 2. Las dos vías

## 2.1 Vía Aplicación (`app`)

Un sistema construido a medida. El repositorio contiene el código fuente, el pipeline lo compila, y la imagen resultante **es** el producto.

## 2.2 Vía CMS (`cms`)

Un sitio operado sobre un gestor de contenido de terceros. El repositorio contiene la **personalización** (temas, plugins, configuración) sobre una imagen upstream. Tiene dos canales de cambio: el pipeline y el panel de administración.

## 2.3 Qué cambia entre vías

| | **Vía Aplicación** | **Vía CMS** |
|---|---|---|
| Origen de la imagen | Construida desde el repositorio | Upstream fijada, opcionalmente extendida |
| Qué versiona la release | El código de la aplicación | Core + temas + plugins + configuración |
| Contenido | Parte del código o irrelevante | **Estado de producción, nunca versionado** |
| Canales de cambio | Uno: el pipeline | Dos: el pipeline y el panel de administración |
| Etapa de tests | Tests automatizados | Smoke tests (§13.6) |
| Riesgo principal | Regresión de código | **Drift**: producción deja de parecerse al repositorio |
| Backup pre-deploy | Recomendado | **Obligatorio** |

**INF-004 (MUST)** — Las reglas `INF` aplican a ambas vías. Las reglas de vía añaden o sustituyen; cuando sustituyen, lo indican explícitamente.

---

# 3. Perfiles de topología

| | **Perfil A** — Compose | **Perfil B** — Swarm | **Perfil C** — Multi-imagen |
|---|---|---|---|
| Topología | Host único | Cluster | A o B, varios artefactos |
| Unidad de deploy | Stack Compose | Stack Swarm | Stack + N imágenes |
| Réplicas | 1 por servicio | N por servicio | Según servicio |
| Zero-downtime | Best effort | `update_config` obligatorio | Según servicio |
| Almacenamiento de archivos | Volumen local admisible | **Object storage obligatorio** | Según servicio |

**INF-101 (MUST)** — En Perfil C, todas las imágenes de una release comparten el mismo tag `vX.Y.Z`.

**INF-102 (MUST)** — En Perfil B, ningún servicio replicado depende de archivos escritos en el filesystem local del contenedor.

---

# 4. Modelo de responsabilidades

| Rol | Responsabilidad | Por defecto | Alternativas |
|---|---|---|---|
| **SCM** | Código, tags, releases | GitHub | GitLab, Gitea |
| **CI/CD** | Tests, build, publicación, disparo del deploy, verificación | GitHub Actions | GitLab CI, Woodpecker |
| **Registry** | Imágenes inmutables | `<REGISTRY>` | Cualquiera con soporte OCI |
| **Runtime Manager** | Stacks, redes, volúmenes, secretos, aplicación del deploy | `<RUNTIME_MANAGER>` | §8 |
| **Config Store** | Custodia de la configuración de producción | Docker Secrets | Vault, SOPS + secret |
| **Aplicación / CMS** | Leer configuración, arrancar, exponer salud y versión | — | — |

**INF-301 (MUST)** — El CI no asume responsabilidades del Runtime Manager: no crea ni modifica secretos, volúmenes, redes ni configuración de runtime en el servidor.

**INF-302 (MUST)** — El Runtime Manager no compila ni construye imágenes.

**INF-303 (MUST)** — Lo desplegado no conoce a Portainer, al SCM ni al registry. Solo conoce el contrato de configuración (§6) y el de salud (§9).

---

# 5. Versionado y artefactos

## 5.1 Semantic Versioning

**INF-100 (MUST)** — Las releases usan `vMAJOR.MINOR.PATCH`.

| Incremento | Vía Aplicación | Vía CMS |
|---|---|---|
| `PATCH` | Correcciones internas | Parche de core, plugin o tema sin cambio visible |
| `MINOR` | Funcionalidad compatible | Plugin nuevo, cambio de tema, funcionalidad nueva |
| `MAJOR` | Cambio incompatible | Upgrade de core con cambio de esquema, cambio de tema base |

## 5.2 Inmutabilidad

**INF-110 (MUST)** — Cada release genera imágenes etiquetadas exactamente con el tag de la release.

```text
Release v1.4.2  →  <IMAGE_BASE>:v1.4.2
```

**INF-111 (MUST)** — Prohibido `latest` en producción, y prohibido cualquier tag flotante que pueda cambiar de contenido (`:8`, `:stable`, `:alpine`).

```yaml
# ✗ prohibido
image: <IMAGE_BASE>:latest
image: wordpress:latest

# ✓ requerido
image: <IMAGE_BASE>:v1.4.2
image: wordpress:6.8.1-fpm
```

**INF-112 (MUST)** — Una imagen publicada no se sobrescribe ni se re-publica.

**INF-113 (SHOULD)** — El registry tiene habilitada la inmutabilidad de tags a nivel de plataforma.

**INF-114 (MAY)** — El compose puede fijar además el digest:
```yaml
image: <IMAGE_BASE>:v1.4.2@sha256:<digest>
```

## 5.3 Rollback

**INF-120 (MUST)** — El rollback consiste en volver a fijar una versión previamente válida. Nunca se reconstruye una imagen antigua.

**INF-121 (MUST)** — El rollback debe ser posible sin acceso al pipeline: basta editar el tag en el stack y re-aplicarlo.

**INF-122 (MUST)** — Si una release incluye una migración de datos irreversible, se documenta en las notas de la release que el rollback de imagen **no** revierte el esquema.

---

# 6. Configuración y secretos

## 6.1 La regla fundamental: dos familias de configuración

Todo proyecto tiene exactamente dos familias de variables. **Mezclarlas es el error más común y peligroso.**

| Familia | ¿Qué es? | Prefijos típicos | ¿Dónde vive? | ¿Va en Portainer? |
|---|---|---|---|---|
| **Runtime / Backend** | Claves privadas, DB, tokens, URLs internas | `DB_`, `JWT_`, `REDIS_`, `API_INTERNAL_`, `SMTP_`, `SECRET_` | Secret único + `.env` local | ✅ **Sí** |
| **Build-time / Frontend** | Client ID público, URLs de API pública, feature flags | `VITE_`, `NEXT_PUBLIC_`, `REACT_APP_`, `PUBLIC_` | `.env` local + `build-arg` | ❌ **NO** |

**INF-200 (MUST)** — El proyecto usa **un solo secret de configuración** para runtime, no uno por variable.

```text
✗  database_password, jwt_secret, smtp_password  (un secret por variable)
✓  <SECRET_NAME>                                 (un solo secret)
```

**INF-201 (MUST)** — El nombre del secret es `<PROJECT_SNAKE>_env`, montado en:
```text
/run/secrets/<PROJECT_SNAKE>_env
```

**INF-202 (MUST)** — El secret se declara como externo. Debe existir previamente en el Runtime Manager.

```yaml
services:
  backend:
    image: <IMAGE_BASE>-backend:v1.4.2
    secrets:
      - <SECRET_NAME>

  frontend:
    image: <IMAGE_BASE>-frontend:v1.4.2
    # ← NINGÚN secret. El frontend no lee runtime.

secrets:
  <SECRET_NAME>:
    external: true
```

```yaml
# ✗ prohibido en producción
secrets:
  <SECRET_NAME>:
    file: .env
```

**INF-203 (MUST)** — El secret se declara únicamente en los servicios que realmente lo consumen (`needs_secret: true`).

**INF-204 (MAY)** — Un proyecto puede definir un segundo secret exclusivamente para material que no es texto plano de configuración (claves privadas, certificados, keyfiles). No para variables.

## 6.2 Contenido y formato del secret único

**INF-210 (MUST)** — El secret contiene texto `KEY=VALUE`, equivalente conceptual a un `.env.production` de backend, sin valores reales versionados jamás.

**Ejemplo de contenido válido del secret:**
```text
DB_HOST=postgres
DB_NAME=miapp
DB_PASSWORD=supersecreta
DB_PORT=5432
JWT_SECRET=clave-firma-jwt
API_INTERNAL_URL=http://backend:8080
REDIS_URL=redis:6379
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx
```

**INF-211 (MUST)** — Toda la configuración de los servicios del stack que la requieran proviene de este mismo mecanismo. No se escriben credenciales dentro del compose.

## 6.3 Variables de Frontend (Build-time)

**INF-250 (MUST)** — Las variables de frontend se **queman en la imagen** durante el build. No se leen en runtime. No van en el secret de Portainer, no van en `environment` del compose.

**INF-251 (MUST)** — Si una variable lleva prefijo público (`VITE_`, `NEXT_PUBLIC_`, `REACT_APP_`, `PUBLIC_`), **nunca** entra en el secret de Portainer. Se expone al navegador por definición.

**INF-252 (MUST)** — Las variables de frontend se inyectan vía `--build-arg` en el pipeline de CI:

```yaml
# En el workflow de CI
- name: Build frontend
  run: |
    docker build       --build-arg VITE_API_URL=${{ vars.VITE_API_URL }}       --build-arg VITE_AUTH_CLIENT_ID=${{ vars.VITE_AUTH_CLIENT_ID }}       -t <IMAGE_BASE>-frontend:${{ github.ref_name }}       ./frontend
```

**INF-253 (MUST)** — El Dockerfile del frontend declara los `ARG` y los expone como `ENV` antes del build:

```dockerfile
FROM node:20-alpine AS builder
ARG VITE_API_URL
ARG VITE_AUTH_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_CLIENT_ID=$VITE_AUTH_CLIENT_ID
RUN npm run build
```

**INF-254 (MUST)** — Si cambia una variable de frontend, requiere una **nueva release** (nuevo build). No basta con reiniciar el contenedor.

## 6.4 Precedencia y carga

**INF-220 (MUST)** — El orden de precedencia es fijo e idéntico en todos los entornos:

```text
1. Variables de entorno del proceso   (mayor prioridad)
2. /run/secrets/<SECRET_NAME>          (producción)
3. .env                                (solo desarrollo)
4. Valores por defecto del código      (menor prioridad)
```

**INF-221 (MUST)** — La misma imagen de backend funciona en desarrollo y en producción sin cambios de código. El único diferenciador es la presencia del archivo de secret.

```text
DESARROLLO                    PRODUCCIÓN
.env                          Runtime Manager
  │                             │
  ▼                             ▼
Backend                       Secret único
                                │
                                ▼
                              /run/secrets/<SECRET_NAME>
                                │
                                ▼
                              Backend
```

**INF-222 (MUST)** — La configuración se valida al arrancar; el proceso falla de forma inmediata y explícita si falta una variable requerida.

**INF-223 (MUST)** — Nunca se escriben valores sensibles en logs, trazas ni respuestas de error.

## 6.5 `.env.example`

**INF-230 (MUST)** — El repositorio contiene `.env.example` con **ambas familias** de variables, separadas claramente, con valores vacíos o placeholders evidentes, nunca reales.

```text
# ============================================================
# RUNTIME / BACKEND  →  Van en el secret de Portainer
# ============================================================
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=5432
JWT_SECRET=
API_INTERNAL_URL=
REDIS_URL=
SMTP_HOST=
SMTP_USER=
SMTP_PASSWORD=

# ============================================================
# BUILD-TIME / FRONTEND  →  NO van en Portainer
# Se inyectan vía --build-arg en el pipeline de CI
# ============================================================
VITE_API_URL=
VITE_AUTH_CLIENT_ID=
VITE_STRIPE_PUBLIC_KEY=
NEXT_PUBLIC_GA_ID=
```

**INF-231 (MUST)** — Al introducir una variable nueva, en el mismo cambio se debe:
1. Agregar soporte en configuración (código),
2. Agregarla a `.env.example` en la sección correcta,
3. Documentarla si no es evidente,
4. Asumir que producción la recibirá por el mecanismo correspondiente (secret si es runtime, build-arg si es frontend),
5. **No** crear un secret nuevo.

**INF-232 (SHOULD)** — El CI verifica que `.env.example` cubra las variables declaradas como requeridas.

## 6.6 Secretos de CI

**INF-240 (MUST)** — Los secretos del CI cubren solo lo necesario para construir y desplegar. No son un espejo de la configuración de runtime.

```text
✓  REGISTRY_TOKEN, DEPLOY_WEBHOOK_URL, HEALTHCHECK_TOKEN
✗  DATABASE_PASSWORD, JWT_SECRET, claves de proveedores
```

**INF-241 (SHOULD)** — El secret de configuración se rota sin necesidad de una nueva release: se actualiza en el Runtime Manager y se reinicia el servicio.

---

# 7. Pipeline de release

## 7.1 Regla principal

**INF-300 (MUST)** — Producción es **release-driven**. Un push a la rama principal no despliega producción; el disparador es la creación de una release SemVer.

## 7.2 Etapas obligatorias

**INF-310 (MUST)** — Al crearse `vX.Y.Z`, el pipeline ejecuta en este orden:

| # | Etapa | Vía Aplicación | Vía CMS | Falla ⇒ aborta |
|---|---|---|---|---|
| 1 | Validar formato SemVer | ✓ | ✓ | ✓ |
| 2 | Verificar tag upstream fijado | — | ✓ | ✓ |
| 3 | Tests | automatizados | smoke (§13.6) | ✓ |
| 4 | Build backend | ✓ | si hay imagen propia | ✓ |
| 5 | Build frontend (con build-args) | ✓ | ✓ | ✓ |
| 6 | Construir imagen(es) | ✓ | ✓ | ✓ |
| 7 | Etiquetar con el tag de la release | ✓ | ✓ | ✓ |
| 8 | Publicar en el registry | ✓ | ✓ | ✓ |
| 9 | **Backup verificado de datos y archivos** | recomendado | **obligatorio** | ✓ |
| 10 | Fijar el tag en `docker-compose.yml` | ✓ | ✓ | ✓ |
| 11 | Commit + push del compose | ✓ | ✓ | ✓ |
| 12 | Disparar el deploy (§8) | ✓ | ✓ | ✓ |
| 13 | Esperar a que termine | ✓ | ✓ | ✓ |
| 14 | Ejecutar migraciones | según §7.3 | `CMS-121` | ✓ |
| 15 | Verificar salud **y versión** (§9) | ✓ | ✓ | ✓ |
| 16 | Marcar el deployment como exitoso | ✓ | ✓ | — |

**INF-311 (MUST)** — El deploy se dispara **después** de que el compose actualizado esté disponible en el SCM. Nunca antes.

**INF-312 (MUST)** — El pipeline nunca reporta éxito si producción no quedó correctamente desplegada y verificada.

**INF-313 (MUST)** — El pipeline es idempotente: re-ejecutarlo sobre el mismo tag no produce artefactos distintos ni estado inconsistente.

**INF-314 (SHOULD)** — Se usa control de concurrencia para impedir dos deploys simultáneos sobre el mismo entorno.

## 7.3 Migraciones

**INF-320 (MUST)** — El proyecto declara explícitamente dónde se ejecutan las migraciones de esquema. Una sola opción, documentada en `infra.project.yml`:

| Estrategia | Cuándo conviene |
|---|---|
| Al arrancar el contenedor, antes de servir tráfico | Perfil A, réplica única |
| Job de migración dedicado previo al despliegue | Perfiles B y C |
| Paso explícito posterior al deploy | Vía CMS (`CMS-121`) |
| Manual, con aprobación | Migraciones destructivas o largas |

**INF-321 (MUST)** — Con más de una réplica, las migraciones no se ejecutan en el arranque de cada réplica.

**INF-322 (SHOULD)** — Las migraciones son compatibles hacia atrás dentro de una misma MAJOR.

---

# 8. Deploy y runtime

## 8.1 Contrato del disparador

**INF-400 (MUST)** — El deploy se dispara mediante un mecanismo que cumpla este contrato:

1. Es invocable desde el CI con una credencial;
2. Hace que el runtime lea el stack versionado y aplique las imágenes fijadas;
3. Permite al CI determinar si el cambio se aplicó.

| Adaptador | Disparo |
|---|---|
| **Portainer** (por defecto) | Webhook de actualización del stack |
| Compose vía SSH | `pull` + `up -d` remoto |
| Swarm | `docker stack deploy` remoto |
| GitOps (Argo CD, Flux) | Reconciliación desde el repositorio |

**INF-401 (MUST)** — Sea cual sea el adaptador, el estado deseado vive en el repositorio. La interfaz del Runtime Manager no es la fuente de verdad para las versiones de imagen.

## 8.2 Runtime Manager

**INF-410 (MUST)** — El Runtime Manager es responsable de stacks, servicios, secretos, redes, volúmenes y aplicación del deploy.

**INF-411 (MUST)** — `docker-compose.yml` está versionado y forma parte del código. Los tags que contiene representan lo desplegado o lo listo para desplegar.

**INF-412 (SHOULD)** — Todo cambio manual en la UI del runtime que afecte al stack se refleja después en el repositorio, o se revierte.

---

# 9. Salud, verificación y persistencia

## 9.1 Contrato de salud

**INF-500 (MUST)** — El servicio principal expone:

```http
GET /health  →  200  {"status":"ok"}
```

**INF-501 (SHOULD)** — Se distinguen liveness y readiness cuando hay dependencias de arranque:

| Endpoint | Significa |
|---|---|
| `GET /health` | El proceso está vivo |
| `GET /health/ready` | Dependencias listas; puede recibir tráfico |

**INF-502 (MUST)** — El servicio expone la versión efectivamente desplegada:

```http
GET /version  →  200  {"version":"v1.4.2"}
```

**INF-503 (MUST)** — La verificación post-deploy comprueba **salud y versión**. Un `200 OK` de la versión anterior es una falla de deployment.

**INF-504 (MUST)** — La verificación define reintentos y timeout explícitos, y falla al agotarlos.

**INF-505 (SHOULD)** — Los servicios definen `healthcheck` a nivel de contenedor.

## 9.2 Persistencia

**INF-510 (MUST)** — Los servicios con estado usan volúmenes persistentes.

**INF-511 (MUST)** — Actualizar una imagen nunca destruye datos persistentes.

**INF-512 (MUST)** — Un deployment nunca elimina volúmenes de forma automática.

**INF-513 (SHOULD)** — El proyecto documenta qué volúmenes existen, qué contienen y cómo se respaldan.

---

# 10. Seguridad

**INF-600 (MUST)** — Ningún secreto se escribe en el repositorio: ni en el compose, ni en el código, ni en archivos versionados.

**INF-601 (MUST)** — `.env` está en `.gitignore` y nunca llega al repositorio.

**INF-602 (MUST)** — Las variables compiladas dentro de un artefacto de frontend son públicas por definición. Nunca contienen credenciales.

```text
✗  VITE_DATABASE_PASSWORD, NEXT_PUBLIC_API_KEY
✓  VITE_API_BASE_URL, VITE_APP_VERSION
```

**INF-603 (MUST)** — Las credenciales privadas permanecen del lado servidor.

**INF-604 (MUST)** — Los secretos no se pasan como build args ni quedan en capas de la imagen.

**INF-605 (SHOULD)** — Los contenedores corren como usuario no root.

**INF-606 (SHOULD)** — El pipeline escanea vulnerabilidades de la imagen.

**INF-607 (SHOULD)** — Solo se publican los puertos necesarios; la comunicación entre servicios usa la red interna del stack.

---

# 11. Repositorio y documentación

**INF-700 (MUST)** — El repositorio contiene:

```text
INFRASTRUCTURE.md      este estándar
infra.project.yml      instanciación legible por máquina (Anexo A)
AGENTS.md              instrucciones para agentes (Anexo C)
README.md              arranque local y descripción
.env.example           contrato de configuración (ambas familias)
.gitignore             incluye .env
docker-compose.yml     stack versionado
```

**INF-701 (SHOULD)** — `docs/DEPLOYMENT.md` documenta lo específico: estrategia de migraciones, volúmenes, procedimiento de rollback y contactos.

**INF-710 (MAY)** — La estructura de la aplicación es libre. Las convenciones de infraestructura no varían.

---

# 12. Vía Aplicación

**APP-100 (MUST)** — Existen tests automatizados y son una etapa bloqueante del pipeline.

**APP-101 (MUST)** — Las migraciones de esquema son propias del proyecto, versionadas junto al código, y su estrategia está declarada según `INF-320`.

**APP-102 (MUST)** — La imagen se construye enteramente desde el repositorio. Nada se descarga ni se instala en tiempo de arranque.

**APP-103 (SHOULD)** — El build es reproducible: dependencias fijadas mediante lockfile versionado.

---

# 13. Vía CMS

La premisa que ordena toda esta sección: **el repositorio define cómo se ve y qué puede hacer el sitio; producción define qué contiene.**

## 13.1 La imagen

**CMS-100 (MUST)** — La imagen upstream se fija a una versión exacta en `<UPSTREAM_IMAGE>`, incluyendo el patch.

```text
✗  wordpress:latest    wordpress:6
✓  wordpress:6.8.1-php8.3-fpm
```

**CMS-101 (MUST)** — Si el proyecto tiene temas, plugins o configuración propia, se construye una imagen propia que los incluye. El código no se monta por bind mount ni se sincroniza por FTP/rsync en producción.

**CMS-102 (MUST)** — El conjunto completo de core, plugins y temas está declarado en el repositorio mediante un manifiesto versionado.

**CMS-103 (MUST)** — Las actualizaciones automáticas del CMS están **deshabilitadas en producción**.

```php
define('AUTOMATIC_UPDATER_DISABLED', true);
define('DISALLOW_FILE_MODS', true);
```

**CMS-104 (MUST)** — El panel de administración **no es un canal de despliegue**. Instalar, actualizar o eliminar plugins y temas desde el panel de producción está prohibido.

**CMS-105 (SHOULD)** — El pipeline detecta drift: compara las extensiones presentes en producción contra el manifiesto y alerta si divergen.

## 13.2 El contenido

**CMS-110 (MUST)** — El contenido es **estado de producción**. No se versiona en el repositorio y no se restaura desde él durante un deployment.

**CMS-111 (MUST)** — La sincronización entre entornos tiene una sola dirección permitida:

```text
Producción  ──►  Staging  ──►  Local
```

**CMS-112 (MUST)** — Los archivos subidos por usuarios viven en almacenamiento persistente: volumen dedicado en Perfil A, **object storage en Perfiles B y C**.

**CMS-113 (SHOULD)** — Los dumps que salen de producción hacia entornos inferiores se anonimizan si contienen datos personales.

## 13.3 Backup y upgrades

**CMS-120 (MUST)** — Antes de toda release que modifique la versión del core, el pipeline ejecuta y **verifica** un backup de la base de datos y de los archivos.

**CMS-121 (MUST)** — Las migraciones internas del CMS se ejecutan como paso explícito del pipeline tras el deploy.

**CMS-122 (MUST)** — Un upgrade de MAJOR del core se prueba antes en staging con una copia reciente de producción.

## 13.4 Configuración

**CMS-140 (MUST)** — El CMS lee su configuración desde variables de entorno provistas por el secret único. El archivo de configuración del CMS está versionado pero **no contiene valores**, solo lecturas:

```php
define('DB_NAME',     getenv('DB_NAME'));
define('DB_USER',     getenv('DB_USER'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
```

**CMS-141 (MUST)** — Las claves de sesión y salts del CMS son secretos: viven en `<SECRET_NAME>`, no en el repositorio.

**CMS-142 (MUST)** — La URL pública del sitio se configura por entorno.

## 13.5 Salud y versión

**CMS-130 (MUST)** — El CMS expone `/health` y `/version` mediante un plugin, módulo o ruta propia mínima.

**CMS-131 (MUST)** — `/version` devuelve la versión de la **release del proyecto**, inyectada como variable de entorno. No la versión del core del CMS.

## 13.6 Verificación en lugar de tests unitarios

**CMS-150 (MUST)** — La etapa 3 del pipeline se cumple con smoke tests:

- La home responde `200`;
- El panel de administración responde `200`;
- Todos los plugins del manifiesto están activos;
- No hay errores fatales en el log tras el arranque;
- Una página de contenido representativa renderiza sin error.

## 13.7 Headless: dos canales de despliegue

**CMS-160 (MUST)** — Los dos canales están separados y no se mezclan:

```text
CANAL CÓDIGO                        CANAL CONTENIDO
Release SemVer                      Publicación en el CMS
      │                                   │
      ▼                                   ▼
Pipeline completo (§7)              Webhook de contenido
      │                                   │
      ▼                                   ▼
Nueva imagen + deploy               Rebuild/revalidación
                                    con la MISMA imagen
```

**CMS-161 (MUST)** — El canal de contenido **nunca** modifica versiones de imagen, ni toca el compose, ni dispara el webhook de deploy.

**CMS-162 (MUST)** — Una falla del canal de contenido no marca el deployment como fallido, ni al revés.

---

# 14. Desviaciones

**INF-900 (MUST)** — Las desviaciones viven en `docs/DEVIATIONS.md` con este formato:

```md
## INF-115 — Plataformas de build

**Estado:** desviación aceptada
**Fecha:** 2026-08-12
**Aprobado por:** <nombre>

**Motivo**
Solo se despliega en amd64. No hay infraestructura arm64.

**Mitigación**
Documentado y monitoreado.

**Revisión**
2027-08-12
```

**INF-901 (MUST)** — Un agente de IA no crea ni aprueba desviaciones por su cuenta. Puede proponerlas.

---

# 15. Agentes de IA

## 15.1 Antes de cambiar algo

**INF-800 (MUST)** — Antes de modificar contenedores, orquestación, CI/CD, deployments, secretos, variables de entorno, servicios de datos, networking o producción, el agente debe leer:

1. `INFRASTRUCTURE.md` (este archivo)
2. `AGENTS.md`
3. `infra.project.yml` — **especialmente `track` y `profile`**
4. `.env.example`
5. `docker-compose.yml`
6. Los workflows del CI

**INF-801 (MUST)** — El agente aplica las reglas de la vía declarada. No asume vía aplicación por defecto.

## 15.2 Prohibido

**INF-810 (MUST NOT)** — El agente no debe:

- Usar `latest` ni tags flotantes en producción;
- Desplegar producción automáticamente en cada push a la rama principal;
- Crear un secret por variable, ni fragmentar el secret único;
- Meter variables `VITE_*`, `NEXT_PUBLIC_*` en el secret de Portainer;
- Pasar secrets del backend como `build-arg` del frontend;
- Versionar `.env` reales, passwords en el compose o claves en el código;
- Exponer secretos en variables de frontend;
- Replicar la configuración de runtime en los secretos del CI;
- Publicar imágenes de producción sin tag SemVer;
- Disparar el deploy antes de actualizar el compose;
- Reportar éxito con la verificación fallida;
- Eliminar volúmenes persistentes durante un deployment;
- Rediseñar la infraestructura sin que se lo pidan.

**CMS-810 (MUST NOT)** — En vía CMS, además, el agente no debe:

- Versionar la base de datos de contenido;
- Restaurar un dump hacia producción;
- Instalar o actualizar plugins desde el panel;
- Habilitar actualizaciones automáticas del core;
- Montar código por bind mount o sincronizar por FTP en producción;
- Tocar el compose o las versiones de imagen desde el canal de contenido;
- Ejecutar un upgrade de core sin backup verificado previo.

## 15.3 Requerido

**INF-811 (MUST)** — El agente debe:

- Mantener `.env.example` al día con ambas familias separadas;
- Usar el secret único para backend; `build-arg` para frontend;
- Respetar la precedencia de configuración;
- Exponer salud y versión;
- Versionar el compose con imágenes inmutables y SemVer;
- Verificar los deployments;
- Mantener el proyecto portable.

**INF-812 (MUST)** — Ante una dependencia nueva, verificar si ya existe en el stack. No duplicar infraestructura.

**CMS-811 (MUST)** — En vía CMS, ante un plugin o tema nuevo, agregarlo al manifiesto versionado, incluirlo en la imagen y cubrirlo en los smoke tests.

## 15.4 Atribución

**INF-820 (MUST)** — La autoría refleja quién hizo realmente el cambio:

```text
Cambio manual        →  autor = desarrollador
Cambio del pipeline  →  autor = bot del CI
Cambio con un agente →  autor principal + Co-authored-by del agente
```

**INF-821 (MUST)** — Los commits automáticos del CI se identifican como el bot de la plataforma.

**INF-822 (MUST)** — Cuando un agente participa realmente, su contribución queda visible mediante trailers `Co-authored-by`.

**INF-823 (MUST NOT)** — No inventar identidades ni direcciones de bots. No atribuir un cambio a un agente que no participó.

---

# 16. Checklist de conformidad

## 16.1 Común a ambas vías

**Instanciación**
- [ ] §0 completa y `infra.project.yml` sincronizado
- [ ] Vía y perfil declarados

**Artefactos**
- [ ] Releases SemVer; sin `latest` ni tags flotantes
- [ ] Tags inmutables; imágenes nunca sobrescritas
- [ ] Compose fija versiones explícitas

**Configuración**
- [ ] Un único secret `<SECRET_NAME>`, declarado como externo
- [ ] Montado en `/run/secrets/<SECRET_NAME>`
- [ ] **Separación runtime vs build-time documentada en `.env.example`**
- [ ] Variables de frontend (`VITE_*`, `NEXT_PUBLIC_*`) **NO** en el secret
- [ ] Precedencia implementada; misma imagen en dev y prod
- [ ] Validación de config al arranque, fail-fast
- [ ] `.env.example` completo; `.env` ignorado

**Pipeline**
- [ ] Disparado por release, no por push
- [ ] Etapas en el orden de §7.2, todas bloqueantes
- [ ] Frontend se compila con `--build-arg` para variables públicas
- [ ] Deploy disparado después del push del compose
- [ ] Estrategia de migraciones declarada
- [ ] Sin éxito falso posible

**Verificación**
- [ ] `/health` y `/version` implementados
- [ ] Versión comprobada post-deploy
- [ ] Reintentos y timeout definidos

**Persistencia y seguridad**
- [ ] Volúmenes persistentes para servicios con estado
- [ ] Ningún secreto en el repositorio ni en el frontend
- [ ] Rollback probado al menos una vez

## 16.2 Adicional — vía Aplicación

- [ ] Tests automatizados bloqueantes
- [ ] Migraciones versionadas junto al código
- [ ] La imagen no descarga nada en tiempo de arranque
- [ ] Lockfile de dependencias versionado

## 16.3 Adicional — vía CMS

- [ ] Imagen upstream fijada a versión exacta con patch
- [ ] Manifiesto de core, plugins y temas versionado
- [ ] Actualizaciones automáticas deshabilitadas
- [ ] Instalación desde el panel bloqueada
- [ ] Código dentro de la imagen, sin bind mounts ni FTP
- [ ] Contenido nunca restaurado hacia producción
- [ ] Medios en volumen persistente u object storage según perfil
- [ ] Backup verificado antes de releases que tocan el core
- [ ] Migraciones del CMS como paso explícito del pipeline
- [ ] `/health` y `/version` provistos por módulo propio
- [ ] Smoke tests cubriendo home, panel y plugins activos
- [ ] Headless: canales de código y contenido separados

---

# 17. Regla de oro

> **Un proyecto, un secret de configuración (solo para backend).**
>
> **Las variables de frontend se queman en la imagen, nunca van en secrets.**
>
> **Una release, una imagen inmutable.**
>
> **El repositorio es el estado deseado; el runtime solo lo aplica.**
>
> **En un CMS, el repositorio define el sitio y producción define el contenido: nunca al revés.**
>
> **Los commits automáticos pertenecen al bot del pipeline.**
>
> **Los agentes reciben atribución solo cuando participaron de verdad.**
>
> **Un deployment exitoso existe únicamente cuando producción responde saludable y con la versión esperada.**

---

# Anexo A — `infra.project.yml`

Ver archivo `infra.project.yml` en la raíz del repositorio. Es la fuente legible por máquina de la §0.

---

# Anexo B — Adaptadores de carga de configuración

El contrato de `INF-220` es idéntico en todos los casos.

**Python**
```python
import os
from pathlib import Path
from dotenv import load_dotenv

PROJECT = os.getenv("PROJECT_NAME", "<PROJECT_SNAKE>")
secret = Path(f"/run/secrets/{PROJECT}_env")
load_dotenv(secret if secret.exists() else ".env", override=False)
```

**Node.js**
```javascript
import fs from "node:fs";
import dotenv from "dotenv";

const project = process.env.PROJECT_NAME ?? "<PROJECT_SNAKE>";
const secret = `/run/secrets/${project}_env`;
dotenv.config({ path: fs.existsSync(secret) ? secret : ".env", override: false });
```

**Go**
```go
project := getenv("PROJECT_NAME", "<PROJECT_SNAKE>")
secret := "/run/secrets/" + project + "_env"

path := ".env"
if _, err := os.Stat(secret); err == nil {
    path = secret
}
_ = godotenv.Load(path)
```

**Shell / entrypoint**
```bash
#!/bin/sh
SECRET="/run/secrets/${PROJECT_NAME}_env"
[ -f "$SECRET" ] && set -a && . "$SECRET" && set +a
exec "$@"
```

**PHP / WordPress**
```php
define('DB_NAME',     getenv('DB_NAME'));
define('DB_USER',     getenv('DB_USER'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
define('DB_HOST',     getenv('DB_HOST'));
define('AUTH_KEY',    getenv('AUTH_KEY'));
define('WP_HOME',     getenv('WP_HOME'));
define('WP_SITEURL',  getenv('WP_SITEURL'));
```

---

# Anexo C — Plantilla de `AGENTS.md`

Ver archivo `AGENTS.md` en la raíz del repositorio.

---

# Anexo D — Placeholders

| Placeholder | Ejemplo | Dónde se define |
|---|---|---|
| `<ORG>` | `mi-organizacion` | §0 |
| `<PROJECT>` | `mi-proyecto` | §0 |
| `<PROJECT_SNAKE>` | `mi_proyecto` | derivado |
| `<TRACK>` | `app` / `cms` | §0 |
| `<PROFILE>` | `A` / `B` / `C` | §0 |
| `<REGISTRY>` | `ghcr.io` | §0 |
| `<IMAGE_BASE>` | `ghcr.io/mi-organizacion/mi-proyecto` | derivado |
| `<SECRET_NAME>` | `mi_proyecto_env` | derivado |
| `<UPSTREAM_IMAGE>` | `wordpress:6.8.1-php8.3-fpm` | §0, solo vía CMS |
| `<RUNTIME_MANAGER>` | `portainer` | §0 |
| `<HEALTH_URL>` | `https://mi-proyecto.com` | §0 |
| `<RUNTIME_LANG>` | `nodejs` | §0 |
