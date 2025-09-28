
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';

export default function AdminLoginDialog() {
  const router = useRouter();
  const { admins } = useAppContext();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    const admin = admins.find(a => a.adminId === username && a.adminCode === password);
    if (admin) {
        toast({
            title: "Login Berhasil",
            description: `Selamat datang kembali, ${admin.name}!`,
        });
        setIsOpen(false);
        router.push('/admin/dashboard');
    } else {
        toast({
            title: "Login Gagal",
            description: "Username atau password salah.",
            variant: "destructive",
        })
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Login Admin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
          <div className="bg-destructive/10 p-3 rounded-full mb-2">
            <UserCircle className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="text-2xl font-bold font-lexend">
            Login Admin
          </DialogTitle>
          <DialogDescription>Panel administrator sistem</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username Admin</Label>
            <Input id="username" placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <Button type="submit" variant="destructive" className="w-full font-bold" onClick={handleLogin}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Masuk sebagai Admin
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Butuh bantuan?{' '}
          <a href="#" className="text-primary hover:underline">
            Hubungi Admin
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
