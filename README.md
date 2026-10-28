# Turf Booking Management (TurfHub)

Football & sports turf booking management application built with Next.js, React, and Tailwind CSS.

## Features

- **Live Slot Booking**: View real-time availability of 7-a-side football turf slots with dynamic pricing.
- **Instant Booking Flow**: Pick date, sport, duration, and advance payment methods (bKash, Nagad, Cards).
- **Customer Bookings Lookup**: Track booking confirmation codes, status, and cancellation/refunds.
- **Admin Dashboard**:
  - Bookings management (filter by date, status, search by phone/code).
  - Manual booking creation for walk-in / front-desk guests.
  - Payments & refunds ledger.
  - Content & pricing management (slots, rates, rules).
  - Photo gallery manager with image compression.
  - Venue settings (operating hours, advance percentage, contact details).
- **Bilingual (English & বাংলা)**: Full internationalization support with language toggle across customer and admin views.
- **Browser-local Storage (Demo)**: Works out of the box with zero database setup.

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing page (Hero, Quick book, How it works, Ground details, Gallery, Services, About) |
| `/book` | Interactive live slot booking system |
| `/my-bookings` | Customer bookings lookup and status tracking |
| `/admin` | Admin dashboard (redirects to `/admin/bookings`) |
| `/admin/bookings` | Admin bookings list and filters |
| `/admin/bookings/new` | Front-desk manual booking entry |
| `/admin/bookings/[id]` | Booking details, payment recording, and cancellation |
| `/admin/payments` | Transactions, dues, and refunds |
| `/admin/content` | Website content, pricing, and services management |
| `/admin/gallery` | Gallery photo manager |
| `/admin/settings` | Venue hours, advance deposit, rules, and contact info |

## Getting Started

```bash
# Install dependencies
yarn install # or npm install

# Run the development server
yarn dev # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
