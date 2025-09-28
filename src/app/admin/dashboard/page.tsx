
'use client';

import {
  Users,
  UserCheck,
  ListChecks,
  BarChart,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ResultsChart from '@/components/results-chart';
import { useAppContext } from '@/context/AppContext';
import { electionSchedule } from '@/lib/data';

const loginActivities = [
    { name: "Anta Massora", nis: "12345", time: "2 menit yang lalu"},
    { name: "Admin Utama", nis: "ADMIN", time: "1 jam yang lalu"},
]

export default function AdminDashboardPage() {
    const { candidates, voters } = useAppContext();

    const totalVotes = voters.filter(v => v.hasVoted).length;
    const participation = voters.length > 0 ? (totalVotes / voters.length) * 100 : 0;

    const statData = [
        {
          title: 'Total Paslon',
          value: candidates.length.toString(),
          icon: ListChecks,
        },
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
          title: 'Partisipasi',
          value: `${participation.toFixed(1)}%`,
          icon: BarChart,
        },
      ];

      const chartData = candidates.map(c => ({ name: c.partyName.split(' ').join('\n'), votes: c.votes || 0 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-lexend text-destructive">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut adalah ringkasan sistem PEMILOS PINTAR.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Perolehan Suara</CardTitle>
            <CardDescription>Grafik perolehan suara sementara untuk setiap paslon.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResultsChart data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Login</CardTitle>
            <CardDescription>Pengguna yang baru saja masuk ke sistem.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pengguna</TableHead>
                        <TableHead className="text-right">Waktu</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loginActivities.map((activity, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="font-medium">{activity.name}</div>
                                <div className="text-xs text-muted-foreground">{activity.nis}</div>
                            </TableCell>
                            <TableCell className="text-right text-xs">{activity.time}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Jadwal Pemilihan</CardTitle>
            <CardDescription>Linimasa dan tahapan pelaksanaan pemilihan OSIS.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex justify-between items-center space-x-4">
                {electionSchedule.map((item, index) => (
                    <div key={index} className="flex-1 text-center">
                        <div className="flex justify-center mb-2">
                            <div className={`w-4 h-4 rounded-full ${item.active ? 'bg-destructive' : 'bg-gray-300'}`}></div>
                        </div>
                        <p className="font-semibold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                ))}
            </div>
             <div className="relative w-full h-1 bg-gray-300 mt-[-1.5rem] -z-10">
                <div className="absolute w-3/4 h-full bg-destructive"></div>
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
