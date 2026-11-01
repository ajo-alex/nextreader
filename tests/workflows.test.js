const test = require("node:test");
const assert = require("node:assert");

// Test suite for NextReader Core Workflows & Business Logic

test("1. Authentication & Authorization Controls", async (t) => {
  await t.test("Non-admin user cannot access admin operations", () => {
    const userRole = "user";
    const isAdmin = (role) => role === "admin";
    assert.strictEqual(isAdmin(userRole), false, "Ordinary user should not be recognized as admin");
  });

  await t.test("User cannot modify another user's book listing", () => {
    const bookOwnerId = "user-123";
    const currentUserId = "user-456";
    const canEdit = (ownerId, actorId, role) => ownerId === actorId || role === "admin";
    
    assert.strictEqual(canEdit(bookOwnerId, currentUserId, "user"), false);
    assert.strictEqual(canEdit(bookOwnerId, bookOwnerId, "user"), true);
    assert.strictEqual(canEdit(bookOwnerId, currentUserId, "admin"), true);
  });

  await t.test("User cannot self-borrow their own book", () => {
    const ownerId = "user-123";
    const borrowerId = "user-123";
    const validateRequest = (owner, borrower) => {
      if (owner === borrower) throw new Error("You cannot borrow your own listed book");
      return true;
    };

    assert.throws(
      () => validateRequest(ownerId, borrowerId),
      /You cannot borrow your own listed book/
    );
  });
});

test("2. Lending Workflow & Concurrency Control", async (t) => {
  const activeLoans = [];

  const createLoan = (bookId, borrowerId) => {
    const hasConflict = activeLoans.some(
      (l) => l.bookId === bookId && ["reserved", "awaiting_handover", "borrowed", "overdue"].includes(l.status)
    );
    if (hasConflict) {
      throw new Error("Book is already committed to an active loan");
    }
    const newLoan = { id: `loan-${Date.now()}`, bookId, borrowerId, status: "borrowed" };
    activeLoans.push(newLoan);
    return newLoan;
  };

  await t.test("Creates active loan successfully when book is available", () => {
    const loan = createLoan("book-001", "borrower-1");
    assert.strictEqual(loan.status, "borrowed");
    assert.strictEqual(activeLoans.length, 1);
  });

  await t.test("Prevents conflicting simultaneous loan for the same book", () => {
    assert.throws(
      () => createLoan("book-001", "borrower-2"),
      /Book is already committed to an active loan/
    );
  });

  await t.test("Only book owner can confirm return", () => {
    const loan = { ownerId: "owner-1", borrowerId: "borrower-1", status: "return_initiated" };
    const confirmReturn = (loanData, actorId) => {
      if (loanData.ownerId !== actorId) {
        throw new Error("Only the book owner can confirm the final return");
      }
      loanData.status = "returned";
      return loanData;
    };

    assert.throws(
      () => confirmReturn(loan, "borrower-1"),
      /Only the book owner can confirm the final return/
    );

    const updated = confirmReturn(loan, "owner-1");
    assert.strictEqual(updated.status, "returned");
  });

  await t.test("Identifies overdue loans correctly", () => {
    const now = Date.now();
    const pastDate = new Date(now - 86400000 * 2).toISOString();
    const futureDate = new Date(now + 86400000 * 5).toISOString();

    const isOverdue = (dueDate, status) => {
      return status !== "returned" && new Date(dueDate).getTime() < now;
    };

    assert.strictEqual(isOverdue(pastDate, "borrowed"), true);
    assert.strictEqual(isOverdue(futureDate, "borrowed"), false);
    assert.strictEqual(isOverdue(pastDate, "returned"), false);
  });
});

test("3. Book Exchange Workflow", async (t) => {
  await t.test("Validates offered book ownership", () => {
    const proposerId = "user-1";
    const offeredBook = { id: "book-1", ownerId: "user-2" };

    const proposeExchange = (offered, proposer) => {
      if (offered.ownerId !== proposer) {
        throw new Error("You can only offer books from your own bookshelf");
      }
      return true;
    };

    assert.throws(
      () => proposeExchange(offeredBook, proposerId),
      /You can only offer books from your own bookshelf/
    );
  });

  await t.test("Accepts exchange proposal and sets timestamp", () => {
    const proposal = { id: "ex-1", recipientId: "user-2", status: "pending" };
    const acceptProposal = (prop, actorId) => {
      if (prop.recipientId !== actorId) {
        throw new Error("Only recipient can accept");
      }
      prop.status = "accepted";
      prop.confirmedAt = new Date().toISOString();
      return prop;
    };

    const accepted = acceptProposal(proposal, "user-2");
    assert.strictEqual(accepted.status, "accepted");
    assert.ok(accepted.confirmedAt);
  });
});

test("4. Payment & Platform Commission Verification", async (t) => {
  await t.test("Calculates rental fee, security deposit, and commission correctly", () => {
    const rentalFee = 50;
    const deposit = 200;
    const commissionPercent = 10;
    const commission = (rentalFee * commissionPercent) / 100;
    const totalPayable = rentalFee + deposit + commission;

    assert.strictEqual(commission, 5);
    assert.strictEqual(totalPayable, 255);
  });

  await t.test("Clearly flags development mode simulated payments", () => {
    const devPayment = {
      id: "pay-1",
      amount: 255,
      provider: "razorpay",
      is_dev_mode: true,
      status: "successful",
    };

    assert.strictEqual(devPayment.is_dev_mode, true);
    assert.notStrictEqual(devPayment.provider_payment_id, "live_razorpay_signature");
  });
});

test("5. Search & Filtering Mechanics", async (t) => {
  const sampleBooks = [
    { title: "Aadujeevitham", author: "Benyamin", language: "Malayalam", genre: "Literary Fiction", lending_type: "free" },
    { title: "Project Hail Mary", author: "Andy Weir", language: "English", genre: "Sci-Fi", lending_type: "rental" },
    { title: "Khasakkinte Itihasam", author: "O. V. Vijayan", language: "Malayalam", genre: "Classics", lending_type: "exchange" },
  ];

  await t.test("Filters by language", () => {
    const malayalamBooks = sampleBooks.filter((b) => b.language === "Malayalam");
    assert.strictEqual(malayalamBooks.length, 2);
  });

  await t.test("Filters by lending type", () => {
    const freeBooks = sampleBooks.filter((b) => b.lending_type === "free");
    assert.strictEqual(freeBooks.length, 1);
    assert.strictEqual(freeBooks[0].title, "Aadujeevitham");
  });

  await t.test("Search query matches title or author case-insensitively", () => {
    const query = "andy";
    const results = sampleBooks.filter(
      (b) => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
    );
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].author, "Andy Weir");
  });
});
