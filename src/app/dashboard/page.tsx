
'use client';

import Image from 'next/image';
import {
  UserCircle,
  Hash,
  Users,
  Clock,
  Info,
  Calendar,
  QrCode,
  ListChecks,
  ThumbsUp,
  BarChart,
  UserCheck,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Candidate } from '@/lib/data';
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
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { candidates, voters, currentUser, castVote } = useAppContext();
  const { toast } = useToast();

  if (!currentUser) {
    // This should not happen if login is enforced, but it's a good safeguard
    // In a real app, you might redirect to login page
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Siswa tidak ditemukan. Silakan login kembali.</p>
        </div>
    );
  }

  const handleVote = (candidateId: string) => {
    if (!currentUser || currentUser.hasVoted) {
        toast({
            title: "Gagal",
            description: "Anda sudah memberikan suara atau sesi tidak valid.",
            variant: "destructive",
        })
        return;
    }
    castVote(candidateId, currentUser.nis)
      .then(() => {
        router.push('/dashboard/thank-you');
      })
      .catch((error) => {
        toast({
            title: "Gagal Memberikan Suara",
            description: error.message,
            variant: "destructive",
        });
      });
  };

  const totalVotes = voters.filter(v => v.hasVoted).length;
  const participation = voters.length > 0 ? (totalVotes / voters.length) * 100 : 0;
  
  const statData = [
    {
      title: 'Total Pemilih',
      value: voters.length.toString(),
      icon: Users,
    },
    {
      title: 'Suara Masuk',
      value: totalVotes.toString(),
      icon: UserCheck,
    },
    {
      title: 'Paslon',
      value: candidates.length.toString(),
      icon: ListChecks,
    },
    {
      title: 'Partisipasi',
      value: `${participation.toFixed(1)}%`,
      icon: BarChart,
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <section className="text-center">
        <UserCircle className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold font-lexend">Selamat Datang!</h1>
        <p className="mt-2 text-muted-foreground">
          Anda telah berhasil masuk ke sistem pemilihan OSIS. Silakan pilih
          pasangan calon terbaik Anda.
        </p>
      </section>

      <section className="mt-8 max-w-md mx-auto">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback className="text-2xl">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-lg">{currentUser.name}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  <span>NIS: {currentUser.nis}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Kelas: {currentUser.class}</span>
                </div>
              </div>
              <Badge variant={currentUser.hasVoted ? 'default' : 'destructive'} className={`mt-2 ${currentUser.hasVoted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <Clock className="h-3 w-3 mr-1" />
                {currentUser.hasVoted ? 'Sudah Memilih' : 'Belum Memilih'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex-row items-start gap-4 space-y-0">
            <Info className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <CardTitle className="text-blue-800">Petunjuk Voting</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
              <li>Klik pada paslon yang ingin Anda pilih.</li>
              <li>
                Pelajari profil paslon dengan mengklik &quot;Lihat
                Detail&quot;.
              </li>
              <li>
                Setelah yakin, klik tombol &quot;Pilih Paslon Ini&quot; untuk
                mengonfirmasi.
              </li>
              <li>Pilihan Anda tidak dapat diubah setelah dikonfirmasi.</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="text-center flex flex-col justify-center items-center">
            <CardHeader>
                <div className='flex items-center gap-2 text-muted-foreground'>
                    <Calendar className="h-5 w-5" />
                    <p>HARI PEMILIHAN</p>
                </div>
                <p className="text-4xl font-bold font-lexend text-primary">14 <span className='text-xl'>September 2025</span></p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
                <QrCode className="h-20 w-20"/>
                <p className="text-sm font-semibold">PANDUAN</p>
            </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="text-center text-2xl font-bold font-lexend">
          Pilih Pasangan Calon OSIS 2025
        </h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map((candidate: Candidate) => (
            <Card key={candidate.id} className="relative overflow-hidden">
                <CardHeader className='items-center text-center'>
                    <div className="flex justify-center -space-x-8">
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
                    <CardTitle>{candidate.partyName}</CardTitle>
                    <CardDescription>
                        {candidate.presidentName} & {candidate.vicePresidentName}
                    </CardDescription>
                </CardHeader>
              <CardContent>
                <div className='text-sm space-y-3'>
                    <div>
                        <h4 className='font-semibold'>Visi:</h4>
                        <p className='text-muted-foreground line-clamp-2'>{candidate.vision}</p>
                    </div>
                    <div>
                        <h4 className='font-semibold'>Misi:</h4>
                        <p className='text-muted-foreground whitespace-pre-line line-clamp-3'>{candidate.mission}</p>
                    </div>
                </div>

                <div className='flex justify-between items-center mt-4 text-sm text-muted-foreground border-t pt-4'>
                    <span>Suara Sementara</span>
                    <span className='font-bold text-primary'>{candidate.votes || 0}</span>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="outline">Lihat Detail</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button disabled={currentUser.hasVoted}>
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          {currentUser.hasVoted ? 'Sudah Memilih' : 'Pilih Paslon Ini'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Pilihan Anda</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin memilih paslon dari{' '}
                            <span className="font-bold">{candidate.partyName}</span>? Pilihan Anda tidak
                            dapat diubah setelah ini.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batalkan</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleVote(candidate.id)}>
                            Ya, Saya Yakin
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-center font-lexend mb-6 text-gray-800">
          Statistik Pemilihan Real-time
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {statData.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-md bg-primary/10 text-primary">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold font-lexend">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
