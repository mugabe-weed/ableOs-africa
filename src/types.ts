export type ActiveApp =
  | "dashboard"
  | "copilot"
  | "biz_creator"
  | "opp_engine"
  | "api_platform"
  | "scanner_engine"
  | "cert_system"
  | "fintech"
  | "transport"
  | "interview_coach"
  | "digital_id"
  | "sign_language"
  | "market_intelligence"
  | "tourism"
  | "content_creator"
  | "incubator"
  | "offline_vault";

export interface OfflineDocument {
  id: string;
  title: string;
  category: "Business Blueprint" | "Regional Tender" | "Micro Note" | "Fintech Invoice";
  content: string;
  lastUpdated: string;
  synchronized: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "jarvis";
  text: string;
  timestamp: string;
  isVoice?: boolean;
}

export interface BusinessPlan {
  businessName: string;
  tagline: string;
  marketAnalysis: string;
  businessModel: string;
  disabilityLeverage: string;
  initialSteps: string[];
  momoPricingStrategy: string;
  draftProposalHook: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type: "Grant" | "Scholarship" | "Tender" | "Fellowship" | "Remote Job" | "Funding";
  provider: string;
  amount: string;
  deadline: string;
  region: string;
  eligibility: string[];
  matchedPercentage: number;
}

export interface DeveloperApiKey {
  id: string;
  key: string;
  label: string;
  createdOn: string;
  callsThisMonth: number;
  status: "Active" | "Revoked";
}

export interface ScannedViolation {
  element: string;
  severity: "CRITICAL" | "WARNING" | "PASS";
  wcagPrinciple: string;
  description: string;
  remediation: string;
}

export interface ScannerResult {
  score: number;
  criticalViolations: ScannedViolation[];
  improvements: string[];
  deviceCompliance: {
    keyboardNavigation: string;
    screenReaderOptimized: string;
    contrastGuidelines: string;
  };
}

export interface CertificationBusiness {
  id: string;
  name: string;
  industry: string;
  region: string;
  accessibilityScore: number;
  status: "Certified" | "Pending" | "Auditing";
  badgeName: "Gold AAA" | "Silver AA" | "Bronze A";
  auditFrequency: string;
}

export interface WalletTransaction {
  id: string;
  type: "Payout" | "Grant Deposit" | "Invoiced Out" | "Crowdfund Match" | "Mobile Money Out";
  amount: number;
  provider: "MTN MoMo" | "Airtel Money" | "Stripe" | "Bank Transfer";
  status: "Completed" | "Processing" | "Failed";
  refCode: string;
  date: string;
}

export interface AccessibleTaxi {
  id: string;
  driverName: string;
  vehicleType: string;
  accessibilityFeatures: string[];
  distanceMinutes: number;
  rating: number;
  status: "Available" | "En Route" | "Busy";
}

export interface SignLanguageSymbol {
  word: string;
  keyframes: string[]; // Mock vector frames represented as SVG translations or canvas indices
  description: string;
}

export interface TourismSpot {
  id: string;
  name: string;
  category: "Hotel" | "Restaurant" | "Nature Trail" | "Museum";
  region: string;
  accessibilityRating: number; // 1-5 stars
  features: string[];
  priceRange: string;
}

export interface IncubatorStartup {
  id: string;
  title: string;
  founder: string;
  stage: "Ideation" | "MVP Completed" | "Early Scaling" | "Series Seed";
  description: string;
  mentorsBooked: string[];
  investorInterestPercentage: number;
  fundingWanted: string;
}
