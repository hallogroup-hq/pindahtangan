# PindahTangan — Product & UX Audit

Audit date: 9 September 2026
Scope: deployed public site, repository at `/Users/akmalirsyadpermana/Downloads/Pindah Tangan`, PRD v1.0, migrations, and test suite.

## Verdict

The deployed site is a polished interactive prototype, not a pilot-ready operational product. The core flows render and can be walked through, but booking, authentication, role control, inventory, order, payout, WhatsApp, and cloud persistence are either browser-local simulation or unsafe/unverified integration scaffolding.

No real customer booking, payment/payout, operational fulfilment, or personal data should be collected through the public deployment until the P0 controls below are complete. Public copy must be changed immediately so it does not present prototype records, testimonial outcomes, verified hygiene outcomes, operating address, or payout timing as established service facts.

## Evidence and method

| Surface | Result | Evidence |
|---|---|---|
| Live public site | Reachable over HTTPS; Vercel response 200. | `https://pindahtangan-zeta.vercel.app/` |
| Mobile booking | At 390px width, a completed booking displayed a batch receipt. It remained browser-local; no server booking was verified. | Screenshot: `/Users/akmalirsyadpermana/.config/browser-harness/tmp/shot.png`; live route: `https://pindahtangan-zeta.vercel.app/booking` |
| Privileged routes | `/admin`, `/host`, and `/studio` rendered full operational data without authentication. | `https://pindahtangan-zeta.vercel.app/admin`, `/host`, `/studio` |
| Unit test suite | 70/70 passed across 12 files. These test local store logic, not production auth, persistence, gateway, bank, or provider behaviour. | `npm test`, 9 Sep 2026 |
| Production build | Passed. | `npm run build`, 9 Sep 2026 |
| E2E suite | Not executed: Playwright browser binary is absent. Attempting the documented `npx playwright install chromium` route was blocked by the local package threat-intelligence gate. Existing E2E selectors are also stale against the rendered UI. | `npm run test:e2e`; `tests/e2e/*.spec.ts` |
| Supabase readiness | No `.env` or `.env.local` exists locally; repository only contains placeholder `.env.example`. The live admin UI reports “Local Cache Mode.” Deployment env could not be inspected without Vercel access. | `.env.example:1-10`, `src/lib/supabase.ts:3-25`, live `/admin` |

## Reality map: implemented vs. simulated vs. missing

| Capability | Classification | Evidence | Pilot implication |
|---|---|---|---|
| Landing page, estimator, booking UI, portal/studio/host/admin UI | Implemented as client UI | Routes render; build passes. | Can be used in a guided prototype demo only. |
| Mobile booking completion | Simulated/local-only | `src/app/booking/page.tsx:39-61` calls `store.bookIntakeBatch`; `src/lib/store.ts:576-640` persists to `localStorage`. | A user can see a receipt, but the operations team receives no durable booking. |
| Estimator | Implemented calculation, unsupported result claim | `ValueEstimator.tsx:10-15` uses fixed Rp32,500–52,500 per piece. | Not a validated forecast or a financial promise. |
| Login, registration and session | Simulated/local-only and unsafe | `store.ts:48-145`, `716-877`; `login/page.tsx:227-263`. | No Supabase Auth/OAuth/magic link; passwords are stored and compared in browser data. |
| Role access control | Missing/broken | Live privileged routes are reachable directly; public registration permits `admin` and `host` roles at `login/page.tsx:480-572`; store has no route guard. | Any visitor can view/alter prototype operations and create a privileged local persona. |
| Studio QC, host mark-sold, fulfilment and payout UI | Implemented as local simulation | Mutations occur in `PindahTanganStore`; host at `host/page.tsx:57-81`; payout at `FridayPayoutModule.tsx:69-90`. | Not an operations system; state can diverge per browser and disappear. |
| Payout and bank CSV | Local file simulation only | `store.ts:1392-1475`, `1711-1734`; payout is directly set `transferred` with an Unsplash receipt. | Must never represent a bank transfer or escrow settlement. |
| WhatsApp | Sandbox/default fallback, no delivery proof | `whatsapp.ts:181-232`, API route returns `simulated` by default at `route.ts:21,71-78`. | No confirmed customer notification; no delivery/webhook reconciliation. |
| Order webhook | Stub; unauthenticated and non-persistent | GET publicly advertises endpoint; `api/webhooks/orders/route.ts:16-58` creates response only. | Do not connect a marketplace; it has no signature validation or database mutation. |
| Supabase read sync | Conditional read/realtime adapter, not production-ready write-through | `supabaseSync.ts:50-178`; only `cloudCreate*` helpers exist at `184-215`, and UI/store mutations do not invoke them. | Cloud mode can show data but does not establish transactionally durable operation. |
| RLS | Conflicting migrations; latest migration is critically open | `01_initial_schema.sql:180-222` starts restrictive policy; `20260905_initial_schema.sql:241-278` creates public reads and anonymous inserts/updates. | Database must be assumed unsafe until the deployed migration state is verified and replaced. |

## UX journey audit

### 1. Mobile booking journey — P0

What works
- The booking page is responsive enough to complete at 390px and exposes the 10-piece minimum and 20-piece pickup threshold.
- The confirmation receipt clearly shows batch code, address, date and slot.

What breaks the real journey
- Submission only writes to browser-local storage (`booking/page.tsx:42-51`, `store.ts:1001-1036`). A refreshed/other-device studio cannot reliably receive the booking.
- No server validation, availability/capacity check, service-area verification, duplicate prevention, consent record, cancellation route, or staff dispatch queue exists.
- The time slot is concatenated into `pickup_address` rather than persisted as a separate operational field (`booking/page.tsx:45`).
- The confirmation and WhatsApp copy say a courier will contact the user, but the default delivery path is simulated.
- A hard-coded WhatsApp destination is used on the confirmation page (`booking/page.tsx:295-304`); ownership and availability of that number were not verified.

Acceptance for remediation
- A server-side booking creates a durable record with authenticated staff visibility, unique ID, explicit pickup-slot field, consent timestamp, and idempotency protection.
- The booking confirmation displays “request received / awaiting confirmation” until a real staff dispatch exists; no courier/WA promise is issued by default.
- Test: mobile browser submits a valid booking, staff session sees it after refresh, invalid/out-of-service requests are rejected, and an audit event is stored.

### 2. Estimator and landing claims — P0/P1

- Fixed per-piece “net” assumptions are presented as a cash estimate (`ValueEstimator.tsx:13-15, 71-78`) without listing sale-rate, category mix, platform fee, unsold rate, delivery cost, or evidence base.
- The hero promises pickup, steam `>100°C`, professional TikTok sale, and automatic Friday transfer (`HeroSection.tsx:28-33`). These are not supported by the current runtime.
- Testimonials are named, geographically specific, quantified, and labelled “Kisah Nyata”; the page also says hundreds of women have used the service (`TestimonialsSection.tsx:14-45, 53-61`). They are seed/demo content with no provenance.
- The site publishes a studio street address, working hours, operating coverage, and live schedule (`SukabumiCoverage.tsx:17-84`). None was independently verified in this audit.

Acceptance for remediation
- Remove named testimonials and “hundreds” claim unless retained with documented, consented evidence.
- Reframe the estimator as a non-guaranteed scenario, state inputs and exclusions, and remove “net transferred” wording until economics are validated.
- Replace unsupported operational/hygiene/payout claims with a clearly labelled pilot waitlist or verified operational facts only.

### 3. Login, portal and roles — P0

- Default local state has an active consignor. `useStore` falls back to the first seed profile (`useStore.ts:42-45`), so the portal opens seeded account data before real authentication.
- Demo credentials and the password are publicly exposed in the login UI (`login/page.tsx:843-904`) and all seed profiles have the same plaintext password in source (`store.ts:48-145`).
- Registration allows a public visitor to select `admin` plus `superadmin` (`login/page.tsx:480-572`).
- Directly loading `/admin`, `/host`, and `/studio` exposes the full corresponding UI/data. No route-level authorization check was found.
- “Data terisolasi aman di database lokal & cloud” is a misleading registration claim (`login/page.tsx:472-476`).

Acceptance for remediation
- Remove public demo credentials and all plaintext password fields from client/store source.
- Use Supabase Auth (or an equivalent server auth system), server-side session enforcement, and verified profile-role lookup.
- Restrict staff roles to invitation/admin provisioning; deny privileged routes and server endpoints by default.
- Test: anonymous, consignor, host, finance, studio, and superadmin sessions each receive only permitted route/data/action access.

### 4. Studio/admin/host operations — P0

- Direct routes render a fully populated seed operation. The nav also exposes all role destinations publicly.
- QC, sold, dispatch, and payout state changes are local object mutations; no durable workflow, user attribution, concurrency control, inventory lock, or operational handoff exists.
- `executeFridayPayout()` generates a “transferred” payout and fake receipt without bank execution (`store.ts:1421-1439`), while UI calls it as an official scheduled batch.
- CSV output can contain unmasked account numbers and is generated from browser-local data.
- Order creation supplies default buyer phone/address values if missing (`store.ts:1311-1321`); dispatch generates random tracking numbers (`store.ts:1647-1708`).

Acceptance for remediation
- Treat all studio/admin/host routes as prototype-only until identity, durable persistence, state-transition authorization, audit records, and operational SOP sign-off exist.
- Separate “prepare payout file” from “bank-confirmed transfer”; require maker/checker approval, bank receipt reference, immutable ledger, and failure/reversal handling.
- Require operator-entered, validated buyer fulfilment data; never synthesize production order data or AWBs.

## Security and data audit

### P0: access control and data exposure

1. Public operational pages and role escalation
- Severity: P0 / critical
- Evidence: live `/admin`, `/host`, `/studio`; `login/page.tsx:480-572`; `store.ts:899-906`.
- Owner route: Lyra — auth/RBAC and route middleware.
- Test: unauthenticated requests receive redirect/403; each role is tested with server-enforced permissions.

2. Browser-local plaintext credentials and PII
- Severity: P0 / critical
- Evidence: seed passwords and names/phone/address/bank data in `store.ts:48-145`, persisted through `localStorage` at `595-640`.
- Owner route: Lyra — data model/auth/security; Ren — remove public seed claims.
- Test: production bundle contains no demo password/real-looking PII; browser storage contains no password or payout data.

3. Open RLS migration
- Severity: P0 / critical
- Evidence: `supabase/migrations/20260905_initial_schema.sql:250-278` grants public read and anonymous insert/update for profiles, orders, payouts and more.
- Owner route: Lyra — migration reconciliation, RLS review, Supabase deployment evidence.
- Test: anon token cannot read another user’s PII, create staff records, alter orders/payouts, or bulk enumerate tables.

4. Unauthenticated webhook
- Severity: P0 / high
- Evidence: deployed GET endpoint; `api/webhooks/orders/route.ts:16-58` has no signature/timestamp/idempotency verification.
- Owner route: Lyra — provider integration.
- Test: unsigned/replayed webhook is rejected; a signed event creates exactly one durable order and audit event.

## P0/P1/P2 remediation backlog

| Priority | Remediation | Owner route | Acceptance criteria | Required test/evidence |
|---|---|---|---|---|
| P0 | Freeze public conversion and relabel deployment as prototype/waitlist; remove unsupported claims/testimonials/financial/hygiene certainty. | Ren + Kei | No live page implies booking, transfer, address, steam temperature, testimonial, or operating schedule is real without evidence. | Content review with live URLs and approval record. |
| P0 | Replace local auth/role model with server-enforced auth and RBAC; staff by invitation only. | Lyra | Anonymous access denied; no client seed passwords; role changes only by authorised server action. | Automated route/API matrix plus manual browser proof. |
| P0 | Remove client PII/seeds and reconcile Supabase migrations/RLS before connecting cloud. | Lyra | One canonical migration path; least-privilege RLS; no public reads/writes to PII/payout/order tables. | Migration run, SQL policy test using anon/user/staff sessions. |
| P0 | Implement durable booking intake or change CTA to a human-managed waitlist with explicit acknowledgement. | Lyra + Ren | Booking is durable, traceable, staff-visible and consented; or no false confirmation is issued. | Mobile end-to-end test with database/audit record. |
| P0 | Disable operational mutations, payout execution, live webhooks and WA “delivered” status until real integrations and approvals exist. | Lyra | Prototype controls are gated/removed; no simulated payout can be marked transferred. | API and UI negative tests. |
| P1 | Build a real operational workflow: intake capacity, QC evidence, item state machine, fulfilment, staff audit log, exception handling. | Lyra + Ren | Each state transition has actor, timestamp, authorization, durable record and operational SOP. | Controlled test run with audit export. |
| P1 | Implement provider adapters: signed marketplace webhook, WhatsApp template/delivery callbacks, approved bank/manual payout reconciliation. | Lyra + Ren | Each integration has sandbox evidence, idempotency, error handling, and no invented statuses. | Sandbox logs and failure-path tests. |
| P1 | Replace estimator with transparent scenario economics and pilot instrumentation. | Ren + finance/economics owner | Inputs, assumptions, downside case, and “not guaranteed” label are visible; actual pilot outcomes can update model. | Unit tests and reviewed calculation sheet. |
| P1 | Repair E2E suite and provision pinned browser in CI. | Lyra | Four journeys execute against current UI; selectors assert actual copy and meaningful mutations. | CI artifact showing e2e pass. |
| P2 | Improve route UX: hide role simulator/nav from public surface, add pending/confirmed/cancelled pickup states, error and empty states. | Lyra + Kei | Public visitor sees only applicable options and honest progress. | Mobile/desktop exploratory QA. |
| P2 | Add legal/privacy/consignment terms, consent and retention policy once operations are real. | Ren + legal owner | Customer-facing terms match verified business process and data handling. | Approved legal copy and acceptance checklist. |

## Test assessment

`npm test` passing is useful for deterministic store calculations, including payout, fulfilment, QC, and unit economics. It is not readiness evidence because those tests instantiate a local `PindahTanganStore` and do not exercise a deployed session, Supabase policy, bank transfer, WhatsApp provider, TikTok/marketplace webhook, or real delivery.

The current E2E files have stale expectations (for example, the consignor test expects “Estimator Nilai Bersih Lemari”, while the deployed UI heading is “Kalkulasi Nilai Lemari”; host and studio specs also expect labels no longer rendered). Once the browser runtime is provisioned, these tests should be corrected before being used as release evidence.

## Go/no-go

Recommendation: NO-GO for public customer pilot and any real-money/live operational launch.

Allowed now: guided internal demo, UX research, a clearly labelled interest/waitlist page that does not create operational commitments, and remediation work. A new readiness review should be run after all P0 items have evidence, before public reactivation.
