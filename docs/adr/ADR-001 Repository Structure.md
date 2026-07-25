# ADR-001: Repository Structure

## Status

Accepted

## Context

The project needs a clear repository layout that supports monorepo development, multiple delivery surfaces, and separation of domain, engine, and application concerns.

## Decision

Adopt a monorepo structure with apps for user-facing surfaces, packages for shared domain and engine capabilities, docs and examples for supporting content, and tests for verification.

## Consequences

- Improves reuse across applications.
- Makes the architecture easier to reason about.
- Requires coordination when introducing new packages or dependencies.

## Alternatives Considered

- A single-package repository.
- A polyrepo structure with duplicated infrastructure.
