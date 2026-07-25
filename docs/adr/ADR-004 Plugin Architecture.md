# ADR-004: Plugin Architecture

## Status

Accepted

## Context

The product needs extension points for different frameworks, scanners, and output integrations without requiring large core changes.

## Decision

Introduce plugin contracts for integrations and analyzer capabilities, with the core platform providing the orchestration layer.

## Consequences

- Encourages modularity and ecosystem growth.
- Enables framework-specific implementations over time.
- Requires versioning discipline for plugin contracts.

## Alternatives Considered

- Hard-coding support for each framework.
- Building all functionality into the core engine.
