# PindahTangan — Pilot Readiness Risk Register

Audit date: 9 September 2026
Decision status: NO-GO for a public customer or real-money pilot.

## Rating key

- P0 / Critical: can expose personal data, misrepresent a transaction/operation, enable unauthorised access, or make a public pilot unsafe. Must close before any public launch.
- P1 / High: materially undermines operational reliability, customer trust, or economics. Close before controlled operational pilot.
- P2 / Medium: important usability, quality, documentation, or measurement gap; schedule after critical pilot controls.

## Risk register

| ID | Priority | Risk / reality gap | Evidence | Impact | Owner route | Required mitigation and acceptance test |
|---|---|---|---|---|---|---|
| R-01 | P0 | Public visitors can open admin, host and studio operations without authentication. | Live `https://pindahtangan-zeta.vercel.app/admin`, `/host`, `/studio` all rendered seeded operational data during audit. | Unauthorised viewing/manipulation of operations; no trustworthy role boundary. | Lyra | Server-side auth middleware and API enforcement. Test anonymous → redirect/403 and role-by-role access matrix. |
| R-02 | P0 | Visitors can self-register as admin/superadmin or host in the client UI. | `src/app/login/page.tsx:480-572`; registration is handled by local store at `227-263`. | Privilege escalation in current model; unacceptable staff provisioning. | Lyra | Remove public staff role selection; staff via invite/admin action only. Test browser and direct request attempts cannot obtain staff role. |
| R-03 | P0 | Passwords, seed PII and financial data are held in client code/localStorage. | `src/lib/store.ts:48-145, 595-640`; demo password exposed at `login/page.tsx:843-904`. | Credential/PII exposure, browser data leakage, false customer records. | Lyra | Remove seeds/credentials from production bundle; use secure auth and protected database. Test bundle and storage scans for passwords/PII. |
| R-04 | P0 | Supabase migration contains open public read and anonymous write policies. | `supabase/migrations/20260905_initial_schema.sql:250-278`. | Enumeration/alteration of profiles, orders, payouts and inventories if deployed. | Lyra | Reconcile to one canonical migration and least-privilege RLS. Test anon/consignor/host/admin policy matrix against a clean staging project. |
| R-05 | P0 | Booking confirmation is not durable but tells customers their pickup is scheduled. | `booking/page.tsx:39-61`; local store booking at `store.ts:958-1036`; mobile screenshot path in product audit. | Lost pickups, customer disappointment, operational chaos. | Lyra + Ren | Durable booking queue with idempotency, consent and staff confirmation—or relabel CTA as waitlist. Test cross-device staff visibility after refresh. |
| R-06 | P0 | Payout UI creates `transferred` state and receipt without a bank transaction. | `store.ts:1392-1475`; `FridayPayoutModule.tsx:69-90`. | False settlement claim; real financial and trust risk. | Lyra + Ren | Disable/gate execution; implement prepare/approve/transfer/reconcile states with bank reference. Test no item becomes paid_out without verified transfer evidence. |
| R-07 | P0 | Order webhook accepts any POST-style payload without signature or persistence. | Public GET: `https://pindahtangan-zeta.vercel.app/api/webhooks/orders`; `route.ts:16-58`. | Spoofed order data if later connected; currently creates misleading integration impression. | Lyra | Verify provider signature/timestamp, store idempotency key and immutable event record. Test invalid/replayed valid events. |
| R-08 | P0 | WhatsApp delivery is simulated/default sandbox, while product copy implies real customer contact. | `src/lib/whatsapp.ts:181-232`; `api/whatsapp/send/route.ts:21-78`; booking/portal copy. | Missed pickup, payout and order notices; misleading delivery status. | Lyra + Ren | Gate delivery language; integrate approved provider with template approval, callback status and retry log. Test sandbox/provider failure path. |
| R-09 | P0 | Named testimonials, earnings, “hundreds” adoption and pilot histories are unproven. | `TestimonialsSection.tsx:14-61`. | Consumer-trust and advertising risk. | Ren + Kei | Remove or replace with consented, traceable evidence; mark prototype examples as examples. Test live copy review. |
| R-10 | P0 | Steam temperature, hygiene result, automatic weekly payout, address/hours/coverage and courier commitment are treated as established facts. | `HeroSection.tsx:28-33`; `ValueEstimator.tsx:111-120`; `FaqSection.tsx:16-35`; `SukabumiCoverage.tsx:17-84`. | Consumer/health/operational claim risk. | Ren + ops owner | Verify each claim with SOP, equipment record, provider/bank process and location permission; otherwise remove/reframe. Evidence checklist must be signed before copy returns. |
| R-11 | P1 | Supabase adapter only conditionally reads/realtime-subscribes; store mutations do not form a durable write-through workflow. | `supabaseSync.ts:50-215`; UI/store action paths. | Cross-device divergence and lost operational data. | Lyra | Server APIs/transactions own all mutations; browser becomes a client only. Test concurrent actions and refresh/relogin durability. |
| R-12 | P1 | “Escrow” is presented but no safeguarded funds model or payment reconciliation exists. | `FridayPayoutModule.tsx:155-163`; PRD claims; local-only model. | Financial/legal ambiguity and customer misunderstanding. | Ren + finance/legal owner | Define actual payment flow, custody, reconciliation and disclosure; do not use escrow wording until valid. Test pilot SOP reconciliation. |
| R-13 | P1 | Fulfilment defaults buyer addresses/phones and generates random tracking numbers. | `store.ts:1303-1321, 1647-1708`. | Wrong shipment/customer data and fake delivery proof. | Lyra | Require validated order input/provider import; issue tracking only from courier integration/manual verified entry. Test missing-data rejection. |
| R-14 | P1 | Estimator labels a fixed speculative range as net cash to bank. | `ValueEstimator.tsx:10-15, 71-78`. | Financial expectation mismatch and weak economics validation. | Ren + finance owner | Model scenario inputs/assumptions, add uncertainty/disclaimer, instrument actual results. Test formula and copy review. |
| R-15 | P1 | Tests prove local calculations only; E2E cannot run and contains stale expectations. | 70 unit tests passed; `npm run test:e2e` blocked by missing browser; `tests/e2e/*.spec.ts`. | No release-grade proof of critical browser and integration flows. | Lyra | Pin/install browser in CI, update semantic selectors and create staging integration tests. Test CI artifacts for current flows. |
| R-16 | P2 | Public nav and persona simulator expose internal routes and seeded operational framing. | Live global nav and `src/components/layout/RoleSwitcher.tsx`. | Confusing public experience and expands accidental exposure. | Lyra + Kei | Hide staff/prototype controls from public build; public nav contains only verified customer routes. Test anonymous navigation audit. |
| R-17 | P2 | Pickup workflow has no capacity, cancellation, consent, availability, or separate slot data. | `booking/page.tsx:18-61`; slot embedded in address at line 45. | Manual operations burden, avoidable booking errors. | Ren + Lyra | Add explicit schema and lifecycle: requested, accepted, dispatched, collected, cancelled. Test edge cases/mobile cancellation. |
| R-18 | P2 | Legal/privacy/consignment terms are not implemented as durable records. | Login has a pre-checked agreement (`login/page.tsx:145, 791-805`); no audited terms/version/consent store found. | Weak customer consent and policy clarity. | Ren + legal owner | Publish verified terms, privacy/retention policy, consignment/return policy and versioned consent capture. Test consent is required and retrievable. |

## Operating gates

### Gate A — immediately: stop misleading public conversion

Owner: Ren + Kei

1. Change public CTA to internal demo or clearly labelled waitlist only.
2. Remove names, earnings, transfer receipts, “hundreds” adoption, automatic payout, guaranteed pickup, unverified hygiene, and unverified address/hours/coverage claims.
3. Remove direct staff-route links and the persona switcher from the public experience.
4. Do not collect new customer addresses, bank details, passwords, or real orders while the system remains browser-local.

Exit evidence
- Live URL review captures new copy and absence of high-risk claims.
- Product owner signs a claim inventory: each retained claim has a source, owner, and date verified.

### Gate B — before any controlled operational pilot

Owner: Lyra with Ren as acceptance owner

1. Secure auth/RBAC and server-side route/API checks are deployed.
2. Production client bundle has no demo credentials or customer-like PII.
3. One clean Supabase migration history and verified RLS policy matrix exist.
4. Booking, item, order and payout state changes are durable, attributed and auditable.
5. Marketplace/WhatsApp/bank integrations are either actually sandbox-tested or visibly disabled; no simulated result can be labelled delivered/transferred.
6. Current E2E and staging integration tests pass in CI.

Exit evidence
- Staging test report, RLS test transcript, release candidate link, and an operations walk-through with a recorded audit trail.

### Gate C — before public launch or real money

Owner: Ren, finance/legal/ops owner, founder approval required

1. Validate business identity, operating address, service area, courier arrangement, equipment/SOP, merchant/payment flow and payout controls.
2. Approve consumer terms, privacy/retention, consignment/reject/return policy, fee and earnings disclosure.
3. Verify real WhatsApp template/provider and marketplace/courier integrations with failure paths.
4. Run controlled pilot transactions with reconciliation and no unresolved P0/P1 items.

Exit evidence
- Founder go/no-go decision; operations readiness checklist; reconciliation evidence; legal/consumer copy approval.

## Immediate owner routing

- Lyra: R-01 through R-08, R-11, R-13, R-15, R-16 technical controls.
- Ren: R-05 process design, R-06 payout/ops governance, R-09/R-10 claims, R-12 finance/legal routing, R-14 economics, R-17/R-18 operating policy.
- Kei: content/brand cleanup after Ren verifies each claim.
- Founder: Gate C approval only, after evidence is complete. No approval is requested now because the current state is clearly below Gate B.

## Verified audit test record

- `npm test`: PASS — 12 files, 70 tests, 9 Sep 2026.
- `npm run build`: PASS — Next.js production build, 19 routes, 9 Sep 2026.
- `npm run test:e2e`: NOT EXECUTED — Playwright Chromium executable is missing. The attempted browser-install command was blocked by the local package threat-intelligence approval gate, so no false pass/fail is recorded.
- Manual live route checks: public landing, booking, admin, host and studio all rendered on `pindahtangan-zeta.vercel.app`; admin showed `Local Cache Mode`.
