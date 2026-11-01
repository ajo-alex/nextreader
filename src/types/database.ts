export type LendingType = 'free' | 'rental' | 'exchange';
export type BookCondition = 'like_new' | 'very_good' | 'good' | 'acceptable';
export type AvailabilityStatus = 'available' | 'reserved' | 'on_loan' | 'unavailable';

export type LoanRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'expired';

export type LoanStatus = 
  | 'reserved' 
  | 'awaiting_handover' 
  | 'borrowed' 
  | 'return_initiated' 
  | 'returned' 
  | 'overdue' 
  | 'disputed' 
  | 'cancelled';

export type ExchangeStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'cancelled' 
  | 'completed' 
  | 'disputed';

export type PaymentStatus = 
  | 'pending' 
  | 'initiated' 
  | 'successful' 
  | 'failed' 
  | 'refund_pending' 
  | 'partially_refunded' 
  | 'refunded';

export type DisputeStatus = 'opened' | 'under_review' | 'resolved' | 'dismissed';
export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
export type UserRole = 'user' | 'admin' | 'moderator';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string;
  locality: string;
  preferred_languages: string[];
  preferred_genres: string[];
  reputation_score: number;
  created_at: string;
  updated_at: string;
  role?: UserRole;
}

export interface Book {
  id: string;
  owner_id: string;
  title: string;
  author: string;
  isbn?: string | null;
  publisher?: string | null;
  edition?: string | null;
  publication_year?: number | null;
  language: string;
  genre: string;
  description: string;
  cover_image_url: string;
  condition: BookCondition;
  lending_type: LendingType;
  rental_price: number;
  security_deposit: number;
  lending_duration_days: number;
  city: string;
  locality: string;
  approximate_latitude?: number | null;
  approximate_longitude?: number | null;
  availability_status: AvailabilityStatus;
  is_hidden?: boolean;
  view_count?: number;
  created_at: string;
  updated_at: string;
  owner?: Profile;
}

export interface BookImage {
  id: string;
  book_id: string;
  storage_path: string;
  display_order: number;
  created_at: string;
}

export interface LoanRequest {
  id: string;
  book_id: string;
  owner_id: string;
  borrower_id: string;
  request_type: LendingType;
  requested_duration_days: number;
  message?: string | null;
  status: LoanRequestStatus;
  created_at: string;
  updated_at: string;
  book?: Book;
  owner?: Profile;
  borrower?: Profile;
}

export interface Loan {
  id: string;
  request_id?: string | null;
  book_id: string;
  owner_id: string;
  borrower_id: string;
  start_date: string;
  due_date: string;
  handover_confirmed_at?: string | null;
  return_initiated_at?: string | null;
  returned_at?: string | null;
  handover_notes?: string | null;
  return_condition_notes?: string | null;
  status: LoanStatus;
  created_at: string;
  updated_at: string;
  book?: Book;
  owner?: Profile;
  borrower?: Profile;
}

export interface ExchangeProposal {
  id: string;
  offered_book_id: string;
  requested_book_id: string;
  proposer_id: string;
  recipient_id: string;
  handover_arrangement?: string | null;
  message?: string | null;
  status: ExchangeStatus;
  proposer_confirmed_at?: string | null;
  recipient_confirmed_at?: string | null;
  created_at: string;
  updated_at: string;
  offered_book?: Book;
  requested_book?: Book;
  proposer?: Profile;
  recipient?: Profile;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
  book?: Book;
}

export interface BookWantedRequest {
  id: string;
  user_id: string;
  title: string;
  author: string;
  isbn?: string | null;
  language: string;
  city: string;
  locality: string;
  note?: string | null;
  status: string;
  created_at: string;
  user?: Profile;
}

export interface Conversation {
  id: string;
  related_request_id?: string | null;
  related_exchange_id?: string | null;
  related_book_id?: string | null;
  created_at: string;
  updated_at: string;
  participants?: Profile[];
  last_message?: Message;
  book?: Book;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at?: string | null;
  sender?: Profile;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  related_entity_type?: string | null;
  related_entity_id?: string | null;
  link_url?: string | null;
  read_at?: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  transaction_type: 'loan' | 'exchange';
  transaction_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  reviewer?: Profile;
  reviewee?: Profile;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  loan_id?: string | null;
  provider: string;
  provider_order_id?: string | null;
  provider_payment_id?: string | null;
  amount: number;
  rental_fee: number;
  security_deposit: number;
  platform_commission: number;
  currency: string;
  payment_type: string;
  status: PaymentStatus;
  is_dev_mode: boolean;
  created_at: string;
  updated_at: string;
  loan?: Loan;
}

export interface DisputeRecord {
  id: string;
  transaction_type: 'loan' | 'exchange';
  transaction_id: string;
  reported_by: string;
  reason: string;
  description: string;
  evidence_photos?: string[];
  status: DisputeStatus;
  resolution?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
  reporter?: Profile;
}

export interface ReportRecord {
  id: string;
  reporter_id: string;
  reported_user_id?: string | null;
  reported_book_id?: string | null;
  reason: string;
  description: string;
  status: ReportStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  reporter?: Profile;
  reported_user?: Profile;
  reported_book?: Book;
}

