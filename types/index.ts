export interface Lead {
  id: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: "new" | "contacted" | "converted";
  createdAt: string;
}

export interface Payment {
  id: string;
  checkoutId: string;
  planName: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: "pending" | "paid" | "failed" | "expired";
  paymentMethod: string;
  checkoutUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditAnswers {
  // Step 3
  hasWebsite: "yes" | "no" | "";
  isMobileFriendly: "yes" | "no" | "not-sure" | "";
  hasGoogleBusiness: "yes" | "no" | "not-sure" | "";
  platforms: string[];
  postingFrequency: "regularly" | "sometimes" | "rarely" | "never" | "";
  hasReviews: "many" | "few" | "none" | "";
  respondsToReviews: "yes" | "no" | "no-reviews" | "";
  runningAds: string[];
  // Step 4
  primaryGoal: string;
  monthlyBudget: string;
}

export interface AuditRequest {
  id: string;
  // Step 1
  name: string;
  email: string;
  phone: string;
  businessName: string;
  city: string;
  // Step 2
  industry: string;
  yearsInBusiness: string;
  employees: string;
  monthlyRevenue: string;
  biggestChallenge: string;
  // Audit answers (steps 3+4)
  answers: AuditAnswers;
  // Computed scores
  scores: AuditScores;
  status: "new" | "reviewed" | "contacted";
  createdAt: string;
}

export interface AuditScores {
  website: number;
  social: number;
  localSeo: number;
  reputation: number;
  advertising: number;
  overall: number;
}

export interface DbData {
  leads: Lead[];
  payments: Payment[];
  audits: AuditRequest[];
}
