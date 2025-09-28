
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { RadialBar, RadialBarChart } from 'recharts';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const chartConfig = {
  votes: {
    label: 'Suara',
  },
};

export default function ResultsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { candidates } = useAppContext();
  const totalVotes = candidates.reduce((acc, c) => acc + (c.votes || 0), 0);

  const radialChartData = candidates.map(c => ({
      name: c.partyName,
      votes: c.votes || 0,
      fill: `hsl(var(--chart-${c.id}))`
  }))


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-lexend text-white">
            Perolehan Suara Sementara
          </DialogTitle>          <DialogDescription className="text-gray-400">
            Hasil ini diperbarui secara real-time. Arahkan mouse ke grafik untuk
            detail.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
          <div className="flex flex-col items-center justify-center h-full">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-full w-full max-w-[250px]"
            >
              <RadialBarChart
                data={radialChartData}
                startAngle={90}
                endAngle={-270}
                innerRadius="60%"
                outerRadius="100%"
                barSize={12}
                cy="50%"
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="name" />}
                />
                <RadialBar dataKey="votes" background cornerRadius={10} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-100 text-5xl font-bold">
                    {totalVotes}
                </text>
                 <text x="50%" y="65%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-300 text-lg">
                    Suara
                </text>
              </RadialBarChart>
            </ChartContainer>
          </div>
          <div className="space-y-4">
            {candidates.sort((a,b) => (b.votes || 0) - (a.votes || 0)).map((candidate) => (
              <div key={candidate.id} className="p-3 rounded-lg bg-gray-700/50 flex items-center justify-between">
                <div className='flex items-center gap-3'>
                    <div className="flex -space-x-3">
                        <Image src={candidate.presidentPhotoUrl} alt={candidate.presidentName} width={40} height={40} className='rounded-full object-cover border-2 border-gray-600' />
                        <Image src={candidate.vicePresidentPhotoUrl} alt={candidate.vicePresidentName} width={40} height={40} className='rounded-full object-cover border-2 border-gray-600' />
                    </div>
                    <div>
                        <p className='font-semibold'>{candidate.partyName}</p>
                        <p className='text-sm text-gray-400'>{candidate.votes || 0} Suara</p>
                    </div>
                </div>
                <p className='font-bold text-lg' style={{color: `hsl(var(--chart-${candidate.id}))`}}>{totalVotes > 0 ? ((candidate.votes || 0) / totalVotes * 100).toFixed(1) : '0.0'}%</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
