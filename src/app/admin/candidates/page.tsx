
'use client';

import Image from 'next/image';
import {
  FileUp,
  FileDown,
  PlusCircle,
  Trash2,
  Search,
  Pencil,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { useRef, useState } from 'react';
import { Candidate } from '@/lib/data';
import CandidateFormDialog from '@/components/candidate-form-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { exportToExcel, readExcelFile } from '@/lib/excel';
import { useToast } from '@/hooks/use-toast';

export default function CandidatesPage() {
  const { candidates, addCandidate, removeCandidate, removeAllCandidates } = useAppContext();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredCandidates = candidates.filter(
    (c) =>
      c.partyName.toLowerCase().includes(search.toLowerCase()) ||
      c.presidentName.toLowerCase().includes(search.toLowerCase()) ||
      c.vicePresidentName.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleAdd = () => {
    setSelectedCandidate(null);
    setIsFormOpen(true);
  }

  const handleEdit = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsFormOpen(true);
  }

  const handleExport = () => {
    const dataToExport = filteredCandidates.map(c => ({
      'ID': c.id,
      'Nama Partai': c.partyName,
      'Calon Ketua': c.presidentName,
      'URL Foto Ketua': c.presidentPhotoUrl,
      'Calon Wakil': c.vicePresidentName,
      'URL Foto Wakil': c.vicePresidentPhotoUrl,
      'Visi': c.vision,
      'Misi': c.mission,
      'Total Suara': c.votes || 0,
    }));
    exportToExcel([{ sheetName: 'Data Kandidat', data: dataToExport }], 'data-kandidat');
  }

  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await readExcelFile(file);
      let addedCount = 0;
      
      const promises = data.map(async (row: any) => {
        const candidateData = {
            partyName: row['Nama Partai'],
            presidentName: row['Calon Ketua'],
            presidentPhotoUrl: row['URL Foto Ketua'] || `https://picsum.photos/seed/${row['Calon Ketua']?.replace(/\s/g, '')}/400/400`,
            presidentPhotoHint: 'student portrait',
            vicePresidentName: row['Calon Wakil'],
            vicePresidentPhotoUrl: row['URL Foto Wakil'] || `https://picsum.photos/seed/${row['Calon Wakil']?.replace(/\s/g, '')}/400/400`,
            vicePresidentPhotoHint: 'student portrait',
            vision: row['Visi'],
            mission: row['Misi'],
        };
        
        if (candidateData.partyName && candidateData.presidentName && candidateData.vicePresidentName && candidateData.vision && candidateData.mission) {
            try {
                await addCandidate(candidateData);
                addedCount++;
            } catch (error: any) {
                console.warn(error.message);
            }
        }
      });

      await Promise.all(promises);

      toast({
        title: "Impor Berhasil",
        description: `${addedCount} data kandidat berhasil ditambahkan.`,
      })
    } catch (error) {
      toast({
        title: "Impor Gagal",
        description: "Gagal membaca file Excel. Pastikan format file sudah benar.",
        variant: "destructive"
      });
    }

    // Reset file input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }


  return (
    <div>
      <h1 className="text-3xl font-bold font-lexend text-destructive">Manajemen Pasangan Calon</h1>
      <p className="text-muted-foreground">
        Panel untuk mengatur data paslon yang akan tampil di halaman depan dan halaman voting.
      </p>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari partai atau nama calon..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                className="hidden"
                accept=".xlsx, .xls"
              />
              <Button variant="outline" onClick={handleTriggerImport}>
                <FileUp className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExport} disabled={candidates.length === 0}>
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="destructive" onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Paslon
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={candidates.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Semua
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini akan menghapus semua data paslon secara permanen. Data yang sudah dihapus tidak dapat dikembalikan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={removeAllCandidates}>Ya, Hapus Semua</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="flex flex-col">
              <CardHeader className="p-4 flex-grow flex flex-col items-center text-center">
                <div className="flex -space-x-8 mb-4">
                  <Image
                    src={candidate.presidentPhotoUrl}
                    alt={candidate.presidentName}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-white shadow-lg object-cover z-10"
                    data-ai-hint={candidate.presidentPhotoHint}
                  />
                   <Image
                    src={candidate.vicePresidentPhotoUrl}
                    alt={candidate.vicePresidentName}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-white shadow-lg object-cover"
                    data-ai-hint={candidate.vicePresidentPhotoHint}
                  />
                </div>
                <h3 className="font-bold font-lexend">{candidate.partyName}</h3>
                <p className="text-xs text-muted-foreground">
                  {candidate.presidentName} & {candidate.vicePresidentName}
                </p>
                <p className="text-3xl font-bold font-lexend text-destructive mt-2">{candidate.votes || 0}</p>
                <p className="text-sm text-muted-foreground">Suara</p>
              </CardHeader>
              <CardFooter className="p-2 border-t justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(candidate)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Paslon?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus paslon dari <span className="font-bold">{candidate.partyName}</span>? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removeCandidate(candidate.id)}>Ya, Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
      <CandidateFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        candidate={selectedCandidate}
      />
    </div>
  );
}
