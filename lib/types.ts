export interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'seller';
  isLoggedIn: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  session?: SessionData;
}
