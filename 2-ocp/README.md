# Open Closed Principle

## Principle Description

## Code example presentation

In this example, we have some sales statistics associated to a seller and a reporter which can create a global report for a month.

Responsibilities seems well separated: statistics calculation and report generation are in two different classes that can evolve separately if business rules comes to change.

But what will happen if we need to add features?

## Issue 1: new stakeholder with different rules

Sometimes, a new stakeholder needs a behavior very close to existing, but with some difference.

OCP teach us that code can be extended to obtain this new behavior without modifing current code (and so, without breaking any existing feature).

### Explanation in Code Example

Human Resource is a new stakeholder that needs some statistics and reports on each seller to compute their bonus.

For HR, the marketing expenses are the only ones related to the seller objectives. Others are related to activity and are not counted in objectives.

### Solution: inheritance

## Issue 2: new stakeholder with different details

When a new stakeholders needs a subset of what a feature can do, OCP helps to reuse the common part by specifying only the difference.

### Explanation in Code Example

### Solution: composition

## Issue 3: new infrastructure

What is not part of our core domain logic is in infrastructure layers. This is where communication channels are defined, by adapting our Model to technical constraints.

### Explanation in Code Example

### Solution: strategy pattern

## Relation with SRP
