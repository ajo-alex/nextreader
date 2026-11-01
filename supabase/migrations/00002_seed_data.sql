-- ==============================================================================
-- NEXTREADER SEED DATA
-- Migration: 00002_seed_data.sql
-- Description: Realistic test users, 22 diverse book listings (English & Malayalam),
--              loan requests, active loans, reviews, wishlists and sample disputes.
-- ==============================================================================

-- 1. Insert Sample Profiles (with fixed deterministic UUIDs)
INSERT INTO profiles (id, username, display_name, avatar_url, bio, city, locality, preferred_languages, preferred_genres, reputation_score)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'arun_read', 'Arun Varma', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 'Architect & lifelong bibliophile. Loving South Asian literature and design theory.', 'Kochi', 'Kakkanad', ARRAY['English', 'Malayalam'], ARRAY['Literary Fiction', 'Architecture', 'Philosophy'], 4.95),
  ('a0000000-0000-0000-0000-000000000002', 'diya_books', 'Diya Menon', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', 'Software engineer by day, speculative fiction devourer by night. Read 40 books last year!', 'Kochi', 'Fort Kochi', ARRAY['English', 'Malayalam'], ARRAY['Sci-Fi', 'Technology', 'Mystery'], 4.88),
  ('a0000000-0000-0000-0000-000000000003', 'rahul_b', 'Rahul Sharma', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 'Product manager in Indiranagar. Happy to share my tech, product and startup collection.', 'Bengaluru', 'Indiranagar', ARRAY['English', 'Hindi'], ARRAY['Business', 'Non-Fiction', 'History'], 5.00),
  ('a0000000-0000-0000-0000-000000000004', 'ananya_page', 'Ananya Iyer', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80', 'Literature graduate student. Always looking for translated classics and poetry.', 'Kochi', 'Palarivattom', ARRAY['English', 'Malayalam', 'Tamil'], ARRAY['Classics', 'Poetry', 'Philosophy'], 4.92),
  ('a0000000-0000-0000-0000-000000000005', 'admin_nextreader', 'NextReader Team (Admin)', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', 'Community management & trust operations desk.', 'Kochi', 'Panampilly Nagar', ARRAY['English', 'Malayalam', 'Hindi'], ARRAY['All'], 5.00)
ON CONFLICT (id) DO NOTHING;

-- Grant Admin role to admin_nextreader
INSERT INTO user_roles (user_id, role)
VALUES ('a0000000-0000-0000-0000-000000000005', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. Insert 22 Realistic Diverse Books
INSERT INTO books (
  id, owner_id, title, author, isbn, publisher, edition, publication_year,
  language, genre, description, cover_image_url, condition, lending_type,
  rental_price, security_deposit, lending_duration_days, city, locality,
  approximate_latitude, approximate_longitude, availability_status
) VALUES
-- 1. Aadujeevitham (Goat Days) - Malayalam
(
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Aadujeevitham (ആടുജീവിതം)',
  'Benyamin',
  '9788126421946',
  'DC Books',
  'Special Edition',
  2008,
  'Malayalam',
  'Literary Fiction',
  'The harrowing and deeply moving true survival story of Najeeb, an Indian migrant worker held hostage in the Saudi Arabian desert. Pristine copy, preserved with care.',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
  'like_new',
  'free',
  0.00,
  0.00,
  14,
  'Kochi',
  'Kakkanad',
  9.9982,
  76.3575,
  'available'
),
-- 2. Project Hail Mary - English
(
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'Project Hail Mary',
  'Andy Weir',
  '9780593135204',
  'Ballantine Books',
  'Hardcover 1st',
  2021,
  'English',
  'Sci-Fi',
  'A lone astronaut must save the earth from disaster in this exhilarating interstellar science mystery from the author of The Martian. One of the best sci-fi reads in a decade.',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'very_good',
  'rental',
  40.00,
  150.00,
  21,
  'Kochi',
  'Fort Kochi',
  9.9658,
  76.2421,
  'available'
),
-- 3. Khasakkinte Itihasam - Malayalam Classic
(
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000004',
  'Khasakkinte Itihasam (ഖസാക്കിന്റെ ഇതിഹാസം)',
  'O. V. Vijayan',
  '9788126400323',
  'DC Books',
  'Golden Jubilee Edition',
  1969,
  'Malayalam',
  'Classics',
  'A monumental cornerstone of modernist Indian literature following Ravi, who escapes to the remote village of Khasak. Soul-stirring prose and unforgettable imagery.',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80',
  'good',
  'exchange',
  0.00,
  0.00,
  14,
  'Kochi',
  'Palarivattom',
  10.0067,
  76.3090,
  'available'
),
-- 4. Designing Data-Intensive Applications - English Tech
(
  'b0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000003',
  'Designing Data-Intensive Applications',
  'Martin Kleppmann',
  '9781449373320',
  'O''Reilly Media',
  '1st Edition',
  2017,
  'English',
  'Technology',
  'The indispensable guide to system architecture, storage engines, distributed consensus, and streaming data systems. Perfect for senior engineers preparing for system design interviews.',
  'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
  'like_new',
  'rental',
  60.00,
  300.00,
  30,
  'Bengaluru',
  'Indiranagar',
  12.9719,
  77.6412,
  'available'
),
-- 5. Chemmeen - Malayalam
(
  'b0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'Chemmeen (ചെമ്മീൻ)',
  'Thakazhi Sivasankara Pillai',
  '9788171300068',
  'Current Books',
  'Collector Edition',
  1956,
  'Malayalam',
  'Classics',
  'The legendary tale of love, seaside myth, and tragedy in a coastal fishing hamlet of Kerala. Won the Sahitya Akademi Award.',
  'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
  'good',
  'free',
  0.00,
  0.00,
  14,
  'Kochi',
  'Kakkanad',
  9.9982,
  76.3575,
  'available'
),
-- 6. Atomic Habits - English
(
  'b0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000003',
  'Atomic Habits',
  'James Clear',
  '9780735211292',
  'Avery',
  'Paperback',
  2018,
  'English',
  'Self-Help',
  'An easy and proven way to build good habits and break bad ones. Clean pages with minimal pencil highlights in chapter 3.',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'very_good',
  'free',
  0.00,
  0.00,
  14,
  'Bengaluru',
  'Indiranagar',
  12.9719,
  77.6412,
  'available'
),
-- 7. The God of Small Things - English Literary
(
  'b0000000-0000-0000-0000-000000000007',
  'a0000000-0000-0000-0000-000000000004',
  'The God of Small Things',
  'Arundhati Roy',
  '9780679457312',
  'Random House',
  '1st Edition',
  1997,
  'English',
  'Literary Fiction',
  'The Booker Prize-winning masterwork set in Ayemenem, Kerala. Rich lyricism exploring childhood, forbidden love, and social boundary.',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  'very_good',
  'exchange',
  0.00,
  0.00,
  21,
  'Kochi',
  'Palarivattom',
  10.0067,
  76.3090,
  'available'
),
-- 8. Oru Desathinte Katha - Malayalam
(
  'b0000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000001',
  'Oru Desathinte Katha (ഒരു ദേശത്തിന്റെ കഥ)',
  'S. K. Pottekkatt',
  '9788126402372',
  'DC Books',
  'Anniversary Edition',
  1971,
  'Malayalam',
  'Literary Fiction',
  'Jnanpith Award-winning sprawling semi-autobiographical chronicle of Athiranipadam and the life journey of Appu. Heartfelt and humorous.',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  'like_new',
  'free',
  0.00,
  0.00,
  28,
  'Kochi',
  'Kakkanad',
  9.9982,
  76.3575,
  'available'
),
-- 9. Dune - English Sci-Fi
(
  'b0000000-0000-0000-0000-000000000009',
  'a0000000-0000-0000-0000-000000000002',
  'Dune (The Deluxe Edition)',
  'Frank Herbert',
  '9780593099971',
  'Ace Hardcover',
  'Deluxe Edition',
  2019,
  'English',
  'Sci-Fi',
  'Frank Herbert''s epic sci-fi masterwork featuring Paul Atreides and the desert planet Arrakis. Gorgeous blue-stenciled edges and hardcover ribbon.',
  'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
  'like_new',
  'rental',
  50.00,
  250.00,
  21,
  'Kochi',
  'Fort Kochi',
  9.9658,
  76.2421,
  'available'
),
-- 10. India After Gandhi - English History
(
  'b0000000-0000-0000-0000-000000000010',
  'a0000000-0000-0000-0000-000000000003',
  'India After Gandhi: The History of the World''s Largest Democracy',
  'Ramachandra Guha',
  '9780330505543',
  'Picador',
  'Revised 10th Anniversary',
  2017,
  'English',
  'History',
  'Magisterial account of India''s history following independence in 1947 through political trials, conflicts, and democratic survival.',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
  'good',
  'rental',
  45.00,
  200.00,
  30,
  'Bengaluru',
  'Indiranagar',
  12.9719,
  77.6412,
  'available'
),
-- 11. Mayyazhippuzhayude Theerangalil - Malayalam
(
  'b0000000-0000-0000-0000-000000000011',
  'a0000000-0000-0000-0000-000000000004',
  'Mayyazhippuzhayude Theerangalil (മയ്യഴിപ്പുഴയുടെ തീരങ്ങളിൽ)',
  'M. Mukundan',
  '9788126400347',
  'DC Books',
  'Hardcover',
  1974,
  'Malayalam',
  'Literary Fiction',
  'The poetic history of French colonial Mahe and the tragic love of Dasan and Chandrika beside the whispering river of spirits.',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
  'very_good',
  'free',
  0.00,
  0.00,
  14,
  'Kochi',
  'Palarivattom',
  10.0067,
  76.3090,
  'available'
),
-- 12. Pachinko - English Fiction
(
  'b0000000-0000-0000-0000-000000000012',
  'a0000000-0000-0000-0000-000000000002',
  'Pachinko',
  'Min Jin Lee',
  '9781455563937',
  'Grand Central Publishing',
  'Paperback',
  2017,
  'English',
  'Literary Fiction',
  'A four-generation epic following an impoverished Korean immigrant family battling discrimination, resilience, and identity in 20th-century Japan.',
  'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=800&q=80',
  'very_good',
  'free',
  0.00,
  0.00,
  21,
  'Kochi',
  'Fort Kochi',
  9.9658,
  76.2421,
  'available'
),
-- 13. Clean Code - English Tech
(
  'b0000000-0000-0000-0000-000000000013',
  'a0000000-0000-0000-0000-000000000003',
  'Clean Code: A Handbook of Agile Software Craftsmanship',
  'Robert C. Martin',
  '9780132350884',
  'Prentice Hall',
  '1st Edition',
  2008,
  'English',
  'Technology',
  'Foundational principles on writing readable, testable, and maintainable object-oriented software. Great shape with crisp spine.',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  'good',
  'exchange',
  0.00,
  0.00,
  14,
  'Bengaluru',
  'Indiranagar',
  12.9719,
  77.6412,
  'available'
),
-- 14. Sapiens: A Brief History of Humankind
(
  'b0000000-0000-0000-0000-000000000014',
  'a0000000-0000-0000-0000-000000000001',
  'Sapiens: A Brief History of Humankind',
  'Yuval Noah Harari',
  '9780062316097',
  'Harper',
  'Paperback',
  2015,
  'English',
  'Non-Fiction',
  'How an insignificant ape became the ruler of planet earth. A mind-expanding survey of cognitive, agricultural, and scientific revolutions.',
  'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80',
  'like_new',
  'rental',
  35.00,
  120.00,
  14,
  'Kochi',
  'Kakkanad',
  9.9982,
  76.3575,
  'available'
),
-- 15. Randamoozham - Malayalam Epic
(
  'b0000000-0000-0000-0000-000000000015',
  'a0000000-0000-0000-0000-000000000001',
  'Randamoozham (രണ്ടാമൂഴം)',
  'M. T. Vasudevan Nair',
  '9788171300891',
  'Current Books',
  'Deluxe Edition',
  1984,
  'Malayalam',
  'Classics',
  'The Mahabharata retold with supreme emotional depth from Bhima''s inner perspective. Winner of the Vayalar Award.',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',
  'like_new',
  'free',
  0.00,
  0.00,
  21,
  'Kochi',
  'Kakkanad',
  9.9982,
  76.3575,
  'available'
),
-- 16. The Psychology of Money
(
  'b0000000-0000-0000-0000-000000000016',
  'a0000000-0000-0000-0000-000000000003',
  'The Psychology of Money',
  'Morgan Housel',
  '9789390166268',
  'Jaico Publishing House',
  '1st Edition',
  2020,
  'English',
  'Business',
  'Timeless lessons on wealth, greed, and happiness. Doing well with money isn''t necessarily about what you know. It''s about how you behave.',
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80',
  'very_good',
  'free',
  0.00,
  0.00,
  14,
  'Bengaluru',
  'Indiranagar',
  12.9719,
  77.6412,
  'available'
),
-- 17. The Midnight Library
(
  'b0000000-0000-0000-0000-000000000017',
  'a0000000-0000-0000-0000-000000000002',
  'The Midnight Library',
  'Matt Haig',
  '9780525559474',
  'Viking',
  'Hardcover',
  2020,
  'English',
  'Literary Fiction',
  'Between life and death there is a library where shelves go on forever. Nora Seed gets the chance to undo her regrets and see how life could have unfolded.',
  'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
  'like_new',
  'rental',
  30.00,
  100.00,
  14,
  'Kochi',
  'Fort Kochi',
  9.9658,
  76.2421,
  'available'
),
-- 18. Thinking, Fast and Slow
(
  'b0000000-0000-0000-0000-000000000018',
  'a0000000-0000-0000-0000-000000000003',
  'Thinking, Fast and Slow',
  'Daniel Kahneman',
  '9780374533557',
  'Farrar, Straus and Giroux',
  'Paperback',
  2011,
  'English',
  'Psychology',
  'Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the two systems that drive the way we think and make choices.',
  'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
  'good',
  'free',
  0.00,
  0.00,
  21,
  'Bengaluru',
  'Indiranagar',
  12.9719,
  77.6412,
  'available'
),
-- 19. Balyakalasakhi - Malayalam
(
  'b0000000-0000-0000-0000-000000000019',
  'a0000000-0000-0000-0000-000000000004',
  'Balyakalasakhi (ബാല്യകാലസഖി)',
  'Vaikom Muhammad Basheer',
  '9788171300846',
  'DC Books',
  'Collector Edition',
  1944,
  'Malayalam',
  'Classics',
  'Basheer''s timeless, tragic story of childhood sweethearts Majeed and Suhra. Heart-wrenching simplicity and poignancy.',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
  'like_new',
  'exchange',
  0.00,
  0.00,
  14,
  'Kochi',
  'Palarivattom',
  10.0067,
  76.3090,
  'available'
),
-- 20. Klara and the Sun
(
  'b0000000-0000-0000-0000-000000000020',
  'a0000000-0000-0000-0000-000000000002',
  'Klara and the Sun',
  'Kazuo Ishiguro',
  '9780593318171',
  'Knopf',
  '1st Edition',
  2021,
  'English',
  'Sci-Fi',
  'A thrilling luminous story from the Nobel laureate that looks at our rapidly changing world through the unforgettable eyes of Klara, an Artificial Friend.',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
  'very_good',
  'free',
  0.00,
  0.00,
  14,
  'Kochi',
  'Fort Kochi',
  9.9658,
  76.2421,
  'available'
),
-- 21. Steve Jobs
(
  'b0000000-0000-0000-0000-000000000021',
  'a0000000-0000-0000-0000-000000000003',
  'Steve Jobs: The Exclusive Biography',
  'Walter Isaacson',
  '9781451648539',
  'Simon & Schuster',
  'Hardcover',
  2011,
  'English',
  'Biography',
  'Based on more than forty interviews with Jobs conducted over two years. An unvarnished portrait of creative obsession and Silicon Valley history.',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'good',
  'rental',
  40.00,
  150.00,
  21,
  'Bengaluru',
  'Indiranagar',
  12.9719,
  77.6412,
  'available'
),
-- 22. Aaghoshavela - Malayalam
(
  'b0000000-0000-0000-0000-000000000022',
  'a0000000-0000-0000-0000-000000000004',
  'Aaghoshavela (ആഘോഷവേള)',
  'Sarah Joseph',
  '9788126415280',
  'Current Books',
  '1st Edition',
  2004,
  'Malayalam',
  'Literary Fiction',
  'Powerful feminist narratives and evocative village celebrations rendered with razor-sharp prose.',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  'like_new',
  'free',
  0.00,
  0.00,
  14,
  'Kochi',
  'Palarivattom',
  10.0067,
  76.3090,
  'available'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Sample Loans demonstrating lifecycle states
-- Loan 1: Active borrowed loan
INSERT INTO loans (
  id, book_id, owner_id, borrower_id, start_date, due_date,
  handover_confirmed_at, status
) VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '16 days',
  NOW() - INTERVAL '5 days',
  'borrowed'
) ON CONFLICT (id) DO NOTHING;

-- Loan 2: Completed returned loan
INSERT INTO loans (
  id, book_id, owner_id, borrower_id, start_date, due_date,
  handover_confirmed_at, return_initiated_at, returned_at, status
) VALUES (
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '16 days',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '17 days',
  NOW() - INTERVAL '16 days',
  'returned'
) ON CONFLICT (id) DO NOTHING;

-- Loan 3: Overdue loan
INSERT INTO loans (
  id, book_id, owner_id, borrower_id, start_date, due_date,
  handover_confirmed_at, status
) VALUES (
  'c0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000018',
  'a0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000004',
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '25 days',
  'overdue'
) ON CONFLICT (id) DO NOTHING;

-- 4. Sample Reviews
INSERT INTO reviews (
  id, transaction_type, transaction_id, reviewer_id, reviewee_id, rating, comment
) VALUES
(
  'd0000000-0000-0000-0000-000000000001',
  'loan',
  'c0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000003',
  5,
  'Rahul handed over Atomic Habits in perfect condition. Super friendly pickup near Indiranagar Metro.'
),
(
  'd0000000-0000-0000-0000-000000000002',
  'loan',
  'c0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  5,
  'Arun returned the book two days early in spotless shape. 100% recommended reader!'
)
ON CONFLICT (transaction_type, transaction_id, reviewer_id) DO NOTHING;

-- 5. Sample Wishlist items
INSERT INTO wishlists (user_id, book_id)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004'),
  ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000015')
ON CONFLICT (user_id, book_id) DO NOTHING;

-- 6. Sample Wanted Requests ("Looking For This Book")
INSERT INTO book_wanted_requests (user_id, title, author, language, city, locality, note)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Kalam (കാലം)', 'M. T. Vasudevan Nair', 'Malayalam', 'Kochi', 'Kakkanad', 'Looking for an older copy to read with my book club.'),
  ('a0000000-0000-0000-0000-000000000002', 'The Three-Body Problem', 'Cixin Liu', 'English', 'Kochi', 'Fort Kochi', 'Would love to borrow or rent the trilogy.'),
  ('a0000000-0000-0000-0000-000000000004', 'Ahalya', 'K. B. Sreedevi', 'Malayalam', 'Kochi', 'Palarivattom', 'Looking for this translated work.')
ON CONFLICT DO NOTHING;

-- 7. Sample Notifications
INSERT INTO notifications (user_id, type, title, body, link_url, read_at)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'loan_reminder', 'Upcoming return due date', 'Your loan of "Project Hail Mary" is due in 16 days.', '/my-loans', NULL),
  ('a0000000-0000-0000-0000-000000000001', 'welcome', 'Welcome to NextReader!', 'Start exploring local books in Kakkanad or list your first shelf item.', '/discover', NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;
