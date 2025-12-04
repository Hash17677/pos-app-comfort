# User Type Selection & Role-Based Session Management Enhancement

## Application Overview
This application is focus on selling Air Conditioner units, parts for Air Conditioners and provide services related to the Air Conditioners. I have already setup the NextJs application and install the drizzle and setup the neon database. All components should be use the shadcn components and dont try to install those on your side. Always provide the install command and I will install the compoennt my self.

Shop Name Is 'COMFORT ZONE HOLDINGS (PVT) LTD' and logo in in the 'public/logo.jpg'

## Requirement Overview
Need to implement the login page which accept the email and password and also implement role-based session management with access control.

## Enhancement Specifications
### 1. Database Schema
All schemas are should be implement in db/schema.ts file.

**Updated schema in `db/schema.ts`**:

userType: pgEnum('user_type', ['admin', 'seller']).notNull().default('seller')
users:
  userId: uuid("id").primaryKey().defaultRandom()
  email: string
  name: string
  password: string
  userType: 'admin' | 'seller'
  createdAt: timestamp("created_at").defaultNow().notNull()


### 2. Implement login UI
- Implement the login UI with shop name and logo indicating. UI should be very minimal. use colour schemas which used for logo.
- Every time user load the application it should be navigate to the login page ("/login"). only If user has the valid session then only it navigate to the root of application ("/"). For now only developed the login page and dashboard in simple h1 tag is ok for now.
- Implement the session management with nextjs compitable way. session object should be like that.
 interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller';
  isLoggedIn: boolean;
 }

## Technical Notes
- Use ONLY Shadcn components and Tailwind CSS
- Implement Server Actions (no API routes)
- Ensure responsive design
- Add loading states and error handling with Sonner toasts
- Maintain existing security standards (password hashing, validation) - Assume I already have separate process to add users with hash password