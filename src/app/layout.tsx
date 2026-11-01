import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { repository } from "@/lib/data/repository";

export const metadata: Metadata = {
  title: "NextReader — Every book deserves another reader",
  description: "A community-powered platform connecting people who own physical books with readers nearby. Lend, borrow, exchange, and rent books with trust.",
  keywords: ["book sharing", "borrow books", "lend books", "book exchange", "Malayalam literature", "college book sharing", "sustainable reading", "Kochi", "Bengaluru"],
  openGraph: {
    title: "NextReader — Community-Powered Book Sharing",
    description: "Every book deserves another reader. Read it. Share it. Pass it on.",
    url: "https://nextreader.local",
    siteName: "NextReader",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "NextReader Community Bookshelf",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextReader — Every book deserves another reader",
    description: "Read it. Share it. Pass it on.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, allUsers, notifications] = await Promise.all([
    repository.getCurrentUser(),
    repository.getAllUsers(),
    repository.getUserNotifications("a0000000-0000-0000-0000-000000000001"),
  ]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-sage selection:text-forest-dark">
        <Navbar
          currentUser={currentUser}
          allUsers={allUsers}
          unreadNotificationCount={unreadCount}
        />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
