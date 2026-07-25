# ADR-005: Knowledge Base

## Status

Accepted

## Context

Analysis quality depends on reusable domain knowledge like rules, scenarios, scoring heuristics, and taxonomy.

## Decision

Keep knowledge assets in a dedicated knowledge base package so rules and scoring can evolve independently from engine implementations.

## Consequences

- Makes rule tuning and scoring changes more structured.
- Improves auditability of analysis behavior.
- Requires clear ownership and versioning for knowledge assets.

## Alternatives Considered

- Embedding rules directly in engine code.
- Storing knowledge in ad-hoc JSON or markdown files without structure.
