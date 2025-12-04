'use server';

import { db } from '@/db';
import { invoiceheader, invoicedetails, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';

interface InvoiceResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface InvoiceItem {
  itemname: string;
  qty: number;
  amount: number;
}

export async function getInvoices(): Promise<InvoiceResponse> {
  try {
    const invoices = await db
      .select({
        invoiceNo: invoiceheader.invoiceNo,
        customerId: invoiceheader.customerId,
        customerName: customers.name,
        invoiceAmount: invoiceheader.invoiceAmount,
        discountAmount: invoiceheader.discountAmount,
        netAmount: invoiceheader.netAmount,
        status: invoiceheader.status,
        remark: invoiceheader.remark,
        createdAt: invoiceheader.createdAt,
        updatedAt: invoiceheader.updatedAt,
      })
      .from(invoiceheader)
      .leftJoin(customers, eq(invoiceheader.customerId, customers.id))
      .orderBy(desc(invoiceheader.invoiceNo));

    return {
      success: true,
      data: invoices,
    };
  } catch (error) {
    console.error('Get invoices error:', error);
    return {
      success: false,
      message: 'Failed to fetch invoices',
    };
  }
}

export async function getInvoiceById(invoiceNo: number): Promise<InvoiceResponse> {
  try {
    const [invoice] = await db
      .select({
        invoiceNo: invoiceheader.invoiceNo,
        customerId: invoiceheader.customerId,
        customerName: customers.name,
        customerMobile: customers.mobileno,
        invoiceAmount: invoiceheader.invoiceAmount,
        discountAmount: invoiceheader.discountAmount,
        netAmount: invoiceheader.netAmount,
        status: invoiceheader.status,
        remark: invoiceheader.remark,
        createdAt: invoiceheader.createdAt,
        updatedAt: invoiceheader.updatedAt,
      })
      .from(invoiceheader)
      .leftJoin(customers, eq(invoiceheader.customerId, customers.id))
      .where(eq(invoiceheader.invoiceNo, invoiceNo))
      .limit(1);

    if (!invoice) {
      return {
        success: false,
        message: 'Invoice not found',
      };
    }

    const details = await db
      .select()
      .from(invoicedetails)
      .where(eq(invoicedetails.invoiceNo, invoiceNo));

    return {
      success: true,
      data: {
        ...invoice,
        items: details,
      },
    };
  } catch (error) {
    console.error('Get invoice error:', error);
    return {
      success: false,
      message: 'Failed to fetch invoice',
    };
  }
}

export async function addInvoice(formData: {
  customerId: string;
  invoiceAmount: number;
  discountAmount: number;
  netAmount: number;
  items: InvoiceItem[];
}): Promise<InvoiceResponse> {
  try {
    // Get current user session
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized - Please login',
      };
    }

    // Validate required fields
    if (!formData.customerId || !formData.items || formData.items.length === 0) {
      return {
        success: false,
        message: 'Customer and at least one item are required',
      };
    }

    // Validate amounts
    if (formData.invoiceAmount < 0 || formData.discountAmount < 0 || formData.netAmount < 0) {
      return {
        success: false,
        message: 'Amounts cannot be negative',
      };
    }

    // Create invoice header
    const [newInvoice] = await db
      .insert(invoiceheader)
      .values({
        customerId: formData.customerId,
        invoiceAmount: formData.invoiceAmount,
        discountAmount: formData.discountAmount,
        netAmount: formData.netAmount,
        enteredUser: session.userId,
      })
      .returning();

    // Create invoice details
    const itemsToInsert = formData.items.map((item) => ({
      invoiceNo: newInvoice.invoiceNo,
      itemname: item.itemname,
      qty: item.qty,
      amount: item.amount,
    }));

    await db.insert(invoicedetails).values(itemsToInsert);

    revalidatePath('/invoices');

    return {
      success: true,
      message: 'Invoice created successfully',
      data: newInvoice,
    };
  } catch (error) {
    console.error('Add invoice error:', error);
    return {
      success: false,
      message: 'Failed to create invoice',
    };
  }
}

export async function cancelInvoice(
  invoiceNo: number,
  reason: string
): Promise<InvoiceResponse> {
  try {
    if (!reason || reason.trim().length === 0) {
      return {
        success: false,
        message: 'Cancellation reason is required',
      };
    }

    const [cancelledInvoice] = await db
      .update(invoiceheader)
      .set({
        status: 'Cancelled',
        remark: reason,
        updatedAt: new Date(),
      })
      .where(eq(invoiceheader.invoiceNo, invoiceNo))
      .returning();

    if (!cancelledInvoice) {
      return {
        success: false,
        message: 'Invoice not found',
      };
    }

    revalidatePath('/invoices');

    return {
      success: true,
      message: 'Invoice cancelled successfully',
      data: cancelledInvoice,
    };
  } catch (error) {
    console.error('Cancel invoice error:', error);
    return {
      success: false,
      message: 'Failed to cancel invoice',
    };
  }
}
