# Dhan Vijeta - Premium Stock Market EdTech Platform

Dhan Vijeta is a premium, production-ready, full-stack EdTech website for a stock market academy. It features a luxury dark finance theme (black, dark blue, navy, gold, emerald green, neon borders, and glassmorphism) with 3D background visual cards and high-end interactive learning features.

---

## Key Features

1. **Enterprise Role-Based Auth**: Single user model containing `'student'` and `'admin'` roles with unified JWT (short-lived Access Tokens, long-lived HttpOnly Refresh Tokens) and streaks tracker.
2. **Dynamic Course Syllabus**: Course -> Section -> Lesson structure containing customizable videos, notes downloads, and assignment tasks.
3. **Decoupled Purchase Ledger**: Dedicated `Purchase` model managing access privileges, learning progress counters, and completion tracking.
4. **Instant Course Unlocking & Batch Board**: Access to `/my-batch` pages is locked until payment verification. Unlocking dynamically unlocks course files, assignments, and batch-wide announcements.
5. **Video Security**: Raw video streaming links are masked. Frontend requests expiring signed URLs (valid for 2 hours) which are vetted against the student's active purchases list on the backend.
6. **Automatic Digital Certificates**: Upon completing all lessons in a course syllabus (100%), a verifiable certificate with a unique code is generated and downloadable.
7. **Coupon & Discount Engine**: Admin CRUD panels to configure percentage or flat coupons; applied and validated live on checkout (re-calculated securely on backend).
8. **Interactive 3D Background Canvas**: Built using Three.js + React Three Fiber + Drei, drawing rotating gold coins, particle fields, and moving trading wicks that respond to cursor movement (running at 60 FPS).
9. **Admin Analytical Dashboard**: Real-time sales charts, revenue metrics (daily, monthly, all-time), course enrollment listings, and broadcaster tool.

---

## Technology Stack

*   **Frontend**: React.js, Vite, React Router, Tailwind CSS v3, Framer Motion, GSAP, Three.js + React Three Fiber + Drei, Axios (Interceptors), React Icons, React Hot Toast, React Hook Form, Zod.
*   **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose, JWT (Access & Refresh tokens), bcrypt, Multer, Cloudinary (Optional signed streams), Razorpay (Live / Mock toggle), Nodemailer (Verification / Password resets).

---

## Setup & Launch Instructions

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   MongoDB running locally (e.g., `mongodb://localhost:27017/dhanvijeta`) or an Atlas MongoDB URI string.

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure `.env` file values:
   *   `MONGO_URI`: Set to your MongoDB connection string.
   *   `USE_MOCK_PAYMENT`: Set to `true` (default) to test checkouts instantly without setting up real Razorpay credentials.
   *   `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD`: Standard seed credentials.

5. Seed the default administrator account:
   ```bash
   npm run seed:admin
   ```
   *This seeds the admin account: `admin@dhanvijeta.com` / `AdminPass123!`*

6. Start the server:
   *   Production: `npm start`
   *   Development: `npm run dev` (Runs on port `5000` by default)

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *Runs on port `5173` by default*

4. Open `http://localhost:5173` in your browser.

---

## Testing Verification Flows

1. **Register & Log In**: Create a student account using the navbar login modal. Note the active verification email token printed on your backend server terminal (since SMTP defaults are mock local logs).
2. **Apply Coupon**: Navigate to a course page, enter `PROTRADER` or another code created via the Admin console, and verify the checkout card updates pricing immediately.
3. **Checkout (Mock Mode)**: Click "Buy Now". Since `USE_MOCK_PAYMENT` is `true`, the checkout instantly calls backend verification, locks the course, and redirects to your course batch page.
4. **My Batch Protection**: Try changing URLs to `/my-batch/:unboughtCourseId` directly. Confirm you are immediately redirected to courses listing.
5. **Study & Certificates**: Play videos, click lesson checkboxes to progress. When the percentage reaches 100%, check your student dashboard to collect and verify your certificate code.
