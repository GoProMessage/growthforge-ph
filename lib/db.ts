// @ts-nocheck
/**
 * Database layer — Supabase (PostgreSQL)
 *
 * All functions are async and talk to Supabase.
 * When SUPABASE_URL / SUPABASE_SERVICE_KEY are not set,
 * read operations return empty arrays and writes throw a
 * clear "not configured" error so the UI degrades gracefully.
 */

import { getSupabase, isSupabaseReady } from "@/lib/supabase";
import type { Lead, Payment, AuditRequest } from "@/types";

// ─── Row → TypeScript mappers ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapLead(r: any): Lead {
  return {
    id: r.id,
    name: r.name,
    business: r.business,
    email: r.email,
    phone: r.phone ?? "",
    service: r.service ?? "",
    message: r.message ?? "",
    status: r.status ?? "new",
    createdAt: r.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPayment(r: any): Payment {
  return {
    id: r.id,
    checkoutId: r.checkout_id,
    planName: r.plan_name,
    amount: r.amount,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone ?? "",
    status: r.status ?? "pending",
    paymentMethod: r.payment_method ?? "",
    checkoutUrl: r.checkout_url ?? "",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapAudit(r: any): AuditRequest {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone ?? "",
    businessName: r.business_name,
    city: r.city ?? "",
    industry: r.industry ?? "",
    yearsInBusiness: r.years_in_business ?? "",
    employees: r.employees ?? "",
    monthlyRevenue: r.monthly_revenue ?? "",
    biggestChallenge: r.biggest_challenge ?? "",
    answers: r.answers ?? {},
    scores: r.scores ?? {},
    status: r.status ?? "new",
    createdAt: r.created_at,
  };
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  if (!isSupabaseReady) return [];
  const { data, error } = await getSupabase()
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapLead);
}

export async function addLead(
  lead: Omit<Lead, "id" | "createdAt" | "status">
): Promise<Lead> {
  const { data, error } = await getSupabase()
    .from("leads")
    .insert({
      name: lead.name,
      business: lead.business,
      email: lead.email,
      phone: lead.phone,
      service: lead.service,
      message: lead.message,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapLead(data);
}

export async function updateLeadStatus(
  id: string,
  status: Lead["status"]
): Promise<boolean> {
  const { error } = await getSupabase()
    .from("leads")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  const { error } = await getSupabase().from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}

// ─── Payments ────────────────────────────────────────────────────────────────

export async function getPayments(): Promise<Payment[]> {
  if (!isSupabaseReady) return [];
  const { data, error } = await getSupabase()
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapPayment);
}

export async function addPayment(
  payment: Omit<Payment, "id" | "createdAt" | "updatedAt" | "status">
): Promise<Payment> {
  const { data, error } = await getSupabase()
    .from("payments")
    .insert({
      checkout_id: payment.checkoutId,
      plan_name: payment.planName,
      amount: payment.amount,
      customer_name: payment.customerName,
      customer_email: payment.customerEmail,
      customer_phone: payment.customerPhone,
      payment_method: payment.paymentMethod,
      checkout_url: payment.checkoutUrl,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapPayment(data);
}

export async function updatePaymentStatus(
  checkoutId: string,
  status: Payment["status"],
  paymentMethod?: string
): Promise<boolean> {
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (paymentMethod) updates.payment_method = paymentMethod;
  const { error } = await getSupabase()
    .from("payments")
    .update(updates)
    .eq("checkout_id", checkoutId);
  if (error) throw new Error(error.message);
  return true;
}

// ─── Audits ──────────────────────────────────────────────────────────────────

export async function getAudits(): Promise<AuditRequest[]> {
  if (!isSupabaseReady) return [];
  const { data, error } = await getSupabase()
    .from("audits")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAudit);
}

export async function addAudit(
  audit: Omit<AuditRequest, "id" | "createdAt" | "status">
): Promise<AuditRequest> {
  const { data, error } = await getSupabase()
    .from("audits")
    .insert({
      name: audit.name,
      email: audit.email,
      phone: audit.phone,
      business_name: audit.businessName,
      city: audit.city,
      industry: audit.industry,
      years_in_business: audit.yearsInBusiness,
      employees: audit.employees,
      monthly_revenue: audit.monthlyRevenue,
      biggest_challenge: audit.biggestChallenge,
      answers: audit.answers,
      scores: audit.scores,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapAudit(data);
}

export async function updateAuditStatus(
  id: string,
  status: AuditRequest["status"]
): Promise<boolean> {
  const { error } = await getSupabase()
    .from("audits")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  return true;
}
