
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  CheckSquare,
  BarChart3,
  Vote,
  User,
  Calendar,
  ClipboardList,
  Megaphone,
  Award,
} from 'lucide-react';
import ResultsChart from '@/components/results-chart';
import StudentLoginDialog from '@/components/student-login-dialog';
import AdminLoginDialog from '@/components/admin-login-dialog';
import { useAppContext } from '@/context/AppContext';
import StatsDialog from '@/components/stats-dialog';

const timelineData = [
  {
    icon: ClipboardList,
    title: 'Pendaftaran Calon',
    date: '1-3 September 2025',
  },
  {
    icon: User,
    title: 'Penetapan Calon',
    date: '4 September 2025',
  },
  {
    icon: Megaphone,
    title: 'Masa Kampanye',
    date: '5-10 September 2025',
  },
    {
    icon: Calendar,
    title: 'Masa Tenang',
    date: '11-12 September 2025',
  },
  {
    icon: Vote,
    title: 'Pemungutan Suara',
    date: '13 September 2025',
  },
  {
    icon: Award,
    title: 'Penetapan Pemenang',
    date: '14 September 2025',
  },
];


const newsData = [
    {
        image: "https://picsum.photos/seed/news1/600/400",
        imageHint: "students meeting",
        title: "SMKN 2 Tana Toraja Siap Gelar Pemilihan Ketua OSIS Digital Pertama",
        date: "28 Agu 2025"
    },
    {
        image: "https://picsum.photos/seed/news2/600/400",
        imageHint: "candidate debate",
        title: "Debat Kandidat: Para Calon Ketua OSIS Adu Visi dan Misi",
        date: "29 Agu 2025"
    },
    {
        image: "https://picsum.photos/seed/news3/600/400",
        imageHint: "voting computer",
        title: "Bagaimana Cara Kerja Sistem E-Voting di Pemilihan Kali Ini?",
        date: "30 Agu 2025"
    }
]

export type StatType = 'candidates' | 'votes' | 'voters' | 'participation' | null;

export default function HomePage() {
  const { candidates, voters } = useAppContext();
  const totalVoters = voters.length;
  const votedCount = voters.filter(v => v.hasVoted).length;
  const participation = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;
  const [isStatDialogOpen, setIsStatDialogOpen] = useState(false);
  const [activeStat, setActiveStat] = useState<StatType>(null);

  const [chartData] = useState([
    { name: '08:00', votes: 0 },
    { name: '09:00', votes: Math.floor(votedCount * 0.1) },
    { name: '10:00', votes: Math.floor(votedCount * 0.3) },
    { name: '11:00', votes: Math.floor(votedCount * 0.6) },
    { name: '12:00', votes: Math.floor(votedCount * 0.8) },
    { name: '13:00', votes: votedCount },
    { name: '14:00', votes: votedCount },
  ]);
  
  const statData = [
    {
      id: 'candidates' as const,
      title: 'Total Paslon',
      value: candidates.length.toString(),
      icon: Users,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      id: 'votes' as const,
      title: 'Suara Masuk',
      value: votedCount.toString(),
      icon: CheckSquare,
      color: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      id: 'voters' as const,
      title: 'Total Pemilih',
      value: totalVoters.toString(),
      icon: BarChart3,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
     {
      id: 'participation' as const,
      title: 'Partisipasi',
      value: `${participation.toFixed(1)}%`,
      icon: Vote,
      color: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
  ];

  const handleScrollToCandidates = () => {
    document.getElementById('candidates-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleStatClick = (statId: StatType) => {
    setActiveStat(statId);
    setIsStatDialogOpen(true);
  }


  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-20 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Image src="https://iili.io/KAqSp4V.png" alt="Logo Aplikasi" width={40} height={40} />
            <div>
              <p className="text-sm font-bold text-gray-800">Kombel SMKN 2 Tana Toraja</p>
              <p className="text-xs text-gray-500">Sistem Pemilihan Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StudentLoginDialog />
            <AdminLoginDialog />
          </div>
        </div>
      </header>
      
      <main>
        <section className="relative bg-gradient-to-r from-purple-600 to-blue-500 text-white py-20 px-4 md:px-6">
           <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-lexend">
                        Pemilihan OSIS<br/>SERENTAK 2025/2026
                    </h1>
                    <p className="mt-4 text-lg text-purple-200">
                        Sistem Pemilihan Digital SMKN 2 Tana Toraja
                    </p>
                    <div className="mt-8 flex gap-4">
                      <StudentLoginDialog>
                        <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                            Mulai Voting
                        </Button>
                      </StudentLoginDialog>
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="border-white text-white hover:bg-white/10"
                            onClick={handleScrollToCandidates}
                        >
                            Lihat Kandidat
                        </Button>
                    </div>
                </div>
                <div className="hidden md:block">
                  <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                    <CardHeader className="flex-row items-center gap-4">
                      <Image src="https://iili.io/KAqSZhb.png" alt="Logo SMKN 2" width={60} height={60}/>
                      <div>
                        <CardTitle className="text-white">SMKN 2 Tana Toraja</CardTitle>
                        <CardDescription className="text-purple-200">Jl. Poros Mebali Buntu, Gandangbatu Sillanan</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
           </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 py-12 -mt-12 relative z-10">
            <h3 className="text-2xl font-bold text-center font-lexend mb-6 text-gray-800">Statistik Pemilihan Real-time</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statData.map((stat) => (
                    <div key={stat.id} onClick={() => handleStatClick(stat.id)} className="cursor-pointer">
                        <Card className="overflow-hidden h-full">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`p-3 rounded-md ${stat.color}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <p className="text-2xl font-bold font-lexend">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 py-8">
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Tren Partisipasi</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResultsChart data={chartData} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Aktivitas Terkini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                           <div className="flex items-start gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckSquare className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm">Anta Massora berhasil melakukan voting</p>
                                    <p className="text-xs text-muted-foreground">beberapa saat lalu</p>
                                </div>
                           </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
        
        <section className="container mx-auto px-4 md:px-6 py-12">
           <Card className="bg-yellow-50 border-yellow-200">
             <CardContent className="p-4 flex items-start gap-4">
                <div className="text-yellow-600 mt-1">
                    <Megaphone className="w-6 h-6"/>
                </div>
                <div>
                    <h4 className="font-bold text-yellow-800">Penting untuk diperhatikan</h4>
                    <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
                        <li>Pastikan Anda telah terdaftar sebagai pemilih tetap.</li>
                        <li>Gunakan hak suara Anda dengan bijak, satu suara sangat berarti.</li>
                        <li>Pilihlan kandidat berdasarkan Visi & Misi, bukan karena paksaan.</li>
                    </ul>
                </div>
             </CardContent>
           </Card>
        </section>

        <section id="candidates-section" className="bg-gray-100 py-16 scroll-mt-20">
          <div className="container mx-auto px-4 md:px-6">
              <h3 className="text-3xl font-bold text-center font-lexend mb-2">Kandidat Osis SMKN 2 Tana Toraja</h3>
              <p className="text-center text-muted-foreground mb-8">Kenali visi dan misi para pasangan calon ketua dan wakil osis</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {candidates.map(candidate => (
                    <Card key={candidate.id} className="text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                       <CardHeader>
                          <div className="flex justify-center -space-x-6">
                            <Image
                                src={candidate.presidentPhotoUrl}
                                alt={`Foto ${candidate.presidentName}`}
                                width={100}
                                height={100}
                                className="rounded-full object-cover border-4 border-white shadow-lg z-10"
                                data-ai-hint={candidate.presidentPhotoHint}
                            />
                             <Image
                                src={candidate.vicePresidentPhotoUrl}
                                alt={`Foto ${candidate.vicePresidentName}`}
                                width={100}
                                height={100}
                                className="rounded-full object-cover border-4 border-white shadow-lg"
                                data-ai-hint={candidate.vicePresidentPhotoHint}
                            />
                          </div>
                       </CardHeader>
                       <CardContent className="p-6 pt-2">
                          <h4 className="text-xl font-bold font-lexend">{candidate.partyName}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {candidate.presidentName} & {candidate.vicePresidentName}
                          </p>
                          <p className="text-sm mt-4 italic text-gray-600 line-clamp-2">"{candidate.vision}"</p>
                          <Button className="mt-6 w-full">Baca Selengkapnya</Button>
                       </CardContent>
                    </Card>
                  ))}
              </div>
          </div>
        </section>
        
        <section className="container mx-auto px-4 md:px-6 py-16">
             <h3 className="text-3xl font-bold text-center font-lexend mb-2">Sorotan Berita Pemilihan</h3>
             <p className="text-center text-muted-foreground mb-8">Ikuti perkembangan terbaru seputar pemilihan serentak</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {newsData.map((news, index) => (
                    <Card key={index} className="overflow-hidden group">
                        <div className="relative h-48">
                            <Image src={news.image} alt={news.title} fill className="object-cover transition-transform duration-300 group-hover:scale-110" data-ai-hint={news.imageHint} />
                        </div>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground">{news.date}</p>
                            <h4 className="font-bold mt-1 line-clamp-2">{news.title}</h4>
                        </CardContent>
                    </Card>
                ))}
             </div>
        </section>

        <section className="bg-gray-100 py-16">
            <div className="container mx-auto px-4 md:px-6">
                <h3 className="text-3xl font-bold text-center font-lexend mb-8">Tahapan Pemilihan</h3>
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2"></div>
                    {timelineData.map((item, index) => (
                        <div key={index} className={`relative flex items-center w-full my-6 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <div className={`relative w-5/12`}>
                              <Card className="p-4">
                                <h4 className="font-bold font-lexend text-md">{item.title}</h4>
                                <p className="text-muted-foreground text-sm">{item.date}</p>
                              </Card>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground ring-4 ring-background">
                            <item.icon className="w-5 h-5"/>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-wrap justify-between items-start gap-8">
            <div className="flex-shrink-0">
                <div className="flex items-center gap-3 mb-2">
                    <Image src="https://iili.io/KAqSp4V.png" alt="Logo Aplikasi" width={32} height={32} />
                    <h4 className="font-bold text-lg text-white">Kombel SMKN 2 Tana Toraja</h4>
                </div>
                <p className="text-sm">Badan Penyelenggara Pemilihan OSIS SMKN 2 Tana Toraja</p>
            </div>
            <div className="text-center">
                <h4 className="font-bold text-lg text-white mb-2">Kontak</h4>
                <ul className="text-sm space-y-1">
                    <li>Email: kpu.smkn2toraja@email.com</li>
                    <li>Telepon: +62 812 3456 7890</li>
                </ul>
            </div>
             <div className="text-right">
                <h4 className="font-bold text-lg text-white mb-2">Tautan</h4>
                <ul className="text-sm space-y-1">
                    <li><a href="#" className="hover:underline">Panduan Voting</a></li>
                    <li><a href="#" className="hover:underline">FAQ</a></li>
                    <li><a href="#" className="hover:underline">Hubungi Bantuan</a></li>
                </ul>
            </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-8 border-t border-gray-700 pt-6 text-center text-sm">
            <p>&copy; 2025 Kombel SMKN 2 Tana Toraja. All rights reserved.</p>
        </div>
      </footer>
      <StatsDialog 
        open={isStatDialogOpen} 
        onOpenChange={setIsStatDialogOpen} 
        type={activeStat}
      />
    </div>
  );
}
