# slotwise domain

> Module 0 deliverable. Written in my own words.

## Bounded contexts

The parts of the system with their own language and rules.

| Context | What it owns | What it calls an appointment |
| --- | --- | --- |
| Scheduling | Staff, working hours, services, free slots and bookings | A booking: start, end, staff member |
| Customers | Customer profile and booking history | A visit |
| Billing | Charges, payments and refunds through the payment provider | A charge: amount and payment status |
| Notifications | Confirmations and reminders | A reminder to send |

## Invariants

Rules the code must never break. At least three, each with one concrete way to break it.

| Invariant | One way to break it |
| --- | --- |
| No two bookings overlap for the same staff member | Two customers book the same barber for Friday 18:00 at the same moment |
| A tenant never sees another tenant's data | The barbershop reads a clinic booking by adding ?tenant=clinic to the URL |
| Each payment notice is processed once | The provider retries the same event_id and the booking is charged twice |
