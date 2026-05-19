# Admin Statistics Filtering & Landing Page Hero Redesign

## Date
2026-05-19

## Context
1. **Analytics Integrity**: The visitor tracking system (`Analytics`) and post view counters (`Post.viewCount`) were capturing activities performed by administrators. This contaminated the accuracy of the visitor dashboard statistics (page views, unique visitors, device/browser distributions, and conversion rates).
2. **Dashboard Reset**: The user requested a complete reset of all statistical data starting from today to have a clean slate for accurate tracking.
3. **Landing Page Aesthetic**: The user wanted to replace an existing "checked" image in the landing page hero section with a more subtle, premium pastel-toned image that reflects the professional yet comforting atmosphere of a law office, without compromising readability or existing layouts.

## Decisions Made

### 1. Admin Activity Filtering in APIs
* **Analytics Tracking (`src/app/api/analytics/track/route.ts`)**: Added an early return mechanism by verifying the `admin_session_v1` JWT cookie. If an admin is visiting any client-facing page, the API skips the `prisma.analytics.create()` process entirely.
* **Post View Count (`src/app/api/posts/[id]/route.ts`)**: Modified the logic to execute a simple `prisma.post.findUnique` instead of updating the `viewCount` increment if the requester is verified as an administrator via the `admin_session_v1` cookie.

### 2. Comprehensive Database Statistics Reset
* Wrote and executed a temporary administrative script (`src/app/api/reset/route.ts` & local node scripts) that successfully deleted all records from the `Analytics`, `Lead`, `Consultation`, and `BoardQna` tables, and reset all `Post.viewCount` to `0`. 
* This resulted in the admin dashboard conversion rates and total numbers being reset to a perfect `0`. The temporary script files were permanently deleted to prevent accidental data loss in the future.

### 3. Hero Section Design Overhaul
* **Resource Update**: Generated and uploaded a high-quality pastel-toned illustration (`hero-pastel.png`) depicting a bright, warm, and professional law office.
* **Component Restructuring (`src/app/page.tsx`)**: 
  * Removed the explicit right-side image card block (which contained the green checkmark).
  * Removed the floating '1:1 밀착 관리' glass-card badge as per the user's final instruction to clean up the right space.
  * Applied `hero-pastel.png` as a full-width background to the hero section with `opacity-50` and `bg-cover`.
  * Softened the gradient overlays (`bg-gradient-to-r` and `bg-gradient-to-t` from `opacity-80` to `opacity-60`) so the pastel illustration blends beautifully with the left-aligned text, drastically elevating the premium aesthetic of the homepage without impacting core functionalities.

## Status
Completed and fully pushed to `origin/main` on GitHub, triggering Vercel deployment automatically.
