
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { Download, Users, UserCheck, Percent } from 'lucide-react';
import { exportToExcel } from '@/lib/excel';

export default function ResultsPage() {
    const { candidates, voters } = useAppContext();
    const totalVotes = candidates.reduce((acc, candidate) => acc + (candidate.votes || 0), 0);
    const totalVoters = voters.length;
    const votedCount = voters.filter(v => v.hasVoted).length;
    const participation = totalVoters > 0 ? (votedCount / totalVoters) * 100 : 0;

    const electionStats = [
      {
        icon: Users,
        label: 'Total Pemilih',
        value: totalVoters.toString(),
      },
      {
        icon: UserCheck,
        label: 'Suara Masuk',
        value: votedCount.toString(),
      },
      {
        icon: Percent,
        label: 'Tingkat Partisipasi',
        value: `${participation.toFixed(1)}%`,
      },
    ];

    const handleExportResults = () => {
        const summarySheet = {
            sheetName: 'Ringkasan Hasil',
            data: [
                { 'Metrik': 'Total Pemilih Terdaftar', 'Jumlah': totalVoters },
                { 'Metrik': 'Total Suara Masuk', 'Jumlah': votedCount },
                { 'Metrik': 'Tingkat Partisipasi', 'Jumlah': `${participation.toFixed(2)}%` },
            ]
        };

        const detailsSheet = {
            sheetName: 'Rincian Suara',
            data: candidates.sort((a,b) => (b.votes || 0) - (a.votes || 0)).map(c => ({
                'ID Paslon': c.id,
                'Nama Partai': c.partyName,
                'Calon Ketua': c.presidentName,
                'Calon Wakil': c.vicePresidentName,
                'Jumlah Suara': c.votes || 0,
                'Persentase Suara': totalVotes > 0 ? `${((c.votes || 0) / totalVotes * 100).toFixed(2)}%` : '0.00%',
            }))
        };

        exportToExcel([summarySheet, detailsSheet], 'hasil-pemilihan');
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold font-lexend text-destructive">Hasil Pemilihan Real-time</h1>
            <p className="text-muted-foreground">
                Panel hasil akhir dan statistik pemilihan OSIS SERENTAK.
            </p>
        </div>
        <Button variant="destructive" onClick={handleExportResults} disabled={candidates.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Rekapitulasi &amp; Export Hasil
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
            {candidates.sort((a, b) => (b.votes || 0) - (a.votes || 0)).map((candidate) => {
                const votePercentage = totalVotes > 0 ? ((candidate.votes || 0) / totalVotes) * 100 : 0;
                return (
                    <Card key={candidate.id} className="overflow-hidden">
                        <CardContent className="p-4 flex items-center gap-4 relative">
                             <div className="absolute top-0 left-0 h-full bg-destructive/10 -z-0" style={{ width: `${votePercentage}%` }}></div>
                             <div className="flex -space-x-4 z-10">
                                <Image
                                    src={candidate.presidentPhotoUrl}
                                    alt={candidate.presidentName}
                                    width={60}
                                    height={60}
                                    className="rounded-md border-2 border-white object-cover"
                                    data-ai-hint={candidate.presidentPhotoHint}
                                />
                                <Image
                                    src={candidate.vicePresidentPhotoUrl}
                                    alt={candidate.vicePresidentName}
                                    width={60}
                                    height={60}
                                    className="rounded-md border-2 border-white object-cover"
                                    data-ai-hint={candidate.vicePresidentPhotoHint}
                                />
                             </div>
                            <div className="flex-grow z-10">
                                <h3 className="font-bold">{candidate.partyName}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {candidate.presidentName} & {candidate.vicePresidentName}
                                </p>
                            </div>
                            <div className="text-right z-10">
                                <p className="text-2xl font-bold font-lexend text-destructive">{votePercentage.toFixed(1)}%</p>
                                <p className="text-sm text-muted-foreground">{candidate.votes || 0} Suara</p>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>

        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Statistik Voting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {electionStats.map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-3">
                                <stat.icon className="h-5 w-5 text-muted-foreground" />
                                <p className="text-sm font-medium">{stat.label}</p>
                            </div>
                            <p className="font-bold">{stat.value}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
