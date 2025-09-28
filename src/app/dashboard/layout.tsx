
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAppContext();

  useEffect(() => {
    // If after a short period there is no current user, redirect to home.
    // This handles cases where the user directly navigates to the dashboard
    // without being logged in.
    if (currentUser === null) {
      const timer = setTimeout(() => {
        if (!currentUser) {
          router.push('/');
        }
      }, 500); // Wait 500ms to allow context to potentially load user
      return () => clearTimeout(timer);
    }
  }, [currentUser, router]);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  }

  if (!currentUser) {
    // While waiting for the effect to run, show a loading indicator.
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="https://iili.io/KAqSp4V.png" alt="Logo" width={32} height={32} />
            <span className="font-bold text-lg">Kombel SMKN 2 Tana Toraja</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-sm">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">Siswa</p>
            </div>
            <Avatar>
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image src="https://iili.io/KAqSp4V.png" alt="Logo Aplikasi" width={32} height={32} />
              <h4 className="text-lg font-bold">Kombel SMKN 2 Tana Toraja</h4>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Sistem Pemilihan OSIS SERENTAK Sulawesi Selatan.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold">Kontak</h4>
            <ul className="mt-2 space-y-1 text-sm text-primary-foreground/80">
              <li>smkn2tantor@gmail.com</li>
              <li>0852-5567-2747</li>
              <li>
                Jl. Poros Mebali Buntu, Kel. Benteng Ambeso, Kec. Gandangbatu
                Sillanan, Kab. Tana Toraja, Prov. Sulawesi Selatan
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold">Bantuan</h4>
            <ul className="mt-2 space-y-1 text-sm text-primary-foreground/80">
              <li>
                <Link href="#" className="hover:underline">
                  Panduan Voting
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Hubungi Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-primary-foreground/80 md:px-6">
            <p>© 2024 Kombel SMKN 2 Tana Toraja. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
