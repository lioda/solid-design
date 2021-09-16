# Single Responsibility Principle

## Principle Description

SRP states that a module should express only one responsibility.  
Detecting when some code breaks this principle is not an easy task. It requires to know a lot about the domain; and we often know about the domain **after** implementation.  
So SRP related errors are often more easy to fix during the refactor phase of development cycle.

As SOLID principles should give us (at least) more testability on our code, tests are a good indicator off illness.  
But they are not the only one, SRP is about _cohesion_ and _domain separation_.

Through an example we will see how to discern and fix these two main issues.

## Code example presentation

In our example we try to model an application for a parcel delivery service.  
The class `ParcelDayOfArrival` computes when a parcel will arrive.

Delivery is only done during business days, so arrival date must skip week ends.

This date can be displayed to customer in a friendly way and we can calculate some tax to apply on transit according to calendar days.

## Issue 1: lack of cohesion

A method rely on properties of its own class. When some method do not use these fields, we say there is a lack of cohesion.

It may be a sign of SRP related issue.

### Explanation in Code Example

At first, it seems a good idea to `displayToCustomer()` method in `ParcelDayOfArrival` class, because there is a coupling between `ParcelDayOfArrival` data and `displayToCustomer()` implementation.

Taking a closer look, in `displayToCustomer()` we only _read_ `arrivalDate` property _after_ it has been computed (time separation).  
It has nothing to do with business rules implemented in `ParcelDayOfArrival`, so if they change, it has no impact on `displayToCustomer()`.

In fact we face two separated concepts of our domain: _computation day of arrival_ and _display of it in a friendly way_.

### Solution: unit what goes together; separate what is unrelated

We can extract `displayToCustomer()` in it's own concept, the `DisplayDayOfArrival` class. And we rename the method with a more appropriate name: `displayFriendly()`.

Tests are quite the same, we have just to move them in their own file.

This new class rely on `ParcelDayOfArrival.date()` but we transform it to avoid an anaemic domain model. Instead of exposing its date, it can do the formatting itself (maybe it wouldn't be the case in a real world application as we would need to think about i18n)

And we need to change visibility of `countCalendarDaysFrom()` to public and add its tests.  
By adding tests, we highlight a missing edge case: what if customer want to display _after_ day of arrival?  
So during responsibility separation process, we have detected a hidden bug.

Visibility change is not a problem: `countCalendarDaysFrom()` do a computation on inner data without exposing it, encapsulation is respected and it seems to express a domain behavior.

## Issue 2: mixed domains

Behaviors which belong to different domains should be separated. Doing that, we must avoid to leak information of one domain to another.

### Explanation in Code Example

In the example, the `transitTax()` method appears to rely on accountability domain.

Some clues of this separation: the `taxPerDay` field is only used by this method (cohesion issue), the tax is computed on a transit (based on calendar days, not the business days), and tax calculation probably changes at another rythm than delivery rules (`taxPerDay` valu, doubled tax on sunday, and so on).

#### Solution: separation by stakeholders

By splitting the `ParcelDayOfArrival`, we can create the `TransitTax` class which only relay on an abstract `Transit` (defined by a calendar days duration).

This `TransitTax` class allow us to give reality to a concept which exists in the Business Language of accountability domain.

If we implement `Transit` interface in `ParcelDayOfArrival` (without forgiving tests 😉), then the transit tax can be computed on it (and whatever will transit by our delivery service if we decide to diversify our business).

So, the two domains are separated and only linked by an abstraction to avoid any coupling.

## Relation to DRY principle

In the _problem code_, we had a private method `countCalendarDaysFrom(date: Dayjs): number` which was used by `displayToCustomer()` and `transitTax()`.  
It was a good usage of the Don't Reapeat Yourself (DRY) principle.

Now that we have extracted `displayToCustomer()` and `transitTax()`, how to be sure to not duplicate code?  
We have exposed some new methods in `ParcelDayOfArrival` to achieve that. But each extracted class use its own method: `countTransitCalendarDay` for `TransitTax` and a public version of `countCalendarDaysFrom` for `DisplayDayOfArrival`.

Is it a duplication? In fact, `TransitTax` and `DisplayDayOfArrival` are in 2 separated domains, they use the same computation by **accident**.

- `DisplayDayOfArrival` rely on calendar days, and it's unlikely to change. Our customers need a friendly display and unless we change days in the week, it will barely evolves.
- In contrast, the rule for computing tax will probably change; and it must not impact the customer display.

So, these two methods express two different concpets in domain languages. Their linked implementations respect DRY principle. But we are free to change theam apart.

DRY principle is related to SRP, but they are orthognal concepts:

- SRP says that different responsibilities have to be separated
- DRY says that each responsibility must be expressed only once
