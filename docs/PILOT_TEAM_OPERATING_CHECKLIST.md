# PindahTangan — Team Operating Checklist for a Controlled Dry-Run

**Audience:** named pilot operator, intake/QC lead, host, fulfillment lead, and payout checker.

**Single-minded message:** no item, order, or payout moves forward without a named person, a record, and an exception path.

**Scope:** internal dry-run and controlled operational rehearsal only. This checklist does not authorize public conversion, real customer data collection through the prototype, a real payout, or a public launch.

**Source basis:** `PindahTangan — Pilot Readiness Risk Register.md` Gates A–C and R-05–R-18; `docs/PILOT_BUSINESS_MODEL_AND_ECONOMICS.md` §§3–7; PRD v1.0 §§5–6 for intended flow only. Audit reality overrides PRD claims where they conflict.

---

## Before the dry-run

- [ ] A pilot owner, intake/QC lead, host, fulfillment lead, and payout maker/checker are named. One person may hold multiple roles only if payout maker/checker separation is preserved.
- [ ] This dry-run uses fictional/non-sensitive test records or consented internal participants. No real customer address, bank detail, password, or payment is entered into the current prototype.
- [ ] The team has a shared controlled ledger outside the prototype with columns for item custody, QC, agreed net payout, sales/payment state, fulfillment, exception, and payout reconciliation.
- [ ] The operating site, handling permissions, storage, and handover contacts are verified for the rehearsal.
- [ ] A contact/incident path is written down: lost item, count mismatch, QC dispute, buyer-payment issue, delivery issue, payout mismatch, data/privacy concern.
- [ ] The team agrees the stop condition: pause the flow when any custody, payment, shipping, payout, or privacy record is missing or contradictory.

## 1. Intake / handover

- [ ] Confirm the participant identity through the approved pilot method; do not use the prototype’s client-side login.
- [ ] Record handover date/time, handler, participant reference, temporary batch ID, stated item count, and handover location.
- [ ] Count items with the participant/handler where possible; record mismatch immediately.
- [ ] Record visible condition caveats at receipt; do not claim cleaning, treatment, or acceptance.
- [ ] Issue a factual receipt: “items received for assessment,” not “pickup confirmed,” “accepted,” or “guaranteed for sale.”
- [ ] Store items in the documented location; record custody transfer when the handler changes.

**Exit gate:** every physical item can be tied to a batch/custody record. Otherwise pause and resolve.

## 2. QC / acceptance

- [ ] Assign a unique internal SKU/hangtag only after the item is physically present and recorded.
- [ ] Record garment description, brand if visible, size/measurements, condition notes, and photos according to the participant’s consent.
- [ ] Decide accepted / not accepted / needs clarification, with reason and operator name.
- [ ] For a non-accepted item, record the agreed next step (return, hold, or another explicitly agreed disposition). Do not invent donation authority.
- [ ] For an accepted item, document the proposed **agreed net payout** before listing/live preparation.
- [ ] Obtain participant acknowledgement of accepted items, payout amount, known condition, and applicable return/refund/unsold terms before proceeding.

**Exit gate:** no item enters live preparation without custody, QC decision, and acknowledged agreed net payout.

## 3. Prepare / go live

- [ ] Verify every item presented has a SKU, actual condition description, price/opening guidance, agreed net payout, and owner reference.
- [ ] Confirm host, platform, session scope, content rights, and compensation/cancellation terms in writing.
- [ ] Test the manual order ledger and communication channel before the session.
- [ ] Use neutral language: a claimed item is not sold until buyer payment is verified.
- [ ] Record item claim, buyer reference, agreed item price, timestamp, operator/host, and payment-status evidence.
- [ ] Do not rely on the prototype’s “mark sold” state as a sales record.

**Exit gate:** items remain available unless a buyer-paid state is evidenced in the controlled ledger.

## 4. Payment / fulfillment

- [ ] Verify buyer payment using the approved collection method and preserve the transaction reference.
- [ ] Record the item subtotal and shipping separately; shipping is not platform item-sale margin.
- [ ] Collect complete, verified delivery details via the approved secure process—not via seed/prototype fields.
- [ ] Pack against a pick list; perform a second-person item/SKU check before dispatch.
- [ ] Record courier/provider, actual tracking reference, dispatch timestamp, and proof of handover.
- [ ] Record delivery, failed delivery, cancellation, refund, or return status and the responsible next action.
- [ ] Never create a tracking number, customer address, or delivery completion state from placeholder data.

**Exit gate:** every buyer-paid order has payment evidence and a fulfillment state; unresolved exceptions block payout eligibility.

## 5. Payout dry-run

- [ ] List only items with buyer-payment evidence, completed applicable hold, and no unresolved fulfillment/refund exception.
- [ ] Recalculate each seller liability from the agreed net payout record; do not deduct an unagreed prep/steam fee after the fact.
- [ ] Prepare a payout draft showing participant reference, item/SKU, gross item sale, agreed net payout, eligibility rationale, and total liability.
- [ ] A second person checks the payout draft against payment, fulfillment, and item records.
- [ ] For the dry-run, label all documents **SIMULATION — NO BANK TRANSFER EXECUTED**.
- [ ] Do not mark a payout transferred, issue a transfer receipt, or export/use a bank file in the prototype.
- [ ] For a future real payout, require bank reference/proof and reconciliation before the status may be called complete.

**Exit gate:** maker/checker reconciliation either balances or an exception is logged and expansion pauses.

## Close-out / learning review

- [ ] Count physical items vs custody ledger; reconcile every discrepancy.
- [ ] Review elapsed time/cost per item, QC acceptance reasons, host/ops friction, paid-order path, fulfillment exception, and payout reconciliation result.
- [ ] Ask participant(s) what was clear, unclear, or uncomfortable. Record as unattributed internal feedback unless consent for use is obtained.
- [ ] Update the claim register before any new external copy.
- [ ] Record a go / revise / stop decision. A dry-run pass does not override Gate B/C security, legal, payment, or founder-approval requirements.
