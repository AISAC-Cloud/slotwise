# slotwise

The capstone project of **Claude Code Architect 2.0**, an AISAC Academy course. You build it module by module,
from this nearly empty repository (Module 1) to the whole system (Module 13).

> An AISAC Academy course. Not affiliated with or endorsed by Anthropic.

## The product

slotwise is a subscription scheduling platform for service businesses: a barbershop, a clinic, a pilates
studio. Each business that subscribes is a **tenant**, with its own data, kept apart from every other tenant.

Inside each tenant:

- **Staff**: the professionals and their working hours.
- **Services**: a 40-minute haircut, a one-hour pilates session.
- **Customers**: they pick a free slot and book it.
- **Payment**: paid in advance through an external provider, which notifies slotwise when the money arrives.
- **Reminders**: sent before the appointment.

Simple on purpose. It hides exactly the problems an architect cares about.

## How the course uses this repository

1. Create your own copy: **Use this template → Create a new repository**. Private is fine. Work in your copy,
   never in this one.
2. Each module that changes the code gets a starting point tagged `mNN-start`. This first commit is
   `m01-start`; the next tags arrive as the modules are released.
3. Fell behind or got lost? Restart from the module's tag:

   ```bash
   git remote add course https://github.com/AISAC-Cloud/slotwise.git
   git fetch course --tags
   git switch -c module-08 m08-start
   ```

## Check your environment

Lesson 0.3 installs the tools. Then, from the folder where your projects live:

```bash
curl -fsSLO https://raw.githubusercontent.com/AISAC-Cloud/slotwise/main/check-env.sh
chmod +x check-env.sh
./check-env.sh
```

[`check-env.sh`](check-env.sh) only reads; it changes nothing, and it is short enough to read before you run
it. Every line should say `OK`. It does not check logins: GitHub and Claude Code logins are yours to do.

## Module 0 deliverable

Fill in [`docs/domain.md`](docs/domain.md) in your own words: the four bounded contexts and at least three
invariants, each with one way to break it. In Module 1 you open Claude Code for the first time inside this
repository.

## License

[MIT](LICENSE)
