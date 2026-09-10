# PindahTangan — Pilot Operations SOP (Standard Operating Procedures)

**Status:** Proposed for controlled Sukabumi pilot only.  
**Gate dependency:** Must pass Gate B (security, auth, durability, integration) before any real-item intake.  
**Owner route:** Ren (ops/policy), Lyra (tech delivery), Kei (content), Founder (Gate C approval).

---

## 0. Operating Principles

1. **No untraceable item.** Every physical garment has a custody record before it moves to the next step.
2. **Agreed net payout is recorded before sale.** No hidden post-sale deduction; the seller knows their exact cash amount at acceptance.
3. **Buyer payment, seller liability, shipping, refund/return, and payout are separate ledger states.** They do not collapse into one status.
4. **Payout is complete only after bank reference + reconciliation.** A CSV export is not a transfer; a simulated receipt is not evidence.
5. **Stop on exception.** Any custody mismatch, payment issue, shipping failure, payout mismatch, or privacy concern pauses expansion until resolved.

---

## 1. Intake & Handover SOP

### 1.1 Scope
- Applies to every consignor batch entering the pilot (target: up to 5 consignors, ~100 submitted items).
- Does not authorize public booking, automated pickup promises, or collection of real addresses/bank details through the prototype.

### 1.2 Roles
| Role | Responsibility |
|------|----------------|
| Pilot Owner (Ren) | Approves cohort, capacity, and exceptions |
| Intake/QC Lead | Receives, counts, records, and stores items |
| Fulfillment Lead | Handles dispatch, courier coordination |

### 1.3 Process

| Step | Action | Record Created | Evidence Required |
|------|--------|----------------|-------------------|
| 1 | Confirm participant identity via approved pilot method (not prototype login) | Consignor record in controlled ledger | Manual verification (WhatsApp/call) |
| 2 | Agree handover window, location, handler | Handover log: date/time, handler, participant ref, temp batch ID, stated count, location | Signed/acknowledged by both parties |
| 3 | Count items with participant/handler present | Physical count vs stated count; mismatch logged immediately | Photo of items + count sheet |
| 4 | Record visible condition caveats at receipt | Condition notes per item (stains, tears, missing buttons, odor) | Photos of defects if any |
| 5 | Issue factual receipt: "Items received for assessment" | Receipt document (not "pickup confirmed," not "accepted") | Digital + physical copy to consignor |
| 6 | Store items in documented location | Custody location record; transfer logged when handler changes | Location log with timestamps |

### 1.4 Exit Gate (Intake)
**Every physical item can be tied to a batch/custody record.** If any item cannot be traced → pause and resolve before QC.

---

## 2. QC / Acceptance SOP

### 2.1 Scope
- Runs within 1×24 hours of intake completion.
- Three stations: Screening → Steam/Prep → Hangtag.

### 2.2 Roles
| Role | Responsibility |
|------|----------------|
| QC Operator | Inspects, photographs, decides accept/reject |
| Intake/QC Lead | Reviews decisions, records agreed net payout |

### 2.3 Process

| Step | Action | Record Created | Evidence Required |
|------|--------|----------------|-------------------|
| 1 | Assign unique internal SKU/hangtag only after item is physically present | SKU `PT-SM-{batch}-{seq}`, hangtag number | Tag photographed on garment |
| 2 | Record: title, brand (if visible), size, measurements (LD cm), condition notes, photos | Item record in controlled ledger | Minimum 3 photos: front, back, label/defect |
| 3 | QC Decision: **Accepted** / **Not Accepted** / **Needs Clarification** | QC decision log with reason code + operator name | Defect photo + reason code for rejects |
| 4 | **For Not Accepted:** Agree next step (return / hold / other explicitly agreed disposition). Do not invent donation authority. | Reject resolution record | Consignor acknowledgment of chosen path |
| 5 | **For Accepted:** Document proposed **agreed net payout** before any live preparation | Net payout agreement per item | Amount stated in IDR, acknowledged by consignor |
| 6 | Obtain participant acknowledgment of: accepted items, payout amount, known condition, applicable return/refund/unsold terms | Signed/recorded acknowledgment (digital or paper) | Consignor confirms via pilot communication channel |

### 2.4 Exit Gate (QC)
**No item enters live preparation without:** custody record + QC decision + acknowledged agreed net payout.

### 2.5 Reject Reason Codes (Pilot)
| Code | Reason | Next Step Options |
|------|--------|-------------------|
| R01 | Permanent stain (ink, oil, mold) | Return / Hold for review |
| R02 | Torn / hole in fabric | Return / Hold for review |
| R03 | Broken zipper | Return / Hold for review |
| R04 | Missing main buttons | Return / Hold for review |
| R05 | Persistent odor | Return / Hold for review |
| R06 | Size/brand cannot be determined | Hold for clarification |
| R07 | Other (documented) | Case by case |

---

## 3. Price Agreement & Net Payout SOP

### 3.1 Principle
The **agreed net payout** is the single number the consignor receives per sold item. It is discussed and recorded **before** the item is offered for sale.

### 3.2 Process

| Step | Action | Record Created |
|------|--------|----------------|
| 1 | Operator proposes net payout based on tier, brand, condition, market reference | Proposed net payout per item |
| 2 | Consignor accepts or negotiates (within pilot guardrails) | Final agreed net payout |
| 3 | Agreement recorded with timestamp, operator, consignor acknowledgment | Price agreement log |
| 4 | **Guardrail:** Item will not be sold below agreed net payout + minimum contribution without documented exception | Exception log if triggered |

### 3.3 Pilot Guardrails (from Business Model Memo)
1. Confirm seller's net payout during QC, before item is queued.
2. Do not sell below agreed net payout + approved minimum contribution without explicit documented exception.
3. Show buyer shipping separately; reconcile courier collection/delivery per order.
4. Do not use the landing-page estimator range as an earnings claim.
5. Do not represent the Rp2,500 prep figure as a health/sterilisation guarantee.

---

## 4. Merchandising & Live Session SOP

### 4.1 Scope
- Controlled sales session only after partner/operator confirms readiness.
- Target readiness gate: 50 saleable, priced, traceable items available before a session.

### 4.2 Roles
| Role | Responsibility |
|------|----------------|
| Studio Lead | Prepares run-sheet, verifies item readiness |
| Host / Live Partner | Presents items, claims buyers |
| Fulfillment Lead | Receives sold-item queue for packing |

### 4.3 Process

| Step | Action | Record Created | Evidence Required |
|------|--------|----------------|-------------------|
| 1 | Verify every item presented has: SKU, condition description, price/opening guidance, agreed net payout, owner reference | Run-sheet with all fields populated | Pre-session checklist signed by Studio Lead |
| 2 | Confirm host, platform, session scope, content rights, compensation, cancellation terms in writing | Host agreement | Signed host terms |
| 3 | Test manual order ledger and communication channel before session | Channel test log | Test message sent/received |
| 4 | During session: record item claim, buyer handle, agreed item price, timestamp, operator/host, payment-status evidence | Order claim log (controlled ledger) | "Claimed" not "sold" until payment verified |
| 5 | Do not rely on prototype "mark sold" state as a sales record | N/A — prototype is not used for pilot operations | Manual ledger is source of truth |

### 4.4 Exit Gate (Live)
**Items remain available unless a buyer-paid state is evidenced in the controlled ledger.**

---

## 5. Payment & Fulfillment SOP

### 5.1 Scope
- Applies to every buyer-paid order in the pilot.
- Shipping is a buyer pass-through; reconciled separately from item-sale proceeds.

### 5.2 Roles
| Role | Responsibility |
|------|----------------|
| Fulfillment Lead | Packing, dispatch, courier coordination |
| Finance/Payout Checker | Payment verification, reconciliation |

### 5.3 Process

| Step | Action | Record Created | Evidence Required |
|------|--------|----------------|-------------------|
| 1 | Verify buyer payment using approved collection method | Payment verification record | Transaction reference (bank/payment provider) |
| 2 | Record item subtotal and shipping separately | Order ledger entry with split | Payment proof showing both amounts |
| 3 | Collect complete, verified delivery details via approved secure process | Delivery details record | Consignor/buyer confirmation (not prototype fields) |
| 4 | Pack against pick list; second-person SKU check before dispatch | Packing verification log | Two-person sign-off |
| 5 | Record: courier/provider, actual tracking reference, dispatch timestamp, proof of handover | Dispatch log | Courier receipt / tracking screenshot |
| 6 | Record delivery, failed delivery, cancellation, refund, or return status + responsible next action | Fulfillment status log | Courier delivery proof / return record |
| 7 | **Never** create tracking number, customer address, or delivery completion from placeholder data | N/A — prohibited | All data must be operator-entered and validated |

### 5.4 Exit Gate (Fulfillment)
**Every buyer-paid order has payment evidence and a fulfillment state.** Unresolved exceptions block payout eligibility.

---

## 6. Payout SOP

### 6.1 Principle
Payout covers only items with: buyer-payment evidence + completed applicable hold + no unresolved fulfillment/refund exception.

### 6.2 Roles
| Role | Responsibility |
|------|----------------|
| Payout Maker | Prepares draft, calculates liabilities |
| Payout Checker | Independent verification against payment/fulfillment/item records |
| Pilot Owner | Approves release after maker/checker reconciliation |

### 6.3 Process

| Step | Action | Record Created | Evidence Required |
|------|--------|----------------|-------------------|
| 1 | List eligible items only (buyer-paid, hold passed, no open exceptions) | Eligibility register | Cross-reference: payment + fulfillment + item status |
| 2 | Recalculate each seller liability from **agreed net payout record** — do not deduct unagreed prep/steam fee after the fact | Recalculation sheet | Matches original price agreement |
| 3 | Prepare payout draft: participant ref, item/SKU, gross item sale, agreed net payout, eligibility rationale, total liability | Payout draft document | Maker signature + timestamp |
| 4 | Second person checks draft against payment, fulfillment, item records | Checker verification log | Checker signature + timestamp; discrepancies logged |
| 5 | **For dry-run:** Label all documents **SIMULATION — NO BANK TRANSFER EXECUTED** | Dry-run payout pack | No bank file exported/used |
| 6 | **For future real payout:** Require bank reference/proof + reconciliation before status = complete | Bank proof + reconciliation record | Transfer receipt + bank statement match |

### 6.4 Exit Gate (Payout)
**Maker/checker reconciliation either balances or an exception is logged and expansion pauses.**

---

## 7. Reject / Return / Unsold / Damage SOP

### 7.1 Reject at QC (Pre-Acceptance)
- Already covered in Section 2.4: item never enters live prep; resolution agreed with consignor (return/hold/other).

### 7.2 Buyer Return / Refund (Post-Sale)
| Scenario | Process | Record | Payout Impact |
|----------|---------|--------|---------------|
| Buyer requests return within policy window | Verify reason, receive item, inspect condition | Return log + condition photos | Seller liability reversed; item returns to inventory or reject flow |
| Buyer claims item not as described | Compare photos/description to QC record | Dispute log + evidence | Hold payout for disputed item until resolution |
| Courier reports failed delivery / damage | Record exception, initiate claim with courier | Shipping exception log | Seller liability held until courier claim resolved |

### 7.3 Unsold at 30 Days (Consignment Expiry)
| Option | Process | Record | Payout Impact |
|--------|---------|--------|---------------|
| **Buyout at agreed floor (Rp 10,000 pilot hypothesis)** | Offer to consignor; if accepted, item status → `bought_out`, platform owns item | Buyout agreement + payout adjustment | Rp 10,000 added to consignor's next payout batch |
| **Return to consignor** | Arrange handover; consignor collects or pays return shipping | Return handover log | No payout; item removed from inventory |
| **Donate / recycle (explicit consent only)** | Consignor signs donation authorization | Donation consent form | No payout; item removed from inventory |

### 7.4 Damage / Loss in Custody
| Scenario | Process | Record | Compensation |
|----------|---------|--------|--------------|
| Damage at studio (steam, handling, storage) | Document with photos, operator statement, timestamp | Incident report | Per written pilot terms (to be agreed before real-money pilot) |
| Loss in transit (pickup or delivery) | Courier claim + internal incident report | Incident + claim log | Per written pilot terms + courier liability |
| Theft / unexplained loss | Police report + internal investigation | Incident + police report ref | Per written pilot terms |

---

## 8. Custody & Inventory Control SOP

### 8.1 Custody States
| State | Description | Location Record Required |
|-------|-------------|--------------------------|
| `RECEIVED` | Items handed over, counted, condition noted | Intake location |
| `IN_QC` | At screening/steam/hangtag stations | Station + handler |
| `READY_FOR_LIVE` | Hung on rack, priced, tagged | Rack location + position |
| `IN_LIVE_QUEUE` | On run-sheet for upcoming session | Run-sheet position |
| `CLAIMED` | Buyer claimed during live; payment pending | Host log + buyer handle |
| `PAID` | Buyer payment verified | Payment reference |
| `PACKED` | Verified, sealed, labeled | Packer + timestamp |
| `DISPATCHED` | Handed to courier | Courier receipt + tracking |
| `DELIVERED` | Courier confirms delivery | Delivery proof |
| `PAID_OUT` | Seller liability reconciled + bank transfer confirmed | Bank proof + reconciliation |
| `RETURNED` | Buyer return received + inspected | Return log + condition |
| `BOUGHT_OUT` | Platform purchased at expiry | Buyout agreement |
| `RECLAIMED` | Consignor collected unsold/rejected item | Handover log |

### 8.2 Inventory Reconciliation (Weekly + At Session Boundaries)
- Physical count vs ledger count per location.
- Every discrepancy logged with: item SKU, last known state, last handler, timestamp, resolution action.
- Unreconciled discrepancies → pause intake for that batch until resolved.

---

## 9. Communication & Update SOP

### 9.1 Consignor Updates
| Trigger | Channel | Content | Timing |
|---------|---------|---------|--------|
| Intake received | Pilot contact channel (WhatsApp/call) | Items received for assessment, count, next step | Same day |
| QC decision | Pilot contact channel | Accepted items + agreed net payout; rejected items + reason + next step | Within 24h of intake |
| Live scheduled | Pilot contact channel | Session date, items included, how to watch | Before session |
| Item sold (paid) | Pilot contact channel | Item sold, buyer-paid confirmed, estimated payout cycle | After payment verified |
| Payout eligible | Pilot contact channel | Amount, items included, expected transfer date | Weekly (aligned to payout cycle) |
| Exception / delay | Pilot contact channel | What happened, what we're doing, when next update | As soon as known; max 24h |

### 9.2 Internal Escalation
| Level | Trigger | Owner | SLA |
|-------|---------|-------|-----|
| L1 | Single item exception (return, defect, payment mismatch) | Fulfillment/Payout Lead | Resolve or escalate in 4h |
| L2 | Batch/system exception (multiple items, courier failure, payout mismatch) | Pilot Owner (Ren) | Acknowledge in 1h; resolve or escalate in 24h |
| L3 | Legal/privacy/safety incident | Founder (Akmal) | Immediate |

---

## 10. Dry-Run Checklist (Pre-Pilot Validation)

Before any real consignor items or customer money:

- [ ] Pilot owner, intake/QC lead, host, fulfillment lead, payout maker/checker named (payout maker/checker separation preserved).
- [ ] Shared controlled ledger exists outside prototype (columns: custody, QC, agreed net payout, sales/payment, fulfillment, exception, payout reconciliation).
- [ ] Operating site, handling permissions, storage, handover contacts verified.
- [ ] Contact/incident path written: lost item, count mismatch, QC dispute, buyer-payment issue, delivery issue, payout mismatch, data/privacy concern.
- [ ] Stop condition agreed: pause when any custody, payment, shipping, payout, or privacy record is missing/contradictory.
- [ ] One dry-run with fictional/non-sensitive test records or consented internal participants completed.
- [ ] Dry-run learning review: time/cost per item, QC acceptance reasons, host/ops friction, paid-order path, fulfillment exceptions, payout reconciliation result.
- [ ] Go / revise / stop decision recorded. **Dry-run pass does not override Gate B/C security, legal, payment, or founder-approval requirements.**

---

## 11. Evidence Register — What Mal Must Supply Before Real-Money Pilot

| # | Evidence Required | Source / Owner | Gate | Status |
|---|-------------------|----------------|------|--------|
| E-01 | Business entity registration (PT / CV / sole proprietorship) | Founder | Gate C | ☐ |
| E-02 | Tax registration (NPWP) and VAT/PPh treatment for consignment model | Founder + tax advisor | Gate C | ☐ |
| E-03 | Operating address proof (studio/pickup location lease/permission) | Founder | Gate B | ☐ |
| E-04 | Service area map + pickup capacity confirmation (courier/internal) | Founder + courier partner | Gate B | ☐ |
| E-05 | Courier partner written agreement: pricing, liability, SLA, tracking, claims | Founder + courier | Gate B | ☐ |
| E-06 | Payment provider terms: settlement timeline, fees, chargeback rules, KYC | Founder + payment provider | Gate B | ☐ |
| E-07 | Bank account ownership proof (entity account for buyer funds + payout reserve) | Founder | Gate C | ☐ |
| E-08 | Pilot cash reserve: source + approved max exposure (not derived from model) | Founder | Gate C | ☐ |
| E-09 | Consumer terms: price/refund/return disclosures, condition descriptions, complaint channel | Legal review | Gate C | ☐ |
| E-10 | Consignment agreement template: title/custody at each stage, loss/damage/unsold handling | Legal review | Gate C | ☐ |
| E-11 | Privacy policy + data retention + consent capture + breach process | Legal review | Gate C | ☐ |
| E-12 | Steam/hygiene claim evidence: equipment specs, SOP, test results, reviewed wording | Ops + legal | Gate B | ☐ |
| E-13 | Host engagement terms: compensation, commission, tax withholding, content rights, conduct | Founder + host | Gate B | ☐ |
| E-14 | Insurance: goods in custody, transit, public liability | Founder | Gate C | ☐ |
| E-15 | Written pilot cohort definition: 5 consignors, 100 items, capacity, contact owner | Ren | Gate B | ☐ |
| E-16 | Signed host terms for pilot session(s) | Ren + host | Gate B | ☐ |
| E-17 | Courier pickup/drop-off test receipt (verifiable tracking) | Lyra + courier | Gate B | ☐ |
| E-18 | Payment sandbox test: end-to-end buyer payment → platform receipt → payout draft | Lyra + payment provider | Gate B | ☐ |
| E-19 | WhatsApp Business API: template approval, delivery callback, retry log | Lyra + provider | Gate B | ☐ |
| E-20 | Supabase: clean migration + least-privilege RLS verified in staging | Lyra | Gate B | ☐ |
| E-21 | Auth/RBAC: server-side route/API checks deployed; no client seeds/credentials | Lyra | Gate B | ☐ |
| E-22 | Durable booking → item → order → payout state machine operational | Lyra + Ren | Gate B | ☐ |
| E-23 | E2E + staging integration tests passing in CI | Lyra | Gate B | ☐ |

**Legend:** ☐ = Not yet supplied | ✅ = Supplied and verified | 🔄 = In progress

---

## 12. Version & Approval

| Version | Date | Author | Change Summary | Approved By |
|---------|------|--------|----------------|-------------|
| 0.1 (draft) | 2026-09-10 | Ren | Initial pilot SOP from audit evidence & pilot gates | — |

**Next review:** After Gate B evidence complete; before any real-item intake.