
CREATE SEQUENCE IF NOT EXISTS public.invoice_seq START 1;

CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_no TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  product TEXT,
  amount_paise BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created','paid','failed')),
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  error_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.payments TO service_role;
GRANT USAGE ON SEQUENCE public.invoice_seq TO service_role;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (which bypasses RLS) can access.
-- All client access is brokered through server functions that authorize the admin email.

CREATE INDEX payments_status_idx ON public.payments(status);
CREATE INDEX payments_created_at_idx ON public.payments(created_at DESC);
CREATE INDEX payments_customer_name_idx ON public.payments(lower(customer_name));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER payments_set_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
