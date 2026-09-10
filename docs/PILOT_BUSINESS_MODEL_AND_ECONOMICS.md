# PindahTangan — Pilot Business Model & Economics Decision Memo

**Purpose:** turn the PRD’s economics into a testable 30-day Sukabumi pilot model. This is an internal decision document, not a forecast or statement of traction.

**Decision status:** proposed pilot model. No real pricing, payout, sales, host-fee, address, supplier, or legal-compliance evidence was provided to validate the assumptions below.

## 1. Decision in brief

Run the first pilot as a managed-consignment service with one transparent number for the consignor: the **agreed net payout per accepted, sold item**. Do not promise an estimate as money owed, and do not describe an after-the-fact steam deduction as an automatic service fee.

- The buyer pays: item price and the displayed shipping charge.
- The consignor pays: no separate cash fee in the pilot; their agreed net payout is stated before the item goes live.
- PindahTangan retains: the difference between paid item price and agreed net payout. This spread funds curation, preparation, live selling, and operating costs.
- Shipping: collected separately from the buyer and held as a pass-through; it is not GMV margin.
- Payout: only for buyer-paid orders that have passed the defined cancellation/refund hold. A weekly batch can remain the customer-facing cadence, but it must not be marketed as “automatic” until the bank/payment workflow is proven.

This is clearer than the current PRD/code convention where `floor_price` is described as a seller right but is then reduced by Rp2.500. During the pilot, “floor price” must be renamed in operational copy to **agreed net payout**, or the deduction must be explicitly accepted before intake. Recommendation: use the first option.

## 2. Business Model Canvas (pilot)

| Block | Pilot definition | Evidence to collect |
|---|---|---|
| Customer segments | Sukabumi consignors with usable women’s fashion; live-commerce buyers seeking curated, lower-price fashion; local part-time hosts | Interview notes, booking source, audience/checkout data |
| Customer problem | Consignors do not want to photograph, list, negotiate, pack, or ship; buyers need an accurate, curated live-shopping experience | Top three reasons for consigning/buying; drop-off reasons |
| Value proposition | Managed intake, transparent acceptance and net payout, live merchandising, and traceable status/payout record | Whether each promise changes conversion or repeat intent |
| Channels | Direct WhatsApp/referral outreach, local community/content, then hosted live sessions | Acquisition source and cost per qualified booking/viewer |
| Customer relationship | Assisted onboarding and pickup/intake; WhatsApp updates; clear QC/reject and payout support | Response time, complaints, repeat consignor rate |
| Revenue | Product-price spread retained by PindahTangan; buyer shipping is pass-through | Actual average sale price, net seller payout, payment fees, refunds |
| Key activities | Intake, QC, prep, content/live, buyer payment confirmation, fulfillment, reconciliation, payout | Minutes and cost per submitted/accepted/sold item |
| Key resources | Reliable operator, host, basic prep station, inventory/rack control, order/payment ledger, working capital reserve | Shift attendance, equipment availability, reconciliation exceptions |
| Key partners | Courier/payment provider/studio or pickup partner, live platform, host | Written commercial terms and operational SLA |
| Cost structure | Per-item preparation, payment fees, packaging, host/ops shift, pickup, studio/live allocation, refunds/returns | Supplier invoices, actual staff hours, pickup and payment statements |

## 3. Pilot pricing and take-rate hypothesis

The PRD’s worked example is used only as a hypothesis: Rp65.000 item price, Rp35.000 “floor,” less Rp2.500 steam fee, resulting in a Rp32.500 seller receipt. For decision clarity, this memo treats Rp32.500 as the proposed **net payout**.

| Item-level cash allocation | Rp | Treatment |
|---|---:|---|
| Buyer item payment (illustrative) | 65.000 | Gross product sale; exclude separately charged shipping |
| Agreed net payout to consignor | 32.500 | Liability once eligible for settlement |
| PindahTangan retained spread | 32.500 | 50.0% of item sale before operating costs |
| Intake/QC labour allocation* | 3.000 | Variable operating assumption |
| Steam consumables/electricity* | 2.500 | Variable operating assumption; not a separate seller deduction |
| Photo/hangtag allocation* | 1.500 | Variable operating assumption |
| Payment fee (2% of item price)* | 1.300 | Variable operating assumption |
| Packaging allocation* | 1.500 | Variable operating assumption |
| Contribution after item-variable costs | 22.700 | Available for session fixed costs, refunds, and profit |

*All starred values are assumptions to measure, not established costs.

At this illustrative price/payout pair, retained spread is 50%. That is a **hypothesis**, not a recommended permanent commission. The pilot should test whether price acceptance and supply acceptance still work at this split. A permanent take-rate should be set only after actual sell-through, labor, refund, and acquisition data are known.

### Price guardrails for the pilot

1. Confirm the seller’s net payout during QC, before the item is queued.
2. Do not sell below the agreed net payout plus the approved minimum contribution without an explicit documented exception.
3. Show buyer shipping separately; reconcile courier collection/delivery against each order.
4. Do not use the current landing-page estimator range as an earnings claim. It is currently hard-coded at Rp32.500–Rp52.500 per piece and is not tied to observed sales or acceptance rates.
5. Do not represent the Rp2.500 prep figure as a health/sterilisation guarantee. The PRD/UI’s “>100°C” claim needs evidence and reviewed wording before public use.

## 4. Cash-flow and payout-liability model

### Cash states

1. **Order placed:** record order; no seller payout liability until buyer payment is confirmed.
2. **Buyer-paid, before fulfillment/hold ends:** item proceeds are restricted operational cash. Record gross payment, shipping pass-through, platform retained spread, and seller payout liability separately.
3. **Eligible for payout:** buyer payment is confirmed, any agreed cancellation/refund hold is passed, and the order has no unresolved fulfillment exception. Include the seller amount in the weekly payout batch.
4. **Transferred and reconciled:** attach bank proof/reference; mark payout completed only after bank reconciliation, not on CSV export.
5. **Refund/return/chargeback:** reverse or reserve the relevant seller and platform amounts according to a written policy; never pay the same proceeds twice.

### Minimum cash controls before a real-money pilot

- One order ledger reconciles live claim, buyer payment, item SKU, shipping, payout liability, payout status, and refund/return status.
- Separate “customer/seller funds payable” from operating cash. Do not treat unsettled seller money as spendable revenue.
- Maintain a pilot reserve equal to the larger of: one planned weekly seller-payout batch, or estimated refund/return exposure for open orders. The reserve size must be set after the first actual paid orders; no amount is assumed here.
- Two-person approval for a payout file and a daily/weekly reconciliation of payment-provider balance, bank movement, order total, shipping total, and seller liabilities.
- A CSV download is only a draft instruction. The current local-store implementation marks payout `transferred` immediately and uses placeholder/simulated data; it is not evidence of a real disbursement workflow.

## 5. Session unit-economics model and sensitivity

### Base-case assumptions (one two-hour live session)

| Assumption | Rp / units | Validation method |
|---|---:|---|
| Average paid item price | 65.000 | Paid-order ledger |
| Agreed seller net payout | 32.500 | QC agreement + payout ledger |
| Item-variable cost | 9.800 | Timesheet, invoices, provider fee statement |
| Contribution per sold item | 22.700 | Recalculate from actuals |
| Host base fee | 60.000 | Signed host terms / payroll evidence |
| Operator allocation | 40.000 | Timesheet or agreed shift cost |
| Studio/live allocation | 25.000 | Invoice / internal allocation basis |
| Pickup allocation | 30.000 | Route log and actual courier cost |
| Total session fixed cost | 155.000 | Actual expense log |

**Formula:**

`session result = (sold items × Rp22.700 contribution) − Rp155.000 fixed session cost`

The mathematical break-even is 6.83 items, so a session needs **7 paid items** merely to cover these assumed costs. The operational gate should be higher: target **12 paid items** before calling the session viable, leaving a Rp117.400 base-case contribution after the assumed session fixed cost and before central overhead, refunds, acquisition, taxes, and founder pay.

| Paid items | Item GMV | Seller payout liability | Session result after assumed variable + fixed costs |
|---:|---:|---:|---:|
| 8 | 520.000 | 260.000 | 26.600 |
| 10 | 650.000 | 325.000 | 72.000 |
| 12 | 780.000 | 390.000 | 117.400 |
| 20 | 1.300.000 | 650.000 | 299.000 |
| 30 | 1.950.000 | 975.000 | 526.000 |

These outputs are calculations from assumptions, not outcomes achieved by PindahTangan. The 30-item row is deliberately not called “sold out” or forecasted.

### Sensitivity to realised price and seller payout

Holding non-payment variable costs at Rp8.500/item and payment fee at 2% of item price:

| Scenario | Paid price | Seller net payout | Contribution/item | Approx. paid items to cover Rp155.000 session fixed cost |
|---|---:|---:|---:|---:|
| Low | 55.000 | 27.500 | 17.900 | 9 |
| Base | 65.000 | 32.500 | 22.700 | 7 |
| High | 75.000 | 37.500 | 27.500 | 6 |

Break-even gets worse if average price falls, seller payout is negotiated higher, acceptance is lower, pickup costs are concentrated in small batches, or items require rework/return. This is why pilot decision-making must use contribution and cash liability, not GMV alone.

## 6. Minimum viable thresholds

These are starting test thresholds, not market facts.

| Area | 30-day test threshold | What makes it fail/rework |
|---|---|---|
| Supply | 5 pilot consignors; 100 submitted items; at least 70 accepted items | Fewer than 70 accepted after QC, unclear custody, or unacceptable rejection rate |
| Inventory per live | 50 saleable items available/merchandised before a scheduled session | Host lacks enough relevant inventory or pricing is not approved |
| Demand | At least 12 buyer-paid items in a two-hour session | Live has interest but no confirmed payment, or paid conversion is materially below session viability |
| Sell-through | Measure paid items ÷ live-presented items; evaluate by price/tier, not just total | A session should not be judged from views alone |
| Operations | Every item has custody record, QC decision, agreed net payout, SKU/hangtag, and status | Any untraceable item or unresolved seller claim pauses further intake |
| Fulfillment | All buyer-paid orders have shipping status and reconciliation evidence within the stated service window | Unresolved payment/shipping exceptions grow across sessions |
| Payout | 100% of eligible seller liabilities reconcile to bank proof before marking complete | Missing bank detail, payout mismatch, or no proof of transfer |

Supply math behind the gate: 5 consignors × 20 submitted pieces = 100 submitted pieces. A 70% QC acceptance hypothesis produces 70 saleable pieces. This is adequate for a controlled first session plus reserve inventory, but must be measured rather than assumed.

## 7. First 30-day Sukabumi pilot scorecard

### Week 0: setup and evidence capture

- Owner and named operator; written custody, QC, price-agreement, refund/return, and payout rules.
- Confirm actual studio/pickup location and operating coverage. The repository contains a seed address; it is not evidence of an operating site.
- Verify payment collection flow, bank account ownership, provider fees, courier terms, and host terms.
- Recruit a small consented pilot cohort only; no public scale launch and no real-money activity before the controls above are approved.

### Weeks 1–2: supply and readiness

| Metric | Target / measurement |
|---|---|
| Qualified booking requests | Count and source; no target treated as achieved |
| Submitted pieces | Toward 100 pilot submitted items |
| QC acceptance/rejection rate | Accepted ÷ submitted; reason codes and custody evidence |
| Net-payout acceptance | Share of accepted items whose seller accepts proposed net payout |
| Cost/time per item | Intake, QC, prep, photo/tag, and pickup time/cost |
| Inventory ready | Saleable items with prices, measurements, photos, SKU, and status |

### Weeks 3–4: two controlled live/payout cycles

| Metric | Definition |
|---|---|
| Paid-item GMV | Sum of buyer-confirmed item payments only; shipping reported separately |
| Paid sell-through | Buyer-paid items ÷ items presented live |
| Average paid price and seller net payout | By tier and total |
| Contribution per paid item | Paid price − seller payout − measured item-variable costs |
| Session result | Contribution total − measured session fixed costs |
| Payment-to-dispatch rate | Buyer-paid orders dispatched ÷ buyer-paid orders |
| Refund/return/cancellation exposure | Count and Rp; reason and resolution time |
| Seller payout accuracy/on-time rate | Reconciled eligible liabilities paid correctly/on stated cadence |
| Buyer/consignor satisfaction | Short qualitative feedback; no fabricated testimonials |
| Repeat intent | Consignor willing to submit again; buyer willing to attend/buy again |

### Day-30 decision rule

Proceed to a second, slightly larger cohort only if all three conditions are met:

1. No unresolved custody, payout, or payment-reconciliation exception.
2. At least one controlled session reaches the 12 buyer-paid-item viability threshold **using measured costs**, not UI simulation data.
3. Pilot participants understand and accept the net-payout, QC, refund/return, and payout terms.

Otherwise, pause expansion and change the failing part: pricing/assortment, supply quality, live conversion, fulfillment, or settlement controls.

## 8. Questions requiring owner/provider/legal/tax review

This is an issue register, not legal or tax advice.

| Topic | Question to resolve before real-money/public launch |
|---|---|
| Business structure and tax | Which entity receives buyer funds and books the retained spread; what tax documents, VAT/PPh treatment, and seller reporting obligations apply? |
| Consignment title and loss | Who has title/custody at every stage; how are lost, damaged, rejected, or unsold garments handled and compensated? |
| Consumer protection | What disclosures, price/refund/return terms, product-condition descriptions, and complaint channel are required for used apparel and live sales? |
| Payment collection | Is the planned payment flow permitted by the provider/platform; who controls funds; what settlement, chargeback, and KYC rules apply? |
| Data protection | What consent, retention, access controls, and breach process cover buyer addresses, phone numbers, bank details, and garment photos? |
| Shipping | Who contracts with the courier; who bears loss/damage/failed-delivery cost; how are shipping fees and receipts reconciled? |
| Product condition/hygiene claims | What evidence supports any steam, cleanliness, odour, or health claim? Remove guarantees until substantiated and legally reviewed. |
| Influencer/host engagement | Are host compensation, commission, tax withholding, content rights, and conduct obligations written down? |

## 9. Source basis and implementation mismatches to resolve

- PRD v1.0 sections 5 and 9 define the current 10-item minimum, 20-item free-pickup threshold, Rp2.500 steam deduction, Rp60.000 host base fee, Rp2.000 host item commission, 30-day consignment, and a 30-item / Rp65.000 / Rp35.000 illustrative session.
- `src/lib/constants.ts` and `src/lib/store.ts` implement those as local simulation constants/data, including prefilled profiles/orders/payouts and simulated WhatsApp status. They must not be presented as live traction.
- `src/components/landing/ValueEstimator.tsx` uses a fixed Rp32.500–Rp52.500-per-piece range and makes payout/prep claims that need pilot evidence and approved wording.
- `src/components/admin/FridayPayoutModule.tsx` and `src/lib/store.ts` currently treat an action as completed transfer and allow export of draft bank CSVs. They require payment/bank integration, approval, and reconciliation controls before any real payout.

## 10. Founder decisions required before a real-money pilot

1. Approve whether the pilot uses the proposed **agreed net payout** terminology and a spread-funded service model.
2. Set the real-money gate owner: who approves buyer-payment, refund/return, and payout controls after provider/bank review.
3. Confirm initial cash-reserve source and approved maximum exposure; do not derive it from this model.
4. Approve the pilot cohort, operating location, host/pay terms, and public/private launch boundary after evidence is collected.
