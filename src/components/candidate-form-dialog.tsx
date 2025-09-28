
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
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { Candidate } from '@/lib/data';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

interface CandidateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate | null;
}

export default function CandidateFormDialog({ open, onOpenChange, candidate }: CandidateFormDialogProps) {
  const { addCandidate, updateCandidate } = useAppContext();
  const { toast } = useToast();
  
  const [partyName, setPartyName] = useState('');
  const [presidentName, setPresidentName] = useState('');
  const [presidentPhotoUrl, setPresidentPhotoUrl] = useState('');
  const [vicePresidentName, setVicePresidentName] = useState('');
  const [vicePresidentPhotoUrl, setVicePresidentPhotoUrl] = useState('');
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  
  const isEditMode = !!candidate;

  useEffect(() => {
    if (open && candidate) {
      setPartyName(candidate.partyName);
      setPresidentName(candidate.presidentName);
      setPresidentPhotoUrl(candidate.presidentPhotoUrl);
      setVicePresidentName(candidate.vicePresidentName);
      setVicePresidentPhotoUrl(candidate.vicePresidentPhotoUrl);
      setVision(candidate.vision);
      setMission(candidate.mission);
    } else if (!open) {
      // Reset form when dialog is closed
      setPartyName('');
      setPresidentName('');
      setPresidentPhotoUrl('');
      setVicePresidentName('');
      setVicePresidentPhotoUrl('');
      setVision('');
      setMission('');
    }
  }, [open, candidate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCandidateData = {
        partyName,
        presidentName,
        presidentPhotoUrl: presidentPhotoUrl || `https://picsum.photos/seed/${presidentName.replace(/\s/g, '')}/400/400`,
        presidentPhotoHint: 'student portrait',
        vicePresidentName,
        vicePresidentPhotoUrl: vicePresidentPhotoUrl || `https://picsum.photos/seed/${vicePresidentName.replace(/\s/g, '')}/400/400`,
        vicePresidentPhotoHint: 'student portrait',
        vision,
        mission,
    };

    try {
        if (isEditMode && candidate) {
            await updateCandidate(candidate.id, { ...candidate, ...newCandidateData });
            toast({ title: "Berhasil", description: "Data kandidat berhasil diperbarui." });
        } else {
            await addCandidate(newCandidateData);
            toast({ title: "Berhasil", description: "Kandidat baru berhasil ditambahkan." });
        }
        onOpenChange(false);
    } catch(error: any) {
        toast({ title: "Gagal", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="font-lexend">{isEditMode ? 'Edit Paslon' : 'Tambah Paslon Baru'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Perbarui detail pasangan calon di bawah ini.' : 'Isi formulir untuk menambahkan paslon baru.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="partyName" className="text-right">Nama Partai</Label>
                  <Input id="partyName" value={partyName} onChange={(e) => setPartyName(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="presidentName" className="text-right">Calon Ketua</Label>
                  <Input id="presidentName" value={presidentName} onChange={(e) => setPresidentName(e.target.value)} className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="presidentPhotoUrl" className="text-right">URL Foto Ketua</Label>
                  <Input id="presidentPhotoUrl" value={presidentPhotoUrl} onChange={(e) => setPresidentPhotoUrl(e.target.value)} className="col-span-3" placeholder="Opsional"/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vicePresidentName" className="text-right">Calon Wakil</Label>
                  <Input id="vicePresidentName" value={vicePresidentName} onChange={(e) => setVicePresidentName(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vicePresidentPhotoUrl" className="text-right">URL Foto Wakil</Label>
                  <Input id="vicePresidentPhotoUrl" value={vicePresidentPhotoUrl} onChange={(e) => setVicePresidentPhotoUrl(e.target.value)} className="col-span-3" placeholder="Opsional"/>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="vision" className="text-right pt-2">Visi</Label>
                  <Textarea id="vision" value={vision} onChange={(e) => setVision(e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="mission" className="text-right pt-2">Misi</Label>
                  <Textarea id="mission" value={mission} onChange={(e) => setMission(e.target.value)} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter className='mt-4'>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                <Button type="submit" variant="destructive">{isEditMode ? 'Simpan Perubahan' : 'Tambah Paslon'}</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
