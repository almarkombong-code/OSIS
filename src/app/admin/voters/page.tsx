
'use client';

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
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { useRef, useState } from 'react';
import VoterFormDialog from '@/components/voter-form-dialog';
import { Voter } from '@/lib/data';
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


export default function VotersPage() {
  const { voters, addVoter, removeVoter, removeAllVoters } = useAppContext();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredVoters = voters.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.nis.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setSelectedVoter(null);
    setIsFormOpen(true);
  }

  const handleEdit = (voter: Voter) => {
    setSelectedVoter(voter);
    setIsFormOpen(true);
  }

  const handleExport = () => {
    const dataToExport = filteredVoters.map(v => ({
      'NIS': v.nis,
      'Nama': v.name,
      'Kelas': v.class,
      'URL Avatar': v.avatarUrl,
      'Status Memilih': v.hasVoted ? 'Sudah Memilih' : 'Belum Memilih'
    }));
    exportToExcel([{ sheetName: 'Data Pemilih', data: dataToExport }], 'data-pemilih');
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
      let skippedCount = 0;
      
      const promises = data.map(async (row: any) => {
        const voterData = {
          nis: String(row['NIS']),
          name: row['Nama'],
          class: String(row['Kelas']),
          avatarUrl: row['URL Avatar'] || `https://picsum.photos/seed/${String(row['NIS'])}/100/100`
        };

        if(voterData.nis && voterData.name && voterData.class) {
            try {
                await addVoter(voterData);
                addedCount++;
            } catch (error: any) {
                skippedCount++;
                console.warn(error.message);
            }
        }
      });
      
      await Promise.all(promises);

      toast({
        title: "Impor Berhasil",
        description: `${addedCount} data ditambahkan, ${skippedCount} data duplikat dilewati.`,
      })
    } catch (error) {
      toast({
        title: "Impor Gagal",
        description: "Gagal membaca file Excel. Pastikan format file sudah benar.",
        variant: "destructive"
      });
    }

    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold font-lexend text-destructive">Data Pemilih</h1>
      <p className="text-muted-foreground">
        Panel kontrol data pemilih OSIS SERENTAK
      </p>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari nama atau NIS..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                Import Excel
              </Button>
              <Button variant="outline" onClick={handleExport} disabled={voters.length === 0}>
                <FileDown className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="destructive" onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Data
              </Button>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={voters.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Semua Data
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini akan menghapus semua data pemilih secara permanen dan mereset status voting. Data yang sudah dihapus tidak dapat dikembalikan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={removeAllVoters}>Ya, Hapus Semua</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVoters.map((voter) => (
                <TableRow key={voter.id}>
                  <TableCell className="font-medium">{voter.nis}</TableCell>
                  <TableCell>{voter.name}</TableCell>
                  <TableCell>{voter.class}</TableCell>
                  <TableCell>
                    <Badge variant={voter.hasVoted ? 'default' : 'destructive'} className={voter.hasVoted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {voter.hasVoted ? 'Sudah Memilih' : 'Belum Memilih'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(voter)}>
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
                          <AlertDialogTitle>Hapus Pemilih?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus pemilih <span className="font-bold">{voter.name}</span> dengan NIS <span className='font-bold'>{voter.nis}</span>? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeVoter(voter.id)}>Ya, Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <VoterFormDialog 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        voter={selectedVoter}
      />
    </div>
  );
}
