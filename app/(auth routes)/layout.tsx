import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - NoteHub',
  description: 'Sign in or sign up to access your NoteHub account',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-layout">{children}</div>;
}
