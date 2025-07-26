import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '인증 | Moonwave Travel',
  description: '안전하고 편리한 여행 계획을 위한 로그인',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
