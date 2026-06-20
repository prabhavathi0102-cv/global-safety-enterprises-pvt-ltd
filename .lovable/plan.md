## Razorpay payment gateway — implementation plan

### 1. Backend setup (Lovable Cloud)
- Enable Lovable Cloud (Supabase) on the project.
- Add secrets: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `ADMIN_EMAIL` (your admin allowlist email). The Key ID is also exposed safely to the browser via a server fn — never the secret.
- Tables (with RLS + GRANTs):
  - `payments` — id, invoice_no, customer_name, company_name, email, phone, address, product, amount_paise, currency, status (`created|paid|failed`), razorpay_order_id, razorpay_payment_id, razorpay_signature, error_reason, created_at.
  - Sequence for invoice numbers: `INV-2026-00001`.
  - RLS: inserts/updates only via server functions (service role). Reads only by admin (email match against `ADMIN_EMAIL`) or via authenticated admin role check.

### 2. Customer checkout flow (`/payment`)
- Replace mock card/netbanking UI with a single Razorpay flow.
- Form fields: Name, Company, Email, Phone, Address, Product/Service, Amount.
- Zod validation client + server.
- "Pay Now" calls server fn `createRazorpayOrder` → creates order via Razorpay REST (`/v1/orders`) using HTTP Basic auth with key id + secret, inserts a `created` row in `payments`, returns `{ orderId, keyId, amount, currency, invoiceNo }`.
- Frontend dynamically loads `https://checkout.razorpay.com/v1/checkout.js`, opens Razorpay Checkout with UPI / Card / Netbanking / Wallet methods enabled and prefilled customer info.
- On checkout success → call `verifyRazorpayPayment` server fn with `{ order_id, payment_id, signature }`:
  - Verify HMAC-SHA256 signature against `RAZORPAY_KEY_SECRET`.
  - On valid: update row to `paid`, send confirmation email (Lovable Emails template), POST same data to existing `GOOGLE_SHEETS_WEBHOOK_URL`, return `{ ok, invoiceNo }`.
  - On invalid: mark `failed`.
- On checkout `payment.failed` event / dismiss → call `recordPaymentFailure` to update row to `failed`.
- UI shows "Payment Successful" with invoice no, or "Payment Failed. Please try again." with retry.

### 3. Confirmation email
- New React Email template `payment-confirmation.tsx` (invoice no, amount, product, customer name).
- Triggered from `verifyRazorpayPayment` via `/lovable/email/transactional/send` (service-role internal call).
- Requires Lovable Emails domain setup — I'll prompt you to set up the sender domain via the email-setup dialog after Cloud is enabled.

### 4. Admin dashboard (`/admin/payments`)
- Public route requiring login; access gated by `ADMIN_EMAIL` allowlist (server-fn middleware checks `claims.email === ADMIN_EMAIL`).
- Simple email/password sign-in at `/admin/login` (reuses Supabase auth).
- Stats: Total Payments (₹), Successful, Failed counts.
- Searchable, paginated table of all payments.
- "Export CSV" button — server fn returns CSV blob.

### 5. Files to add / change
- `supabase/migrations/<ts>_payments.sql` — table, sequence, RLS, GRANTs.
- `src/lib/payments.functions.ts` — createRazorpayOrder, verifyRazorpayPayment, recordPaymentFailure, listPayments, exportPaymentsCsv (admin-gated).
- `src/lib/email-templates/payment-confirmation.tsx` + registry update.
- `src/routes/payment.tsx` — replaced with Razorpay flow.
- `src/routes/admin/login.tsx`, `src/routes/_authenticated/admin/payments.tsx` (+ `_authenticated/route.tsx` if missing).
- Secrets via `add_secret`.

### 6. Out of scope (confirm if you want them)
- GST/tax fields on invoice PDF (currently invoice number only — no PDF).
- Refunds / partial payments.
- Multi-admin role table (using single email allowlist per your choice).

Reply "go" to proceed. I'll enable Cloud, then ask for your Razorpay keys + admin email.