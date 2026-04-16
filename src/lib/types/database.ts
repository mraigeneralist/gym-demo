export type UserRole = "member" | "admin";
export type MembershipPlan = "basic" | "pro" | "elite";
export type MembershipInterval = "monthly" | "3month" | "annual";
export type MembershipStatus = "active" | "expired" | "cancelled";
export type BookingStatus = "confirmed" | "waitlist" | "cancelled";

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  referral_code: string;
  role: UserRole;
  created_at: string;
}

export interface Membership {
  id: string;
  member_id: string;
  plan: MembershipPlan;
  interval: MembershipInterval;
  price: number;
  start_date: string;
  end_date: string;
  status: MembershipStatus;
  created_at: string;
  // joined
  profiles?: Profile;
}

export interface Trainer {
  id: string;
  name: string;
  bio: string;
  photo_url: string | null;
  specialties: string[];
  created_at: string;
}

export interface GymClass {
  id: string;
  name: string;
  type: string;
  instructor_id: string;
  day_of_week: number; // 0=Sunday, 6=Saturday
  start_time: string;
  end_time: string;
  capacity: number;
  description: string;
  created_at: string;
  // joined
  trainers?: Trainer;
}

export interface Booking {
  id: string;
  member_id: string;
  class_id: string;
  class_date: string;
  status: BookingStatus;
  created_at: string;
  // joined
  classes?: GymClass;
  profiles?: Profile;
}

export interface WaitlistEntry {
  id: string;
  member_id: string;
  class_id: string;
  class_date: string;
  position: number;
  created_at: string;
  // joined
  profiles?: Profile;
}

export interface WorkoutOfDay {
  id: string;
  date: string;
  title: string;
  description: string;
  exercises: Exercise[];
  created_by: string;
  created_at: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

export interface ProgressLog {
  id: string;
  member_id: string;
  date: string;
  weight: number | null;
  notes: string | null;
  metrics: ProgressMetrics;
  created_at: string;
}

export interface ProgressMetrics {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  body_fat?: number;
  bench_press?: number;
  squat?: number;
  deadlift?: number;
  [key: string]: number | undefined;
}

// Pricing data for membership plans
export interface PlanInfo {
  plan: MembershipPlan;
  name: string;
  monthlyPrice: number;
  prices: { interval: MembershipInterval; price: number; label: string }[];
  features: string[];
  highlighted?: boolean;
}

export const MEMBERSHIP_PLANS: PlanInfo[] = [
  {
    plan: "basic",
    name: "Basic",
    monthlyPrice: 29,
    prices: [
      { interval: "monthly", price: 29, label: "Monthly" },
      { interval: "3month", price: 79, label: "3 Months" },
      { interval: "annual", price: 290, label: "Annual" },
    ],
    features: [
      "Access to gym floor",
      "Locker room access",
      "2 classes per week",
      "Basic progress tracking",
    ],
  },
  {
    plan: "pro",
    name: "Pro",
    monthlyPrice: 49,
    prices: [
      { interval: "monthly", price: 49, label: "Monthly" },
      { interval: "3month", price: 135, label: "3 Months" },
      { interval: "annual", price: 490, label: "Annual" },
    ],
    features: [
      "Everything in Basic",
      "Unlimited classes",
      "Personal locker",
      "Nutrition guidance",
      "Progress analytics",
    ],
    highlighted: true,
  },
  {
    plan: "elite",
    name: "Elite",
    monthlyPrice: 79,
    prices: [
      { interval: "monthly", price: 79, label: "Monthly" },
      { interval: "3month", price: 219, label: "3 Months" },
      { interval: "annual", price: 790, label: "Annual" },
    ],
    features: [
      "Everything in Pro",
      "1-on-1 trainer sessions",
      "Recovery zone access",
      "Guest passes (2/month)",
      "Priority booking",
      "Exclusive events",
    ],
  },
];
