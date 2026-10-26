# Prioritized Engineering Backlog

These candidates are intended for Zero Trap's community-powered emergency assistance workflow. Keep privacy, consent, and reliability requirements explicit; verify existing implementations before treating an item as a confirmed bug.

## Candidate issues

1. **Make emergency request submission retry-safe** — Prevent repeated taps or flaky connectivity from creating duplicate emergencies, using a stable client-generated request identifier.
2. **Define explicit location-sharing consent and lifetime** — Explain when location is shared, with whom, and for how long; allow the requester to stop sharing where operationally appropriate.
3. **Minimize and protect location data** — Restrict access to active emergency participants, avoid leaking coordinates in public logs/analytics, and define retention/deletion behavior.
4. **Represent emergency request lifecycle clearly** — Define valid states (created, acknowledged, en route, resolved, cancelled) and prevent stale or contradictory transitions.
5. **Handle offline submission and delivery status honestly** — Queue requests safely when offline and distinguish locally queued, sent, acknowledged, failed, and expired states.
6. **Validate Firebase security rules** — Add emulator-backed tests for ownership, helper access, unauthorized reads/writes, and privilege escalation across emergency records.
7. **Add helper verification and abuse reporting safeguards** — Define trust signals and a reporting flow without implying unverified users are vetted or guaranteed safe.
8. **Add robust notification delivery and fallback behavior** — Retry transient notification failures, avoid duplicate notifications, and surface delivery uncertainty without presenting it as confirmed rescue.
9. **Add automated tests for critical emergency flows** — Cover request creation, authorization, location-sharing consent, duplicate submission, cancellations, and failure recovery.
10. **Document emergency-service limitations and accessibility** — State that the app does not replace local emergency services; ensure key flows support assistive technology and low-connectivity use.

## Suggested order

Protect authorization and location privacy (2, 3, 6) while guaranteeing request integrity under retries and offline conditions (1, 4, 5). A user interface must never imply that help has been dispatched or accepted until the system has evidence of that state.
