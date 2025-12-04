# User Type Selection & Role-Based Session Management Enhancement

## Requirement Overview
Need to implement the Invoice management page which allows to generate invoices.

## Enhancement Specifications
### 1. Database Schema
All schemas are should be implement in db/schema.ts file.

**Updated schema in `db/schema.ts`**:

invoiceheader:
  invoiceNo: int - should be increamt automatically
  customerId: string - should link to the customer table
  invoiceAmount: double
  discountAmount: double
  netAmount: double
  status: { 'Active' | 'Cancelled' } - Default Active
  remark: string (10000)
  createdAt: timestamp("created_at").defaultNow().notNull()
  updatedAt: timestamp("updated_at").defaultNow().notNull()

invoicedetails:
  invoiceNo - link to the invoiceheader table
  itemno - uuid value
  itemname - string (1000)
  qty - int
  amount - double
  createdAt: timestamp("created_at").defaultNow().notNull()
  updatedAt: timestamp("updated_at").defaultNow().notNull()

### 2. Implementation
- follows the same UI patterns as customer sections
- In side the dashboard there is button for invoices. once clicked that it should ne navigate to the '/invoices'. 
- Inside the invoice page there should be option to add invoices. And also displayed the all invoices are now added to the system. no modify option for invoices.
- There should be option to the cancel the invoice. Once cancel user provide the reason for cancel and that reason is store in the invoiceheader.remark and status changed as 'Cancelled'.

## Technical Notes
- Use ONLY Shadcn components and Tailwind CSS
- Implement Server Actions (no API routes)
- Ensure responsive design
- Add loading states and error handling with Sonner toasts
- dont install any components or pkg provide the command and I will install those