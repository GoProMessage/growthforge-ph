// @ts-nocheck
import type { AuditAnswers, AuditScores } from "@/types";

export function calculateAuditScore(answers: AuditAnswers): AuditScores {
  // ── Website (0-100) ──────────────────────────────────────────────────────
  let website = 0;
  if (answers.hasWebsite === "yes") {
    website += 55;
    if (answers.isMobileFriendly === "yes") website += 45;
    else if (answers.isMobileFriendly === "not-sure") website += 15;
  }

  // ── Social Media (0-100) ─────────────────────────────────────────────────
  let social = 0;
  const activePlatforms = answers.platforms.filter((p) => p !== "none").length;
  social += Math.min(activePlatforms * 20, 60);
  if (answers.postingFrequency === "regularly") social += 40;
  else if (answers.postingFrequency === "sometimes") social += 20;
  else if (answers.postingFrequency === "rarely") social += 5;

  // ── Local SEO (0-100) ────────────────────────────────────────────────────
  let localSeo = 0;
  if (answers.hasGoogleBusiness === "yes") localSeo += 65;
  else if (answers.hasGoogleBusiness === "not-sure") localSeo += 15;
  if (answers.hasWebsite === "yes") localSeo += 35;

  // ── Reputation (0-100) ───────────────────────────────────────────────────
  let reputation = 0;
  if (answers.hasReviews === "many") reputation += 60;
  else if (answers.hasReviews === "few") reputation += 25;
  if (answers.respondsToReviews === "yes") reputation += 40;
  else if (answers.respondsToReviews === "no") reputation += 0; // has reviews but ignores them

  // ── Advertising (0-100) ──────────────────────────────────────────────────
  let advertising = 0;
  const activeAds = answers.runningAds.filter((a) => a !== "none").length;
  advertising = Math.min(activeAds * 50, 100);

  // Cap all at 100, floor at 0
  const cap = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
  website = cap(website);
  social = cap(social);
  localSeo = cap(localSeo);
  reputation = cap(reputation);
  advertising = cap(advertising);

  const overall = cap(
    Math.round((website + social + localSeo + reputation + advertising) / 5)
  );

  return { website, social, localSeo, reputation, advertising, overall };
}

export interface Recommendation {
  category: string;
  score: number;
  priority: "critical" | "high" | "medium";
  title: string;
  description: string;
  emoji: string;
}

export function getRecommendations(
  scores: AuditScores,
  answers: AuditAnswers
): Recommendation[] {
  const recs: Recommendation[] = [];

  if (scores.website < 50) {
    recs.push({
      category: "Website",
      score: scores.website,
      priority: scores.website < 20 ? "critical" : "high",
      emoji: "🌐",
      title: answers.hasWebsite === "no"
        ? "Create a Professional Website"
        : "Optimize Your Website for Mobile",
      description: answers.hasWebsite === "no"
        ? "85% of Filipino consumers look up businesses online before buying. A website builds instant credibility and generates leads 24/7."
        : "Over 70% of PH internet users browse on mobile. A mobile-optimized site dramatically improves conversions and Google ranking.",
    });
  }

  if (scores.localSeo < 60) {
    recs.push({
      category: "Local SEO",
      score: scores.localSeo,
      priority: scores.localSeo < 30 ? "critical" : "high",
      emoji: "📍",
      title: answers.hasGoogleBusiness !== "yes"
        ? "Claim Your Google Business Profile (Free!)"
        : "Optimize Your Local SEO",
      description: answers.hasGoogleBusiness !== "yes"
        ? "Google Business Profile is completely free and puts your business on Google Maps. Businesses with GBP get 7× more clicks than those without."
        : "Optimize your Google Business Profile with photos, posts, and keywords to rank higher in local searches across your city.",
    });
  }

  if (scores.reputation < 50) {
    recs.push({
      category: "Reputation",
      score: scores.reputation,
      priority: scores.reputation < 25 ? "critical" : "high",
      emoji: "⭐",
      title: answers.hasReviews === "none"
        ? "Start Collecting Customer Reviews"
        : "Respond to Every Customer Review",
      description: answers.hasReviews === "none"
        ? "93% of consumers read reviews before choosing a business. Even 5 genuine Google reviews can set you apart from competitors."
        : "Responding to reviews (especially negative ones) shows professionalism and increases customer trust by up to 45%.",
    });
  }

  if (scores.social < 50) {
    recs.push({
      category: "Social Media",
      score: scores.social,
      priority: "high",
      emoji: "📱",
      title: activePlatformCount(answers) === 0
        ? "Set Up Facebook & Instagram"
        : "Post Consistently on Social Media",
      description: activePlatformCount(answers) === 0
        ? "Facebook and Instagram are where most Filipino customers discover new businesses. A consistent presence builds trust and drives inquiries."
        : "Businesses that post 3-5 times per week see 3× more engagement. A content calendar makes consistency easy.",
    });
  }

  if (scores.advertising < 30) {
    recs.push({
      category: "Advertising",
      score: scores.advertising,
      priority: "medium",
      emoji: "🎯",
      title: "Launch Targeted Facebook or Google Ads",
      description:
        "Even ₱500/day in Facebook Ads can reach thousands of your ideal customers in your city. Targeted ads deliver the fastest ROI for Philippine SMBs.",
    });
  }

  // Sort by priority, take top 3
  const priorityOrder = { critical: 0, high: 1, medium: 2 };
  return recs
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 4);
}

function activePlatformCount(answers: AuditAnswers): number {
  return answers.platforms.filter((p) => p !== "none").length;
}

export function getScoreLabel(score: number): {
  label: string;
  color: string;
  bgColor: string;
  message: string;
} {
  if (score >= 80)
    return {
      label: "Excellent",
      color: "text-green-600",
      bgColor: "bg-green-500",
      message: "Your digital presence is strong! Let's fine-tune it to maximize ROI.",
    };
  if (score >= 60)
    return {
      label: "Good",
      color: "text-blue-600",
      bgColor: "bg-blue-500",
      message: "You have a solid foundation. A few targeted improvements can significantly grow your business.",
    };
  if (score >= 35)
    return {
      label: "Needs Work",
      color: "text-amber-600",
      bgColor: "bg-amber-500",
      message: "There are clear opportunities to improve your online presence and attract more customers.",
    };
  return {
    label: "Critical",
    color: "text-red-600",
    bgColor: "bg-red-500",
    message: "Your business is missing out on significant online opportunities. Let's fix that fast!",
  };
}
