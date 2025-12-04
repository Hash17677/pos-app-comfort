# User Type Selection & Role-Based Session Management Enhancement

## Requirement Overview
Need to implement the customer management page which allows to add customers, edit their details.

## Enhancement Specifications
### 1. Database Schema
All schemas are should be implement in db/schema.ts file.

**Updated schema in `db/schema.ts`**:

customers:
  customerId: uuid("id").primaryKey().defaultRandom()
  name: string
  email: string
  mobileno: string (10Digit)
  createdAt: timestamp("created_at").defaultNow().notNull()
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

### 2. Implementation
- In side the dashboard there is button for customer. once clicked that it should ne navigate to the '/customers'. 
- Inside the customer page there should be option to add customers. And also displayed the all customers are now added to the system.
- There should be option to the edit customer details as well.

## Technical Notes
- Use ONLY Shadcn components and Tailwind CSS
- Implement Server Actions (no API routes)
- Ensure responsive design
- Add loading states and error handling with Sonner toasts
- dont install any components or pkg provide the command and I will install those