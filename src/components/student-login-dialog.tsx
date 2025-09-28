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
import { GraduationCap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export default function StudentLoginDialog({ children }: { children?: ReactNode }) {
  const router = useRouter();
  const { voters, setCurrentUser } = useAppContext();
  const { toast } = useToast();
  const [nis, setNis] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = () => {
    const voter = voters.find(v => v.nis === nis);
    // Password check is ignored for now
    if (voter) {
        setCurrentUser(voter);
        toast({
            title: "Login Berhasil",
            description: `Selamat datang, ${voter.name}!`,
        });
        setIsOpen(false);
        router.push('/dashboard');
    } else {
        toast({
            title: "Login Gagal",
            description: "NIS tidak ditemukan atau salah.",
            variant: "destructive",
        })
    }
  };
  
  const trigger = children ? children : <Button variant="outline">Login Siswa</Button>;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
            <div className="bg-primary/10 p-3 rounded-full mb-2">
                <GraduationCap className="w-8 h-8 text-primary" />
            </div>
          <DialogTitle className="text-2xl font-bold font-lexend">Login Siswa</DialogTitle>
          <DialogDescription>
            Masuk untuk memberikan suara.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nis">Nomor Induk Siswa (NIS)</Label>
            <Input id="nis" placeholder="Masukkan NIS Anda" value={nis} onChange={e => setNis(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input id="password" type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        <Button type="submit" className="w-full font-bold" onClick={handleLogin}>
            <ArrowRight className="mr-2 h-4 w-4"/>
            Masuk sebagai Siswa
        </Button>
        <p className="text-center text-sm text-muted-foreground">
            Butuh bantuan? <a href="#" className="text-primary hover:underline">Hubungi Admin</a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
