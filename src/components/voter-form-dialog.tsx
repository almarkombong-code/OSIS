
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { Voter } from '@/lib/data';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

interface VoterFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  voter: Voter | null;
}

export default function VoterFormDialog({ open, onOpenChange, voter }: VoterFormDialogProps) {
  const { addVoter, updateVoter } = useAppContext();
  const { toast } = useToast();
  
  const [nis, setNis] = useState('');
  const [name, setName] = useState('');
  const [voterClass, setVoterClass] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const isEditMode = !!voter;

  useEffect(() => {
    if (open && voter) {
      setNis(voter.nis);
      setName(voter.name);
      setVoterClass(voter.class);
      setAvatarUrl(voter.avatarUrl);
    } else if (!open) {
      // Reset form when dialog is closed
      setNis('');
      setName('');
      setVoterClass('');
      setAvatarUrl('');
    }
  }, [open, voter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVoterData = {
        nis,
        name,
        class: voterClass,
        avatarUrl: avatarUrl || `https://picsum.photos/seed/${nis}/100/100`,
    };

    try {
        if (isEditMode && voter) {
            await updateVoter(voter.id, newVoterData);
            toast({ title: "Berhasil", description: "Data pemilih berhasil diperbarui." });
        } else {
            await addVoter(newVoterData);
            toast({ title: "Berhasil", description: "Pemilih baru berhasil ditambahkan." });
        }
        onOpenChange(false);
    } catch(error: any) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-lexend">{isEditMode ? 'Edit Pemilih' : 'Tambah Pemilih Baru'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Perbarui detail pemilih di bawah ini.' : 'Isi formulir di bawah untuk menambahkan pemilih baru.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nis" className="text-right">NIS</Label>
                <Input id="nis" value={nis} onChange={(e) => setNis(e.target.value)} className="col-span-3" required disabled={isEditMode} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nama</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="class" className="text-right">Kelas</Label>
                <Input id="class" value={voterClass} onChange={(e) => setVoterClass(e.target.value)} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avatarUrl" className="text-right">URL Avatar</Label>
                <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="col-span-3" placeholder="Opsional, akan dibuat otomatis"/>
            </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                <Button type="submit" variant="destructive">{isEditMode ? 'Simpan Perubahan' : 'Tambah Pemilih'}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
