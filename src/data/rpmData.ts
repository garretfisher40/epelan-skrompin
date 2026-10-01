// src/data/rpmData.ts
export const DEFAULT_LOGO = "https://i.postimg.cc/vxcg6FgY/LOGO-SEKOLAH-VECTOR.png";

export const RPM_DATA: Record<string, Record<string, string[]>> = {
  "TS1|Sistem Terangkum, Dinamik & Relevan": {
    "S1|Keberkesanan Implementasi Dasar": [
      "P1|Memperkasa Pendidikan Sains & Matematik",
      "P2|Memperkukuh Pelaksanaan MBMMBI",
      "P3|Kajian Pengambilan & Penempatan Guru"
    ],
    "S2|Memperkasa Struktur Persekolahan": [
      "P1|Memperkasa Struktur Persekolahan Kebangsaan",
      "P2|Penambahbaikan Bahasa Tambahan"
    ],
    "S3|Memperkasa Pentaksiran Kebangsaan": [
      "P1|Memperkasakan Sistem Pentaksiran Kebangsaan"
    ]
  },
  "TS2|Mengoptimumkan Potensi Murid": {
    "S1|Reformasi Kurikulum": [
      "P1|Kurikulum Berorientasikan Kompetensi"
    ],
    "S2|Meningkatkan Kemahiran Murid": [
      "P1|Memperkukuh Literasi & Numerasi Tahap 1",
      "P2|Memperkukuh Keterampilan Berbahasa",
      "P3|Membudayakan Pembelajaran Sepanjang Hayat",
      "P4|Kemahiran Murid Masa Hadapan"
    ],
    "S3|Membangunkan Bakat": [
      "P1|Bakat Holistik STEM, TVET, Sukan & Seni"
    ],
    "S4|Membentuk Karakter": [
      "P1|Kesejahteraan Fizikal, Mental & Sosial",
      "P2|Memperkukuh Jati Diri & Kerohanian"
    ]
  },
  "TS3|Mentransformasikan Pendidik": {
    "S1|Kesejahteraan Pendidik": [
      "P1|Fokus Pengajaran & Pembelajaran",
      "P2|Kesejahteraan Pendidik Holistik"
    ],
    "S2|Kompetensi & PPB": [
      "P1|Pembangunan Profesionalisme Berterusan"
    ],
    "S3|Latihan Keguruan": [
      "P1|Latihan Keguruan Luwes & Relevan",
      "P2|Jaminan Mutu Latihan Dalam Perkhidmatan"
    ],
    "S4|Pemimpin Transformatif": [
      "P1|Pelapis Pemimpin Pendidikan Berwawasan",
      "P2|Keluwesan Penempatan Pentadbir"
    ]
  },
  "TS4|Memantapkan Prasarana": {
    "S1|Pembangunan Prasarana Terangkum": [
      "P1|Prasarana Strategik & Responsif",
      "P2|Pengurusan Aset & Penyelenggaraan",
      "P3|Prasarana Pendidikan Khas",
      "P4|Kemudahan Berfungsi & Berimpak"
    ],
    "S2|Prasarana Digital": [
      "P1|Inovasi Teknologi Pembelajaran",
      "P2|Naik Taraf Prasarana Digital"
    ],
    "S3|Sistem Pintar Berpandukan Data": [
      "P1|Tadbir Urus Data Pintar & Terhubung"
    ]
  },
  "TS5|Mempergiat Sinergi Komuniti": {
    "S1|Kerjasama Pihak Berkepentingan": [
      "P1|Dasar Kerjasama KPM & Komuniti"
    ],
    "S2|Ekosistem Penyaluran Sumber": [
      "P1|Penyaluran Sumber Komuniti & Swasta"
    ],
    "S3|Pelibatan Pihak Berkepentingan": [
      "P1|Mekanisme Pelibatan PIBG & Komuniti"
    ]
  },
  "TS6|Kemampanan Ekosistem Pendidikan": {
    "S1|Pendidikan Pembangunan Mampan": [
      "P1|PPM dalam Kurikulum & Kokurikulum",
      "P2|Kemahiran Pekerjaan Lestari"
    ],
    "S2|Pendidik Menerajui PPM": [
      "P1|Kapasiti Pendidik sebagai Peneraju PPM"
    ],
    "S3|Advokasi & Promosi Kemampanan": [
      "P1|Jaringan & Jalinan Kemampanan",
      "P2|Murid sebagai Agen Perubahan"
    ],
    "S4|Pemantauan PPM": [
      "P1|Pengiktirafan Institusi Amalan Kemampanan"
    ]
  },
  "TS7|Kecekapan Tadbir Urus": {
    "S1|Pelan Komunikasi KPM": [
      "P1|Komunikasi Strategik & Responsif"
    ],
    "S2|Struktur Organisasi": [
      "P1|Penyusunan Struktur & Perjawatan",
      "P2|Polisi & Prosedur Tadbir Urus"
    ],
    "S3|Autonomi Terpimpin": [
      "P1|Pelaksanaan Autonomi Terpimpin",
      "P2|Pengoptimuman Fasiliti & Prasarana"
    ],
    "S4|Pengurusan Perubahan & Risiko": [
      "P1|Pelan Pengurusan Perubahan",
      "P2|Pelan Pengurusan Risiko"
    ]
  }
};

export const UNIT_OPTIONS: Record<string, string[]> = {
  "Unit Kurikulum": [
    "Bahasa Melayu",
    "Bahasa Inggeris",
    "Matematik",
    "Sains",
    "Pendidikan Islam",
    "Pendidikan Moral",
    "Sejarah",
    "Reka Bentuk dan Teknologi",
    "Pendidikan Seni Visual",
    "Pendidikan Muzik",
    "Pendidikan Jasmani dan Pendidikan Kesihatan",
    "Pusat Sumber Sekolah",
    "Pemulihan Khas",
    "PBD / Pentaksiran",
    "Jadual Waktu",
    "PLC / LADAP"
  ],
  "Unit Hal Ehwal Murid (HEM)": [
    "Disiplin & Pengawas",
    "Bimbingan dan Kaunseling",
    "Kebajikan Murid",
    "SPBT",
    "RMT / Program Susu",
    "Kantin",
    "Kesihatan",
    "Keselamatan",
    "Kebersihan & Keceriaan",
    "APDM / Kehadiran",
    "PPDa"
  ],
  "Unit Kokurikulum": [
    "Sukan dan Permainan",
    "Kelab dan Persatuan",
    "Unit Beruniform",
    "Rumah Sukan",
    "PAJSK",
    "1M1S",
    "Program Kecemerlangan Kokurikulum"
  ],
  "Unit Pentadbiran": [
    "Pengurusan & Pentadbiran",
    "Data / SKPM Kualiti@Sekolah",
    "Kewangan",
    "Aset & Inventori",
    "ICT / Digital",
    "Pembangunan Fizikal",
    "Perhubungan & Dokumentasi"
  ]
};

export const ISU_BY_UNIT: Record<string, string[]> = {
  "Unit Kurikulum": [
    "Penguasaan asas membaca dan literasi murid Tahap 1 belum mencapai tahap optimum.",
    "Penguasaan fakta asas matematik dan kemahiran numerasi murid masih lemah.",
    "Kemahiran bertutur dan perbendaharaan kata Bahasa Inggeris (HIP) murid masih terhad.",
    "Pencapaian PBD sebahagian murid masih belum mencapai sekurang-kurangnya TP3.",
    "Kemahiran murid menjawab soalan beraras tinggi (KBAT) dan penyelesaian masalah masih lemah.",
    "Penguasaan kosa kata dan struktur penulisan karangan murid belum mencapai sasaran.",
    "Pencapaian murid dalam ujian akhir sesi akademik (UASA) bagi subjek teras perlu ditingkatkan.",
    "Jurang penguasaan pembelajaran antara murid perdana dan murid pemulihan khas.",
    "Pembudayaan Komuniti Pembelajaran Profesional (PLC) panitia belum menyeluruh.",
    "Integrasi teknologi digital dan pelantar DELIMa dalam PdP guru belum optimum.",
    "Lain-lain / Isu Kustom"
  ],
  "Unit Hal Ehwal Murid (HEM)": [
    "Peratus kehadiran harian murid ke sekolah belum mencapai sasaran KPM (≥ 95%).",
    "Isu salah laku disiplin murid seperti lewat ke sekolah, kekemasan diri dan ponteng kelas.",
    "Kesedaran murid terhadap pencegahan buli fizikal dan buli lisan perlu dipertingkat.",
    "Kesejahteraan emosi dan kesihatan mental murid akibat tekanan persekitaran atau keluarga.",
    "Amalan kebersihan, kesihatan dan keselamatan diri murid (Program 3K) belum membudaya.",
    "Tahap kesedaran murid tentang bahaya rokok, vape dan bahan terlarang (PPDa) perlu diperkukuh.",
    "Pengurusan data kehadiran APDM dan maklumat bantuan murid (RMT/KWAPM) memerlukan semakan rapi.",
    "Penglibatan dan kerjasama ibu bapa serta komuniti (PIBKS) dalam program sekolah masih rendah.",
    "Tahap kepimpinan dan sahsiah murid pengawas serta ketua kelas perlu diasah.",
    "Lain-lain / Isu Kustom"
  ],
  "Unit Kokurikulum": [
    "Peratus kehadiran murid dalam perjumpaan mingguan kokurikulum belum mencapai sasaran 100%.",
    "Pencapaian gred markah PAJSK murid Tahap 2 masih ramai di peringkat sederhana.",
    "Penyertaan murid dalam pertandingan sukan (MSSD) dan ko-akademik terhad kepada murid yang sama.",
    "Penguasaan kemahiran asas dan teknik murid dalam sukan serta permainan masih rendah.",
    "Kemahiran kawad kaki asas dan tatacara pemakaian seragam unit beruniform masih lemah.",
    "Minat murid terhadap aktiviti fizikal dan sukan berkurangan akibat ketagihan gajet.",
    "Kekurangan peralatan sukan dan prasarana kokurikulum yang kondusif di sekolah.",
    "Pendedahan dan penglibatan murid dalam aktiviti inovasi STEM dan kelab masih terhad.",
    "Lain-lain / Isu Kustom"
  ],
  "Unit Pentadbiran": [
    "Pengurusan data, fail panitia dan dokumentasi evidens sekolah belum berpusat dan sistematik.",
    "Penarafan kendiri SKPM Kualiti@Sekolah memerlukan evidens yang lebih lengkap dan kemas kini.",
    "Penyelenggaraan prasarana fizikal, aset dan pendawaian bangunan sekolah memerlukan tindakan segera.",
    "Capaian internet dan peralatan ICT di bilik darjah memerlukan naik taraf serta penyelenggaraan berkala.",
    "Pengurusan perbelanjaan PCG panitia dan rekod kewangan memerlukan pematuhan audit yang ketat.",
    "Jalinan strategik dan perkongsian pintar sekolah bersama alumni, agensi luar dan pihak swasta (CSR) masih terhad.",
    "Pembudayaan amalan kelestarian hijau, penjimatan tenaga dan Sekolah Lestari (PPM) belum menyeluruh.",
    "Lain-lain / Isu Kustom"
  ]
};

export const ISU_PRESETS: string[] = [
  ...ISU_BY_UNIT["Unit Kurikulum"],
  ...ISU_BY_UNIT["Unit Hal Ehwal Murid (HEM)"],
  ...ISU_BY_UNIT["Unit Kokurikulum"],
  ...ISU_BY_UNIT["Unit Pentadbiran"],
];

export const SMART_TEMPLATES: Record<string, {
  programs: string[];
  matlamat: string;
  objektif: string;
  kpis: string[];
}> = {
  // Kurikulum
  "Penguasaan asas membaca dan literasi murid Tahap 1 belum mencapai tahap optimum.": {
    programs: ["Program Bacaan Berfokus", "Klinik Membaca Pantas", "Bimbingan Kumpulan Kecil"],
    matlamat: "Meningkatkan kelancaran dan kefahaman membaca murid ke tahap penguasaan optimum (RPM TS2/S2).",
    objektif: "1. Meningkatkan kelancaran membaca sekurang-kurangnya 85% murid sasaran.\n2. Mengurangkan bilangan murid di bawah tahap minimum penguasaan literasi.",
    kpis: ["Peratus murid melepasi ujian kelancaran membaca (≥ 85%)", "Peningkatan skor PBD membaca"]
  },
  "Penguasaan membaca murid belum konsisten.": {
    programs: ["Program Bacaan Berfokus", "Klinik Membaca", "Bimbingan Kumpulan Kecil"],
    matlamat: "Meningkatkan kelancaran dan kefahaman membaca murid ke tahap penguasaan optimum.",
    objektif: "1. Meningkatkan kelancaran membaca sekurang-kurangnya 80% murid sasaran.\n2. Mengurangkan bilangan murid di bawah tahap minimum penguasaan literasi.",
    kpis: ["Peratus murid melepasi ujian kelancaran membaca", "Peningkatan skor PBD membaca"]
  },
  "Penguasaan fakta asas matematik dan kemahiran numerasi murid masih lemah.": {
    programs: ["Bijak Sifir 1-12", "Klinik Numerasi Pantas", "Modul Pintar Mengira"],
    matlamat: "Memastikan semua murid menguasai fakta asas congak dan operasi asas matematik.",
    objektif: "1. Memastikan sekurang-kurangnya 90% murid menguasai operasi tambah, tolak, darab dan bahagi.\n2. Meningkatkan keyakinan menyelesaikan masalah harian.",
    kpis: ["Peratus murid lulus ujian asas sifir ≥ 90%", "Peningkatan pencapaian PBD Matematik"]
  },
  "Kemahiran bertutur dan perbendaharaan kata Bahasa Inggeris (HIP) murid masih terhad.": {
    programs: ["English Speaking Day & HIP Corner", "Choral Speaking & Storytelling", "Word of the Day"],
    matlamat: "Membina persekitaran imersif Bahasa Inggeris bagi meningkatkan keyakinan bertutur murid (MBMMBI).",
    objektif: "1. Meningkatkan keberanian murid bertutur dalam Bahasa Inggeris dalam situasi harian.\n2. Memperkaya perbendaharaan kata sekurang-kurangnya 5 perkataan baharu seminggu.",
    kpis: ["Peningkatan skor tahap imersif HIP sekolah", "Peratus murid mencapai TP4 ke atas dalam Bahasa Inggeris"]
  },
  "Pencapaian PBD sebahagian murid masih belum mencapai sekurang-kurangnya TP3.": {
    programs: ["Intervensi Berfokus PBD", "Bimbingan Rakan Sebaya", "Modul Pemulihan & Pengukuhan"],
    matlamat: "Meningkatkan peratus murid mencapai sekurang-kurangnya Tahap Penguasaan 3 (TP3) dalam semua mata pelajaran.",
    objektif: "1. Mengurangkan bilangan murid TP1 dan TP2 kepada sifar.\n2. Membimbing murid menguasai standard pembelajaran minimum.",
    kpis: ["Peratus murid mencapai sekurang-kurangnya TP3 dalam PBD (Sasaran: ≥ 85%)", "Sifar murid TP1 & TP2"]
  },
  "Kemahiran murid menjawab soalan beraras tinggi (KBAT) dan penyelesaian masalah masih lemah.": {
    programs: ["Bengkel KBAT & Peta I-Think", "Klinik Penyelesaian Masalah", "Sudut Cabaran Minda"],
    matlamat: "Membudayakan pemikiran kritis dan kreatif dalam menyelesaikan soalan beraras tinggi.",
    objektif: "1. Mendedahkan murid dengan teknik menganalisis dan menaakul soalan KBAT.\n2. Meningkatkan markah soalan bahagian penyelesaian masalah dalam pentaksiran.",
    kpis: ["Peningkatan skor soalan KBAT dalam pentaksiran", "Peratus murid mengaplikasi alat berfikir I-Think"]
  },
  "Penguasaan kosa kata dan struktur penulisan karangan murid belum mencapai sasaran.": {
    programs: ["Klinik Penulisan Kreatif", "Writing Booster", "Penulisan Berpandu"],
    matlamat: "Meningkatkan kualiti struktur penulisan dan kosa kata murid.",
    objektif: "1. Meningkatkan keupayaan membina ayat gramatis.\n2. Mengukuhkan penguasaan kosa kata dan tatabahasa murid sasaran.",
    kpis: ["Peratus murid mencapai TP4 ke atas dalam penulisan", "Peningkatan skor esei"]
  },
  "Pembudayaan Komuniti Pembelajaran Profesional (PLC) panitia belum menyeluruh.": {
    programs: ["PLC Berfokus Subjek", "Bengkel Pedagogi Digital", "Lesson Study Panitia"],
    matlamat: "Meningkatkan kompetensi profesionalisme dan amalan pedagogi abad ke-21 guru (RPM TS3/S2).",
    objektif: "1. Membudayakan perkongsian amalan terbaik antara guru panitia.\n2. Mengintegrasikan teknologi dan alatan pintar dalam PdP.",
    kpis: ["Bilangan kitaran PLC yang selesai (Sasaran: ≥ 4 kali setahun)", "Peratus guru mengaplikasi PdP digital"]
  },

  // HEM
  "Peratus kehadiran harian murid ke sekolah belum mencapai sasaran KPM (≥ 95%).": {
    programs: ["Kempen Jom Ke Sekolah & Cakna Kehadiran", "Program Sifar Ponteng", "Anugerah Bintang Kehadiran Bulanan"],
    matlamat: "Meningkatkan peratus kehadiran murid ke sekolah mencapai sasaran kebangsaan sekurang-kurangnya 95% (APDM).",
    objektif: "1. Mengurangkan kadar ketidakhadiran tanpa sebab dan murid berisiko cicir.\n2. Memberikan motivasi dan penghargaan berkala kepada kelas berkehadiran tertinggi.",
    kpis: ["Peratus kehadiran tahunan APDM mencapai ≥ 95%", "Pengurangan murid berisiko cicir ke sifar"]
  },
  "Isu salah laku disiplin murid seperti lewat ke sekolah, kekemasan diri dan ponteng kelas.": {
    programs: ["Program Sahsiah Unggul Murid (SUMUR)", "Klinik Disiplin & Adab", "Operasi Sifar Lewat"],
    matlamat: "Membentuk sahsiah terpuji, jati diri dan disiplin murid berteraskan modul Karamah Insaniah & ABC.",
    objektif: "1. Mengurangkan kes salah laku disiplin murid dalam rekod SSDM.\n2. Membudayakan adab menghormati masa, guru dan peraturan sekolah.",
    kpis: ["Penurunan kes disiplin dalam SSDM sebanyak 50%", "Sifar kes salah laku berat"]
  },
  "Kesedaran murid terhadap pencegahan buli fizikal dan buli lisan perlu dipertingkat.": {
    programs: ["Kempen Hentikan Buli: Sekolah Selamat", "Bengkel Kawan Bukan Lawan", "Peti Aduan & Sahabat Kaunseling"],
    matlamat: "Mewujudkan iklim sekolah yang selamat, harmoni dan sifar buli.",
    objektif: "1. Meningkatkan kesedaran murid tentang kesan buruk buli fizikal dan siber.\n2. Memperkukuh peranan PRS sebagai mata dan telinga bimbingan kaunseling.",
    kpis: ["Sifar aduan kes buli fizikal dan lisan", "100% murid menandatangani ikrar anti-buli"]
  },
  "Kesejahteraan emosi dan kesihatan mental murid akibat tekanan persekitaran atau keluarga.": {
    programs: ["Minda Sihat Murid Ceria", "Sesi Terapi Emosi & Bimbingan Kelompok", "Ziarah Cakna Kasih"],
    matlamat: "Memelihara kesejahteraan psikososial dan kesihatan mental murid.",
    objektif: "1. Mengenal pasti murid yang memerlukan sokongan kaunseling awal.\n2. Membantu murid mengurus emosi dan tekanan pembelajaran secara positif.",
    kpis: ["100% murid berisiko menerima sesi kaunseling", "Peningkatan skor saringan Minda Sihat"]
  },
  "Amalan kebersihan, kesihatan dan keselamatan diri murid (Program 3K) belum membudaya.": {
    programs: ["Kempen Sekolah Bersih & Sihat", "Pemeriksaan Kesihatan & Gigi Berkala", "Latihan Kecemasan & Kebakaran"],
    matlamat: "Membudayakan amalan kebersihan diri, kesihatan makanan kantin dan keselamatan murid.",
    objektif: "1. Memastikan persekitaran sekolah sentiasa bersih dan bebas denggi.\n2. Meningkatkan pengetahuan murid tentang amalan pemakanan sihat.",
    kpis: ["Penarafan Gred A Kebersihan Kantin Sekolah", "Bebas kes keracunan makanan dan kemalangan"]
  },

  // Kokurikulum
  "Peratus kehadiran murid dalam perjumpaan mingguan kokurikulum belum mencapai sasaran 100%.": {
    programs: ["Karnival 1Murid 1Sukan (1M1S)", "Kem Pemantapan Kokurikulum & Perkhemahan", "Anugerah Bintang Kokurikulum"],
    matlamat: "Meningkatkan kehadiran dan penglibatan aktif murid dalam ketiga-tiga elemen kokurikulum.",
    objektif: "1. Memastikan kehadiran mingguan aktiviti kokurikulum melebihi 95%.\n2. Mengasah bakat kepimpinan dan semangat berpasukan murid.",
    kpis: ["Peratus kehadiran aktiviti kokurikulum ≥ 95%", "Peratus murid mencapai Gred A/B PAJSK"]
  },
  "Pencapaian gred markah PAJSK murid Tahap 2 masih ramai di peringkat sederhana.": {
    programs: ["Program Lonjakan Skor PAJSK", "Bengkel Perekodan PAJSK Murid", "Pertandingan Peringkat Luar / Dalam Talian"],
    matlamat: "Meningkatkan purata markah keseluruhan PAJSK murid Tahap 2 ke gred cemerlang.",
    objektif: "1. Memastikan setiap murid Tahap 2 memegang jawatan dan menyertai aktiviti berimpak.\n2. Memaksimumkan penyertaan murid dalam acara peringkat zon, daerah dan negeri.",
    kpis: ["Peningkatan peratus murid mencapai Gred A dalam PAJSK kepada ≥ 40%", "Sifar murid Gred E"]
  },
  "Penyertaan murid dalam pertandingan sukan (MSSD) dan ko-akademik terhad kepada murid yang sama.": {
    programs: ["Klinik Pembangunan Bakat Baharu", "Karnival Bakat Tunas Muda", "Kem Asas Kawad & Sukan"],
    matlamat: "Mencungkil dan memperluas bakat baharu murid dalam pelbagai bidang sukan dan ko-akademik.",
    objektif: "1. Meningkatkan penyertaan murid baharu dalam acara peringkat zon dan daerah.\n2. Melahirkan atlet pelapis sekolah yang berdaya saing.",
    kpis: ["Peningkatan 30% penyertaan murid baharu dalam MSSD", "Pencapaian pingat peringkat daerah"]
  },
  "Penguasaan kemahiran asas dan teknik murid dalam sukan serta permainan masih rendah.": {
    programs: ["Klinik Kemahiran Asas Bola Sepak / Bola Jaring / Badminton", "Latihan Intensif Berjadual", "Perlawanan Persahabatan"],
    matlamat: "Menguasai kemahiran asas dan taktikal permainan sukan teras sekolah.",
    objektif: "1. Meningkatkan kemahiran teknikal pemain pelapis sekolah.\n2. Membina kecergasan fizikal dan disiplin sukan murid.",
    kpis: ["Kemenangan sekurang-kurangnya tempat ke-3 peringkat MSSD", "100% atlet menguasai kemahiran asas"]
  },

  // Pentadbiran
  "Pengurusan data, fail panitia dan dokumentasi evidens sekolah belum berpusat dan sistematik.": {
    programs: ["Pendigitalan Fail Panitia (e-Fail Drive)", "Bengkel Pengurusan Dokumentasi Kualiti", "Audit Dokumentasi Berkala"],
    matlamat: "Memastikan pengurusan data, fail dan evidens unit sekolah tersusun, selamat dan mudah diakses.",
    objektif: "1. Membangunkan repositori digital berpusat bagi semua unit.\n2. Menyediakan dokumentasi lengkap mematuhi standard SKPM Kualiti@Sekolah.",
    kpis: ["100% fail panitia dikemas kini secara digital", "Penarafan SKPM Kualiti@Sekolah bertaraf Cemerlang"]
  },
  "Penarafan kendiri SKPM Kualiti@Sekolah memerlukan evidens yang lebih lengkap dan kemas kini.": {
    programs: ["Bengkel Verifikasi Evidens SKPM Kualiti@Sekolah", "Pemantauan Berterusan Standard 3 & 4", "Klinik Skor Kualiti"],
    matlamat: "Meningkatkan skor penarafan kendiri sekolah dalam SKPM Kualiti@Sekolah ke tahap cemerlang.",
    objektif: "1. Mengumpul evidens autentik bagi setiap standard kualiti.\n2. Meningkatkan skor Standard 3.1 (Kurikulum) dan 3.2 (Kokurikulum).",
    kpis: ["Skor keseluruhan SKPM Kualiti@Sekolah mencapai tahap Cemerlang (≥ 90%)", "Evidens lengkap 100%"]
  },
  "Penyelenggaraan prasarana fizikal, aset dan pendawaian bangunan sekolah memerlukan tindakan segera.": {
    programs: ["Audit Keselamatan & Penyelenggaraan Aset", "Gotong-Royong Kondusif", "Permohonan Penyelenggaraan Berkala PPD"],
    matlamat: "Menyediakan persekitaran fizikal sekolah yang selamat, ceria dan kondusif untuk PdP.",
    objektif: "1. Membaiki kerosakan fizikal kritikal dengan segera.\n2. Memastikan semua aset sekolah direkodkan dalam sistem SPA/KewPA.",
    kpis: ["100% laporan kerosakan diambil tindakan", "Pengiktirafan persekitaran sekolah selamat"]
  }
};


// Preset Dropdown Options for Section C (RPM 2026-2035 & Malaysian Education System)
export const MATLAMAT_PRESETS: string[] = [
  "Meningkatkan tahap penguasaan murid dalam kemahiran asas literasi dan numerasi ke tahap optimum (RPM TS2/S2).",
  "Meningkatkan peratus murid mencapai sekurang-kurangnya Tahap Penguasaan 3 (TP3) hingga TP6 dalam Pentaksiran Bilik Darjah (PBD).",
  "Mengukuhkan penguasaan dwibahasa (Bahasa Melayu & Bahasa Inggeris) melalui dasar MBMMBI dan aktiviti HIP (RPM TS1/S1).",
  "Membangunkan potensi murid dalam bidang STEM, inovasi digital dan TVET peringkat sekolah rendah (RPM TS2/S3).",
  "Membentuk sahsiah terpuji, jati diri, disiplin dan kerohanian murid berteraskan modul Karamah Insaniah & ABC (RPM TS2/S4).",
  "Meningkatkan kecergasan fizikal, kesihatan mental dan penglibatan aktif murid dalam 1Murid 1Sukan (1M1S).",
  "Membudayakan pembelajaran bermakna dan kemahiran berfikir aras tinggi (KBAT) dalam kalangan murid.",
  "Meningkatkan kompetensi profesionalisme guru melalui perkongsian amalan terbaik Komuniti Pembelajaran Profesional (PLC) (RPM TS3/S2).",
  "Memastikan kebajikan murid terpelihara dan sifar keciciran melalui pemantauan APDM dan program bantuan (RMT/KWAPM).",
  "Memperkukuh jalinan kolaboratif antara sekolah, PIBG, komuniti setempat dan agensi luar (PIBKS) (RPM TS5/S3).",
  "Membudayakan amalan kelestarian hijau, kebersihan dan Sekolah Bebas Plastik / PPM (RPM TS6/S1).",
  "Pilihan Sendiri / Kustom"
];

export const OBJEKTIF_PRESETS: string[] = [
  "1. Meningkatkan kelancaran dan kefahaman membaca sekurang-kurangnya 85% murid sasaran.\n2. Mengurangkan bilangan murid belum mencapai TP3 dalam PBD.",
  "1. Memastikan sekurang-kurangnya 90% murid menguasai fakta asas matematik dan pengiraan pantas.\n2. Mengaplikasikan kemahiran penyelesaian masalah dalam situasi harian.",
  "1. Meningkatkan keyakinan dan keberanian murid berkomunikasi dalam Bahasa Inggeris (HIP).\n2. Memperkaya perbendaharaan kata dan kemahiran tatabahasa asas.",
  "1. Memberikan pendedahan amali sains, teknologi, kejuruteraan dan robotik/pengkodan kepada murid.\n2. Menjana daya cipta, inovasi dan pemikiran kritis murid.",
  "1. Memastikan peratus kehadiran harian murid ke sekolah mencapai sasaran KPM ≥ 95%.\n2. Mengurangkan peratus kes salah laku disiplin dan murid berisiko cicir.",
  "1. Mengasah bakat kepimpinan, ketahanan kendiri dan semangat kesukarelawanan murid dalam kokurikulum.\n2. Melahirkan atlet dan bakat murid berpotensi ke peringkat daerah (MSSD/Karnival).",
  "1. Memperkasa amalan pedagogi abad ke-21 dan integrasi DELIMa melalui 4 kitaran PLC panitia.\n2. Membina bank soalan dan modul pengayaan/pemulihan yang berkualiti.",
  "1. Memupuk amalan adab, integriti, kasih sayang dan hormat-menghormati dalam kalangan murid.\n2. Membentuk peribadi murid yang seimbang dari aspek jasmani, emosi, rohani dan intelek (JERI).",
  "1. Meningkatkan penyertaan ibu bapa dan komuniti dalam aktiviti sarana sekolah kepada ≥ 80%.\n2. Menjalin kerjasama strategik dengan pihak berkepentingan bagi menyokong kemenjadian murid.",
  "Pilihan Sendiri / Kustom"
];

export const KPI_PRESETS: string[] = [
  "Peratus murid mencapai sekurang-kurangnya TP3 dalam PBD (Sasaran: ≥ 85%)",
  "Peratus murid mencapai TP4 hingga TP6 dalam Pentaksiran Bilik Darjah (PBD)",
  "Peratus murid melepasi saringan literasi dan numerasi (PLaN / Pemulihan Khas)",
  "Peratus murid mencapai tahap Penguasaan Minimum (MTM) dalam UASA / Ujian Akhir Sesi Akademik",
  "Peratus kehadiran murid ke sekolah bulanan melebihi 95% dalam sistem APDM",
  "Peratus murid Tahap 2 menyertai sekurang-kurangnya satu pertandingan kokurikulum/STEM peringkat daerah/negeri",
  "Peratus murid mencapai gred A & B dalam penilaian markah PAJSK",
  "Pencapaian 100% murid menyertai dan aktif dalam aktiviti 1Murid 1Sukan (1M1S)",
  "Bilangan sesi bimbingan intervensi berfokus / klinik mata pelajaran yang disempurnakan",
  "Peratus guru panitia melaksanakan sekurang-kurangnya 4 kitaran PLC setahun",
  "Peratus murid melepasi Standard Kecergasan Fizikal Kebangsaan (SEGAK) dengan gred Cemerlang / Baik",
  "Peratus kehadiran ibu bapa / penjaga dalam program pelibatan sekolah (PIBKS) mencapai sasaran",
  "Pilihan Sendiri / Kustom"
];

export const TEMPOH_PRESETS: string[] = [
  "Sepanjang Tahun (Januari hingga November 2026)",
  "Penggal 1 Persekolahan (Mac – Mei 2026)",
  "Penggal 2 Persekolahan (Jun – Ogos 2026)",
  "Penggal 3 Persekolahan (September – Disember 2026)",
  "Fasa 1: Mac hingga Julai 2026",
  "Fasa 2: Ogos hingga Disember 2026",
  "Setiap Minggu / Setiap Hari Persekolahan",
  "Program Intensif / Berfokus (1 Bulan)",
  "Program Lepas Waktu Persekolahan / Kelas Bimbingan",
  "Bulan Kemerdekaan & Bulan Panitia (Ogos – September)",
  "Minggu Transisi & Minggu Akademik Sekolah",
  "Pilihan Sendiri / Kustom"
];

export const SASARAN_PRESETS: string[] = [
  "Semua Murid SK Rompin (Prasekolah, PPKI hingga Tahun 6)",
  "Semua Murid Tahap 1 (Tahun 1, Tahun 2 dan Tahun 3)",
  "Semua Murid Tahap 2 (Tahun 4, Tahun 5 dan Tahun 6)",
  "Murid Pemulihan Khas & Intervensi Literasi / Numerasi (PLaN)",
  "Murid Tahun 1 (Program Transisi Tahun Satu 2.0)",
  "Murid Tahun 6 (Program Pengukuhan & Persediaan Sekolah Menengah)",
  "Murid Sasaran Galus (Gagal / Lulus) & Berisiko TP1 - TP2",
  "Murid Potensi Cemerlang (Pengayaan TP5 - TP6 / Calon Tokoh Murid)",
  "Murid Berisiko Cicir / Rekod Kehadiran Bawah 80% (APDM)",
  "Semua Guru & Warga Pendidik SK Rompin",
  "Ketua Panitia & Ahli Jawatankuasa Kerja Panitia",
  "Pemimpin Murid (Pengawas Sekolah, Pengawas PSS, PRS & Ketua Kelas)",
  "Ibu Bapa / Penjaga Murid Sasaran & Komuniti Setempat (PIBG / PIBKS)",
  "Pilihan Sendiri / Kustom"
];

// Preset Dropdown Options for Section D (Pelaksanaan & Pemantauan)
export const TANGGUNGJAWAB_PRESETS: string[] = [
  "Ketua Panitia dan semua Guru Mata Pelajaran",
  "Guru Besar, GPK Pentadbiran, GPK HEM & GPK Kokurikulum",
  "Penyelaras Program, Ketua Panitia & Guru Penasihat",
  "Guru Bimbingan dan Kaunseling (GBK) & Guru Disiplin",
  "Guru Pemulihan Khas & Guru Penyelaras PLaN",
  "Guru Penyelaras PSS, Guru Nilam & Pengawas PSS",
  "Semua Guru Kelas dan Guru Pembantu",
  "Jawatankuasa Sambutan, JK Hadiah & JK Teknikal",
  "Jawatankuasa PIBG dan Sukarelawan Ibu Bapa (KSIB)",
  "Pilihan Sendiri / Kustom"
];

export const KEWANGAN_PRESETS: string[] = [
  "Peruntukan PCG Panitia (Bantuan Per Kapita KPM)",
  "Peruntukan PCG Kokurikulum & Sukan",
  "Tabung Sumbangan Persatuan Ibu Bapa dan Guru (PIBG)",
  "Bantuan Persekolahan KPM (BAP / KWAPM / RMT)",
  "Sumbangan Korporat / Penaja Komuniti / Alumni",
  "Peruntukan Bimbingan & Kaunseling / LPBT",
  "Tiada Implikasi Kewangan (Menggunakan sumber sedia ada sekolah)",
  "Peruntukan Khas PPD / JPN",
  "Pilihan Sendiri / Kustom"
];

export const KEKANGAN_PRESETS: string[] = [
  "Tahap penguasaan asas dan latar belakang kesediaan murid yang berbeza-beza.",
  "Masa pelaksanaan yang terhad berikutan kepadatan jadual waktu dan takwim aktiviti.",
  "Kehadiran sebilangan kecil murid kurang konsisten (isu ketidakhadiran tegar).",
  "Kekurangan bahan bantu mengajar (BBM), peranti digital atau kemudahan teknikal.",
  "Peruntukan kewangan panitia yang terhad untuk penyediaan modul dan ganjaran.",
  "Kekangan ruang bilik khas dan fasiliti aktiviti hands-on / sukan.",
  "Sokongan dan bimbingan pembelajaran di rumah oleh segelintir waris masih di tahap minimum.",
  "Pilihan Sendiri / Kustom"
];

export const PEMANTAUAN_PRESETS: string[] = [
  "Semakan rekod kehadiran harian murid dan analisis perkembangan bulanan.",
  "Borang pemantauan aktiviti, buku log program dan kad transit PBD.",
  "Pencerapan PdP dan bimbingan berkala oleh Pentadbir / Ketua Panitia (SKPM Kualiti@Sekolah).",
  "Laporan mingguan guru bertugas dan perjumpaan berkala jawatankuasa kerja.",
  "Pemantauan berterusan melalui sistem APDM, SSDM dan e-Pelan.",
  "Semakan hasil kerja murid dan buku latihan secara berfasa.",
  "Pilihan Sendiri / Kustom"
];

export const PENILAIAN_PRESETS: string[] = [
  "Analisis perbandingan skor Pentaksiran Bilik Darjah (PBD) sebelum dan selepas program.",
  "Ujian diagnostik, instrumen pasca-ujian dan saringan literasi/numerasi.",
  "Borang maklum balas, soal selidik kepuasan murid, guru dan ibu bapa.",
  "Analisis pencapaian sasaran KPI dan peratus kelulusan Minimum (MTM).",
  "Penilaian rubrik kemahiran, pemerhatian tingkah laku dan senarai semak amali.",
  "Laporan pasca-nilai (post-mortem) dalam mesyuarat panitia / mesyuarat pengurusan.",
  "Pilihan Sendiri / Kustom"
];

export const PENAMBAHBAIKAN_PRESETS: string[] = [
  "Melaksanakan intervensi berfokus dan bimbingan secara individu (one-to-one coaching).",
  "Menyusun semula modul aktiviti dan memperbanyakkan bahan bantu visual/interaktif digital.",
  "Mengadakan sesi PLC panitia bagi berkongsi strategi pedagogi berkesan.",
  "Memperkemas jadual latihan dan memperhebat hebahan ganjaran murid.",
  "Menjalin jalinan kolaboratif bersama ibu bapa melalui program 'Cakna Waris'.",
  "Mempelbagaikan kaedah pengajaran berbeza (Differentiated Learning) mengikut aras murid.",
  "Pilihan Sendiri / Kustom"
];

export const EVIDENS_PRESETS: string[] = [
  "Laporan bergambar aktiviti, kertas kerja kelulusan dan minit mesyuarat panitia.",
  "Borang senarai kehadiran murid, surat makluman waris dan jadual pelaksanaan.",
  "Buku program / brosur, poster hebahan, montaj video dan pautan bahan digital.",
  "Borang transit markah PBD, instrumen penilaian, kertas soalan dan hasil kerja murid.",
  "Sijil penyertaan/penghargaan, senarai nama pemenang dan rekod pengiktirafan.",
  "Pilihan Sendiri / Kustom"
];
