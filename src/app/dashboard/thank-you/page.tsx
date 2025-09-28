'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, BarChart2 } from 'lucide-react';
import ResultsDialog from '@/components/results-dialog';

export default function ThankYouPage() {
  const router = useRouter();
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  return (
    <>
      <div className="container mx-auto flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center px-4 text-center md:px-6">
        <CheckCircle className="h-24 w-24 text-green-500" />
        <h1 className="mt-6 text-4xl font-bold font-lexend text-gray-800">
          Terima Kasih!
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Suara Anda telah berhasil direkam. Terima kasih telah berpartisipasi
          dalam pemilihan Ketua OSIS SMKN 2 Tana Toraja.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button onClick={() => setIsResultsOpen(true)}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Lihat Hasil Sementara
          </Button>
          <Button variant="outline" onClick={() => router.push('/')}>
            Kembali ke Halaman Depan
          </Button>
        </div>
      </div>
      <ResultsDialog open={isResultsOpen} onOpenChange={setIsResultsOpen} />
    </>
  );
}
