
export type Candidate = {
  id: string; // Changed to string for Firebase ID
  firebaseId?: string; // Explicitly add firebaseId
  partyName: string;
  presidentName: string;
  presidentPhotoUrl: string;
  presidentPhotoHint: string;
  vicePresidentName: string;
  vicePresidentPhotoUrl:string;
  vicePresidentPhotoHint: string;
  vision: string;
  mission: string;
  votes?: number;
};

// This is now just for initial seeding, not for live state
export const initialCandidates: Omit<Candidate, 'id' | 'firebaseId'>[] = [
  {
    partyName: "Partai Harapan Jaya",
    presidentName: "Andi Pratama",
    presidentPhotoUrl: "https://picsum.photos/seed/candidate1/400/400",
    presidentPhotoHint: "male student portrait",
    vicePresidentName: "Rina Wati",
    vicePresidentPhotoUrl: "https://picsum.photos/seed/vicecandidate1/400/400",
    vicePresidentPhotoHint: "female student portrait",
    vision: "Mewujudkan OSIS yang inovatif, transparan, dan menjadi wadah aspirasi seluruh siswa.",
    mission: "1. Mengadakan program kerja berbasis teknologi.\n2. Meningkatkan komunikasi antara siswa dan pihak sekolah.\n3. Mengembangkan bakat dan minat siswa melalui ekstrakurikuler.",
    votes: 0,
  },
  {
    partyName: "Partai Bintang Prestasi",
    presidentName: "Siti Aisyah",
    presidentPhotoUrl: "https://picsum.photos/seed/candidate2/400/400",
    presidentPhotoHint: "female student portrait",
    vicePresidentName: "Eko Prasetyo",
    vicePresidentPhotoUrl: "https://picsum.photos/seed/vicecandidate2/400/400",
    vicePresidentPhotoHint: "male student portrait",
    vision: "Menjadikan sekolah sebagai lingkungan yang nyaman, kreatif, dan berprestasi.",
    mission: "1. Menyelenggarakan acara-acara yang meningkatkan kebersamaan.\n2. Membuat program 'Kotak Suara Siswa' untuk menampung ide dan keluhan.\n3. Bekerja sama dengan komite sekolah untuk meningkatkan fasilitas.",
    votes: 0,
  },
  {
    partyName: "Partai Generasi Emas",
    presidentName: "Budi Santoso",
    presidentPhotoUrl: "https://picsum.photos/seed/candidate3/400/400",
    presidentPhotoHint: "student photo",
    vicePresidentName: "Lina Marlina",
    vicePresidentPhotoUrl: "https://picsum.photos/seed/vicecandidate3/400/400",
    vicePresidentPhotoHint: "student photo",
    vision: "OSIS yang solid, sportif, dan mampu menginspirasi siswa untuk berprestasi.",
    mission: "1. Mengaktifkan kembali liga olahraga antar kelas.\n2. Mengadakan workshop dan seminar inspiratif secara rutin.\n3. Mempererat hubungan antar angkatan melalui kegiatan bersama.",
    votes: 0,
  }
];

export type Voter = {
    id: string; // Changed to string for Firebase ID
    firebaseId?: string; // Explicitly add firebaseId
    nis: string;
    name: string;
    class: string;
    avatarUrl: string;
    hasVoted: boolean;
};

// This is now just for initial seeding, not for live state
export const initialVoters: Omit<Voter, 'id' | 'firebaseId' | 'hasVoted'>[] = [
    {
        nis: '12345',
        name: 'Anta Massora',
        class: '11',
        avatarUrl: 'https://picsum.photos/seed/student1/100/100',
    }
];


export const studentPages = [
  { name: 'Dasbor', path: '/dashboard', icon: 'Home' },
  { name: 'Hasil Suara', path: '/results', icon: 'BarChart3' },
];

export const adminPages = [
  { name: 'Dasbor', path: '/admin/dashboard', icon: 'LayoutDashboard' },
  { name: 'Data Pemilih', path: '/admin/voters', icon: 'Users' },
  { name: 'Manajemen Kandidat', path: '/admin/candidates', icon: 'UserSquare' },
  { name: 'Hasil Pemilihan', path: '/admin/results', icon: 'BarChart3' },
  { name: 'Pengaturan', path: '/admin/settings', icon: 'Settings' },
];


export type Admin = {
  adminId: string;
  adminCode: string;
  name: string;
  role: string;
}

export const admins: Admin[] = [
  { adminId: 'admin', adminCode: 'admin123', name: 'Admin Utama', role: 'Administrator' },
  { adminId: 'kepsek', adminCode: 'supersecret', name: 'Kepala Sekolah', role: 'Kepala Sekolah' },
];

export const electionSchedule = [
    { title: "Pendaftaran Calon", date: "1-3 Sep 2025"},
    { title: "Penetapan Calon", date: "4 Sep 2025"},
    { title: "Masa Kampanye", date: "5-10 Sep 2025"},
    { title: "Pemungutan Suara", date: "13 Sep 2025", active: true},
    { title: "Penetapan Pemenang", date: "14 Sep 2025"},
]
