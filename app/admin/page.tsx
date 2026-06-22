"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import {
  Users, DollarSign, TrendingUp, RefreshCw, Trash, Home,
  Loader2, ClipboardList, BarChart3,
} from "lucide-react";
import type { Lead, Payment, AuditRequest } from "@/types";

function formatCurrency(centavos: number): string {
  return `₱${(centavos / 100).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function getChartData(items: { createdAt: string }[], days = 7) {
  const result: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result[d.toISOString().split("T")[0]] = 0;
  }
  items.forEach((item) => {
    const day = item.createdAt.split("T")[0];
    if (day in result) result[day]++;
  });
  return Object.entries(result).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en-PH", { month: "short", day: "numeric" }),
    count,
  }));
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-100 text-green-700" :
    score >= 60 ? "bg-blue-100 text-blue-700" :
    score >= 35 ? "bg-amber-100 text-amber-700" :
    "bg-red-100 text-red-700";
  const label =
    score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 35 ? "Needs Work" : "Critical";
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${color}`}>
      {score}/100 · {label}
    </span>
  );
}

const LEAD_STATUS = { new: "bg-blue-100 text-blue-700", contacted: "bg-amber-100 text-amber-700", converted: "bg-green-100 text-green-700" };
const PAYMENT_STATUS = { pending: "bg-amber-100 text-amber-700", paid: "bg-green-100 text-green-700", failed: "bg-red-100 text-red-700", expired: "bg-gray-100 text-gray-500" };
const AUDIT_STATUS = { new: "bg-blue-100 text-blue-700", reviewed: "bg-purple-100 text-purple-700", contacted: "bg-green-100 text-green-700" };

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [audits, setAudits] = useState<AuditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [l, p, a] = await Promise.all([
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/payments").then((r) => r.json()),
        fetch("/api/audit").then((r) => r.json()),
      ]);
      setLeads(l.leads || []);
      setPayments(p.payments || []);
      setAudits(a.audits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdateLeadStatus = async (id: string, status: Lead["status"]) => {
    setUpdatingId(id);
    await fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setUpdatingId(null);
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await fetch("/api/leads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleUpdateAuditStatus = async (id: string, status: AuditRequest["status"]) => {
    setUpdatingId(id);
    await fetch("/api/audit", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setAudits((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setUpdatingId(null);
  };

  // Stats
  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const avgAuditScore = audits.length > 0 ? Math.round(audits.reduce((s, a) => s + a.scores.overall, 0) / audits.length) : 0;
  const newAudits = audits.filter((a) => a.status === "new").length;

  const stats = [
    { label: "Total Leads", value: leads.length, sub: `${leads.filter((l) => l.status === "new").length} new`, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Total Revenue", value: formatCurrency(totalRevenue), sub: `${payments.filter((p) => p.status === "paid").length} paid`, icon: DollarSign, color: "text-green-600 bg-green-50" },
    { label: "Audit Requests", value: audits.length, sub: `${newAudits} unreviewed`, icon: ClipboardList, color: "text-purple-600 bg-purple-50" },
    { label: "Avg. Audit Score", value: avgAuditScore > 0 ? `${avgAuditScore}/100` : "—", sub: "across all requests", icon: BarChart3, color: "text-amber-600 bg-amber-50" },
  ];

  const leadsChartData = getChartData(leads);
  const auditsChartData = getChartData(audits);
  const revenueChartData = getChartData(payments.filter((p) => p.status === "paid")).map((d) => ({
    ...d,
    revenue: payments.filter((p) => p.status === "paid")
      .filter((p) => new Date(p.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" }) === d.date)
      .reduce((s, p) => s + p.amount / 100, 0),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-amber-400 font-bold text-sm">G</span>
            </div>
            <div>
              <h1 className="font-bold text-blue-900 text-lg">GrowthForge Admin</h1>
              <p className="text-gray-400 text-xs">Leads · Audits · Revenue</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={fetchData} className="border-gray-200 text-gray-600">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </Button>
            <Link href="/audit">
              <Button size="sm" variant="outline" className="border-amber-300 text-amber-600 hover:bg-amber-50">
                🎁 Audit Page
              </Button>
            </Link>
            <Link href="/">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white">
                <Home className="w-3.5 h-3.5 mr-1.5" /> Website
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color} mb-3`}>
                        <s.icon className="w-4 h-4" />
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{s.value}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                      <p className="text-gray-500 text-xs">{s.sub}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-gray-700">New Leads — 7 Days</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={leadsChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1d4ed8" radius={[3, 3, 0, 0]} name="Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-gray-700">Audit Requests — 7 Days</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={auditsChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#9333ea" radius={[3, 3, 0, 0]} name="Audits" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-gray-700">Revenue — 7 Days (₱)</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v: number) => [`₱${v.toLocaleString()}`, "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="audits">
              <TabsList className="bg-white border border-gray-200">
                <TabsTrigger value="audits">🎯 Audits ({audits.length})</TabsTrigger>
                <TabsTrigger value="leads">📋 Leads ({leads.length})</TabsTrigger>
                <TabsTrigger value="payments">💳 Payments ({payments.length})</TabsTrigger>
              </TabsList>

              {/* Audits Table */}
              <TabsContent value="audits">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    {audits.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>No audit requests yet.</p>
                        <Link href="/audit" className="text-blue-500 text-sm hover:underline">Share the audit page →</Link>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Business</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Industry</TableHead>
                              <TableHead>Overall Score</TableHead>
                              <TableHead>Category Scores</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {audits.map((audit) => (
                              <TableRow key={audit.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <div>
                                    <p className="font-semibold text-blue-900 text-sm">{audit.businessName}</p>
                                    <p className="text-gray-400 text-xs">{audit.city}</p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <p className="text-gray-700 text-sm">{audit.name}</p>
                                    <p className="text-gray-400 text-xs">{audit.email}</p>
                                    {audit.phone && <p className="text-gray-400 text-xs">{audit.phone}</p>}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-gray-600 text-xs">{audit.industry || "—"}</span>
                                </TableCell>
                                <TableCell>
                                  <ScoreBadge score={audit.scores.overall} />
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-0.5 text-xs text-gray-500 min-w-[120px]">
                                    {[
                                      { label: "Web", val: audit.scores.website },
                                      { label: "Social", val: audit.scores.social },
                                      { label: "SEO", val: audit.scores.localSeo },
                                      { label: "Rep", val: audit.scores.reputation },
                                      { label: "Ads", val: audit.scores.advertising },
                                    ].map((c) => (
                                      <div key={c.label} className="flex items-center gap-1.5">
                                        <span className="w-8 shrink-0">{c.label}</span>
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                          <div className={`h-full rounded-full ${c.val >= 60 ? "bg-green-500" : c.val >= 35 ? "bg-amber-500" : "bg-red-500"}`}
                                            style={{ width: `${c.val}%` }} />
                                        </div>
                                        <span className="w-6 text-right">{c.val}</span>
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-gray-500 text-xs">{formatDate(audit.createdAt)}</span>
                                </TableCell>
                                <TableCell>
                                  <Select value={audit.status}
                                    onValueChange={(v) => handleUpdateAuditStatus(audit.id, v as AuditRequest["status"])}
                                    disabled={updatingId === audit.id}>
                                    <SelectTrigger className={`w-28 h-7 text-xs border-0 ${AUDIT_STATUS[audit.status]} font-semibold`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="reviewed">Reviewed</SelectItem>
                                      <SelectItem value="contacted">Contacted</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Leads Table */}
              <TabsContent value="leads">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    {leads.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>No leads yet. Share your website to start receiving inquiries!</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Name & Business</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Service</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {leads.map((lead) => (
                              <TableRow key={lead.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <p className="font-semibold text-blue-900 text-sm">{lead.name}</p>
                                  <p className="text-gray-400 text-xs">{lead.business}</p>
                                </TableCell>
                                <TableCell>
                                  <p className="text-gray-700 text-sm">{lead.email}</p>
                                  {lead.phone && <p className="text-gray-400 text-xs">{lead.phone}</p>}
                                </TableCell>
                                <TableCell>
                                  <span className="text-gray-600 text-sm capitalize">{lead.service || "—"}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-gray-500 text-sm">{formatDate(lead.createdAt)}</span>
                                </TableCell>
                                <TableCell>
                                  <Select value={lead.status}
                                    onValueChange={(v) => handleUpdateLeadStatus(lead.id, v as Lead["status"])}
                                    disabled={updatingId === lead.id}>
                                    <SelectTrigger className={`w-28 h-7 text-xs border-0 ${LEAD_STATUS[lead.status]} font-semibold`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="contacted">Contacted</SelectItem>
                                      <SelectItem value="converted">Converted</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm"
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 h-7 w-7 p-0">
                                    <Trash className="w-3.5 h-3.5" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Table */}
              <TabsContent value="payments">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    {payments.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p>No payments yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead>Customer</TableHead>
                              <TableHead>Plan</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Method</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {payments.map((payment) => (
                              <TableRow key={payment.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <p className="font-semibold text-blue-900 text-sm">{payment.customerName}</p>
                                  <p className="text-gray-400 text-xs">{payment.customerEmail}</p>
                                </TableCell>
                                <TableCell><span className="font-medium text-gray-700 text-sm">{payment.planName}</span></TableCell>
                                <TableCell><span className="font-bold text-green-700 text-sm">{formatCurrency(payment.amount)}</span></TableCell>
                                <TableCell><span className="text-gray-500 text-sm capitalize">{payment.paymentMethod ? payment.paymentMethod.replace("_", " ") : "—"}</span></TableCell>
                                <TableCell><span className="text-gray-500 text-sm">{formatDate(payment.createdAt)}</span></TableCell>
                                <TableCell>
                                  <Badge className={`text-xs border-0 ${PAYMENT_STATUS[payment.status]}`}>
                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
