
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { type StatType } from '@/app/page';
import ResultsChart from './results-chart';

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: StatType;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

export default function StatsDialog({
  open,
  onOpenChange,
  type,
}: StatsDialogProps) {
  const { candidates, voters } = useAppContext();

  const getDialogContent = () => {
    switch (type) {
      case 'candidates':
        const candidateVoteData = candidates.map((c) => ({
          name: c.partyName.split(' ').join('\n'),
          votes: c.votes || 0,
        }));
        return {
          title: 'Perolehan Suara per Paslon',
          description: 'Grafik ini menunjukkan jumlah suara yang diperoleh setiap paslon.',
          chart: <ResultsChart data={candidateVoteData} />,
        };
      case 'votes':
        const votedCount = voters.filter((v) => v.hasVoted).length;
        const votesOverTimeData = [
            { name: '08:00', votes: Math.floor(votedCount * 0.1) },
            { name: '09:00', votes: Math.floor(votedCount * 0.2) },
            { name: '10:00', votes: Math.floor(votedCount * 0.4) },
            { name: '11:00', votes: Math.floor(votedCount * 0.7) },
            { name: '12:00', votes: votedCount },
        ];
         return {
          title: 'Tren Suara Masuk',
          description: 'Grafik ini menunjukkan akumulasi suara yang masuk dari waktu ke waktu.',
          chart: <ResultsChart data={votesOverTimeData} />,
        };
      case 'voters':
        const totalVoters = voters.length;
        const hasVoted = voters.filter((v) => v.hasVoted).length;
        const notVoted = totalVoters - hasVoted;
        const voterStatusData = [
          { name: 'Sudah Memilih', value: hasVoted },
          { name: 'Belum Memilih', value: notVoted },
        ];
        return {
          title: 'Status Pemilih',
          description: 'Grafik ini menunjukkan perbandingan antara pemilih yang sudah dan belum memberikan suara.',
          chart: (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={voterStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {voterStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ),
        };
      case 'participation':
         const participationPercent = voters.length > 0 ? (voters.filter(v=>v.hasVoted).length / voters.length) : 0;
         const participationData = [
          { name: 'Partisipasi', value: participationPercent },
          { name: 'Belum Berpartisipasi', value: 1 - participationPercent },
        ];
         return {
          title: 'Tingkat Partisipasi Pemilih',
          description: 'Persentase pemilih yang telah menggunakan hak suaranya.',
          chart: (
             <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={participationData}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                   {participationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                 <Tooltip />
                 <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-foreground">
                    {(participationPercent * 100).toFixed(1)}%
                </text>
              </PieChart>
            </ResponsiveContainer>
          )
        };
      default:
        return {
          title: '',
          description: '',
          chart: null,
        };
    }
  };

  const { title, description, chart } = getDialogContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-lexend">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Card>
            <CardContent className="p-4 h-80 flex items-center justify-center">
                {chart}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
