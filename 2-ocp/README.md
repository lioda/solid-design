# Open Closed Principle

## Principle Description

Requirements change over time, so code must evolve.  
If we modify code for each we create some fragility.

OCP is here to help us keep our code base readable and clean:

> Any component (class, function...) should be open for extension, but closed for modification

What is difference between extension and modification ?

- Modification impact the existing application
- Extension references a bunch of techniques to add behavior and rules in application without modifying existing ones.

## Code example presentation

In this example, we have three features (in 3 classes):

- some sales statistics associated to a seller
- a mean to create a global JSON report on a month, needed by sales management
- a use case orchestrates report generation and saves it in a repository (in string format to simplify example)

Responsibilities seems well separated: statistics calculation and report generation are in two different classes that can evolve separately if business rules comes to change.

To test a design, we need confrontation to change over time.

## Issue 1: New Rules

The marketing department asks us to add some information in the report. They want to compare the volume of `Product` selled.

They always work on some new products and they need market fit feedback.

### Explanation in Code Example

The current `ManagementReporter` generates a report for management, attesting of sales people performance.  
Marketing is asking a whole new metric report.

If we modify the current `ManagementReporter` it could impact current report, event if not by introducing bug at least by adding complexity to a completed feature.

### Solution: A Reporter Strategy

By introducing a new `MarketingReporter` we can separate features (we respect SRP! :) ) and the system is now aware of some reporter plugin.

The new `MarketingReporter` share same interface with existing `ManagementReporter` so we can apply some polymorphism on them, and each report can be injected in `ReportSavingUseCase`.  
As an effect, we can see that `ReportSavingUseCase` obtains more focus on its responsibility (saving report).  
OCP is often a nice complement of SRP.

## Issue 2: Extending Existing Rule

Accountant department wants to pay our sales people, and they may have some bonuses.  
Objectives are proportionnel to each seller's profit generation:

- a fail objective gives no bonus
- a successful objective gives the exact bonus amount
- an outstanding performance of 200% doubles the bonus amount

So we need to keep current report generation (which computes each sales people's profit) and add it an objective comparison.

### Explanation in Code Example

The new `Objective` class encapsulates rules about objectives (applying SRP).

Current `ManagementReporter` implementation is used by management to compare sales people, and probably to set objectives.  
Accountant department has other needs, but based on the same calculation as manager (it would be a serious bug if both calcultations did not give the same result...)

### Solution: Extending Reporter

The new class `AccountantReporter` extends `ManagementReporter`. It uses its superclass `generateReport()` method and complete it.  
By extension we are talking about inheritance, but there are other means to do it (see the `Composition over inheritance` chapter below).

It is important to follow the new `ManagementReporter` interface created during _Issue 1_.

### Composition over inheritance

In this solution, we have deliberately favored inheritance (which is a natural case of extension) over composition.

Inheritance is a powerful but dangerous tool. It's easy to have large class hierarchies that leads to Rigidity or Fragility. Also, some languages permit multiple inheritance which can be hard to maintain (for example, the [diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem)).

Composition creates a design oriented toward flexibility and separation of responsibilities.  
No worries, in the next issue, we will use Composition :)

## Issue 3: Introducing a new use case reusing existing behaviors (relation with SRP and DRY)

When the current behavior is wrong (we made false assumptions on our domain rules), we can change (or delete it). This is not an issue with OCP as the current behavior will no longer be used.

We must note a special need of modifications, when we keep a subset of current rules in addition with some new rule.

### Explanation in Code Example

For example, what if we need to generate an accountant report with only expenses: those from sellers and those from engineers.

If we don't impact current code, we will end up by rewriting some rules. Which is bad from a DRY point of view.  
If we impact current `ManagementReporter`, it's a violation of SRP (it implements many rules) and OCP.

### Solution: separate responsibilities

With SRP we already know how to tackle this issue. We must rules: computing income is a rule, computing expenses is another rule.

Then we can create a new model of what is a reporter: it is an aggregate of rules coupled with a formatter.

Look at the XXX file. We can see each rule isolated from another one and each reporter use a subset of these rules to build its report.

## Code modification and false assumptions

During our programming duties, we always make assumptions about domain (the problem space), the solutions we implement, the future changes.  
All of our asumptions generate tradeoffs between flexibility and rigidity.

OCP and SRP come together to improve sustainability of our design. We can add behavior, extend exisiting rules and compose current features to adapt when requirements change.

However, sometimes there is no choice, be a bug or policy evolution, we fall in the case where modification must happen.

This is why we work with tests (preferably by using TDD or BDD methodology), and despite principles and our efforts there are two circumstances of modification.

- if an ssumption is wrong, there is a bug, and we need to change current code (not without modifying tests first, of course)
- if a feature is no longer used, we need to delete some part of code. SRP helps us to limit our work, and removing an isolated component should be easy.

Code is a living organism which reinvent itself and adapt permanently. Don't hesitate to mutate code when a change occurs.
