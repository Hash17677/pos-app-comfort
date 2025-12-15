'use server';

import { db } from '@/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';

interface CustomerResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export async function getCustomers(): Promise<CustomerResponse> {
  try {
    const allCustomers = await db.select().from(customers).orderBy(customers.createdAt);
    
    return {
      success: true,
      data: allCustomers,
    };
  } catch (error) {
    console.error('Get customers error:', error);
    return {
      success: false,
      message: 'Failed to fetch customers',
    };
  }
}

export async function getCustomerById(id: string): Promise<CustomerResponse> {
  try {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);

    if (!customer) {
      return {
        success: false,
        message: 'Customer not found',
      };
    }

    return {
      success: true,
      data: customer,
    };
  } catch (error) {
    console.error('Get customer error:', error);
    return {
      success: false,
      message: 'Failed to fetch customer',
    };
  }
}

export async function addCustomer(formData: {
  name: string;
  email: string;
  mobileno: string;
  address: string;
}): Promise<CustomerResponse> {
  try {
    // Get current user session
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: 'Unauthorized - Please login',
      };
    }

    // Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(formData.mobileno)) {
      return {
        success: false,
        message: 'Mobile number must be exactly 10 digits',
      };
    }

    // Validate required fields
    if (!formData.name || !formData.mobileno) {
      return {
        success: false,
        message: 'Name and mobile number are required',
      };
    }

    const [newCustomer] = await db
      .insert(customers)
      .values({
        name: formData.name,
        email: formData.email || null,
        mobileno: formData.mobileno,
        address: formData.address || null,
        enteredUser: session.userId,
      })
      .returning();

    revalidatePath('/customers');

    return {
      success: true,
      message: 'Customer added successfully',
      data: newCustomer,
    };
  } catch (error) {
    console.error('Add customer error:', error);
    return {
      success: false,
      message: 'Failed to add customer',
    };
  }
}

export async function updateCustomer(
  id: string,
  formData: {
    name: string;
    email: string;
    mobileno: string;
    address: string;
  }
): Promise<CustomerResponse> {
  try {
    // Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(formData.mobileno)) {
      return {
        success: false,
        message: 'Mobile number must be exactly 10 digits',
      };
    }

    // Validate required fields
    if (!formData.name || !formData.mobileno) {
      return {
        success: false,
        message: 'Name and mobile number are required',
      };
    }

    const [updatedCustomer] = await db
      .update(customers)
      .set({
        name: formData.name,
        email: formData.email || null,
        mobileno: formData.mobileno,
        address: formData.address || null,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();

    if (!updatedCustomer) {
      return {
        success: false,
        message: 'Customer not found',
      };
    }

    revalidatePath('/customers');

    return {
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer,
    };
  } catch (error) {
    console.error('Update customer error:', error);
    return {
      success: false,
      message: 'Failed to update customer',
    };
  }
}

export async function deleteCustomer(id: string): Promise<CustomerResponse> {
  try {
    const [deletedCustomer] = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    if (!deletedCustomer) {
      return {
        success: false,
        message: 'Customer not found',
      };
    }

    revalidatePath('/customers');

    return {
      success: true,
      message: 'Customer deleted successfully',
    };
  } catch (error) {
    console.error('Delete customer error:', error);
    return {
      success: false,
      message: 'Failed to delete customer',
    };
  }
}
