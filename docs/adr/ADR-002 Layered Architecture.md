# ADR-002: Layered Architecture

## Status

Accepted

## Context

The system needs a clear separation of concerns so that domain logic, analysis engines, and presentation concerns can evolve independently.

## Decision

Adopt a layered architecture with a domain package at the center, engine packages for analysis capabilities, application packages for delivery surfaces, and shared infrastructure in the core package.

## Consequences

- Improves maintainability and testability.
- Makes it easier to introduce new engines and plugins.
- Requires thoughtful boundary management between layers.

## Alternatives Considered

- Monolithic implementation inside one package.
- Feature-based structure that mixes concerns together.
