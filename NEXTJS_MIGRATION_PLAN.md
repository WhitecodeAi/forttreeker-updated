
# Next.js Migration Strategy for FortTracker

This document outlines the comprehensive strategy to migrate the existing **FortTracker** React + Vite application to **Next.js 14+ (App Router)** while preserving the existing Node.js + Express backend.

---

## 1️⃣ Migration Strategy

### Core Approach: Incremental Migration
Since we already have a robust Express backend, we will treat Next.js primarily as the **Frontend Layer** (acting as a Backend-for-Frontend or BFF) that proxies requests to your existing Express API.

### Folder Structure Configuration
We will use the **Next.js App Router** structure with `src/app`.

```
/
├── server/                     # (EXISTING) Unchanged Express Backend
├── public/                     # Static assets (images, fonts)
└── src/                        # Source folder
    ├── app/                    # Next.js App Router Routes
    │   ├── (site)/             # Public Website Group (Layout Group)
    │   │   ├── page.tsx        # Home Page
    │   │   ├── forts/          # Forts Listing
    │   │   └── about/          # About Page
    │   ├── (auth)/             # Auth Group
    │   │   ├── login/
    │   │   └── register/
    │   ├── admin/              # Admin Panel (Protected)
    │   │   ├── layout.tsx      # Admin Sidebar/Layout
    │   │   └── page.tsx        # Dashboard
    │   ├── layout.tsx          # Root Layout (Providers)
    │   └── globals.css         # Global Styles (Tailwind)
    ├── components/             # Reusable UI Components (Shadcn)
    │   ├── ui/                 # Shadcn primitives (Button, Card)
    │   ├── shared/             # Shared components (Footer, Navbar)
    │   └── admin/              # Admin-specific components
    ├── lib/                    # Utilities
    │   ├── utils.ts            # Class merging
    │   ├── api.ts              # API client (Axios/Fetch wrapper)
    │   └── types.ts            # Shared TS types
    └── hooks/                  # Custom Hooks
```

---

## 2️⃣ Next.js Setup

### Initialization
Create a new Next.js app alongside your existing server or replace the `client` folder.

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint
# Select "Yes" for src/ directory and App Router
```

### Key Dependencies
Install the packages matching your current stack:
```bash
npm install @tanstack/react-query lucide-react framer-motion clsx tailwind-merge recharts react-hook-form zod @hookform/resolvers
```

### Providers Layout (`src/app/layout.tsx`)
Move your Context providers here (`QueryClientProvider`, `ThemeProvider`). `AuthProvider` will need refactoring (see Section 3).

```tsx
// src/app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
             {children}
             <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
```

---

## 3️⃣ Routing Conversion

### Route Mapping Table

| Vite React Route | Next.js App Router Path | Note |
| :--- | :--- | :--- |
| `/` | `src/app/(site)/page.tsx` | Site Homepage |
| `/forts` | `src/app/(site)/forts/page.tsx` | Listing |
| `/fort/:id` | `src/app/(site)/forts/[id]/page.tsx` | **Dynamic Route** |
| `/login` | `src/app/(auth)/login/page.tsx` | Login Page |
| `/admin` | `src/app/admin/page.tsx` | Admin Dashboard |
| `/trek-groups` | `src/app/(site)/trek-groups/page.tsx` | Public Feature |

### Dynamic Routes
For `/fort/:id`, create folder `src/app/forts/[id]/`.
Access params in Server Components directly:
```tsx
// src/app/forts/[id]/page.tsx
export default function FortDetailPage({ params }: { params: { id: string } }) {
  return <FortDetailClientComponent id={params.id} />
}
```

### Protected Routes & Middleware
Instead of a `ProtectedRoute` wrapper component, use **Next.js Middleware**.

**File:** `src/middleware.ts`
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  const path = request.nextUrl.pathname

  // 1. Redirect if not logged in
  if (!token && (path.startsWith('/admin') || path.startsWith('/trek-planner'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Add logic to decode token and check Admin role if needed
  // (Requires a JWT decode lib that works in Edge runtime or calling an API)

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/trek-planner/:path*', '/ride-booking/:path*'],
}
```

---

## 4️⃣ Backend Integration (The BFF Pattern)

Your Express backend is listening on `PORT=3001` (for example). Next.js runs on 3000.
To check Auth via cookies properly, we need to proxy requests or configure CORS.

**Recommended: use Next.js Rewrites** in `next.config.mjs` to proxy `/api` calls to the Express backend.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // Proxy to Backend
      },
    ]
  },
}
export default nextConfig
```

**Benefits:**
*   Cookies set by Express (HttpOnly) will effectively belong to the same domain.
*   No CORS issues.
*   Multer file uploads work exactly as before.

---

## 5️⃣ SEO & Performance Improvements

### Metadata API (Server Components)
Replace `react-helmet` or manual `<title>` tags with Next.js Metadata.

```tsx
// src/app/forts/[id]/page.tsx
import { Metadata } from 'next'

// Fetch data for metadata generation
export async function generateMetadata({ params }): Promise<Metadata> {
  const fort = await getFort(params.id) // Fetch from API
  return {
    title: `${fort.name} - FortTracker`,
    description: fort.description,
  }
}
```

### SSR vs Client Components
*   **Use Client Components (`"use client"`)** for:
    *   Interactive forms (Login, Register).
    *   Complex state (Trek Planner, Drag & Drop).
    *   Admin Charts (Recharts requires browser APIs).
*   **Use Server Components (Default)** for:
    *   Fort Listings (SEO critical).
    *   Static Marketing Pages (About Us).
    *   Blog/Content pages.

### Image Optimization
Use `next/image` to automatically resize and serve AVIF/WebP images.

```tsx
import Image from "next/image"

<Image 
  src={fort.imageUrl} 
  alt={fort.name} 
  width={800} 
  height={600} 
  className="object-cover" 
/>
```

---

## 6️⃣ Deployment Plan

We will split the deployment into two services:

### 1. Backend (API + Database)
*   **Host**: Render.com, Railway, or VPS (Hostinger/DigitalOcean).
*   **Service**: Deploy the `server/` folder and `package.json` as a standard Node.js Web Service.
*   **Env**: `DB_HOST`, `JWT_SECRET`, etc.

### 2. Frontend (Next.js)
*   **Host**: Vercel (Recommended for Next.js) or any Node.js host.
*   **Config**: Set `NEXT_PUBLIC_API_URL` (if not using rewrites) or configure Rewrites to point to your deployed Backend URL (e.g., `https://api.forttracker.com`).
*   **Env**: `NEXT_PUBLIC_API_URL`, etc.

---

## 7️⃣ Code Example: Fetching Data

### Server Component (Data Fetching for SEO)
```tsx
// src/lib/api.ts
export async function getForts() {
  // Direct fetch inside Server Component
  const res = await fetch(`${process.env.API_BASE_URL}/api/forts`, {
    cache: 'no-store' // or 'force-cache' for SSG
  })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

// src/app/(site)/forts/page.tsx
import { getForts } from "@/lib/api"
import FortCard from "@/components/fort-card"

export default async function FortsPage() {
  const forts = await getForts()
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {forts.map(fort => (
        <FortCard key={fort.id} data={fort} />
      ))}
    </div>
  )
}
```

### Client Component (React Query)
Unchanged from your current setup! Just add `"use client"` at the top of your page/component.

```tsx
"use client"

import { useQuery } from "@tanstack/react-query"

export default function AdminStats() {
  const { data, isLoading } = useQuery({ 
    queryKey: ['admin-stats'],
    queryFn: fetchStats 
  })

  if (isLoading) return <div>Loading...</div>
  
  return <div>Total Users: {data.users}</div>
}
```
