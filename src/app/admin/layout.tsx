
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { admins } from '@/lib/data';
import { cn } from '@/lib/utils';

const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Data Pemilih', href: '/admin/voters' },
    { name: 'Kandidat', href: '/admin/candidates' },
    { name: 'Hasil', href: '/admin/results' },
    { name: 'Pengaturan', href: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const admin = admins[0];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <Image src="https://iili.io/KAqSp4V.png" alt="Logo" width={40} height={40} />
            <span className="font-bold text-xl text-gray-800 font-lexend">Kombel SMKN 2 Tana Toraja</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                  pathname === link.href && "text-primary font-semibold"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-sm">{admin.name}</p>
              <p className="text-xs text-muted-foreground">{admin.role}</p>
            </div>
            <Button variant="destructive" onClick={() => router.push('/')}>
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-8">
            {children}
        </div>
      </main>
    </div>
  );
}
