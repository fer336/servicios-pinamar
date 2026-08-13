# Infrastructure Standard Deviations

This document records approved local deviations from `INFRASTRUCTURE.md` v2.1.0 for Servicios Pinamar.

## INF-002 / INF-101 — Multi-image naming

**Estado:** desviación aceptada  
**Fecha:** 2026-08-12  
**Aprobado por:** maintainer

**Motivo**
The standard derives a logical `<IMAGE_BASE>` from `<ORG>/<PROJECT>`, but this repository already publishes three production images with service suffixes:

- `ghcr.io/fer336/servicios-pinamar-web`
- `ghcr.io/fer336/servicios-pinamar-api`
- `ghcr.io/fer336/servicios-pinamar-cms`

Changing image names now would require registry, workflow, compose, and runtime migration without product value.

**Mitigación**
All three images still share the same SemVer release tag and are pinned together in `docker-compose.yml`.

**Revisión**
2027-02-12

## INF-201 — Secret name

**Estado:** desviación aceptada  
**Fecha:** 2026-08-12  
**Aprobado por:** maintainer

**Motivo**
The derived standard secret name for `servicios_pinamar` would be `servicios_pinamar_env`, but production already uses the external Docker Swarm secret `servicios_env`.

Renaming the secret would require coordinated Portainer/runtime migration and risks breaking production configuration.

**Mitigación**
`infra.project.yml`, `docker-compose.yml`, and the API configuration contract explicitly document `servicios_env` and `/run/secrets/servicios_env` as the production secret path.

**Revisión**
2027-02-12

## INF-230 — `.env.example` location

**Estado:** desviación aceptada  
**Fecha:** 2026-08-12  
**Aprobado por:** maintainer

**Motivo**
The standard expects a root `.env.example`. This repository currently documents API runtime configuration in `apps/api/.env.example` because only the API consumes private runtime configuration from `servicios_env`.

**Mitigación**
Any new runtime variable must be added to `apps/api/.env.example` in the same change that introduces it. If web or CMS gain runtime configuration, add a root `.env.example` or per-app examples and update this deviation.

**Revisión**
2027-02-12

## INF-500 / INF-502 / INF-503 — Health and version endpoints

**Estado:** desviación aceptada  
**Fecha:** 2026-08-12  
**Aprobado por:** maintainer

**Motivo**
The current production deployment verifies a public web route instead of a formal `/health` plus `/version` contract. `/version` is not implemented yet.

**Mitigación**
The release workflow must continue failing when production health verification fails. A future infrastructure hardening change should add explicit health/version endpoints and update the workflow to validate the deployed SemVer version.

**Revisión**
2026-11-12

## INF-700 — Required repository files

**Estado:** desviación aceptada  
**Fecha:** 2026-08-12  
**Aprobado por:** maintainer

**Motivo**
The standard expects `AGENTS.md`, root `.env.example`, and visible CI workflow files in the repository root. This repo currently has project instructions in the operator environment, API env documentation in `apps/api/.env.example`, and release workflow state may not be present in the local checkout at all times.

**Mitigación**
Infrastructure agents must still read `INFRASTRUCTURE.md`, `infra.project.yml`, `apps/api/.env.example`, `docker-compose.yml`, and available workflow files before infrastructure changes.

**Revisión**
2026-11-12

## INF-820 / INF-822 / INF-824 — AI attribution trailers

**Estado:** desviación aceptada  
**Fecha:** 2026-08-12  
**Aprobado por:** maintainer

**Motivo**
The local repository/operator policy forbids `Co-authored-by`, `Co-Authored-By`, and AI attribution trailers in commits.

**Mitigación**
Manual commits use the human committer identity, automated release commits use `github-actions[bot]`, and AI-assisted context is tracked through issues, PRs, operational notes, or memory when needed—not commit trailers.

**Revisión**
2027-02-12
