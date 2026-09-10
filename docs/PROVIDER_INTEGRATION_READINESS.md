# PindahTangan — Provider Integration Readiness Map (P1)

**Task:** `t_f123f943` — Provider Integration Readiness: WA, Marketplace, Courier
**Status:** Planned backlog. **No connection, spend, or real-money operation without explicit approval against pilot gates (Gate B / Gate C).**
**Source basis:** Product & UX Audit (2026-09-09), Pilot Readiness Risk Register (R-07, R-08, R-13), Pilot Business Model & Economics Memo (§8), deployed code in `/src`.

---

## 1. WhatsApp Notification Provider

### 1.1 Current implementation (source of truth)
- **Library:** `src/lib/whatsapp.ts` — templates, dispatch engine, log schema
- **API route:** `src/app/api/whatsapp/send/route.ts` — provider selection, sandbox fallback
- **Log type:** `WhatsAppMessageLog` (eventType, recipientPhone, status, provider, sentAt)

### 1.2 Supported providers & sandbox contracts

| Provider | Env key | Sandbox / test mode | Documented API | Status in repo |
|---|---|---|---|---|
| **Fonnte** | `WHATSAPP_PROVIDER=fonnte` + `WHATSAPP_API_TOKEN` | No public sandbox; uses production token. Test by sending to own number. | `https://api.fonnte.com/send` (POST, `Authorization: <token>`, JSON `{target, message, url?}`) | Implemented, **untested** — token not configured |
| **Wablas** | `WHATSAPP_PROVIDER=wablas` + `WHATSAPP_API_TOKEN` | Device must be paired; test by sending to paired number. | `https://api.wablas.com/api/send-message` (POST, `Authorization: <token>`, JSON `{phone, message}`) | Implemented, **untested** — token not configured |
| **Sandbox (default)** | `WHATSAPP_PROVIDER=mock` or unset | Always available. Returns `status: 'simulated'`, provider `sandbox`. | N/A — local log entry only | **Active default** — no real delivery, no callback |

### 1.3 Delivery callbacks & idempotency (required before Gate B)

| Capability | Fonnte | Wablas | Sandbox | Required for pilot |
|---|---|---|---|---|
| **Webhook for delivery receipt (delivered/read/failed)** | Yes — `https://api.fonnte.com/callback` (configure in dashboard) | Yes — Wablas device webhook URL | N/A | **Required** — must persist `message_id`, `status`, `timestamp`, `error_code` to `WhatsAppMessageLog` |
| **Idempotency key on send** | Not native; generate `wa-<ts>-<rand>` client-side, store before send, deduplicate on callback | Same | N/A | **Required** — exactly-once log entry per business event |
| **Retry / exponential backoff** | Not native; implement in route (max 3, 1s/5s/30s) | Same | N/A | **Required** — log each attempt with `attempt_number` |
| **Template approval (WhatsApp Business API)** | Not applicable (Fonnte uses gateway number) | Not applicable (Wablas uses paired device) | N/A | **Required if moving to official BSP** — Meta template namespace, language, header/body/footer variables |

### 1.4 Event types that need real delivery (from `WhatsAppEventType`)

| Event | Trigger | Recipient | Current copy promise | Pilot gate |
|---|---|---|---|---|
| `BOOKING_CONFIRMATION` | Intake batch created | Consignor | “Kurir akan menghubungi 30 menit sebelum tiba” | **Gate B** — disable courier promise until courier partner confirmed |
| `QC_REJECT_ALERT` | Item rejected in studio | Consignor | Portal link for donate/reclaim | Gate B |
| `LIVE_SOLD_CONGRATS` | Host marks sold | Consignor | “Dana diamankan di escrow, transfer Jumat 16.00” | **Gate C** — no escrow/auto-transfer claim until bank workflow proven |
| `FRIDAY_PAYOUT_SLIP` | Payout batch executed | Consignor | “Status: LUNAS (Transferred)” | **Gate C** — only after bank reference + reconciliation |
| `ORDER_SHIPPED_BUYER` | Order dispatched | Buyer | “Paket diserahkan ke ekspedisi, resi terlampir” | Gate B — only with real tracking from courier |

### 1.5 Manual fallback (when provider unavailable)

1. **wa.me deep link** — `createDirectWhatsAppLink(phone, message)` opens WhatsApp Web/App with prefilled text. Operator copies/sends manually.
2. **Studio WhatsApp Activity Log** — UI at `/studio` or `/admin` shows queued messages with “Kirim manual” button opening wa.me link.
3. **Log entry** — status `queued`, provider `manual`, `sentAt` = operator click timestamp. Reconcile later with delivery proof (screenshot / recipient reply).

### 1.6 Open decisions (Founder Gate)
- [ ] Approve provider: Fonnte vs. Wablas vs. official WhatsApp Business API (BSP)
- [ ] Confirm token budget and monthly volume estimate for pilot cohort
- [ ] Decide: wa.me manual fallback is acceptable for pilot, or must be fully automated
- [ ] Legal: consent for WhatsApp notifications (opt-in recorded at intake)

---

## 2. Marketplace / Order Webhook Provider

### 2.1 Current implementation (source of truth)
- **Route:** `src/app/api/webhooks/orders/route.ts` (GET + POST)
- **Payload interface:** `WebhookOrderPayload` (event, source, sku, buyer_*, sold_price)
- **Supported sources:** `tiktok_shop_live`, `tokopedia`, `shopee`, `manual_simulator`
- **Current behaviour:** validates required fields, generates `ORD-<ts>-<rand>`, returns JSON — **no persistence, no signature verification, no idempotency**

### 2.2 Provider webhook contracts (what each platform actually sends)

| Platform | Webhook event | Signature / auth method | Idempotency key | Retry policy | Sandbox / test mode |
|---|---|---|---|---|---|
| **TikTok Shop** | `order.created`, `order.paid`, `order.cancelled` | HMAC-SHA256 (`X-TT-Signature`, `X-TT-Timestamp`) — secret from Seller Center | `order_id` (platform) + `event_type` | 3× over ~1h with backoff | **Yes** — TikTok Shop Sandbox (separate app, test orders) |
| **Tokopedia** | `order.create`, `order.paid`, `order.cancel` | HMAC-SHA256 (`X-Tokopedia-Signature`) — client secret | `order_id` + `event` | 5× over 24h | **Yes** — Tokopedia Playground (mock callbacks) |
| **Shopee** | `ORDER_CREATE`, `ORDER_PAY`, `ORDER_CANCEL` | HMAC-SHA256 (`X-Shopee-Signature`) — partner_key + shop_id | `ordersn` + `event_type` | 8× over 72h | **Yes** — Shopee Open Platform Sandbox |

### 2.3 Required implementation before any marketplace connection (Gate B)

| Requirement | Spec | Test evidence |
|---|---|---|
| **Signature verification** | Middleware per provider: verify HMAC, reject if timestamp > 5 min skew | Unit tests with valid/invalid/replayed signatures |
| **Idempotency persistence** | Table `webhook_events (idempotency_key PK, provider, event_type, payload_hash, received_at, processed_at, order_id FK)` | Replay same payload twice → exactly one `orders` row |
| **Durable order creation** | On `order.paid` / `ORDER_PAY`: insert `orders` row with `buyer_*`, `shipping_*`, `courier_name` (from payload or default), `tracking_number` NULL, `shipping_status = 'pending_pack'` | End-to-end: sandbox callback → DB row → admin UI shows order |
| **Source mapping** | Normalize each platform's payload to internal `WebhookOrderPayload` + store raw JSON in `webhook_events.raw_payload` | Schema validation test per platform |
| **Error handling** | 4xx for invalid signature/payload; 5xx logs error, returns 500 so platform retries; dead-letter after max retries | Chaos test: malformed JSON, missing fields, wrong HMAC |
| **Rate limiting** | Per-source IP / signature namespace (e.g., 100 req/min) | Load test |

### 2.4 Manual fallback (when webhook down or provider not integrated)

1. **Manual simulator endpoint** — POST to same route with `source: 'manual_simulator'` (already in type). Admin UI “Tambah Pesanan Manual” form creates identical payload.
2. **CSV import** — Admin uploads `orders.csv` (columns matching `WebhookOrderPayload`); server validates, deduplicates on `sku + buyer_handle + sold_price + date`, inserts with `source: 'manual_csv'`.
3. **Reconciliation log** — Every manual order tagged `manual_*` in `orders.source` and `webhook_events.provider` for audit.

### 2.5 Open decisions (Founder Gate)
- [ ] Which marketplace(s) for pilot: TikTok Shop Live only, or include Tokopedia/Shopee?
- [ ] Sandbox app credentials: who provisions TikTok Shop Sandbox / Tokopedia Playground / Shopee Sandbox?
- [ ] Webhook URL: use `https://pindahtangan-zeta.vercel.app/api/webhooks/orders` or a dedicated subdomain?
- [ ] Order-to-fulfilment SLA: how long after `order.paid` must dispatch happen? (impacts courier SLA)

---

## 3. Courier / Fulfilment Provider

### 3.1 Current implementation (source of truth)
- **Store method:** `PindahTanganStore.bulkDispatchOrders(orderIds, courierName)` at `store.ts:1647-1708`
- **Tracking generation:** Random digits with prefix by courier name (`JT` for J&T, `GS-SKB-` for Gosend, `0028` for SiCepat) — **placeholder, not real AWB**
- **Courier names in seed/data:** `J&T Express`, `SiCepat`, `Gosend Instant Sukabumi`, `J&T Express` (Bandung)
- **Shipping fee:** Hard-coded `10000` in `store.ts:1318`

### 3.2 Provider integration matrix

| Courier | Integration type | Sandbox / test | AWB format | Label printing | Pickup API | Rate card (pilot) | Status |
|---|---|---|---|---|---|---|---|
| **J&T Express** | API (J&T Open Platform) or drop-off | **Yes** — J&T Sandbox (staging env, test AWB) | `JT` + 10–12 digits | PDF/ZPL via API | **Yes** — schedule pickup, get pickup code | Need commercial agreement | **Not integrated** |
| **SiCepat** | API (SiCepat Enterprise) | **Yes** — SiCepat Sandbox | `0028` + digits | PDF via API | **Yes** | Need commercial agreement | **Not integrated** |
| **Gosend / Gojek (Instant)** | Gojek Logistics API (B2B) | **Limited** — no public sandbox; test with real driver in small area | `GS-SKB-` + digits | In-app only | **Yes** — instant dispatch | Per-km, dynamic | **Not integrated** |
| **Manual / Internal** | Driver WhatsApp / paper manifest | Always available | Hand-written / operator assigned | Paper | Phone call | Fixed per route | **Current fallback** |

### 3.3 Required integration capabilities (Gate B for any real dispatch)

| Capability | J&T | SiCepat | Gosend | Manual |
|---|---|---|---|---|
| **Create order → get real AWB** | POST `/api/v2/orders` → `awb_number`, `label_url` | POST `/api/order/create` → `awb`, `label` | POST `/goapi/v1/delivery/create` → `booking_id`, `tracking_url` | Operator assigns `MAN-<date>-<seq>` |
| **Print label (PDF/ZPL)** | Yes (label_url) | Yes | No (driver app only) | Paper template |
| **Schedule pickup** | POST `/api/v2/pickup` | POST `/api/pickup/create` | Instant — driver assigned auto | Phone / WhatsApp to driver |
| **Tracking webhook** | `status_change` → `delivered`, `failed`, `returned` | `status_update` webhook | `delivery_status` callback | Driver WhatsApp photo + recipient sig |
| **Proof of delivery (POD)** | Photo + signature in webhook payload | Photo in webhook | Photo in driver app | Photo on operator phone |
| **Idempotency** | `partner_reference` (our `order_number`) | `client_order_id` | `booking_id` (ours) | `MAN-<date>-<seq>` |
| **Rate / cost reconciliation** | Monthly statement + per-AWB fee in webhook | Monthly statement | Per-ride in callback | Cash / transfer to driver, logged manually |

### 3.4 Shipping fee & liability model (from Business Model Memo §4, §8)

- **Buyer pays shipping** — displayed separately at checkout / live sale confirmation.
- **Shipping is pass-through** — not GMV margin. Courier cost reconciled per AWB.
- **Liability for loss/damage/failed delivery** — courier contract terms; PindahTangan holds buyer shipping fee in trust until POD or exception resolved.
- **Failed delivery flow** — return to studio (consignor reclaim or relist), buyer refund, shipping fee refunded only if courier error.

### 3.5 Manual fallback (pilot default until integration proven)

1. **Operator pack → driver WhatsApp** — Admin prints packing slip (order_number, buyer_name, address, items), hands to driver.
2. **Driver returns photo of waybill + recipient signature** — uploaded to `/admin/orders/:id/pod` (new route).
3. **Tracking number** — `MAN-<YYYYMMDD>-<seq>` entered manually; status `shipped` only after POD photo uploaded.
4. **Reconciliation** — weekly courier invoice matched to `orders` with `courier_name = 'manual'` and `tracking_number LIKE 'MAN-%'`.

### 3.6 Open decisions (Founder Gate)
- [ ] Pilot courier: start with **manual/internal driver only** (simplest, zero integration risk), or integrate one API (J&T Sandbox)?
- [ ] Service area: confirm actual Sukabumi coverage (kecamatan list) with chosen provider.
- [ ] Shipping fee: fixed Rp10.000 or per-km? Who absorbs over/under?
- [ ] Liability cap per package (courier standard vs. declared value).

---

## 4. Cross-Provider Integration Rules (Gate B Checklist)

| # | Rule | Applies to | Evidence required |
|---|---|---|---|
| 1 | **No simulated status labelled as real** — `status: 'simulated'` never shown to consignor/buyer as “delivered/terkirim” | WA, Webhook, Courier | UI audit: every user-visible status maps to a real provider callback or manual proof |
| 2 | **Idempotency key on every outbound/inbound event** — generated before send, verified on callback | WA send, Webhook receive, Courier create | DB unique constraint + replay test |
| 3 | **Signed webhook verification** — HMAC with timestamp skew check on every inbound callback | Marketplace webhook, Courier tracking webhook, WA delivery receipt | Unit test matrix per provider |
| 4 | **Durable event log** — every provider interaction (request, response, callback, retry) stored with `provider`, `event_type`, `idempotency_key`, `raw_request`, `raw_response`, `status`, `attempt`, `created_at` | All three | Query log for any business event → full chain visible |
| 5 | **Manual fallback path documented and tested** — operator can complete the workflow without the provider | All three | Dry-run: provider down → manual path completes → audit trail matches |
| 6 | **No spend without approval** — provider tokens, sandbox credits, courier test shipments require explicit sign-off | All three | Approval record in Kanban / Notion |
| 7 | **No customer data sent to provider before consent** — phone, address, name only after intake agreement signed | WA, Courier | Consent record linked to `intake_batches` |

---

## 5. Implementation Sequence (if approved)

| Phase | Scope | Owner | Definition of Done |
|---|---|---|---|
| **0. Freeze & relabel** | Public copy: remove “WhatsApp delivered”, “courier akan hubungi”, “resi otomatis” until real | Ren + Kei | Live URL review — no false promise remains |
| **1. WhatsApp provider pick** | Choose Fonnte / Wablas / BSP; configure token in Vercel env; implement signature verification (if BSP) + callback persistence | Lyra | Sandbox: send 5 test messages → 5 `WhatsAppMessageLog` rows with `status: 'delivered'` + callback payloads |
| **2. Webhook hardening** | Add HMAC middleware per platform, `webhook_events` table, idempotency, durable order creation | Lyra | TikTok Shop Sandbox: 3 test callbacks (created, paid, cancelled) → 3 orders + 3 webhook_events, replay safe |
| **3. Courier decision** | Manual-first or J&T Sandbox integration | Lyra + Ren | If manual: POD upload flow works end-to-end. If J&T: sandbox AWB + label + pickup + tracking webhook → order status `delivered` |
| **4. Integration test suite** | Four journeys: booking→WA confirm, live sold→webhook→order, dispatch→courier→POD, payout→bank ref | Lyra | CI artifact: all four pass against staging with real provider sandboxes |
| **5. Gate B review** | Ren accepts evidence; Kei updates copy to match real capabilities | Ren | Signed Gate B exit evidence (checklist + test reports) |

---

## 6. Environment Variables Required (not committed)

```bash
# WhatsApp
WHATSAPP_PROVIDER=fonnte|wablas|mock
WHATSAPP_API_TOKEN=<provider token>
# If official BSP:
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_APP_SECRET=

# Marketplace webhooks (per platform)
TIKTOK_SHOP_APP_SECRET=
TOKOPEDIA_CLIENT_SECRET=
SHOPEE_PARTNER_KEY=
SHOPEE_SHOP_ID=

# Courier (per provider)
JT_CLIENT_ID=
JT_CLIENT_SECRET=
JT_SANDBOX=true
SICEPAT_CLIENT_ID=
SICEPAT_CLIENT_SECRET=
GOJEK_CLIENT_ID=
GOJEK_CLIENT_SECRET=
```

> **Never commit real tokens.** Use Vercel Environment Variables (Production / Preview / Development scopes). Sandbox tokens in Preview/Development only.

---

## 7. Risk & Mitigation Summary (from Risk Register)

| Risk ID | Risk | Current State | Mitigation (this doc) |
|---|---|---|---|
| **R-07** | Order webhook accepts any POST without signature/persistence | Stub only | §2.3: HMAC middleware, idempotency table, durable order creation, sandbox test matrix |
| **R-08** | WhatsApp delivery simulated while copy implies real contact | Sandbox default, wa.me fallback | §1.3: callback persistence required; §1.5: manual fallback logged; §1.6: copy freeze until real |
| **R-13** | Fulfilment generates random tracking numbers | `Math.random()` in store | §3.2: real AWB from provider API; §3.5: manual `MAN-` prefix with POD proof |

---

## 8. Sign-Off Before Any Live Connection

| Role | Name | Approval (Y/N) | Date | Notes |
|---|---|---|---|---|
| Founder (Akmal) | | | | Gate B/C authority |
| Tech Lead (Lyra) | | | | Implementation owner |
| Ops / PM (Ren) | | | | Process / copy / pilot scope |
| Finance / Legal | | | | Payment flow, liability, data consent |

**No provider token configured, no sandbox message sent, no webhook connected, no courier API called until this table has at least Founder + Tech Lead approval.**

---

*End of Provider Integration Readiness Map. This document is the single source of truth for P1 provider work. Update it when provider decisions change; do not scatter details across chat or untracked files.*