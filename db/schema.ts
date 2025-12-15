import { pgEnum, pgTable, text, timestamp, uuid, integer, doublePrecision, serial } from 'drizzle-orm/pg-core';

export const userTypeEnum = pgEnum('user_type', ['admin', 'seller']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['Active', 'Cancelled']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  userType: userTypeEnum('user_type').notNull().default('seller'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email'),
  mobileno: text('mobileno').notNull(),
  address: text('address'),
  enteredUser: uuid('entered_user').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const invoiceheader = pgTable('invoiceheader', {
  invoiceNo: serial('invoice_no').primaryKey(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  invoiceAmount: doublePrecision('invoice_amount').notNull(),
  discountAmount: doublePrecision('discount_amount').notNull().default(0),
  netAmount: doublePrecision('net_amount').notNull(),
  status: invoiceStatusEnum('status').notNull().default('Active'),
  remark: text('remark'),
  enteredUser: uuid('entered_user').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const invoicedetails = pgTable('invoicedetails', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceNo: integer('invoice_no').notNull().references(() => invoiceheader.invoiceNo),
  itemname: text('itemname').notNull(),
  qty: integer('qty').notNull(),
  amount: doublePrecision('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

export type InvoiceHeader = typeof invoiceheader.$inferSelect;
export type InsertInvoiceHeader = typeof invoiceheader.$inferInsert;

export type InvoiceDetail = typeof invoicedetails.$inferSelect;
export type InsertInvoiceDetail = typeof invoicedetails.$inferInsert;
