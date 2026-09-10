# PindahTangan — Pilot Consent Records

**Status:** Proposed templates for controlled Sukabumi pilot only.  
**Gate dependency:** Must pass Gate B (durability, consent capture) and Gate C (legal/consumer terms approval) before any real participant data is collected.  
**Owner route:** Ren (ops/policy), Legal review (terms), Lyra (durable storage).

---

## 0. Consent Principles

1. **Consent is specific, informed, and documented per processing purpose.** No bundled "agree to all" for unrelated purposes.
2. **Consent is captured before the processing starts.** Not after.
3. **Consent records are durable, retrievable, and versioned.** Linked to the participant and the specific terms version.
4. **Withdrawal is as easy as giving consent.** Process documented and operational.
5. **Prototype ≠ production.** The current localStorage-based registration does not constitute valid consent for real operations.

---

## 1. Consent Types Required for Pilot

| Consent Type | Purpose | Legal Basis | When Captured | Version Control |
|--------------|---------|-------------|---------------|-----------------|
| **C-01: Pilot Participation** | Join controlled pilot cohort; receive process updates | Legitimate interest / Contract | Before intake booking | v1.0 + date |
| **C-02: Item Processing & Custody** | Receive, inspect, steam, tag, store, sell items | Contract | At handover (physical/digital) | v1.0 + date |
| **C-03: Net Payout Agreement** | Accept agreed net payout per accepted item | Contract | At QC acceptance (per item) | Per item + date |
| **C-04: Buyer Data Processing** | Process buyer payment, shipping, contact for fulfillment | Contract / Legitimate interest | At buyer checkout (buyer side) | v1.0 + date |
| **C-05: Marketing / Status Updates** | WhatsApp/email updates on item status, pilot news | Consent | At onboarding (opt-in, granular) | v1.0 + date |
| **C-06: Photo/Content Use** | Use garment photos for live sale, internal records | Contract / Consent | At QC (photos taken) | v1.0 + date |
| **C-07: Reject/Unsold Disposition** | Return, buyout, donate, recycle decision | Contract | At QC (reject) / Day 30 (unsold) | Per decision + date |
| **C-08: Data Retention & Deletion** | Retain records per policy; delete on request | Legal obligation / Consent | At onboarding | v1.0 + date |

---

## 2. Consent Record Schema (Controlled Ledger)

Each consent record contains:

| Field | Description | Example |
|-------|-------------|---------|
| `consent_id` | UUID | `c-550e8400-e29b-41d4-a716-446655440000` |
| `participant_id` | Internal pilot reference | `PT-SM-001` (consignor) / `BUY-001` (buyer) |
| `consent_type` | One of C-01 through C-08 | `C-03` |
| `terms_version` | Exact terms document version | `v1.0-20260910` |
| `terms_hash` | SHA-256 of terms text for integrity | `a1b2c3...` |
| `granted` | Boolean | `true` / `false` |
| `granted_at` | ISO timestamp | `2026-09-12T14:30:00+07:00` |
| `granted_by` | How captured | `digital_signature` / `paper_signed` / `verbal_recorded` / `whatsapp_ack` |
| `witnessed_by` | Operator who captured consent | `intake_lead_ren` |
| `withdrawn_at` | Null if active | `2026-09-20T10:00:00+07:00` |
| `withdrawn_by` | Participant or operator | `participant` |
| `notes` | Context (e.g., "accepted net payout Rp32,500 for SKU PT-SM-001-042") | Free text |

---

## 3. Consent Capture Methods (Pilot)

| Method | Used For | Evidence Kept |
|--------|----------|---------------|
| **Paper signed form** | C-01, C-02, C-07 (physical handover) | Scanned PDF + photo of signed form |
| **WhatsApp acknowledgment** | C-03, C-05, C-07 (remote confirmation) | Screenshot + message export + timestamp |
| **Digital signature (simple)** | C-01, C-02, C-04, C-08 | Signed payload + IP + user agent |
| **Verbal + operator log** | C-03, C-07 (in-person) | Operator note with participant confirmation phrase, timestamp, witness |

**Rule:** For C-03 (net payout agreement), minimum evidence = WhatsApp acknowledgment with explicit "saya setuju nilai bersih Rp X untuk item [SKU]" or paper signature.

---

## 4. Participant Onboarding Consent Flow (C-01, C-02, C-05, C-08)

### 4.1 Before Any Item Handover

1. **Pilot information sheet** provided (1-pager: scope, capacity, process, rights, contact).
2. **Consent form v1.0** presented covering:
   - Pilot participation (C-01)
   - Item processing & custody (C-02)
   - Status updates via WhatsApp (C-05) — **opt-in, separate checkbox**
   - Data retention/deletion policy summary (C-08)
3. **Participant signs/acknowledges** — method per Section 3.
4. **Operator records** in controlled ledger with `terms_version = "v1.0-20260910"` and `terms_hash`.
5. **Participant receives copy** of signed consent (paper or digital).

### 4.2 Information Sheet Must Include (Plain Language)

- What PindahTangan is testing (managed consignment pilot, limited capacity).
- What the participant agrees to: handover items for assessment, QC, possible sale.
- What is **not** guaranteed: pickup, sale, payout timing, specific price, hygiene result.
- Net payout is discussed **per accepted item** before sale (C-03).
- Reject/unsold options: return, buyout (Rp10k pilot), donate — **must choose per item**.
- Updates via WhatsApp only if opted in; channel monitored by named owner.
- Data kept for pilot + 12 months; deletion request honored in 30 days.
- Contact for questions/complaints/withdrawal: [Named pilot owner + channel].

---

## 5. Per-Item Net Payout Consent (C-03) — Critical

### 5.1 Trigger
After QC decision = **Accepted**, before item enters live preparation.

### 5.2 Required Content (Per Item)

| Field | Captured |
|-------|----------|
| Item SKU | `PT-SM-001-042` |
| Item description | "Zara blouse, size M, LD 96cm, Tier B" |
| Agreed net payout | `Rp 32,500` |
| Payout terms reference | "Pilot net payout terms v1.0 — no steam fee deduction after sale" |
| Consignor acknowledgment | "Saya setuju nilai bersih Rp 32,500 untuk item ini sebelum masuk penjualan" |
| Operator | `qc_operator_siti` |
| Timestamp | `2026-09-13T10:15:00+07:00` |
| Method | `whatsapp_ack` |

### 5.3 Evidence Standard
- **Minimum:** WhatsApp message from participant's verified number containing explicit agreement text above.
- **Preferred:** Paper signed per-item schedule (batch sign-off) + photo.
- **Not acceptable:** Prototype portal "agree" click, pre-checked box, silence, or implied consent.

### 5.4 If Consignor Declines Net Payout
- Item stays in `READY_FOR_LIVE` but **blocked from live queue**.
- Options: renegotiate (record new C-03), return to consignor (C-07), hold for review.
- No item moves to live without C-03.

---

## 6. Reject / Unsold Disposition Consent (C-07)

### 6.1 At QC Reject (Immediate)

| Option | Consent Capture | Record |
|--------|----------------|--------|
| **Return** | Participant chooses at QC station or via WhatsApp within 48h | C-07 record: `disposition=return`, `chosen_at`, `method` |
| **Hold for review** | Participant requests time; max 7 days before default to return | C-07 record: `disposition=hold`, `expires_at` |
| **Donate/recycle** | **Explicit written consent only** — no default, no implied | C-07 record: `disposition=donate`, signed consent form |

### 6.2 At Day 30 (Consignment Expiry)

| Option | Consent Capture | Record |
|--------|----------------|--------|
| **Buyout at Rp10,000** | Participant accepts offer via WhatsApp/paper | C-07: `disposition=buyout`, `amount=10000`, `accepted_at` |
| **Return** | Participant arranges collection / pays return shipping | C-07: `disposition=return`, `return_method`, `confirmed_at` |
| **Donate** | Explicit written consent (separate from QC reject) | C-07: `disposition=donate`, signed consent form |

**Default if no response by Day 35:** Item held for 60 more days, then donated **only if** original onboarding consent (C-02) included a valid donation fallback clause. Otherwise → return at platform cost.

---

## 7. Buyer Consent (C-04) — For Completeness

| Data | Purpose | Consent Capture |
|------|---------|-----------------|
| Name, phone, address | Shipping + contact | Checkout form (explicit submit = consent) |
| Payment details | Payment processing | Payment provider flow (provider captures) |
| TikTok/IG handle | Order attribution | Entered by host at "mark sold" — buyer informs handle |
| Order history | Receipt, returns, support | Implied by purchase (contract) |

**Note:** Buyer consent is captured at checkout via the live platform / payment provider. Pilot uses manual order ledger; buyer data not entered into prototype.

---

## 8. Withdrawal / Deletion Process

| Request Type | Process | SLA | Record |
|--------------|---------|-----|--------|
| **Withdraw specific consent (e.g., C-05 updates)** | Participant messages pilot contact; operator logs `withdrawn_at`, `withdrawn_by=participant` | 24h to acknowledge; 48h to stop processing | Consent record updated |
| **Withdraw from pilot entirely (C-01)** | Participant notifies; operator initiates item return/buyout per C-07; all active consents withdrawn | 7 days to resolve items; 30 days for data deletion | All consent records updated; `withdrawn_at` set |
| **Data deletion request** | Participant requests; operator verifies identity; deletes personal data per retention policy; keeps anonymized operational logs | 30 days | Deletion log + remaining anonymized records |

---

## 9. Consent Register — Controlled Ledger View (Template)

| consent_id | participant_id | type | version | granted | granted_at | method | withdrawn_at | notes |
|------------|----------------|------|---------|---------|------------|--------|--------------|-------|
| c-001 | PT-SM-001 | C-01 | v1.0-20260910 | true | 2026-09-12T14:30+07 | paper_signed | — | Pilot participation + custody |
| c-002 | PT-SM-001 | C-02 | v1.0-20260910 | true | 2026-09-12T14:30+07 | paper_signed | — | Item processing consent |
| c-003 | PT-SM-001 | C-05 | v1.0-20260910 | true | 2026-09-12T14:30+07 | paper_signed | — | WhatsApp updates opt-in |
| c-004 | PT-SM-001 | C-08 | v1.0-20260910 | true | 2026-09-12T14:30+07 | paper_signed | — | Data retention policy |
| c-005 | PT-SM-001 | C-03 | v1.0-20260910 | true | 2026-09-13T10:15+07 | whatsapp_ack | — | Net payout Rp32,500 for PT-SM-001-042 |
| c-006 | PT-SM-001 | C-03 | v1.0-20260910 | true | 2026-09-13T10:16+07 | whatsapp_ack | — | Net payout Rp28,000 for PT-SM-001-043 |
| c-007 | PT-SM-001 | C-07 | v1.0-20260910 | true | 2026-09-13T10:20+07 | whatsapp_ack | — | Reject PT-SM-001-044 → return |

---

## 10. Terms Versioning (Pilot)

| Version | Date | Covers | Hash (SHA-256) | Status |
|---------|------|--------|----------------|--------|
| v1.0-20260910 | 2026-09-10 | C-01, C-02, C-05, C-08 (onboarding) | `pending` | Draft |
| v1.0-20260910 | 2026-09-10 | C-03 (net payout per item) | `pending` | Draft |
| v1.0-20260910 | 2026-09-10 | C-04 (buyer checkout) | `pending` | Draft |
| v1.0-20260910 | 2026-09-10 | C-06 (photo use) | `pending` | Draft |
| v1.0-20260910 | 2026-09-10 | C-07 (reject/unsold disposition) | `pending` | Draft |

**Rule:** Each consent record stores the `terms_hash` of the exact version agreed to. If terms change, new version = new consent capture required.

---

## 11. Evidence Register — What Mal Must Supply for Consent Validity

| # | Evidence Required | Source / Owner | Gate | Status |
|---|-------------------|----------------|------|--------|
| EC-01 | Legal review of all consent form texts (C-01 through C-08) — Indonesian consumer law compliance | Legal | Gate C | ☐ |
| EC-02 | Data Processing Addendum (DPA) with any subprocessors (WhatsApp API, payment provider, courier) | Legal + Founder | Gate C | ☐ |
| EC-03 | Data retention schedule: what is kept, how long, deletion method, exception for legal holds | Legal + Ops | Gate C | ☐ |
| EC-04 | Breach notification process: 72h to authority, affected individuals, documented | Legal + Ops | Gate C | ☐ |
| EC-05 | Verified WhatsApp Business Account (WABA) for pilot contact channel — not personal number | Lyra + Founder | Gate B | ☐ |
| EC-06 | Secure consent storage: encrypted at rest, access-controlled, audit-logged (not localStorage) | Lyra | Gate B | ☐ |
| EC-07 | Consent withdrawal tool/process tested end-to-end (participant → operator → ledger → stop processing) | Lyra + Ren | Gate B | ☐ |
| EC-08 | Participant identity verification method for consent binding (OTP, manual call, KTP check) | Ren | Gate B | ☐ |
| EC-09 | Pilot contact channel SLA: monitored by named owner, response time, escalation path | Ren | Gate B | ☐ |

---

## 12. Version & Approval

| Version | Date | Author | Change Summary | Approved By |
|---------|------|--------|----------------|-------------|
| 0.1 (draft) | 2026-09-10 | Ren | Initial consent records from audit evidence & pilot gates | — |

**Next review:** After legal review (Gate C) and durable storage verified (Gate B); before any participant onboarding.