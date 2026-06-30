-- ============================================================
-- GrowthForge PH — Supabase Schema
-- Paste this ENTIRE file into:
--   Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ─── Leads ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  business    TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  service     TEXT,
  message     TEXT,
  status      TEXT NOT NULL DEFAULT 'new',  -- new | contacted | converted | closed
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Payments ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_id      TEXT NOT NULL UNIQUE,
  plan_name        TEXT NOT NULL,
  amount           INTEGER NOT NULL,         -- in centavos (e.g. 999900 = ₱9,999)
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT,
  status           TEXT NOT NULL DEFAULT 'pending',  -- pending | completed | failed
  payment_method   TEXT,                     -- gcash | paymaya | card | grab_pay
  checkout_url     TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Audits ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audits (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT NOT NULL,
  email              TEXT NOT NULL,
  phone              TEXT,
  business_name      TEXT NOT NULL,
  city               TEXT,
  industry           TEXT,
  years_in_business  TEXT,
  employees          TEXT,
  monthly_revenue    TEXT,
  biggest_challenge  TEXT,
  answers            JSONB NOT NULL DEFAULT '{}',
  scores             JSONB NOT NULL DEFAULT '{}',
  status             TEXT NOT NULL DEFAULT 'new',  -- new | reviewed | converted
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS leads_email_idx    ON leads    (email);
CREATE INDEX IF NOT EXISTS leads_status_idx   ON leads    (status);
CREATE INDEX IF NOT EXISTS payments_checkout  ON payments (checkout_id);
CREATE INDEX IF NOT EXISTS audits_email_idx   ON audits   (email);

-- ─── Row Level Security (keep disabled for service-role access) ───
-- The app uses the SERVICE_ROLE key (server-only), which bypasses RLS.
-- Enable RLS + policies only if you add a public/client-side Supabase usage.

-- Done! You can now add your Supabase URL and service key to .env.local.
