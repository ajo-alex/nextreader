-- ==============================================================================
-- NEXTREADER DATABASE SCHEMA
-- Migration: 00001_initial_schema.sql
-- Description: Core schema, enums, tables, constraints, indexes & RLS policies
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Custom Types / Enums
-- ------------------------------------------------------------------------------
CREATE TYPE lending_type AS ENUM ('free', 'rental', 'exchange');
CREATE TYPE book_condition AS ENUM ('like_new', 'very_good', 'good', 'acceptable');
CREATE TYPE availability_status AS ENUM ('available', 'reserved', 'on_loan', 'unavailable');

CREATE TYPE loan_request_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled', 'expired');
CREATE TYPE loan_status AS ENUM (
  'reserved', 
  'awaiting_handover', 
  'borrowed', 
  'return_initiated', 
  'returned', 
  'overdue', 
  'disputed', 
  'cancelled'
);

CREATE TYPE exchange_status AS ENUM (
  'pending', 
  'accepted', 
  'rejected', 
  'cancelled', 
  'completed', 
  'disputed'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 
  'initiated', 
  'successful', 
  'failed', 
  'refund_pending', 
  'partially_refunded', 
  'refunded'
);

CREATE TYPE refund_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE dispute_status AS ENUM ('opened', 'under_review', 'resolved', 'dismissed');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'action_taken', 'dismissed');
CREATE TYPE app_role AS ENUM ('user', 'admin', 'moderator');

-- ------------------------------------------------------------------------------
-- 2. Profiles Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  city TEXT NOT NULL DEFAULT 'Kochi',
  locality TEXT NOT NULL DEFAULT 'Kakkanad',
  preferred_languages TEXT[] DEFAULT ARRAY['English'],
  preferred_genres TEXT[] DEFAULT ARRAY['Fiction', 'Technology'],
  reputation_score NUMERIC(3, 2) DEFAULT 5.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. User Roles Table (Server-controlled permissions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Helper function to check if current auth user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 4. Books Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  publisher TEXT,
  edition TEXT,
  publication_year INT,
  language TEXT NOT NULL DEFAULT 'English',
  genre TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT NOT NULL,
  condition book_condition NOT NULL DEFAULT 'good',
  lending_type lending_type NOT NULL DEFAULT 'free',
  rental_price NUMERIC(10, 2) DEFAULT 0.00,
  security_deposit NUMERIC(10, 2) DEFAULT 0.00,
  lending_duration_days INT NOT NULL DEFAULT 14,
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  approximate_latitude DOUBLE PRECISION,
  approximate_longitude DOUBLE PRECISION,
  availability_status availability_status NOT NULL DEFAULT 'available',
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Book Images Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS book_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Loan Requests Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS loan_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  request_type lending_type NOT NULL DEFAULT 'free',
  requested_duration_days INT NOT NULL DEFAULT 14,
  message TEXT,
  status loan_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Active Loans Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES loan_requests(id) ON DELETE SET NULL,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  borrower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date TIMESTAMPTZ NOT NULL,
  handover_confirmed_at TIMESTAMPTZ,
  return_initiated_at TIMESTAMPTZ,
  returned_at TIMESTAMPTZ,
  handover_notes TEXT,
  return_condition_notes TEXT,
  status loan_status NOT NULL DEFAULT 'reserved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure a book cannot have multiple overlapping active loans
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_book_loan
ON loans (book_id)
WHERE status IN ('reserved', 'awaiting_handover', 'borrowed', 'return_initiated', 'overdue');

-- ------------------------------------------------------------------------------
-- 8. Book Exchange Proposals Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exchange_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  offered_book_id UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  requested_book_id UUID NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
  proposer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  handover_arrangement TEXT,
  message TEXT,
  status exchange_status NOT NULL DEFAULT 'pending',
  proposer_confirmed_at TIMESTAMPTZ,
  recipient_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Wishlists Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- ------------------------------------------------------------------------------
-- 10. Book Wanted Requests ("Looking For This Book")
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS book_wanted_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT,
  language TEXT NOT NULL DEFAULT 'English',
  city TEXT NOT NULL,
  locality TEXT NOT NULL,
  note TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. Conversations & Messages Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  related_request_id UUID REFERENCES loan_requests(id) ON DELETE SET NULL,
  related_exchange_id UUID REFERENCES exchange_proposals(id) ON DELETE SET NULL,
  related_book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 12. Notifications Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  link_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. Reviews Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('loan', 'exchange')),
  transaction_id UUID NOT NULL,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (transaction_type, transaction_id, reviewer_id)
);

-- ------------------------------------------------------------------------------
-- 14. Payments Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  loan_id UUID REFERENCES loans(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  provider_order_id TEXT,
  provider_payment_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  rental_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  platform_commission NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_type TEXT NOT NULL DEFAULT 'rental_and_deposit',
  status payment_status NOT NULL DEFAULT 'pending',
  is_dev_mode BOOLEAN NOT NULL DEFAULT FALSE,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. Refunds Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  provider_refund_id TEXT,
  status refund_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 16. Disputes Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('loan', 'exchange')),
  transaction_id UUID NOT NULL,
  reported_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_photos TEXT[],
  status dispute_status NOT NULL DEFAULT 'opened',
  resolution TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 17. Reports Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 18. Audit Logs Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 19. Indexes for Query Performance
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_books_owner ON books(owner_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(availability_status);
CREATE INDEX IF NOT EXISTS idx_books_city ON books(city);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_lending_type ON books(lending_type);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_loan_requests_owner ON loan_requests(owner_id);
CREATE INDEX IF NOT EXISTS idx_loan_requests_borrower ON loan_requests(borrower_id);
CREATE INDEX IF NOT EXISTS idx_loan_requests_status ON loan_requests(status);

CREATE INDEX IF NOT EXISTS idx_loans_book ON loans(book_id);
CREATE INDEX IF NOT EXISTS idx_loans_owner ON loans(owner_id);
CREATE INDEX IF NOT EXISTS idx_loans_borrower ON loans(borrower_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_loan ON payments(loan_id);

-- ------------------------------------------------------------------------------
-- 20. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_wanted_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can view profiles; users can update only their own profile
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Books: Visible to everyone if not hidden, or if user is owner/admin
CREATE POLICY "Books viewable by everyone if not hidden" 
ON books FOR SELECT USING (NOT is_hidden OR auth.uid() = owner_id OR is_admin(auth.uid()));

CREATE POLICY "Users can insert their own books" 
ON books FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own books" 
ON books FOR UPDATE USING (auth.uid() = owner_id OR is_admin(auth.uid()));

CREATE POLICY "Users can delete their own books" 
ON books FOR DELETE USING (auth.uid() = owner_id OR is_admin(auth.uid()));

-- Book images
CREATE POLICY "Book images viewable by everyone" 
ON book_images FOR SELECT USING (true);

CREATE POLICY "Book images editable by owner" 
ON book_images FOR ALL USING (
  EXISTS (SELECT 1 FROM books WHERE books.id = book_images.book_id AND books.owner_id = auth.uid())
);

-- Loan Requests: Only owner, borrower or admin can view
CREATE POLICY "Loan requests viewable by participants" 
ON loan_requests FOR SELECT USING (
  auth.uid() = owner_id OR auth.uid() = borrower_id OR is_admin(auth.uid())
);

CREATE POLICY "Borrowers can create loan requests" 
ON loan_requests FOR INSERT WITH CHECK (auth.uid() = borrower_id AND auth.uid() <> owner_id);

CREATE POLICY "Participants can update loan requests" 
ON loan_requests FOR UPDATE USING (
  auth.uid() = owner_id OR auth.uid() = borrower_id OR is_admin(auth.uid())
);

-- Loans: Only owner, borrower or admin can view
CREATE POLICY "Loans viewable by participants" 
ON loans FOR SELECT USING (
  auth.uid() = owner_id OR auth.uid() = borrower_id OR is_admin(auth.uid())
);

CREATE POLICY "Owner or admin can update loan" 
ON loans FOR UPDATE USING (
  auth.uid() = owner_id OR auth.uid() = borrower_id OR is_admin(auth.uid())
);

-- Exchange Proposals
CREATE POLICY "Exchange proposals viewable by participants" 
ON exchange_proposals FOR SELECT USING (
  auth.uid() = proposer_id OR auth.uid() = recipient_id OR is_admin(auth.uid())
);

CREATE POLICY "Users can propose exchanges" 
ON exchange_proposals FOR INSERT WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Participants can update exchange proposals" 
ON exchange_proposals FOR UPDATE USING (
  auth.uid() = proposer_id OR auth.uid() = recipient_id OR is_admin(auth.uid())
);

-- Wishlists: Users view and manage only their own wishlist
CREATE POLICY "Users view own wishlist" 
ON wishlists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users manage own wishlist" 
ON wishlists FOR ALL USING (auth.uid() = user_id);

-- Wanted requests: Public can view, owner can insert/update
CREATE POLICY "Wanted requests viewable by everyone" 
ON book_wanted_requests FOR SELECT USING (true);

CREATE POLICY "Users create own wanted requests" 
ON book_wanted_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own wanted requests" 
ON book_wanted_requests FOR UPDATE USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Conversations & Messages
CREATE POLICY "Participants can view conversations" 
ON conversations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = conversations.id 
    AND conversation_participants.user_id = auth.uid()
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Participants view conversation participants" 
ON conversation_participants FOR SELECT USING (
  user_id = auth.uid() OR is_admin(auth.uid()) OR EXISTS (
    SELECT 1 FROM conversation_participants cp 
    WHERE cp.conversation_id = conversation_participants.conversation_id 
    AND cp.user_id = auth.uid()
  )
);

CREATE POLICY "Participants can view messages" 
ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id = auth.uid()
  ) OR is_admin(auth.uid())
);

CREATE POLICY "Participants can send messages" 
ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id = auth.uid()
  )
);

-- Notifications: Private to recipient
CREATE POLICY "Users view own notifications" 
ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications" 
ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Reviews: Viewable by all, insertable only by participant
CREATE POLICY "Reviews viewable by everyone" 
ON reviews FOR SELECT USING (true);

CREATE POLICY "Verified participants create reviews" 
ON reviews FOR INSERT WITH CHECK (
  auth.uid() = reviewer_id AND reviewer_id <> reviewee_id
);

-- Payments & Refunds
CREATE POLICY "Users view own payments" 
ON payments FOR SELECT USING (auth.uid() = user_id OR is_admin(auth.uid()));

CREATE POLICY "Users view refunds for their payments" 
ON refunds FOR SELECT USING (
  EXISTS (SELECT 1 FROM payments WHERE payments.id = refunds.payment_id AND (payments.user_id = auth.uid() OR is_admin(auth.uid())))
);

-- Disputes & Reports
CREATE POLICY "Participants view disputes" 
ON disputes FOR SELECT USING (
  auth.uid() = reported_by OR is_admin(auth.uid())
);

CREATE POLICY "Users submit disputes" 
ON disputes FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins manage disputes" 
ON disputes FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Users create reports" 
ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins view and manage reports" 
ON reports FOR ALL USING (is_admin(auth.uid()));

-- User roles: Only admins view and modify roles
CREATE POLICY "Admins manage roles" 
ON user_roles FOR ALL USING (is_admin(auth.uid()));

-- Audit logs: Only admins view audit logs
CREATE POLICY "Admins view audit logs" 
ON audit_logs FOR SELECT USING (is_admin(auth.uid()));

