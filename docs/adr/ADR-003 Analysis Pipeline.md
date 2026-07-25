# ADR-003: Analysis Pipeline

## Status

Accepted

## Context

The platform must support a predictable workflow from repository intake to report generation without tightly coupling individual analysis steps.

## Decision

Model the analysis flow as a staged pipeline where each stage produces structured data that the next stage can consume.

## Consequences

- Supports incremental and composable analysis.
- Helps isolate failures to a specific stage.
- Provides a natural foundation for future rule execution and reporting.

## Alternatives Considered

- One large analysis function.
- Event-driven execution without explicit stage boundaries.
