# NextReader

> **Every book deserves another reader.**  
> *Read it. Share it. Pass it on.*

NextReader is a production-minded, full-stack community-powered book-sharing web platform that connects people who own physical books with readers nearby. Instead of books sitting unread on private shelves, NextReader allows users to discover, lend, borrow, exchange, and rent physical copies with verified trust.

---

## 📚 Product Highlights & Key Features

### 1. Book Discovery & Community Search
- **Database-Backed Search:** Query books by title, author, keyword, ISBN, genre, language (including Malayalam and English), and city.
- **Multi-Faceted Filtering:** Free lending, paid rental, exchange proposals, condition ratings (Like New, Very Good, Good, Acceptable), and localities.
- **URL Parameter Sync:** All search filters and sort preferences are synchronized with URL search params for seamless sharing and bookmarking.
- **Privacy-Preserving Locations:** Public listings display approximate localities (e.g. *Kakkanad, Kochi* or *Indiranagar, Bengaluru*). Exact residential addresses are strictly protected.

### 2. Physical Lending & Loan Lifecycle Machine
NextReader implements a strict, server-enforced state machine:
```
[Listing Available] 
       │
       ▼ (Borrower Submits Request)
[Loan Request: Pending]
       │
       ▼ (Owner Accepts)
[Loan: Awaiting Handover] ─── (Owner Confirms Physical Handover) ──► [Loan: Borrowed]
                                                                         │
[Loan: Returned] ◄─── (Owner Confirms Inspection) ─── [Return Initiated] ┘
```
- **Concurrency Prevention:** Unique database constraints and server validations prevent overlapping active loans for the same physical book copy.
- **Physical Handover Confirmations:** The owner explicitly confirms when the book is physically passed to the borrower.
- **Due Date Tracking & Overdue Warnings:** Automatic calculation of return due dates with reminders.
- **Mutual Verified Reviews:** Only participants in completed eligible transactions can rate each other (1–5 stars) to build reputation scores.

### 3. Book Exchanges
- Propose one of your own bookshelf copies in return for another reader’s book.
- Validates that the offered book is owned by the proposer and not double-committed.

### 4. Transparent Paid Rentals & Security Deposits
- Supports Indian Rupee (INR) transactions.
- Clearly separates **Rental Fee**, **Refundable Security Deposit**, and **Platform Commission (10%)**.
- **Development Mode Fallback:** When Razorpay keys are omitted or `NEXT_PUBLIC_DEV_PAYMENT_MODE=true`, NextReader uses a transparent, clearly-labelled simulated payment adapter. Simulated transactions are never misrepresented as real payments.

### 5. Community Wanted Board ("Looking For This Book")
- Readers can post wanted book requests for rare regional titles, college textbooks, or out-of-print classics.
- Other community members who own the book can respond and list it directly.

### 6. Reader Dashboard & Management Workspaces
- **Overview Dashboard (`/dashboard`):** Real statistics, active borrowed copies, lent books, pending requests, and upcoming due dates.
- **My Books (`/my-books`):** Manage listed shelf copies with status tabs (*Available*, *Reserved*, *On Loan*, *Unavailable*).
- **My Loans (`/my-loans`):** Track borrowed books, view return due dates, initiate returns, and review lenders.
- **My Lending (`/my-lending`):** Confirm physical handovers, verify return condition, and access the dispute desk.
- **Requests (`/requests`):** Review incoming borrower requests, outgoing applications, and exchange proposals.
- **Messaging (`/messages`):** Chat with owners and borrowers to arrange meetup locations and handover details.
- **Notification Center (`/notifications`):** In-app real-time alerts with unread badges, mark as read, and direct action links.
- **Profile & Settings (`/profile`, `/settings`):** Manage reading preferences, bio, and privacy controls.

### 7. Administrative Console (`/admin`)
- **Server-Side Authorization:** Admin routes are locked down at the server level. Non-admin users are denied access.
- **Real Aggregate Metrics:** Total registered users, available books, active loans, overdue tracking, transaction volume, and platform revenue.
- **Moderation & Management:**
  - `/admin/users` — Reader management, verification status, and role inspection.
  - `/admin/books` — Catalogue moderation, condition audits, and listing controls.
  - `/admin/loans` — Realtime monitoring of circulating physical books.
  - `/admin/reports` — Dispute desk for condition discrepancies, damage claims, and deposit decisions.
  - `/admin/transactions` — Payment logs and platform commission reconciliation.
  - `/admin/settings` — Business rules and deposit guidelines.

---

## 🎨 Design System & Visual Palette

NextReader is designed to feel like a combination of a premium reading community and an editorial consumer platform.

- **Forest Green (`#244C3A`):** Brand anchor & primary interactive surfaces.
- **Deep Green (`#173729`):** High-contrast editorial titles and dark states.
- **Soft Sage (`#DCE8D8`):** Accents, pills, and subtle highlights.
- **Warm Cream (`#F8F5ED`):** Editorial page backgrounds.
- **Pure White (`#FFFFFF`):** High-contrast cards and dashboard modules.
- **Charcoal (`#252923`):** Accessible body copy and labels.
- **Muted Grey (`#777C75`):** Secondary metadata and timestamps.
- **Accent Orange (`#E99A55`):** Focused calls-to-action, warnings, and stars.
- **Surface Border (`#E7E5DC`):** Crisp, refined card borders.

---

## 🛠 Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Components by default, Server Actions).
- **Language:** TypeScript in strict mode.
- **Styling:** Tailwind CSS with custom editorial design tokens.
- **Icons:** [Lucide React](https://lucide.dev/).
- **Validation:** [Zod](https://zod.dev/) with safe server-side parsers.
- **Database & Auth:** PostgreSQL schema with Supabase (migrations provided with full Row Level Security).
- **Testing:** Node.js native test runner (`node:test`, `node:assert`).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+ (Node.js 22/24 recommended)
- npm or pnpm

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/nextreader.git
cd nextreader
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Description | Default in Dev |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Base application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Optional in dev |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anon Key | Optional in dev |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Server Service Role Key | Optional in dev |
| `NEXT_PUBLIC_DEV_PAYMENT_MODE` | Toggle development payment simulator | `true` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret Key | (server-only) |
| `PLATFORM_COMMISSION_PERCENTAGE` | Platform commission on paid rentals (%) | `10` |

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **💡 Zero-Config Local Dev Mode:**  
> NextReader includes a built-in stateful repository pre-seeded with 22 diverse physical books (including Malayalam literature such as *Aadujeevitham*, *Chemmeen*, *Khasakkinte Itihasam*, and *Randamoozham*), realistic readers, active loans, and reviews. You can immediately test all workflows out of the box without needing external database keys!

### 5. Interactive Test Profile Switcher
Use the profile switcher in the top navigation bar to test the application from different perspectives:
- **Arun Varma:** Reader & book owner in Kakkanad, Kochi (has active borrowed & lent books).
- **Diya Menon:** Speculative fiction reader in Fort Kochi.
- **Rahul Sharma:** Tech & product bookshelf owner in Indiranagar, Bengaluru.
- **Ananya Iyer:** Literature student in Palarivattom.
- **NextReader Team (Admin):** Platform operator with full access to `/admin`.

---

## 🗄 Database Schema & Supabase Setup

Version-controlled SQL migrations are located in `supabase/migrations/`:
1. `00001_initial_schema.sql`: Complete PostgreSQL tables, enums, unique constraints, foreign keys, indexes, and Row Level Security (RLS) policies.
2. `00002_seed_data.sql`: 22 sample book listings across genres and languages, sample loans across all lifecycle states, reviews, wishlists, and notifications.

### Applying to Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in the Supabase Dashboard.
3. Paste and run `00001_initial_schema.sql`.
4. Paste and run `00002_seed_data.sql`.
5. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.

---

## 🧪 Automated Testing

Run the automated test suite verifying core business rules:
```bash
npm test
```

### Test Coverage Includes:
- **Authentication & Authorization:** Non-admin route restrictions, preventing modification of other users' books, and blocking self-borrowing.
- **Lending State Machine:** Concurrency conflict prevention, owner-only handover/return confirmations, and overdue identification.
- **Book Exchanges:** Offered book ownership validation and proposal acceptance.
- **Payments:** Platform fee, rental fee, deposit math, and dev payment flagging.
- **Search & Filters:** Case-insensitive search, language filtering, and lending type filtering.

---

## 🌐 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the environment variables from `.env.example`.
4. Deploy! NextReader is configured for Next.js App Router on Vercel.

---

## 📄 License
MIT © NextReader Community. Every book deserves another reader.

