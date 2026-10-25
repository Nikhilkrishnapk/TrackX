// utils/authErrors.ts
export function mapAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/user-not-found':
      return 'No account with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/invalid-credential':
      return 'Invalid Credentials';
    case 'auth/email-already-in-use':
      return 'Email already registered';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait and try again.';
    case 'auth/network-request-failed':
      return 'No internet connection. Check your network and try again.';
    default:
      return 'Something went wrong. Try again.';
  }
}
