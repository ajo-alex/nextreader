import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, AlertCircle } from "lucide-react";
import { repository } from "@/lib/data/repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateBookAction } from "@/actions";

export const dynamic = "force-dynamic";

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;
  const book = await repository.getBookById(id);
  const currentUser = await repository.getCurrentUser();

  if (!book) notFound();

  // Authorization: Only owner or admin
  if (book.owner_id !== currentUser.id && currentUser.role !== "admin") {
    redirect(`/books/${id}`);
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateBookAction(id, formData);
    redirect(`/books/${id}`);
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-left space-y-6">
      <div>
        <Link
          href={`/books/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mutedGray hover:text-forest transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Book Details</span>
        </Link>
      </div>

      <div className="rounded-3xl border border-surfaceBorder bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div className="border-b border-surfaceBorder/80 pb-4">
          <h1 className="font-serif text-2xl font-bold text-forest-dark flex items-center gap-2">
            <Edit className="h-6 w-6 text-forest" />
            Edit Book Listing
          </h1>
          <p className="text-xs text-mutedGray mt-0.5">
            Update bibliographic details or lending terms for "{book.title}".
          </p>
        </div>

        <form action={handleUpdate} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">Title</label>
              <Input type="text" name="title" defaultValue={book.title} required />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">Author</label>
              <Input type="text" name="author" defaultValue={book.author} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">Genre</label>
              <Input type="text" name="genre" defaultValue={book.genre} required />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">Language</label>
              <Input type="text" name="language" defaultValue={book.language} required />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">Condition</label>
              <select
                name="condition"
                defaultValue={book.condition}
                className="w-full h-10 px-3 rounded-lg border border-surfaceBorder bg-white text-xs"
              >
                <option value="like_new">Like New</option>
                <option value="very_good">Very Good</option>
                <option value="good">Good</option>
                <option value="acceptable">Acceptable</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-charcoal">Description</label>
            <Textarea
              name="description"
              rows={4}
              defaultValue={book.description}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">Lending Type</label>
              <select
                name="lending_type"
                defaultValue={book.lending_type}
                className="w-full h-10 px-3 rounded-lg border border-surfaceBorder bg-white text-xs"
              >
                <option value="free">Free Community Lending</option>
                <option value="rental">Paid Rental</option>
                <option value="exchange">Book Exchange</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">Rental Fee (₹)</label>
              <Input
                type="number"
                name="rental_price"
                defaultValue={book.rental_price}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">Security Deposit (₹)</label>
              <Input
                type="number"
                name="security_deposit"
                defaultValue={book.security_deposit}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">City</label>
              <Input type="text" name="city" defaultValue={book.city} required />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-charcoal">Locality</label>
              <Input type="text" name="locality" defaultValue={book.locality} required />
            </div>
          </div>

          <div className="pt-4 border-t border-surfaceBorder flex justify-end gap-3">
            <Link href={`/books/${id}`}>
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="sm" className="px-6">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

