"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { repository } from "@/lib/data/repository";
import { LendingType, BookCondition } from "@/types/database";

// ------------------------------------------------------------------------------
// Validation Schemas
// ------------------------------------------------------------------------------
const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  author: z.string().min(1, "Author is required").max(150),
  isbn: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  edition: z.string().optional().nullable(),
  publication_year: z.coerce.number().optional().nullable(),
  language: z.string().min(1, "Language is required"),
  genre: z.string().min(1, "Genre is required"),
  description: z.string().min(10, "Please provide a description of at least 10 characters"),
  cover_image_url: z.string().url("Valid cover image URL is required"),
  condition: z.enum(["like_new", "very_good", "good", "acceptable"] as const),
  lending_type: z.enum(["free", "rental", "exchange"] as const),
  rental_price: z.coerce.number().min(0).default(0),
  security_deposit: z.coerce.number().min(0).default(0),
  lending_duration_days: z.coerce.number().min(1).max(90).default(14),
  city: z.string().min(1, "City is required"),
  locality: z.string().min(1, "Locality is required"),
});

const loanRequestSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  durationDays: z.coerce.number().min(1).max(90),
  message: z.string().max(500).optional(),
});

const exchangeProposalSchema = z.object({
  offeredBookId: z.string().min(1, "Offered book is required"),
  requestedBookId: z.string().min(1, "Requested book is required"),
  handoverArrangement: z.string().max(300).optional(),
  message: z.string().max(500).optional(),
});

const reviewSchema = z.object({
  transactionType: z.enum(["loan", "exchange"] as const),
  transactionId: z.string().min(1),
  revieweeId: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// ------------------------------------------------------------------------------
// User & Auth Actions
// ------------------------------------------------------------------------------
export async function switchUserAction(userId: string) {
  const success = await repository.setCurrentUserId(userId);
  if (success) {
    revalidatePath("/", "layout");
    return { success: true };
  }
  return { success: false, error: "Failed to switch user" };
}

// ------------------------------------------------------------------------------
// Book Listing Actions
// ------------------------------------------------------------------------------
export async function createBookAction(formData: FormData) {
  try {
    const user = await repository.getCurrentUser();
    const rawData = {
      title: formData.get("title"),
      author: formData.get("author"),
      isbn: formData.get("isbn") || null,
      publisher: formData.get("publisher") || null,
      edition: formData.get("edition") || null,
      publication_year: formData.get("publication_year") ? Number(formData.get("publication_year")) : null,
      language: formData.get("language"),
      genre: formData.get("genre"),
      description: formData.get("description"),
      cover_image_url: formData.get("cover_image_url") || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
      condition: formData.get("condition"),
      lending_type: formData.get("lending_type"),
      rental_price: formData.get("rental_price") ? Number(formData.get("rental_price")) : 0,
      security_deposit: formData.get("security_deposit") ? Number(formData.get("security_deposit")) : 0,
      lending_duration_days: formData.get("lending_duration_days") ? Number(formData.get("lending_duration_days")) : 14,
      city: formData.get("city") || user.city,
      locality: formData.get("locality") || user.locality,
    };

    const validated = bookSchema.parse(rawData);

    const book = await repository.createBook({
      ...validated,
      owner_id: user.id,
      availability_status: "available",
      approximate_latitude: null,
      approximate_longitude: null
    });

    revalidatePath("/discover");
    revalidatePath("/my-books");
    revalidatePath("/dashboard");

    return { success: true, data: book };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create book listing" };
  }
}

export async function updateBookAction(bookId: string, formData: FormData) {
  try {
    const user = await repository.getCurrentUser();
    const rawData = {
      title: formData.get("title"),
      author: formData.get("author"),
      isbn: formData.get("isbn") || null,
      language: formData.get("language"),
      genre: formData.get("genre"),
      description: formData.get("description"),
      cover_image_url: formData.get("cover_image_url"),
      condition: formData.get("condition"),
      lending_type: formData.get("lending_type"),
      rental_price: formData.get("rental_price") ? Number(formData.get("rental_price")) : 0,
      security_deposit: formData.get("security_deposit") ? Number(formData.get("security_deposit")) : 0,
      lending_duration_days: formData.get("lending_duration_days") ? Number(formData.get("lending_duration_days")) : 14,
      city: formData.get("city"),
      locality: formData.get("locality"),
    };

    const validated = bookSchema.partial().parse(rawData);
    const updated = await repository.updateBook(bookId, validated, user.id);

    revalidatePath(`/books/${bookId}`);
    revalidatePath("/my-books");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update book" };
  }
}

export async function deleteBookAction(bookId: string) {
  try {
    const user = await repository.getCurrentUser();
    const success = await repository.deleteBook(bookId, user.id);
    revalidatePath("/my-books");
    revalidatePath("/discover");
    return { success };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete book" };
  }
}

// ------------------------------------------------------------------------------
// Loan & Request Actions
// ------------------------------------------------------------------------------
export async function requestLoanAction(payload: {
  bookId: string;
  durationDays: number;
  message?: string;
}) {
  try {
    const user = await repository.getCurrentUser();
    const validated = loanRequestSchema.parse(payload);

    const request = await repository.createLoanRequest({
      bookId: validated.bookId,
      borrowerId: user.id,
      durationDays: validated.durationDays,
      message: validated.message,
    });

    revalidatePath(`/books/${payload.bookId}`);
    revalidatePath("/requests");
    revalidatePath("/dashboard");

    return { success: true, data: request };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit request" };
  }
}

export async function respondLoanRequestAction(requestId: string, action: "accept" | "reject") {
  try {
    const user = await repository.getCurrentUser();
    if (action === "accept") {
      const loan = await repository.acceptLoanRequest(requestId, user.id);
      revalidatePath("/requests");
      revalidatePath("/my-lending");
      revalidatePath("/dashboard");
      return { success: true, data: loan };
    } else {
      await repository.rejectLoanRequest(requestId, user.id);
      revalidatePath("/requests");
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Action failed" };
  }
}

export async function confirmHandoverAction(loanId: string, notes?: string) {
  try {
    const user = await repository.getCurrentUser();
    const loan = await repository.confirmHandover(loanId, user.id, notes);
    revalidatePath("/my-lending");
    revalidatePath("/my-loans");
    revalidatePath("/dashboard");
    return { success: true, data: loan };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to confirm handover" };
  }
}

export async function initiateReturnAction(loanId: string, conditionNotes?: string) {
  try {
    const user = await repository.getCurrentUser();
    const loan = await repository.initiateReturn(loanId, user.id, conditionNotes);
    revalidatePath("/my-loans");
    revalidatePath("/my-lending");
    return { success: true, data: loan };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to initiate return" };
  }
}

export async function confirmReturnAction(loanId: string, returnNotes?: string) {
  try {
    const user = await repository.getCurrentUser();
    const loan = await repository.confirmReturn(loanId, user.id, returnNotes);
    revalidatePath("/my-lending");
    revalidatePath("/my-loans");
    revalidatePath("/discover");
    revalidatePath("/dashboard");
    return { success: true, data: loan };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to confirm return" };
  }
}

// ------------------------------------------------------------------------------
// Book Exchange Actions
// ------------------------------------------------------------------------------
export async function proposeExchangeAction(payload: {
  offeredBookId: string;
  requestedBookId: string;
  handoverArrangement?: string;
  message?: string;
}) {
  try {
    const user = await repository.getCurrentUser();
    const validated = exchangeProposalSchema.parse(payload);

    const proposal = await repository.createExchangeProposal({
      offeredBookId: validated.offeredBookId,
      requestedBookId: validated.requestedBookId,
      proposerId: user.id,
      handoverArrangement: validated.handoverArrangement,
      message: validated.message,
    });

    revalidatePath(`/books/${payload.requestedBookId}`);
    revalidatePath("/requests");
    return { success: true, data: proposal };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to propose exchange" };
  }
}

export async function respondExchangeProposalAction(proposalId: string, action: "accept" | "reject") {
  try {
    const user = await repository.getCurrentUser();
    if (action === "accept") {
      const proposal = await repository.acceptExchangeProposal(proposalId, user.id);
      revalidatePath("/requests");
      return { success: true, data: proposal };
    } else {
      revalidatePath("/requests");
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err.message || "Action failed" };
  }
}

// ------------------------------------------------------------------------------
// Wishlist & Community Actions
// ------------------------------------------------------------------------------
export async function toggleWishlistAction(bookId: string) {
  try {
    const user = await repository.getCurrentUser();
    const isAdded = await repository.toggleWishlist(user.id, bookId);
    revalidatePath("/wishlist");
    revalidatePath(`/books/${bookId}`);
    return { success: true, isAdded };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle wishlist" };
  }
}

export async function createWantedRequestAction(formData: FormData) {
  try {
    const user = await repository.getCurrentUser();
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const language = (formData.get("language") as string) || "English";
    const city = (formData.get("city") as string) || user.city;
    const locality = (formData.get("locality") as string) || user.locality;
    const note = formData.get("note") as string;

    if (!title || !author) {
      throw new Error("Title and Author are required");
    }

    const req = await repository.createWantedRequest({
      userId: user.id,
      title,
      author,
      language,
      city,
      locality,
      note,
    });

    revalidatePath("/community");
    return { success: true, data: req };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to post wanted request" };
  }
}

// ------------------------------------------------------------------------------
// Reviews
// ------------------------------------------------------------------------------
export async function submitReviewAction(payload: {
  transactionType: "loan" | "exchange";
  transactionId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
}) {
  try {
    const user = await repository.getCurrentUser();
    const validated = reviewSchema.parse(payload);

    const review = await repository.createReview({
      transactionType: validated.transactionType,
      transactionId: validated.transactionId,
      reviewerId: user.id,
      revieweeId: validated.revieweeId,
      rating: validated.rating,
      comment: validated.comment,
    });

    revalidatePath("/my-loans");
    revalidatePath(`/profile`);
    return { success: true, data: review };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit review" };
  }
}

// ------------------------------------------------------------------------------
// Messaging & Notifications
// ------------------------------------------------------------------------------
export async function sendMessageAction(conversationId: string, body: string) {
  try {
    const user = await repository.getCurrentUser();
    if (!body.trim()) throw new Error("Message cannot be empty");

    const message = await repository.sendMessage(conversationId, user.id, body.trim());
    revalidatePath("/messages");
    return { success: true, data: message };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send message" };
  }
}

export async function markNotificationAsReadAction(notificationId: string) {
  try {
    await repository.markNotificationAsRead(notificationId);
    revalidatePath("/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false };
  }
}

export async function markAllNotificationsAsReadAction() {
  try {
    const user = await repository.getCurrentUser();
    await repository.markAllNotificationsAsRead(user.id);
    revalidatePath("/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false };
  }
}

// ------------------------------------------------------------------------------
// Payments (Razorpay & Development Mode)
// ------------------------------------------------------------------------------
export async function processPaymentAction(payload: {
  loanId?: string;
  rentalFee: number;
  securityDeposit: number;
}) {
  try {
    const user = await repository.getCurrentUser();
    const isDevMode = process.env.NEXT_PUBLIC_DEV_PAYMENT_MODE !== "false";

    const payment = await repository.createPayment({
      userId: user.id,
      loanId: payload.loanId,
      rentalFee: payload.rentalFee,
      securityDeposit: payload.securityDeposit,
      isDevMode
    });

    revalidatePath("/dashboard");
    revalidatePath("/my-loans");
    return { success: true, data: payment };
  } catch (err: any) {
    return { success: false, error: err.message || "Payment processing failed" };
  }
}

// ------------------------------------------------------------------------------
// Disputes & Reports
// ------------------------------------------------------------------------------
export async function submitDisputeAction(payload: {
  transactionType: "loan" | "exchange";
  transactionId: string;
  reason: string;
  description: string;
}) {
  try {
    const user = await repository.getCurrentUser();
    const dispute = await repository.createDispute({
      transactionType: payload.transactionType,
      transactionId: payload.transactionId,
      reportedBy: user.id,
      reason: payload.reason,
      description: payload.description,
    });

    revalidatePath("/admin/reports");
    return { success: true, data: dispute };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to file dispute" };
  }
}

export async function resolveDisputeAction(disputeId: string, resolution: string) {
  try {
    const user = await repository.getCurrentUser();
    if (user.role !== "admin") {
      throw new Error("Unauthorized: Only administrators can resolve disputes");
    }

    const dispute = await repository.resolveDispute(disputeId, user.id, resolution);
    revalidatePath("/admin/reports");
    return { success: true, data: dispute };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to resolve dispute" };
  }
}
