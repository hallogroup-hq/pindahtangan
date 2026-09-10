# PindahTangan — Pilot Claim Register

**Status:** Operational register for the controlled Sukabumi pilot.  
**Purpose:** Track every participant-facing claim, its evidence status, and whether it can be used in external communication.  
**Source of truth:** `PindahTangan — Pilot Readiness Risk Register.md` (R-09, R-10, R-14, R-17, R-18); `docs/PILOT_BUSINESS_MODEL_AND_ECONOMICS.md`; `docs/PINDAHTANGAN_BRAND_IDENTITY_AND_MESSAGING.md` §7; `docs/PILOT_FAQ_AND_CLAIM_REGISTER.md`.  
**Owner route:** Ren (claims), Kei (external copy), Legal (consumer claims), Founder (Gate C approvals).

---

## 0. Claim Classification

| Status | Meaning | External Use |
|--------|---------|--------------|
| **APPROVED** | Evidence collected, verified, legally reviewed | Can be used in external copy |
| **CONDITIONAL** | Evidence exists for specific instance only | Use only for that instance; cite evidence |
| **PROPOSED** | Intended/pilot wording; no live evidence yet | Internal only; "sedang diuji" qualifier required |
| **NOT APPROVED** | No evidence, contradicted by audit, or legally risky | **Do not use** — remove from all external surfaces |

---

## 1. Master Claim Register

| ID | Claim / Wording | Category | Status | Evidence Required | Current Evidence | Gate | Owner | Notes |
|----|-----------------|----------|--------|-------------------|------------------|------|-------|-------|
| CL-01 | "PindahTangan adalah konsinyasi fesyen terkelola" | Service descriptor | PROPOSED | Defined pilot scope + named operator | Pilot scope drafted; operator TBD | Gate B | Ren | Pair with "pilot terbatas Sukabumi" |
| CL-02 | "Kami membantu proses titip jual pakaian" | Service intent | PROPOSED | SOP + dry-run evidence for each stated step | SOPs drafted; dry-run pending | Gate B | Ren | List actual supported steps |
| CL-03 | "Item diterima dan dicek" | Process claim | CONDITIONAL | Dated custody + QC record per item | Dry-run only; no real items yet | Gate B | Ren | Use only after real receipt/QC exists |
| CL-04 | "Nilai bersih disepakati sebelum item masuk penjualan" | Pricing claim | PROPOSED | Acknowledged agreement per accepted item | Price agreement SOP drafted | Gate B | Ren | Core pilot differentiator |
| CL-05 | "Pilot terbatas Sukabumi" | Geographic scope | CONDITIONAL | Named scope, capacity, contact owner | Scope drafted; capacity TBD | Gate B | Ren | Use only if operator can handle it |
| CL-06 | "Penjemputan gratis / jemput lemari" | Logistics claim | NOT APPROVED | Confirmed service area, threshold, provider, pricing, capacity, terms | PRD claims ≥20 pcs free; no partner confirmed | Gate B | Ren + Lyra | **Remove from all copy until confirmed** |
| CL-07 | Exact address, opening hours, coverage, live schedule | Location claim | NOT APPROVED | Location permission, operating calendar, accountable owner | PRD lists address; not verified in audit | Gate B | Ren | **Remove from all copy until verified** |
| CL-08 | "Diproses dengan steam >100°C", "steril", "wangi butik", hygiene guarantee | Hygiene claim | NOT APPROVED | Equipment/SOP evidence, substantiated claim, reviewed wording | PRD/hero claims >100°C; no equipment evidence | Gate B | Ren + Ops | **Remove; legal/health risk** |
| CL-09 | "Uang otomatis cair setiap Jumat" | Payout claim | NOT APPROVED | Payment/bank flow, refund/hold policy, approval + reconciliation evidence | Prototype simulates Friday payout; no bank integration | Gate C | Ren + Finance | **Remove; financial claim risk** |
| CL-10 | "Escrow" / "rekening penampung aman" | Financial claim | NOT APPROVED | Valid safeguarded-funds model + legal/provider review | PRD/admin uses "escrow" term; no actual escrow | Gate C | Ren + Legal | **Do not use until valid model exists** |
| CL-11 | Estimator RpX per item / earnings promise | Earnings claim | NOT APPROVED | Measured pilot data, disclosed assumptions, reviewed calculator | ValueEstimator uses hard-coded Rp32.5k–52.5k | Gate C | Ren + Finance | **Remove; unsupported forecast** |
| CL-12 | "Ratusan perempuan", sales/GMV, sell-through, on-time payout | Traction claim | NOT APPROVED | Auditable, current measured result with approved period/method | Testimonials are seed data; no real traction | Gate C | Ren + Kei | **Remove all testimonials/counts** |
| CL-13 | Named testimonial / "kisah nyata" | Social proof | NOT APPROVED | Consent, attribution, provenance, approval | TestimonialsSection has named, quantified stories | Gate C | Ren + Kei | **Remove; fictional social proof** |
| CL-14 | Named studio/courier/host/payment partner | Partner claim | NOT APPROVED | Written agreement + permission to name | PRD names partners; no agreements found | Gate B | Ren | Say "partner sedang dibahas" only |
| CL-15 | "WhatsApp terkirim/terkirim", "kurir akan menghubungi" | Communication claim | NOT APPROVED | Approved provider, delivery callback/retry evidence, operating owner | WhatsApp is simulated/default sandbox | Gate B | Lyra + Ren | Say "tim akan konfirmasi via jalur yg disepakati" |
| CL-16 | Buyer order "terjual" / "sold" | Sales claim | CONDITIONAL | Payment reference + order record | Prototype marks "sold" on host click | Gate B | Ren | Say "terklaim" until payment verified |
| CL-17 | Payout "transferred" / "cair" | Payout claim | CONDITIONAL | Bank reference/proof + reconciliation | Prototype marks "transferred" on CSV export | Gate C | Ren + Finance | **Never say from CSV/prototype** |
| CL-18 | Tracking / shipment "dikirim" / "tiba" | Fulfillment claim | CONDITIONAL | Actual provider-issued tracking + status evidence | Prototype generates random tracking numbers | Gate B | Lyra | State only after provider/manual verified |
| CL-19 | "Kapasitas 50 gantungan per sesi" | Capacity claim | PROPOSED | Dry-run evidence of 50 items prepped + run-sheet | PRD/Admin PRD specify 50; not tested | Gate B | Ren | Planning threshold only |
| CL-20 | "Retensi 30 hari + beli putus Rp10.000" | Policy claim | PROPOSED | Written pilot terms + consignor consent per item | PRD defines; pilot terms not finalized | Gate C | Ren + Legal | Requires C-07 consent per item |
| CL-21 | "Floor price RpX–Y per tier" | Pricing claim | PROPOSED | Actual accepted items + agreed net payout records | PRD defines tiers; no real acceptance data | Gate B | Ren | Use "range pilote" qualifier |
| CL-22 | "Gajian host Rp60.000 + Rp2.000/item" | Host compensation | PROPOSED | Signed host terms + payroll evidence | PRD/Admin PRD define; no host signed | Gate B | Ren | Requires E-13 evidence |
| CL-23 | "Komisi platform 50% / spread RpX" | Economics claim | PROPOSED | Measured pilot contribution + cost data | Business model memo treats as hypothesis | Gate C | Ren + Finance | Hypothesis only; not a claim |
| CL-24 | "Gratis ongkir pembeli / ongkir pass-through" | Shipping claim | PROPOSED | Courier terms + reconciliation evidence | Business model memo: shipping = pass-through | Gate B | Ren | Must be verified per courier |
| CL-25 | "Data aman, terenkripsi, isolasi database" | Security claim | NOT APPROVED | Auth/RBAC deployed, RLS verified, no client seeds | Audit: P0 auth failures, open RLS, client PII | Gate B | Lyra | **Remove; contradicted by audit** |

---

## 2. External Communication Claim Filters

### 2.1 Landing Page / Public Website
| Current Prototype Claim | Required Replacement | Status |
|-------------------------|---------------------|--------|
| "Uang tunai ditransfer otomatis setiap Jumat sore" | "Jadwal dan mekanisme pencairan akan dijelaskan sebelum item masuk proses" | NOT APPROVED → replace |
| ">100°C", "steril", "higienitas terjamin" | "Item akan melalui pengecekan dan penanganan sesuai proses pilot yang disepakati" | NOT APPROVED → replace |
| Slider estimating Rp32.5k–52.5k/pc | "Nilai bersih dibahas per item yang diterima, sebelum masuk penjualan" | NOT APPROVED → replace |
| "Ratusan perempuan..." + named testimonials | Remove section entirely | NOT APPROVED → remove |
| Exact pickup coverage, address, fixed schedule | Show only after owner approval + operational verification | NOT APPROVED → remove |
| "Jemput Lemari" as dominant CTA | "Ajukan minat pilot" / "Tanya soal pilot" | NOT APPROVED → replace |

### 2.2 Partner Conversations (from PILOT_PARTNER_OPS_DECK.md)
| Allowed Now | Only After Written Proof | Do Not Say Yet |
|-------------|-------------------------|----------------|
| "Kami sedang menguji proses titip jual dalam cohort kecil" | "Penyerahan bisa dilakukan di [location] pada [window]" | "Studio kami buka setiap hari" |
| "Peran partner sedang dibahas per tahap" | "Partner [name] menangani [scope]" | "Bermitra dengan [name]" |
| "Ongkir dan opsi penyerahan akan dikonfirmasi" | "Pickup tersedia untuk [area/term]" | "Penjemputan gratis" |
| "Pencairan direkonsiliasi sebelum dinyatakan selesai" | "Payout diproses sesuai [approved terms]" | "Otomatis cair setiap Jumat" |
| "Detail proses dapat berubah setelah dry-run" | "Sesi live dijalankan pada [date/platform]" | "Live rutin / penjualan terjamin" |

### 2.3 Consignor One-Pager (from PILOT_CONSIGNOR_ONE_PAGER.md)
| Current Draft Claim | Evidence Gate | Status |
|---------------------|---------------|--------|
| "Kami cek satu per satu" | QC SOP + dry-run | PROPOSED |
| "Nilai bersih dibahas sebelum item ditawarkan" | C-03 consent per item | PROPOSED |
| "Kamu menerima pembaruan sesuai mekanisme pilot" | Update SOP + contact channel | PROPOSED |
| No address, hours, pickup promise, hygiene, payout timing, estimator, testimonials, prototype links | — | COMPLIANT (omits NOT APPROVED) |

---

## 3. Evidence Tracking Per Claim

| Claim ID | Evidence Type | Evidence Location | Collected | Verified By | Verified At | Approved For Use |
|----------|---------------|-------------------|-----------|-------------|-------------|------------------|
| CL-01 | Pilot scope doc + operator name | `docs/PILOT_BUSINESS_MODEL_AND_ECONOMICS.md` §7 | Partial | — | — | ❌ |
| CL-03 | Custody log + QC record | Controlled ledger (not built) | ❌ | — | — | ❌ |
| CL-04 | Price agreement log + C-03 consent | Controlled ledger (not built) | ❌ | — | — | ❌ |
| CL-05 | Scope + capacity + contact | Pilot cohort definition (E-15) | ❌ | — | — | ❌ |
| CL-06 | Courier agreement + pricing | E-05 | ❌ | — | — | ❌ |
| CL-07 | Lease/permission + calendar | E-03 | ❌ | — | — | ❌ |
| CL-08 | Steamer specs + SOP + test result | E-12 | ❌ | — | — | ❌ |
| CL-09 | Payment flow + bank proof + reconciliation | E-06, E-07, E-18 | ❌ | — | — | ❌ |
| CL-10 | Escrow model + legal opinion | E-09, E-10 | ❌ | — | — | ❌ |
| CL-11 | Pilot measured data + calculator review | Weeks 3-4 pilot scorecard | ❌ | — | — | ❌ |
| CL-12 | Auditable results + approved method | Day-30 decision rule | ❌ | — | — | ❌ |
| CL-13 | Consented feedback + attribution | Close-out review (Week 4) | ❌ | — | — | ❌ |
| CL-14 | Signed partner agreements | E-05, E-06, E-13 | ❌ | — | — | ❌ |
| CL-15 | WABA + callback logs | E-19 | ❌ | — | — | ❌ |
| CL-16 | Payment ref + order record | Controlled ledger | ❌ | — | — | ❌ |
| CL-17 | Bank proof + reconciliation | Payout SOP + E-07 | ❌ | — | — | ❌ |
| CL-18 | Provider tracking + status | Courier integration (E-05) | ❌ | — | — | ❌ |
| CL-19 | Dry-run 50-item prep | Team dry-run checklist | ❌ | — | — | ❌ |
| CL-20 | Pilot terms + C-07 consent | Legal review (E-09, E-10) | ❌ | — | — | ❌ |
| CL-21 | Accepted items + net payout | QC SOP + C-03 | ❌ | — | — | ❌ |
| CL-22 | Host terms + payroll | E-13 | ❌ | — | — | ❌ |
| CL-23 | Measured contribution + costs | Pilot scorecard Weeks 3-4 | ❌ | — | — | ❌ |
| CL-24 | Courier terms + reconciliation | E-05 + fulfillment SOP | ❌ | — | — | ❌ |
| CL-25 | Auth/RBAC + RLS + no seeds | E-20, E-21 | ❌ | — | — | ❌ |

---

## 4. Claim Lifecycle Rules

1. **No claim moves to APPROVED without:** evidence collected + verified by owner + legal review (if consumer-facing) + founder sign-off (if financial/legal).
2. **CONDITIONAL claims** are instance-specific. Using them as general marketing claims requires upgrading to APPROVED.
3. **PROPOSED claims** are internal planning language only. External use requires "sedang diuji / pilot terbatas" qualifier and owner approval.
4. **NOT APPROVED claims** must be removed from all external surfaces (website, decks, social, comms) immediately.
5. **Claim register is updated** before any new external copy is published (per Brand Identity §10 checklist).
6. **Weekly claim audit** during pilot: Ren reviews register against actual external copy; discrepancies flagged and corrected in 24h.

---

## 5. Quick Reference: What to Say vs. What Not to Say

| Situation | Safe Response | Unsafe Response |
|-----------|---------------|-----------------|
| Consignor asks "kapan uang cair?" | "Jadwal dan mekanisme pencairan akan kami jelaskan sebelum item Anda masuk proses penjualan." | "Setiap Jumat otomatis cair." |
| Consignor asks "benar gratis jemput?" | "Opsi penyerahan akan kami konfirmasi setelah cek kapasitas dan area Anda." | "Ya, gratis kalau ≥20 pcs." |
| Consignor asks "disteam >100°C kan?" | "Item akan melalui pengecekan dan penanganan sesuai proses pilot yang disepakati." | "Ya, kami steam >100°C biar steril." |
| Buyer asks "baju ini asli bersih?" | "Setiap item dicek kondisinya sebelum ditawarkan. Detail kondisi tersedia untuk item ini." | "Sudah distem >100°C, pasti bersih." |
| Partner asks "kapan live rutin?" | "Kami menjalankan sesi terkontrol setelah persiapan selesai. Jadwal akan dikonfirmasi." | "Live tiap hari jam 8 malam." |
| Anyone asks "berapa untungnya?" | "Nilai bersih dibahas per item yang diterima. Ini pilot, jadi kami ukur dulu datanya." | "Rata-rata Rp32.5k–52.5k per potong." |
| Press asks "sudah berapa penitip?" | "Kami menjalankan pilot terbatas dengan cohort kecil. Data akan kami bagikan setelah selesai." | "Ratusan perempuan sudah bergabung." |

---

## 6. Escalation for Claim Questions

| Question Type | Escalate To | SLA |
|---------------|-------------|-----|
| Legal terms, consumer rights, tax, payment custody, loss/damage, refund/return, data handling | Legal owner (via Ren) | 24h |
| Financial claim (payout, escrow, earnings, commission) | Finance owner (via Ren) | 24h |
| Operational claim (pickup, hygiene, capacity, schedule) | Ops owner (Ren) | 4h |
| Partner claim (naming partner, partnership status) | Ren + partner owner | 24h |
| Marketing/brand claim (testimonials, traction, scale) | Kei + Ren | 4h |

**Default safe response while checking:**  
"Yang bisa kami pastikan saat ini adalah [verified fact]. Untuk [uncertain point], kami cek dulu dan kembali dengan detailnya paling lambat [waktu]."

---

## 7. Version & Approval

| Version | Date | Author | Change Summary | Approved By |
|---------|------|--------|----------------|-------------|
| 0.1 (draft) | 2026-09-10 | Ren | Initial claim register from audit evidence, risk register, brand guide, FAQ | — |

**Next review:** Weekly during pilot; before any new external asset publication.