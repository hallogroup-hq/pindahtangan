# PindahTangan — Pilot Test Protocol
## Controlled 5-Consignor/100-Item Market-Test Cohort

**Purpose:** This protocol turns the PindahTangan economics memo into a concrete, bounded test protocol. All numbers, thresholds, and conditions are explicitly derived from the pilot business model and economics decision memo. No fictional traction, fabricated results, or estimated outcomes are presented as achieved facts.

---

## 1. Supply Gate — Recruitment & Cohort Composition

| Metric | Target | Measurement Method | Stop Condition |
|--------|--------|-------------------|----------------|
| Consignor cohort size | **5 consented consignors** | Signed pilot participation agreement + named operator verification | Cohort fewer than 5 after 2 recruitment rounds; pause and re-evaluate outreach |
| Submitted items | **100 items total** | Item count per consignor record; each item logged with temporary batch ID | Fewer than 80 submitted items after 3-week intake window; pause intake and assess supply |
| Submitted items per consignor | 20 items (target) | Per-consignor item log | Any single consignor submits fewer than 5 items; note in review but do not exclude |

**Recruitment protocol:**
1. Named owner (pilot operator) contacts each consignor individually via approved pilot method (WhatsApp/referral)
2. Consignor receives full pilot copy (one-pager + FAQ) before agreement
3. Signed participation agreement records: name, contact, submitted item count, consent for QC/measurement
4. Consignor receives factual receipt: "items received for assessment," not "accepted for sale"

**Capacity guardrail:** If any consignor submits 0 items after agreed intake, they are replaced through additional outreach — but the 5-consignor cohort minimum must be met before proceeding.

---

## 2. Intake & Custody

| Metric | Target | Measurement Method | Stop Condition |
|--------|--------|-------------------|----------------|
| Item receipt & custody record | 100% of submitted items | Custody ledger entry per item at receipt; includes: handler, date/time, batch ID, location | Any item without custody record after 48h; pause intake, resolve, or remove from cohort |
| Visible condition caveats recorded | 100% of items | Photo + condition notes at receipt; no claims of cleaning/treatment/acceptance | Condition caveats missing for >10% of items; pause and document reason |
| Factual receipt issued | 5 consignors | Receipt states: "items received for assessment"; NOT "accepted," "guaranteed for sale," or "pickup confirmed" | Receipt uses language implying acceptance; pause, correct, and re-issue |

**Exit gate:** Every physical item can be tied to a batch/custody record. Otherwise pause and resolve before QC step.

---

## 3. QC / Acceptance

| Metric | Target | Measurement Method | Stop Condition |
|--------|--------|-------------------|----------------|
| QC acceptance/rejection decision | Per item; recorded with reason code + operator name | Accepted / Not accepted / Needs clarification; reason code from approved list | QC decision missing for >30% of items after 1-week window; pause cohort, audit QC process |
| Agreed net payout documented per accepted item | Per accepted item | Proposed net payout discussed and recorded **before** item is offered for sale; written acknowledgement from consignor | Any accepted item without documented agreed net payout; item excluded from live preparation |
| Participant acknowledgement obtained | Per accepted item | Consignor acknowledges: (a) item accepted, (b) proposed net payout amount, (c) known condition, (d) applicable return/refund/unsold terms | Missing acknowledgement; item excluded from live preparation, note for review |

**QC reason codes (approved list):**
- Accepted: garment in saleable condition, all components present, no damage
- Stain: detected residue, odor, or mark not removable by standard process
- Damage: tear, hole, broken fastener, significant wear
- Missing component: hangtag, button, belt loop, etc. absent
- Sizing: cannot verify size/measurements against brand guide
- Other: documented free-text reason

**Acceptance hypothesis:** 70% of submitted items accepted → 70 saleable items. This is a hypothesis to measure, not a target to hit. Actual acceptance rate is a measured outcome.

**Exit gate:** No item enters live preparation without custody, QC decision, and acknowledged agreed net payout.

---

## 4. Measurement Framework

### Pre-session inventory check (before first live session)
| Metric | Target | Evidence |
|--------|--------|----------|
| Saleable, priced, traceable items available | **≥50 items** | Each item has: SKU/hangtag, actual condition description, price/opening guidance, agreed net payout, owner reference |
| Items presented live | ≤50 items | Items actually presented in the live session, not just available |

### Live session metrics (per two-hour session)
| Metric | Definition | Measurement |
|--------|-----------|------------|
| Items presented live | Physical items on stage during session | Count from on-stage item list |
| Buyer-paid items | Items where buyer payment confirmed | Order ledger with payment evidence + transaction reference |
| Paid sell-through | Buyer-paid items ÷ items presented live | Calculated per session |
| Average paid price | Mean of buyer-paid item prices | Order ledger |
| Average seller net payout | Mean of agreed net payouts for paid items | Payout ledger |
| Contribution per paid item | Paid price − seller net payout − measured item-variable costs | Rec per order |
| Session result | (Paid items × contribution/item) − session fixed costs | Calculated from above |
| Payment-to-dispatch rate | Buyer-paid orders dispatched ÷ buyer-paid orders | Order ledger reconciliation |
| Refund/return/cancellation exposure | Count and Rp; reason and resolution time | Exception ledger |
| Seller payout accuracy/on-time rate | Eligible liabilities paid correctly/on stated cadence | Payout ledger vs. bank reconciliation |
| Buyer/consignor satisfaction | Short qualitative feedback; unattributed | Post-session feedback form |
| Repeat intent | Consignor willing to submit again; buyer willing to attend/buy again | Feedback form |

### Post-session metrics (between sessions)
| Metric | Definition | Target/Threshold |
|--------|-----------|-----------------|
| Payout reconciliation | 100% of eligible seller liabilities reconcile to bank proof | Before any payout status called complete |
| Inventory custody reconciliation | Physical items vs. custody ledger; every discrepancy counted and resolved | Close-out review |
| QC acceptance rate | Accepted items ÷ submitted items | Measured; reported in scorecard |
| Cost/time per item | Intake, QC, prep, photo/tag, and pickup time/cost | Timesheets + invoices + provider statements |
| Participant feedback | What was clear, unclear, or uncomfortable | Unattributed internal feedback |

---

## 5. Stop Conditions

The pilot stops immediately (expansion paused) if **any** of the following occurs:

1. **Unresolved custody exception:** Any submitted item cannot be tied to a batch/custody record. Expansion pauses until resolved or item removed from cohort.

2. **Buyer-payment exception:** Any buyer-paid order lacks payment evidence or fulfillment state in the controlled ledger. Expansion pauses; order does not contribute to sell-through or contribution metrics.

3. **Payout-reconciliation exception:** Eligible seller liabilities cannot reconcile to bank proof. No payout status called complete until reconciliation complete.

4. **Material safety/privacy issue:** Any incident involving lost/damaged items, unauthorized data sharing, or privacy breach that cannot be contained and documented.

5. **QC process failure:** QC decision or reason code not recorded within 1 week of item receipt for >30% of items. Pilot pauses for QC process audit.

6. **Cohort integrity failure:** Fewer than 5 consignors with submitted items after 3-week intake window. Pilot pauses; reassess recruitment strategy before continuing.

7. **Founder-approval gate not met:** Any of the three Day-30 decision rule conditions unmet (see Section 6).

**Stop-condition protocol:**
- Named owner documents the exact stop condition, responsible party, and resolution path
- Pilot operator communicates stop condition to affected consignors using approved FAQ wording
- All records (ledger entries, decisions, communications) preserved for post-pilot review
- Expansion resumes only after condition resolved AND founder approval obtained

---

## 6. Day-30 Decision Rule

Proceed to a second, slightly larger cohort only if **all three** conditions are met:

1. **No unresolved custody, payout, or payment-reconciliation exception** from Weeks 1–4 operations.

2. **At least one controlled session reaches 12 buyer-paid items** using measured costs, not UI simulation data. (This is the viability threshold from the business model memo: 7 items break even; 12 items leave Rp117.400 contribution after assumed fixed costs.)

3. **Pilot participants understand and accept** the net-payout, QC, refund/return, and payout terms. Evidence: signed acknowledgement records + qualitative feedback.

If **any** condition is not met, pause expansion and change the failing part: pricing/assortment, supply quality, live conversion, fulfillment, or settlement controls.

---

## 7. No Fictional Traction Statement

This protocol explicitly does **not** present any of the following as achieved facts or market traction:

- Estimated or projected earnings, income ranges, or "expected payout" amounts presented as actual outcomes
- Item counts, sell-through rates, or conversion percentages presented as achieved rather than measured
- GMV (Gross Merchandise Value) presented as revenue or business validation
- Testimonials, participant satisfaction claims, or "success stories" without consent and attribution
- Prototype UI states, seed records, generated receipts, or simulated data presented as evidence of real operation
- Fixed pricing ranges (e.g., "Rp32.500–Rp52.500 per piece") presented as observed market data
- Automation, integration, or platform claims that the current prototype does not actually support

All numbers in this protocol are either:
- **Assumptions** to be measured (marked with `*` in the source economics memo)
- **Hypotheses** to be tested (70% acceptance rate, 12-item viability threshold)
- **Measured outcomes** from actual pilot execution (to be filled in post-pilot)
- **Decision thresholds** for founder approval (not achieved results)

The protocol's purpose is to enable controlled measurement and decision-making, not to demonstrate or claim market traction.

---

## 8. Protocol Governance

| Role | Responsibility |
|------|---------------|
| Pilot owner / named operator | Execute intake, QC, session operations; document all measurements; escalate stop conditions |
| Founder (Akmal) | Review Day-30 decision rule; approve or pause expansion; resolve founder-gate decisions |
| QC lead | Apply reason codes consistently; maintain QC decision quality; audit if stop condition triggered |
| Payout checker | Reconcile payout ledger; verify bank proof; second-check payout drafts |
| Consignors | Submit items per agreed count; acknowledge accepted items + net payout; provide qualitative feedback |

**Protocol review schedule:**
- Week 1: Intake & custody review; verify 100-item target on track
- Week 2: QC acceptance rate check; verify acceptance hypothesis being tested
- Week 3: First session metrics; verify sell-through and payment collection
- Week 4: Second session metrics; prepare Day-30 decision data
- Day 30: Founder decision rule evaluation; proceed, pause, or rework

**Protocol revision:** May be revised only by founder decision, documented change log, and all downstream task cards updated accordingly. No mid-pilot assumption changes without founder approval.

---
*Protocol derived from: PindahTangan — Pilot Business Model & Economics Decision Memo (docs/PILOT_BUSINESS_MODEL_AND_ECONOMICS.md), PindahTangan — Pilot Readiness Risk Register, and PindahTangan — Product & UX Audit. All thresholds and conditions explicitly grounded in source documents.*