# Sentinel Ubiquitous Language

## Purpose

Sentinel is a Production Readiness Intelligence Platform.

Unlike traditional static analysis tools that primarily identify syntactic issues, code smells, or predefined rule violations, Sentinel reasons about software in the same way an experienced engineer performs a production readiness review.

The objective of Sentinel is not simply to answer:

"Is this code correct?"

Instead it answers:

- What assumptions does this code make?
- Which assumptions are dangerous?
- Why are they dangerous?
- What evidence supports this?
- What could fail in production?
- How can the developer prevent that failure?
- Which test scenarios validate the fix?

---

# Core Philosophy

Sentinel follows one engineering principle.

> Every production issue begins with an incorrect assumption.

Code is only evidence.

Assumptions are the real source of production failures.

Sentinel exists to discover those assumptions before production does.

---

# Domain Flow

Repository

↓

Evidence

↓

Observation

↓

Assumption

↓

Finding

↓

Risk

↓

Recommendation

↓

Test Scenario

↓

Report

---

# Repository Context

## Repository

Definition

A Repository represents the complete source code being analysed.

Responsibilities

- Owns projects
- Owns scan configuration
- Represents scan boundaries

Examples

Frontend Repository

Backend Repository

Monorepo

Microservices Repository

---

## Project

Definition

A deployable application within a repository.

Examples

Admin Portal

Customer Portal

API

Dashboard

---

## Module

Definition

A logical grouping of functionality.

Examples

Authentication

Orders

Payments

Inventory

Notifications

---

## Source File

Definition

A physical source code file.

Examples

App.tsx

UserService.ts

routes.ts

Button.tsx

---

## Component

Definition

A UI component.

Examples

React Component

Next Component

Vue Component (future)

---

## Hook

Definition

A reusable stateful behaviour.

Examples

useAuth()

useApi()

usePagination()

---

## Function

Definition

Executable behaviour.

Examples

Arrow Function

Function Declaration

Async Function

Generator

---

## Dependency

Definition

Anything imported or consumed from another module.

Examples

React

Axios

Lodash

Internal Services

---

# Analysis Context

This is the heart of Sentinel.

Everything else exists to support this context.

---

## Evidence

Definition

A fact extracted directly from source code.

Evidence contains zero interpretation.

Examples

useEffect()

fetch()

await

try

catch

Promise.all

optional chaining

localStorage

setTimeout

Evidence answers

"What objectively exists?"

---

## Observation

Definition

An interpreted relationship between one or more pieces of evidence.

Observation introduces meaning.

Example

Evidence

useEffect()

dependency array []

Observation

The effect executes only once.

Observation answers

"What behaviour does this imply?"

---

## Assumption

Definition

An implicit expectation inferred from one or more observations.

Assumptions are never written explicitly.

Examples

Developer assumes

API never fails

State never becomes stale

Network is always available

Component always mounts

Array is never empty

Value is never null

Browser supports feature

User has permission

Clock is synchronized

Assumption answers

"What must remain true?"

---

## Finding

Definition

A validated engineering concern.

A Finding exists when an assumption conflicts with engineering knowledge.

Finding answers

"What should concern us?"

---

## Risk

Definition

Potential production impact caused by a finding.

Examples

Memory Leak

Race Condition

Security Vulnerability

Stale Data

Infinite Render

Performance Regression

Data Loss

User Lockout

Application Crash

Accessibility Failure

Risk answers

"What could fail?"

---

## Recommendation

Definition

A concrete engineering action that reduces or eliminates risk.

Recommendations must always include rationale.

Example

Instead of

"Add dependency"

Sentinel should produce

"Include customerId in the dependency array because stale closures can display outdated customer information after navigation."

Recommendation answers

"What should change?"

---

## Test Scenario

Definition

A realistic validation scenario proving the recommendation.

Examples

Disable network

Navigate rapidly

Refresh browser

Expire authentication

Open multiple tabs

Resize browser

Slow 3G

Packet loss

Server timeout

Offline mode

Background tab

Recommendation answers

"How do we verify this?"

---

# Knowledge Context

Represents engineering knowledge.

---

## Rule

Definition

An executable engineering principle.

Rules evaluate assumptions.

Rules never inspect raw syntax directly.

Parser

↓

Semantic

↓

Assumption

↓

Rule

---

## Pattern

Definition

A repeatable implementation strategy.

Examples

Repository Pattern

Factory

Observer

Singleton

Strategy

---

## AntiPattern

Definition

Known engineering mistake.

Examples

God Component

Deep Prop Drilling

Massive useEffect

Nested Ternary

State Duplication

Magic Numbers

---

## Best Practice

Definition

Industry accepted engineering recommendation.

---

## Taxonomy

Definition

Classification system used by Sentinel.

Examples

Security

Performance

Accessibility

Data Integrity

Rendering

State

Networking

Concurrency

API

Testing

---

# Reporting Context

---

## Report

Definition

Complete analysis output.

Contains

Findings

Recommendations

Metrics

Scores

Risk Summary

Test Scenarios

---

## Metric

Definition

A measurable property.

Examples

Files

Components

Functions

Hooks

Dependencies

Rules Triggered

Findings

Coverage

---

## Score

Definition

Numerical evaluation of production readiness.

Examples

Overall Score

Security Score

Performance Score

Reliability Score

Maintainability Score

Testing Score

---

# Pipeline Context

---

## Pipeline

Definition

The ordered execution of analysis stages.

---

## Stage

Definition

One independent execution step.

Examples

Parser

Semantic

Assumptions

Rules

Scoring

Reporting

---

## Artifact

Definition

Output produced by one stage and consumed by another.

Examples

AST

Semantic Graph

Assumption Graph

Rule Results

Risk Graph

Report

---

# Fundamental Principles

Evidence is objective.

Observation is interpreted evidence.

Assumption is inferred expectation.

Finding is validated concern.

Risk is production impact.

Recommendation is corrective action.

Test Scenario is validation.

Report is communication.

---

# Golden Rule

Sentinel never reports what the code is.

Sentinel reports what the code assumes.

Those assumptions are evaluated against engineering knowledge to determine whether they represent production risk.