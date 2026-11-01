import { 
  Profile, Book, Loan, LoanRequest, ExchangeProposal, 
  WishlistItem, BookWantedRequest, Conversation, Message, 
  NotificationItem, Review, PaymentRecord, DisputeRecord, ReportRecord,
  LendingType, BookCondition, AvailabilityStatus, LoanStatus, ExchangeStatus
} from "@/types/database";

import {
  initialProfiles, initialBooks, initialLoans, initialLoanRequests,
  initialExchangeProposals, initialWishlists, initialWantedRequests,
  initialReviews, initialNotifications, initialConversations,
  initialMessages, initialPayments, initialDisputes, initialReports
} from "./mock-db";

// Global in-memory storage for realistic persistence in development
class DataRepository {
  private profiles: Profile[] = [...initialProfiles];
  private books: Book[] = [...initialBooks];
  private loans: Loan[] = [...initialLoans];
  private loanRequests: LoanRequest[] = [...initialLoanRequests];
  private exchangeProposals: ExchangeProposal[] = [...initialExchangeProposals];
  private wishlists: WishlistItem[] = [...initialWishlists];
  private wantedRequests: BookWantedRequest[] = [...initialWantedRequests];
  private reviews: Review[] = [...initialReviews];
  private notifications: NotificationItem[] = [...initialNotifications];
  private conversations: Conversation[] = [...initialConversations];
  private messages: Message[] = [...initialMessages];
  private payments: PaymentRecord[] = [...initialPayments];
  private disputes: DisputeRecord[] = [...initialDisputes];
  private reports: ReportRecord[] = [...initialReports];

  // Active simulated logged-in user (default: Arun Varma, can be switched in UI or auth)
  private currentUserId: string = "a0000000-0000-0000-0000-000000000001";

  // ----------------------------------------------------------------------------
  // Profile & Current User
  // ----------------------------------------------------------------------------
  public async getCurrentUser(): Promise<Profile> {
    const user = this.profiles.find(p => p.id === this.currentUserId);
    if (!user) {
      return this.profiles[0];
    }
    return { ...user };
  }

  public async setCurrentUserId(userId: string): Promise<boolean> {
    const user = this.profiles.find(p => p.id === userId);
    if (user) {
      this.currentUserId = userId;
      return true;
    }
    return false;
  }

  public async getProfileById(id: string): Promise<Profile | null> {
    const p = this.profiles.find(u => u.id === id);
    return p ? { ...p } : null;
  }

  public async getAllUsers(): Promise<Profile[]> {
    return this.profiles.map(p => ({ ...p }));
  }

  public async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    const index = this.profiles.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Profile not found");
    this.profiles[index] = {
      ...this.profiles[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return { ...this.profiles[index] };
  }

  // ----------------------------------------------------------------------------
  // Books & Discovery
  // ----------------------------------------------------------------------------
  public async getBooks(filters?: {
    search?: string;
    genre?: string;
    language?: string;
    lending_type?: string;
    condition?: string;
    availability?: string;
    city?: string;
    locality?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    ownerId?: string;
  }): Promise<Book[]> {
    let result = this.books.filter(b => !b.is_hidden);

    if (filters?.ownerId) {
      result = result.filter(b => b.owner_id === filters.ownerId);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.isbn && b.isbn.toLowerCase().includes(q)) ||
        b.genre.toLowerCase().includes(q) ||
        b.locality.toLowerCase().includes(q)
      );
    }

    if (filters?.genre && filters.genre !== "All") {
      result = result.filter(b => b.genre.toLowerCase() === filters.genre?.toLowerCase());
    }

    if (filters?.language && filters.language !== "All") {
      result = result.filter(b => b.language.toLowerCase() === filters.language?.toLowerCase());
    }

    if (filters?.lending_type && filters.lending_type !== "All") {
      result = result.filter(b => b.lending_type === filters.lending_type);
    }

    if (filters?.condition && filters.condition !== "All") {
      result = result.filter(b => b.condition === filters.condition);
    }

    if (filters?.availability && filters.availability !== "All") {
      result = result.filter(b => b.availability_status === filters.availability);
    }

    if (filters?.city && filters.city !== "All") {
      result = result.filter(b => b.city.toLowerCase() === filters.city?.toLowerCase());
    }

    if (filters?.minPrice !== undefined) {
      result = result.filter(b => b.rental_price >= (filters.minPrice ?? 0));
    }

    if (filters?.maxPrice !== undefined) {
      result = result.filter(b => b.rental_price <= (filters.maxPrice ?? Infinity));
    }

    // Attach owner profiles
    const booksWithOwners = result.map(book => ({
      ...book,
      owner: this.profiles.find(p => p.id === book.owner_id)
    }));

    // Sorting
    switch (filters?.sortBy) {
      case "price_asc":
        booksWithOwners.sort((a, b) => a.rental_price - b.rental_price);
        break;
      case "price_desc":
        booksWithOwners.sort((a, b) => b.rental_price - a.rental_price);
        break;
      case "popular":
        booksWithOwners.sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0));
        break;
      case "newest":
      default:
        booksWithOwners.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return booksWithOwners;
  }

  public async getBookById(id: string): Promise<Book | null> {
    const book = this.books.find(b => b.id === id);
    if (!book) return null;
    return {
      ...book,
      owner: this.profiles.find(p => p.id === book.owner_id)
    };
  }

  public async createBook(data: Omit<Book, "id" | "created_at" | "updated_at">): Promise<Book> {
    const newBook: Book = {
      ...data,
      id: `b0000000-0000-0000-0000-${String(this.books.length + 1).padStart(12, "0")}`,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.books.unshift(newBook);
    return {
      ...newBook,
      owner: this.profiles.find(p => p.id === newBook.owner_id)
    };
  }

  public async updateBook(id: string, updates: Partial<Book>, actorId: string): Promise<Book> {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) throw new Error("Book not found");
    
    // Authorization check
    const current = this.books[index];
    const actor = this.profiles.find(p => p.id === actorId);
    if (current.owner_id !== actorId && actor?.role !== "admin") {
      throw new Error("Unauthorized to edit this book");
    }

    this.books[index] = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString()
    };

    return {
      ...this.books[index],
      owner: this.profiles.find(p => p.id === this.books[index].owner_id)
    };
  }

  public async deleteBook(id: string, actorId: string): Promise<boolean> {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    const current = this.books[index];
    const actor = this.profiles.find(p => p.id === actorId);
    if (current.owner_id !== actorId && actor?.role !== "admin") {
      throw new Error("Unauthorized to delete this book");
    }

    // Check if book has active loans
    const hasActiveLoan = this.loans.some(
      l => l.book_id === id && ["reserved", "awaiting_handover", "borrowed", "return_initiated", "overdue"].includes(l.status)
    );
    if (hasActiveLoan) {
      throw new Error("Cannot delete a book that is currently on active loan");
    }

    this.books.splice(index, 1);
    return true;
  }

  public async incrementBookViews(id: string): Promise<void> {
    const book = this.books.find(b => b.id === id);
    if (book) {
      book.view_count = (book.view_count || 0) + 1;
    }
  }

  // ----------------------------------------------------------------------------
  // Loan Requests & Lifecycle
  // ----------------------------------------------------------------------------
  public async createLoanRequest(data: {
    bookId: string;
    borrowerId: string;
    durationDays: number;
    message?: string;
  }): Promise<LoanRequest> {
    const book = this.books.find(b => b.id === data.bookId);
    if (!book) throw new Error("Book not found");

    if (book.owner_id === data.borrowerId) {
      throw new Error("You cannot borrow your own listed book");
    }

    if (book.availability_status !== "available") {
      throw new Error("Book is currently unavailable or already on loan");
    }

    // Check if borrower already has a pending request for this book
    const existingReq = this.loanRequests.find(
      r => r.book_id === data.bookId && r.borrower_id === data.borrowerId && r.status === "pending"
    );
    if (existingReq) {
      throw new Error("You already have an active pending request for this book");
    }

    const newReq: LoanRequest = {
      id: `req-${Date.now()}`,
      book_id: data.bookId,
      owner_id: book.owner_id,
      borrower_id: data.borrowerId,
      request_type: book.lending_type,
      requested_duration_days: data.durationDays,
      message: data.message || "",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.loanRequests.unshift(newReq);

    // Notify the owner
    const borrower = this.profiles.find(p => p.id === data.borrowerId);
    this.createNotification({
      userId: book.owner_id,
      type: "new_request",
      title: "New Borrowing Request Received",
      body: `${borrower?.display_name || "A reader"} requested to borrow "${book.title}" for ${data.durationDays} days.`,
      relatedEntityType: "loan_request",
      relatedEntityId: newReq.id,
      linkUrl: "/requests"
    });

    return {
      ...newReq,
      book,
      owner: this.profiles.find(p => p.id === book.owner_id),
      borrower
    };
  }

  public async acceptLoanRequest(requestId: string, actorId: string): Promise<Loan> {
    const req = this.loanRequests.find(r => r.id === requestId);
    if (!req) throw new Error("Request not found");

    const book = this.books.find(b => b.id === req.book_id);
    if (!book) throw new Error("Associated book not found");

    if (req.owner_id !== actorId) {
      throw new Error("Only the book owner can accept this request");
    }

    if (book.availability_status !== "available") {
      throw new Error("Book is already committed to another loan");
    }

    // Update request status
    req.status = "accepted";
    req.updated_at = new Date().toISOString();

    // Mark book as on_loan
    book.availability_status = "on_loan";
    book.updated_at = new Date().toISOString();

    // Calculate due date
    const startDate = new Date();
    const dueDate = new Date(startDate.getTime() + req.requested_duration_days * 86400000);

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      request_id: req.id,
      book_id: req.book_id,
      owner_id: req.owner_id,
      borrower_id: req.borrower_id,
      start_date: startDate.toISOString(),
      due_date: dueDate.toISOString(),
      status: "awaiting_handover",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.loans.unshift(newLoan);

    // Reject other pending requests for the same book
    this.loanRequests.forEach(otherReq => {
      if (otherReq.book_id === req.book_id && otherReq.id !== req.id && otherReq.status === "pending") {
        otherReq.status = "rejected";
        otherReq.updated_at = new Date().toISOString();
      }
    });

    // Notify borrower
    this.createNotification({
      userId: req.borrower_id,
      type: "request_accepted",
      title: "Your Book Request Was Accepted!",
      body: `Great news! The owner accepted your request for "${book.title}". Coordinate pickup via messages.`,
      relatedEntityType: "loan",
      relatedEntityId: newLoan.id,
      linkUrl: "/my-loans"
    });

    return {
      ...newLoan,
      book,
      owner: this.profiles.find(p => p.id === req.owner_id),
      borrower: this.profiles.find(p => p.id === req.borrower_id)
    };
  }

  public async rejectLoanRequest(requestId: string, actorId: string): Promise<boolean> {
    const req = this.loanRequests.find(r => r.id === requestId);
    if (!req) return false;

    if (req.owner_id !== actorId) {
      throw new Error("Only the book owner can reject this request");
    }

    req.status = "rejected";
    req.updated_at = new Date().toISOString();

    const book = this.books.find(b => b.id === req.book_id);
    this.createNotification({
      userId: req.borrower_id,
      type: "request_rejected",
      title: "Request Update",
      body: `The owner was unable to accept your request for "${book?.title || "the book"}".`,
      relatedEntityType: "loan_request",
      relatedEntityId: req.id,
      linkUrl: "/discover"
    });

    return true;
  }

  public async cancelLoanRequest(requestId: string, actorId: string): Promise<boolean> {
    const req = this.loanRequests.find(r => r.id === requestId);
    if (!req) return false;

    if (req.borrower_id !== actorId) {
      throw new Error("Only the borrower can cancel their pending request");
    }

    if (req.status !== "pending") {
      throw new Error("Cannot cancel a request that has already been resolved");
    }

    req.status = "cancelled";
    req.updated_at = new Date().toISOString();
    return true;
  }

  // Owner confirms book has been physically handed to the borrower
  public async confirmHandover(loanId: string, actorId: string, notes?: string): Promise<Loan> {
    const loan = this.loans.find(l => l.id === loanId);
    if (!loan) throw new Error("Loan not found");

    if (loan.owner_id !== actorId) {
      throw new Error("Only the book owner can confirm physical handover");
    }

    loan.status = "borrowed";
    loan.handover_confirmed_at = new Date().toISOString();
    loan.handover_notes = notes || null;
    loan.updated_at = new Date().toISOString();

    const book = this.books.find(b => b.id === loan.book_id);
    this.createNotification({
      userId: loan.borrower_id,
      type: "handover_confirmed",
      title: "Book Handover Confirmed",
      body: `Enjoy reading "${book?.title || "your book"}"! Remember to return it by ${new Date(loan.due_date).toLocaleDateString()}.`,
      relatedEntityType: "loan",
      relatedEntityId: loan.id,
      linkUrl: "/my-loans"
    });

    return { ...loan };
  }

  // Borrower marks return as initiated
  public async initiateReturn(loanId: string, actorId: string, conditionNotes?: string): Promise<Loan> {
    const loan = this.loans.find(l => l.id === loanId);
    if (!loan) throw new Error("Loan not found");

    if (loan.borrower_id !== actorId) {
      throw new Error("Only the borrower can initiate book return");
    }

    if (!["borrowed", "overdue"].includes(loan.status)) {
      throw new Error("Invalid loan status to initiate return");
    }

    loan.status = "return_initiated";
    loan.return_initiated_at = new Date().toISOString();
    loan.return_condition_notes = conditionNotes || null;
    loan.updated_at = new Date().toISOString();

    const book = this.books.find(b => b.id === loan.book_id);
    this.createNotification({
      userId: loan.owner_id,
      type: "return_initiated",
      title: "Return Initiated",
      body: `The borrower marked "${book?.title || "the book"}" as returned. Please inspect and confirm receipt.`,
      relatedEntityType: "loan",
      relatedEntityId: loan.id,
      linkUrl: "/my-lending"
    });

    return { ...loan };
  }

  // Owner confirms book receipt and closes loan
  public async confirmReturn(loanId: string, actorId: string, returnNotes?: string): Promise<Loan> {
    const loan = this.loans.find(l => l.id === loanId);
    if (!loan) throw new Error("Loan not found");

    if (loan.owner_id !== actorId) {
      throw new Error("Only the book owner can confirm the final return");
    }

    loan.status = "returned";
    loan.returned_at = new Date().toISOString();
    if (returnNotes) loan.return_condition_notes = returnNotes;
    loan.updated_at = new Date().toISOString();

    // Mark book back as available
    const book = this.books.find(b => b.id === loan.book_id);
    if (book) {
      book.availability_status = "available";
      book.updated_at = new Date().toISOString();
    }

    // Notify borrower
    this.createNotification({
      userId: loan.borrower_id,
      type: "return_confirmed",
      title: "Loan Completed!",
      body: `The owner confirmed receipt of "${book?.title || "the book"}". Leave a review to build community trust!`,
      relatedEntityType: "loan",
      relatedEntityId: loan.id,
      linkUrl: "/my-loans"
    });

    return { ...loan };
  }

  public async getLoans(options?: {
    userId?: string;
    asBorrower?: boolean;
    asOwner?: boolean;
    status?: string;
  }): Promise<Loan[]> {
    let result = [...this.loans];

    if (options?.userId) {
      if (options.asBorrower) {
        result = result.filter(l => l.borrower_id === options.userId);
      } else if (options.asOwner) {
        result = result.filter(l => l.owner_id === options.userId);
      } else {
        result = result.filter(l => l.borrower_id === options.userId || l.owner_id === options.userId);
      }
    }

    if (options?.status && options.status !== "All") {
      result = result.filter(l => l.status === options.status);
    }

    // Populate book and profiles
    return result.map(loan => ({
      ...loan,
      book: this.books.find(b => b.id === loan.book_id),
      owner: this.profiles.find(p => p.id === loan.owner_id),
      borrower: this.profiles.find(p => p.id === loan.borrower_id)
    }));
  }

  public async getLoanRequests(options?: {
    userId?: string;
    type?: "incoming" | "outgoing";
    status?: string;
  }): Promise<LoanRequest[]> {
    let result = [...this.loanRequests];

    if (options?.userId) {
      if (options.type === "incoming") {
        result = result.filter(r => r.owner_id === options.userId);
      } else if (options.type === "outgoing") {
        result = result.filter(r => r.borrower_id === options.userId);
      } else {
        result = result.filter(r => r.owner_id === options.userId || r.borrower_id === options.userId);
      }
    }

    if (options?.status && options.status !== "All") {
      result = result.filter(r => r.status === options.status);
    }

    return result.map(req => ({
      ...req,
      book: this.books.find(b => b.id === req.book_id),
      owner: this.profiles.find(p => p.id === req.owner_id),
      borrower: this.profiles.find(p => p.id === req.borrower_id)
    }));
  }

  // ----------------------------------------------------------------------------
  // Book Exchanges
  // ----------------------------------------------------------------------------
  public async createExchangeProposal(data: {
    offeredBookId: string;
    requestedBookId: string;
    proposerId: string;
    handoverArrangement?: string;
    message?: string;
  }): Promise<ExchangeProposal> {
    const offeredBook = this.books.find(b => b.id === data.offeredBookId);
    const requestedBook = this.books.find(b => b.id === data.requestedBookId);

    if (!offeredBook || !requestedBook) throw new Error("Books not found");
    if (offeredBook.owner_id !== data.proposerId) {
      throw new Error("You can only offer books from your own bookshelf");
    }
    if (requestedBook.owner_id === data.proposerId) {
      throw new Error("Cannot propose an exchange for your own book");
    }

    const proposal: ExchangeProposal = {
      id: `ex-${Date.now()}`,
      offered_book_id: data.offeredBookId,
      requested_book_id: data.requestedBookId,
      proposer_id: data.proposerId,
      recipient_id: requestedBook.owner_id,
      handover_arrangement: data.handoverArrangement || "",
      message: data.message || "",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.exchangeProposals.unshift(proposal);

    // Notify recipient
    const proposer = this.profiles.find(p => p.id === data.proposerId);
    this.createNotification({
      userId: requestedBook.owner_id,
      type: "exchange_proposal",
      title: "New Book Exchange Proposal",
      body: `${proposer?.display_name || "A reader"} proposed to exchange "${offeredBook.title}" for your "${requestedBook.title}".`,
      relatedEntityType: "exchange_proposal",
      relatedEntityId: proposal.id,
      linkUrl: "/requests"
    });

    return {
      ...proposal,
      offered_book: offeredBook,
      requested_book: requestedBook,
      proposer,
      recipient: this.profiles.find(p => p.id === requestedBook.owner_id)
    };
  }

  public async acceptExchangeProposal(proposalId: string, actorId: string): Promise<ExchangeProposal> {
    const proposal = this.exchangeProposals.find(p => p.id === proposalId);
    if (!proposal) throw new Error("Proposal not found");

    if (proposal.recipient_id !== actorId) {
      throw new Error("Only the recipient can accept this proposal");
    }

    proposal.status = "accepted";
    proposal.recipient_confirmed_at = new Date().toISOString();
    proposal.updated_at = new Date().toISOString();

    // Notify proposer
    this.createNotification({
      userId: proposal.proposer_id,
      type: "exchange_accepted",
      title: "Exchange Proposal Accepted!",
      body: `Your book exchange proposal was accepted. Connect via messages to arrange handover!`,
      relatedEntityType: "exchange_proposal",
      relatedEntityId: proposal.id,
      linkUrl: "/requests"
    });

    return { ...proposal };
  }

  public async getExchangeProposals(userId: string): Promise<ExchangeProposal[]> {
    const proposals = this.exchangeProposals.filter(
      p => p.proposer_id === userId || p.recipient_id === userId
    );

    return proposals.map(p => ({
      ...p,
      offered_book: this.books.find(b => b.id === p.offered_book_id),
      requested_book: this.books.find(b => b.id === p.requested_book_id),
      proposer: this.profiles.find(u => u.id === p.proposer_id),
      recipient: this.profiles.find(u => u.id === p.recipient_id)
    }));
  }

  // ----------------------------------------------------------------------------
  // Wishlist & Wanted Requests
  // ----------------------------------------------------------------------------
  public async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    const items = this.wishlists.filter(w => w.user_id === userId);
    return items.map(item => ({
      ...item,
      book: this.books.find(b => b.id === item.book_id)
    }));
  }

  public async toggleWishlist(userId: string, bookId: string): Promise<boolean> {
    const index = this.wishlists.findIndex(w => w.user_id === userId && w.book_id === bookId);
    if (index >= 0) {
      this.wishlists.splice(index, 1);
      return false; // Removed
    } else {
      this.wishlists.push({
        id: `w-${Date.now()}`,
        user_id: userId,
        book_id: bookId,
        created_at: new Date().toISOString()
      });
      return true; // Added
    }
  }

  public async getWantedRequests(): Promise<BookWantedRequest[]> {
    return this.wantedRequests.map(req => ({
      ...req,
      user: this.profiles.find(p => p.id === req.user_id)
    }));
  }

  public async createWantedRequest(data: {
    userId: string;
    title: string;
    author: string;
    language: string;
    city: string;
    locality: string;
    note?: string;
  }): Promise<BookWantedRequest> {
    const newReq: BookWantedRequest = {
      id: `want-${Date.now()}`,
      user_id: data.userId,
      title: data.title,
      author: data.author,
      language: data.language,
      city: data.city,
      locality: data.locality,
      note: data.note || null,
      status: "open",
      created_at: new Date().toISOString()
    };
    this.wantedRequests.unshift(newReq);
    return {
      ...newReq,
      user: this.profiles.find(p => p.id === data.userId)
    };
  }

  // ----------------------------------------------------------------------------
  // Messaging
  // ----------------------------------------------------------------------------
  public async getConversations(userId: string): Promise<Conversation[]> {
    return this.conversations.map(conv => {
      const messages = this.messages.filter(m => m.conversation_id === conv.id);
      const lastMessage = messages[messages.length - 1];
      return {
        ...conv,
        book: this.books.find(b => b.id === conv.related_book_id),
        last_message: lastMessage,
        participants: this.profiles.filter(p => p.id === "a0000000-0000-0000-0000-000000000001" || p.id === "a0000000-0000-0000-0000-000000000002")
      };
    });
  }

  public async getConversationMessages(conversationId: string): Promise<Message[]> {
    const list = this.messages.filter(m => m.conversation_id === conversationId);
    return list.map(m => ({
      ...m,
      sender: this.profiles.find(p => p.id === m.sender_id)
    }));
  }

  public async sendMessage(conversationId: string, senderId: string, body: string): Promise<Message> {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      body,
      created_at: new Date().toISOString()
    };
    this.messages.push(msg);
    return {
      ...msg,
      sender: this.profiles.find(p => p.id === senderId)
    };
  }

  // ----------------------------------------------------------------------------
  // Notifications
  // ----------------------------------------------------------------------------
  public async getUserNotifications(userId: string): Promise<NotificationItem[]> {
    return this.notifications.filter(n => n.user_id === userId);
  }

  public async markNotificationAsRead(id: string): Promise<boolean> {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  public async markAllNotificationsAsRead(userId: string): Promise<void> {
    const now = new Date().toISOString();
    this.notifications.forEach(n => {
      if (n.user_id === userId && !n.read_at) {
        n.read_at = now;
      }
    });
  }

  public createNotification(data: {
    userId: string;
    type: string;
    title: string;
    body: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    linkUrl?: string;
  }): NotificationItem {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.userId,
      type: data.type,
      title: data.title,
      body: data.body,
      related_entity_type: data.relatedEntityType || null,
      related_entity_id: data.relatedEntityId || null,
      link_url: data.linkUrl || null,
      read_at: null,
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    return notif;
  }

  // ----------------------------------------------------------------------------
  // Reviews & Reputation
  // ----------------------------------------------------------------------------
  public async getReviewsForUser(userId: string): Promise<Review[]> {
    const list = this.reviews.filter(r => r.reviewee_id === userId);
    return list.map(r => ({
      ...r,
      reviewer: this.profiles.find(p => p.id === r.reviewer_id)
    }));
  }

  public async createReview(data: {
    transactionType: "loan" | "exchange";
    transactionId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    if (data.reviewerId === data.revieweeId) {
      throw new Error("You cannot review yourself");
    }

    const existing = this.reviews.find(
      r => r.transaction_type === data.transactionType &&
           r.transaction_id === data.transactionId &&
           r.reviewer_id === data.reviewerId
    );
    if (existing) {
      throw new Error("You have already submitted a review for this transaction");
    }

    const review: Review = {
      id: `rev-${Date.now()}`,
      transaction_type: data.transactionType,
      transaction_id: data.transactionId,
      reviewer_id: data.reviewerId,
      reviewee_id: data.revieweeId,
      rating: Math.min(5, Math.max(1, data.rating)),
      comment: data.comment || "",
      created_at: new Date().toISOString()
    };

    this.reviews.unshift(review);

    // Recalculate reviewee's reputation score
    const userReviews = this.reviews.filter(r => r.reviewee_id === data.revieweeId);
    const avgScore = userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length;
    const reviewee = this.profiles.find(p => p.id === data.revieweeId);
    if (reviewee) {
      reviewee.reputation_score = Math.round(avgScore * 100) / 100;
    }

    return {
      ...review,
      reviewer: this.profiles.find(p => p.id === data.reviewerId)
    };
  }

  // ----------------------------------------------------------------------------
  // Payments & Security Deposits (Razorpay & Dev Mode)
  // ----------------------------------------------------------------------------
  public async createPayment(data: {
    userId: string;
    loanId?: string;
    rentalFee: number;
    securityDeposit: number;
    isDevMode?: boolean;
  }): Promise<PaymentRecord> {
    const commissionPercent = Number(process.env.PLATFORM_COMMISSION_PERCENTAGE) || 10;
    const platformCommission = Math.round((data.rentalFee * (commissionPercent / 100)) * 100) / 100;
    const totalAmount = data.rentalFee + data.securityDeposit + platformCommission;

    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      user_id: data.userId,
      loan_id: data.loanId || null,
      provider: "razorpay",
      provider_order_id: `order_${Math.random().toString(36).substring(2, 9)}`,
      amount: totalAmount,
      rental_fee: data.rentalFee,
      security_deposit: data.securityDeposit,
      platform_commission: platformCommission,
      currency: "INR",
      payment_type: "rental_and_deposit",
      status: data.isDevMode ? "successful" : "pending",
      is_dev_mode: data.isDevMode ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.payments.unshift(payment);
    return payment;
  }

  public async getPayments(userId?: string): Promise<PaymentRecord[]> {
    let list = [...this.payments];
    if (userId) {
      list = list.filter(p => p.user_id === userId);
    }
    return list.map(p => ({
      ...p,
      loan: this.loans.find(l => l.id === p.loan_id)
    }));
  }

  // ----------------------------------------------------------------------------
  // Disputes & Content Moderation
  // ----------------------------------------------------------------------------
  public async getDisputes(): Promise<DisputeRecord[]> {
    return this.disputes.map(d => ({
      ...d,
      reporter: this.profiles.find(p => p.id === d.reported_by)
    }));
  }

  public async createDispute(data: {
    transactionType: "loan" | "exchange";
    transactionId: string;
    reportedBy: string;
    reason: string;
    description: string;
  }): Promise<DisputeRecord> {
    const dispute: DisputeRecord = {
      id: `disp-${Date.now()}`,
      transaction_type: data.transactionType,
      transaction_id: data.transactionId,
      reported_by: data.reportedBy,
      reason: data.reason,
      description: data.description,
      status: "opened",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.disputes.unshift(dispute);
    return dispute;
  }

  public async resolveDispute(disputeId: string, adminId: string, resolution: string): Promise<DisputeRecord> {
    const dispute = this.disputes.find(d => d.id === disputeId);
    if (!dispute) throw new Error("Dispute not found");

    dispute.status = "resolved";
    dispute.resolution = resolution;
    dispute.resolved_by = adminId;
    dispute.resolved_at = new Date().toISOString();
    dispute.updated_at = new Date().toISOString();

    return { ...dispute };
  }

  // ----------------------------------------------------------------------------
  // Admin Metrics & Stats
  // ----------------------------------------------------------------------------
  public async getAdminMetrics() {
    const totalUsers = this.profiles.length;
    const totalBooks = this.books.length;
    const availableBooks = this.books.filter(b => b.availability_status === "available").length;
    const activeLoans = this.loans.filter(l => ["borrowed", "awaiting_handover", "reserved"].includes(l.status)).length;
    const completedLoans = this.loans.filter(l => l.status === "returned").length;
    const overdueLoans = this.loans.filter(l => l.status === "overdue").length;
    const pendingDisputes = this.disputes.filter(d => d.status === "opened" || d.status === "under_review").length;
    
    // Revenue calculated strictly from eligible completed payments
    const successfulPayments = this.payments.filter(p => p.status === "successful");
    const totalTransactionVolume = successfulPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalPlatformRevenue = successfulPayments.reduce((acc, p) => acc + p.platform_commission, 0);

    return {
      totalUsers,
      totalBooks,
      availableBooks,
      activeLoans,
      completedLoans,
      overdueLoans,
      pendingDisputes,
      totalTransactionVolume,
      totalPlatformRevenue,
      paymentCount: successfulPayments.length
    };
  }
}

// Singleton repository instance
const globalForRepo = global as unknown as { repository?: DataRepository };
export const repository = globalForRepo.repository ?? new DataRepository();
if (process.env.NODE_ENV !== "production") globalForRepo.repository = repository;

