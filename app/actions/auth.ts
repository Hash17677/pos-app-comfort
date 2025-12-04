'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { setSession } from '@/lib/session';
import { AuthResponse, SessionData } from '@/lib/types';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Verify password using bcrypt
async function verifyPassword(
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

export async function loginAction(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
      };
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toString().toUpperCase()))
      .limit(1);

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Create session data
    const sessionData: SessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.userType as 'admin' | 'seller',
      isLoggedIn: true,
    };

    // Set session cookie
    await setSession(sessionData);

    return {
      success: true,
      message: 'Login successful',
      session: sessionData,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login',
    };
  }
}

export async function logoutAction(): Promise<AuthResponse> {
  try {
    const { clearSession } = await import('@/lib/session');
    await clearSession();
    return {
      success: true,
      message: 'Logout successful',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'An error occurred during logout',
    };
  }
}
