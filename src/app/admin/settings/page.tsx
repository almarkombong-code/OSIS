
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date('2025-09-14')
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date('2025-09-15')
  );
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Pengaturan Disimpan",
      description: "Jadwal dan status sistem telah diperbarui.",
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-lexend text-destructive">Pengaturan Sistem</h1>
      <p className="text-muted-foreground">
        Atur jadwal dan status sistem pemilihan. Perubahan akan berlaku secara global.
      </p>

      <Card className="mt-6 max-w-3xl mx-auto">
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="start-date">Tanggal Mulai Voting</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                Waktu dimulainya siswa dapat memberikan suara.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Tanggal Selesai Voting</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                Waktu terakhir siswa dapat memberikan suara.
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
             <Label>Status Sistem Voting</Label>
             <div className="flex items-center space-x-4 p-4 border rounded-lg mt-2">
                <Switch id="voting-status" defaultChecked />
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                        Aktifkan untuk mengizinkan siswa login dan memilih. Nonaktifkan untuk menutup sesi voting.
                    </p>
                </div>
             </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 justify-end">
          <Button variant="destructive" onClick={handleSave}>Simpan Pengaturan</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
