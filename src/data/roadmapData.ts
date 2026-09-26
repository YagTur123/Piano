import { Chapter } from '../types/piano';

export const PIANO_ROADMAP: Chapter[] = [
  {
    id: 'ch-1',
    number: 1,
    title: 'Piyanoya İlk Adım: Oturuş, Tuşlar ve Parmak Numaraları',
    description: 'Piyano klavyesini tanıma, siyah tuşların gizemi, 1-2-3-4-5 parmak sistemi ve Merkez Do (Middle C) pozisyonu.',
    level: 'Başlangıç',
    lessons: [
      {
        id: 'les-1-1',
        chapterId: 'ch-1',
        number: 1,
        title: 'Siyah Tuşlar ve Merkez Do (C4)',
        subtitle: 'Klavye Coğrafyası',
        description: 'Piyanoda siyah tuşlar 2\'li ve 3\'lü gruplar halindedir. İki siyah tuşun hemen solundaki beyaz tuş her zaman "DO" (C) notasıdır.',
        objective: 'Merkez Do (C4) notasını bulun ve sağ elinizin başparmağıyla (1. parmak) 4 kez ritmik olarak basın.',
        handGuide: 'Sağ elinizi piyanonun üzerine sanki elinizde yumuşak bir elma tutuyormuş gibi yuvarlak ve rahat yerleştirin.',
        tips: [
          'İki siyah tuş grubunu bulun.',
          'Hemen solundaki beyaz tuş: DO (C).',
          'Başparmağınızı tuşun ucuna değil, yumuşak yan kısmına basın.',
          'Bileğinizi kasmayın, serbest bırakın.'
        ],
        tempo: 75,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1, label: 'Sağ 1' }, lyric: 'Do' },
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1, label: 'Sağ 1' }, lyric: 'Do' },
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1, label: 'Sağ 1' }, lyric: 'Do' },
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1, label: 'Sağ 1' }, lyric: 'Do' },
        ],
        recommendedKeyRange: ['C4', 'E4']
      },
      {
        id: 'les-1-2',
        chapterId: 'ch-1',
        number: 2,
        title: 'Parmak Numaraları: 1-2-3 Adımı',
        subtitle: 'Do - Re - Mi İlerlemesi',
        description: 'Piyanoda parmaklar numaralandırılır: 1=Başparmak, 2=İşaret, 3=Orta parmak. Şimdi bu üç parmağı ardışık kullanacağız.',
        objective: 'Do (1), Re (2) ve Mi (3) notalarını sırayla temiz bir tonda basın.',
        handGuide: 'Sağ El: 1 (Do), 2 (Re), 3 (Mi). Parmaklarınızı tuşların üzerinde hazır bekletin, havaya kaldırmayın.',
        tips: [
          '1. Parmak = C4 (Do)',
          '2. Parmak = D4 (Re)',
          '3. Parmak = E4 (Mi)',
          'Tuşlara eşit kuvvette basın.'
        ],
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Do (1)' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: 'Re (2)' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Mi (3)' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: 'Re (2)' },
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'Do (1)' },
        ],
        recommendedKeyRange: ['C4', 'F4']
      },
      {
        id: 'les-1-3',
        chapterId: 'ch-1',
        number: 3,
        title: '5 Parmak Do Pozisyonu (C-D-E-F-G)',
        subtitle: 'Do Re Mi Fa Sol',
        description: 'Piyano eğitiminin temel taşı olan 5 parmak pozisyonudur. 1: Do, 2: Re, 3: Mi, 4: Fa, 5: Sol. 4. ve 5. parmaklar anatomik olarak daha zayıftır, sakin çalın.',
        objective: 'Beş parmağı da sırayla yukarı ve aşağı yönde yürütün.',
        handGuide: 'Sağ El: 1-C4, 2-D4, 3-E4, 4-F4, 5-G4. Parmak uçlarıyla kavisli basın.',
        tips: [
          '4. parmak (yüzük) en zor bağımsızlaşan parmaktır, sabırlı olun.',
          'Her nota tınlarken diğer parmaklar hafifçe tuşların üzerinde dursun.',
          'Legato (bağlı): Bir tuşu bırakırken diğerine basın.'
        ],
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Do' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: 'Re' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Mi' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: 'Fa' },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 5 }, lyric: 'Sol' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: 'Fa' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Mi' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: 'Re' },
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'Do' },
        ],
        recommendedKeyRange: ['C4', 'G4']
      }
    ]
  },
  {
    id: 'ch-2',
    number: 2,
    title: 'Ritim ve Nota Süreleri: Vuruşları Hisset',
    description: 'Birlik (4 vuruş), İkilik (2 vuruş) ve Dörtlük (1 vuruş) notalarla zamanlamayı ve metronomu kavrama.',
    level: 'Başlangıç',
    lessons: [
      {
        id: 'les-2-1',
        chapterId: 'ch-2',
        number: 4,
        title: 'Dörtlük ve İkilik Nota Ritimleri',
        subtitle: '1 Vuruş ve 2 Vuruş Dengesi',
        description: 'Dörtlük nota (♩) 1 vuruş sürer, ikilik nota (𝅗𝅥) 2 vuruş basılı tutulur. Nota sürelerini doğru saymak piyanoda melodiyi ortaya çıkarır.',
        objective: 'Notaları doğru sürelerde tutarak ritmik melodiyi tamamlayın.',
        handGuide: 'Sağ El: C-D-E-F-G tuşları üzerinde hazır bulunsun.',
        tips: [
          'Dörtlük notalarda: "1" de bas, "2" de sonrakine geç.',
          'İkilik notalarda: "1 - 2" diye içinden sayarak tuşu basılı tut.',
          'Metronom tik-tak sesine kulak verin.'
        ],
        tempo: 85,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: '1 vuruş' },
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: '1 vuruş' },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 5 }, lyric: '2 vuruş (tut)' },
          { note: 'A4', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: '1 vuruş' },
          { note: 'A4', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: '1 vuruş' },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 4 }, lyric: '2 vuruş (tut)' },
        ],
        recommendedKeyRange: ['C4', 'A4']
      },
      {
        id: 'les-2-2',
        chapterId: 'ch-2',
        number: 5,
        title: 'Sol Anahtarı Melodi Okuma: Yıldız Parçası',
        subtitle: 'Twinkle Twinkle Little Star Motifi',
        description: 'Tüm dünyada piyano eğitiminde kullanılan klasik melodi. Notalar arasındaki atlamaları (Do -> Sol) ve parmak geçişini öğretir.',
        objective: 'Melodiyi doğru parmak numaraları ve duraksamadan icra edin.',
        handGuide: 'Do için 1. parmak, Sol için 5. parmak, La için hafif el esnemesi.',
        tips: [
          'Do\'dan Sol\'e geçerken elinizi aniden zıplatmayın, yumuşakça uzanın.',
          'Aynı notayı tekrar çalarken parmağınızı tuştan çok kaldırmayın.'
        ],
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Do' },
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Do' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'Sol' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'Sol' },
          { note: 'A4', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'La' },
          { note: 'A4', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'La' },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 4 }, lyric: 'Sol-' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Fa' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Fa' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: 'Mi' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: 'Mi' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Re' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Re' },
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'Do-' },
        ],
        recommendedKeyRange: ['C4', 'A4']
      },
      {
        id: 'les-2-3',
        chapterId: 'ch-2',
        number: 6,
        title: 'Sol El (Fa Anahtarı) Bas Notaları',
        subtitle: 'Sol Elin Keşfi',
        description: 'Piyanoda sol el bas sesleri ve armoni temelini kurar. Sol el parmak numaraları simetriktir: 5=Serçe (C3), 1=Başparmak (G3).',
        objective: 'Sol el ile bas Do (C3), Mi (E3) ve Sol (G3) notalarını çalın.',
        handGuide: 'Sol El: 5. parmak C3\'te, 3. parmak E3\'te, 1. parmak G3\'te hazır.',
        tips: [
          'Sol elin başparmağı sağdakinin tam tersi yönü gösterir!',
          'Bas seslerin dolgun tınlamasını dinleyin.'
        ],
        tempo: 75,
        timeSignature: '4/4',
        notes: [
          { note: 'C3', duration: 2, finger: { hand: 'L', finger: 5 }, lyric: 'Bas Do (5)' },
          { note: 'G3', duration: 2, finger: { hand: 'L', finger: 1 }, lyric: 'Sol (1)' },
          { note: 'E3', duration: 2, finger: { hand: 'L', finger: 3 }, lyric: 'Mi (3)' },
          { note: 'C3', duration: 2, finger: { hand: 'L', finger: 5 }, lyric: 'Bas Do (5)' },
        ],
        recommendedKeyRange: ['C3', 'G3']
      }
    ]
  },
  {
    id: 'ch-3',
    number: 3,
    title: 'İki El Koordinasyonu ve Hanon Egzersizleri',
    description: 'Piyano çalmanın en büyük eşiği: İki eli bağımsız hareket ettirme ve parmak çevikliği geliştirme.',
    level: 'Temel',
    lessons: [
      {
        id: 'les-3-1',
        chapterId: 'ch-3',
        number: 7,
        title: 'İki El Dönüşümlü Diyalog',
        subtitle: 'Sol El Cevap Veriyor',
        description: 'Önce sağ el bir melodi çalar, ardından sol el bas nota ile cevap verir. İki elin zihinde ayrışması için en etkili egzersiz.',
        objective: 'Sağ ve sol el arasında duraksamadan geçiş yapın.',
        handGuide: 'Sağ el C4 üzerinde, sol el C3 üzerinde hazır beklesin.',
        tips: [
          'Sağ el çalarken sol elinizi gevşek tutun.',
          'Sıra sol ele geçtiğinde acele etmeyin.'
        ],
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Sağ Do' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Sağ Mi' },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 5 }, lyric: 'Sağ Sol' },
          { note: 'C3', duration: 2, finger: { hand: 'L', finger: 5 }, lyric: 'Sol Do' },
          { note: 'G3', duration: 2, finger: { hand: 'L', finger: 1 }, lyric: 'Sol Sol' },
          { note: 'C4', duration: 4, finger: { hand: 'R', finger: 1 }, lyric: 'Bitiş Do' },
        ],
        recommendedKeyRange: ['C3', 'G4']
      },
      {
        id: 'les-3-2',
        chapterId: 'ch-3',
        number: 8,
        title: 'Hanon No. 1: Parmak Bağımsızlığı',
        subtitle: 'Efsanevi Piyano Virtüöz Egzersizi',
        description: 'Charles-Louis Hanon\'un yazdığı 1 numaralı egzersiz, 1. ve 2. parmak arasındaki açıklığı artırır ve tüm parmakları eşit güçlendirir.',
        objective: 'C-E-F-G-A-G-F-E notasını takılmadan, düzgün bir ritimle çalın.',
        handGuide: 'Sağ El: 1 (C4) atlar 2 (E4), 3 (F4), 4 (G4), 5 (A4), 4 (G4), 3 (F4), 2 (E4).',
        tips: [
          'Başparmak ile işaret parmağı arasındaki atlamaya dikkat edin (C\'den E\'ye).',
          'Tüm parmaklar tuşa aynı güçte çarpsın.'
        ],
        tempo: 90,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: '1' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: '2' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: '3' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: '4' },
          { note: 'A4', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: '5' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: '4' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: '3' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: '2' },
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: '1 (Son)' },
        ],
        recommendedKeyRange: ['C4', 'A4']
      },
      {
        id: 'les-3-3',
        chapterId: 'ch-3',
        number: 9,
        title: '3-4-5 Parmak Güçlendirme',
        subtitle: 'Zayıf Parmakların Direnci',
        description: 'İnsan elinde 4. parmak (yüzük) ve 5. parmak (serçe) tendonları birbirine bağlıdır. Bu egzersiz bu parmakları izole ederek güçlendirir.',
        objective: 'Mi-Fa-Sol-La geçişlerini düzgün artikülasyonla çalın.',
        handGuide: 'Sağ El: 3 (E4), 4 (F4), 5 (G4). Bilek sabit, parmaklar yay gibi çalışsın.',
        tips: [
          '4. parmağı tuşa basarken bileğinizi döndürmemeye çalışın.',
          'Yavaş başlayıp emin adımlarla ilerleyin.'
        ],
        tempo: 85,
        timeSignature: '4/4',
        notes: [
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 } },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 4 } },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 5 } },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 4 } },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 } },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 4 } },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 5 } },
        ],
        recommendedKeyRange: ['E4', 'G4']
      }
    ]
  },
  {
    id: 'ch-4',
    number: 4,
    title: 'Akorlar ve Armoni: Piyanoyu Konuştur',
    description: 'Do Majör, Fa Majör, Sol Majör ve La Minör akorları ile şarkılara eşlik etme sanatı.',
    level: 'Temel',
    lessons: [
      {
        id: 'les-4-1',
        chapterId: 'ch-4',
        number: 10,
        title: 'İlk Akor: Do Majör Üçlüsü (C Major Triad)',
        subtitle: 'Do - Mi - Sol Armonisi',
        description: 'Akor, birden fazla notanın aynı anda veya kırık olarak tınlamasıdır. Do Majör akoru piyanodaki en temel ve parlak tınıya sahip akordur.',
        objective: 'Do (1), Mi (3) ve Sol (5) notalarını önce arpej (tek tek) ardından aynı anda tınlatın.',
        handGuide: 'Sağ El: 1 (C4), 3 (E4), 5 (G4). Üç parmak aynı anda tuşların üzerine iner.',
        tips: [
          'Parmaklarınızı hazır pozisyonda tutun.',
          'Do, Mi ve Sol arasındaki mesafeler eşittir (üçlü aralıklar).'
        ],
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Do (1)' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Mi (3)' },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 5 }, lyric: 'Sol (5)' },
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'C Akoru Temel' },
        ],
        recommendedKeyRange: ['C4', 'G4']
      },
      {
        id: 'les-4-2',
        chapterId: 'ch-4',
        number: 11,
        title: 'Üç Büyük Akor: C - F - G',
        subtitle: 'Müziğin Temel Taşı',
        description: 'Binlerce popüler şarkı ve klasik eser bu 3 akor üzerine kuruludur: 1. Derece (C), 4. Derece (F), 5. Derece (G).',
        objective: 'C (Do Majör), F (Fa Majör) ve G (Sol Majör) bas ve akor akışını çalın.',
        handGuide: 'Sol el bas notaları C3, F3, G3 çalar.',
        tips: [
          'F akoru: Fa - La - Do',
          'G akoru: Sol - Si - Re',
          'Akor değişimlerinde elinizi gevşetip bir sonraki pozisyona süzülün.'
        ],
        tempo: 85,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'C (Do Majör)' },
          { note: 'F4', duration: 2, finger: { hand: 'R', finger: 4 }, lyric: 'F (Fa Majör)' },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 5 }, lyric: 'G (Sol Majör)' },
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'C (Eve Dönüş)' },
        ],
        recommendedKeyRange: ['C4', 'G4']
      },
      {
        id: 'les-4-3',
        chapterId: 'ch-4',
        number: 12,
        title: 'Hüzünlü Tını: La Minör (Am) ve Pop Döngüsü',
        subtitle: 'C - Am - F - G İlerlemesi',
        description: 'Minör akorlar müziğe derinlik ve hüzün katar. La Minör (A - C - E) akorunu Do Majör ile birleştirerek efsanevi 4-akor döngüsünü çalacağız.',
        objective: 'C -> Am -> F -> G döngüsünü ritmik olarak başarıyla tamamlayın.',
        handGuide: 'Sağ el akor melodisini takip eder.',
        tips: [
          'La Minör: A4 - C5 - E5 (veya tek bas A3).',
          'Majör tını parlak ve mutlu iken, minör tını duygusal ve sakindir.'
        ],
        tempo: 85,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'C Majör' },
          { note: 'A4', duration: 2, finger: { hand: 'R', finger: 5 }, lyric: 'A Minör' },
          { note: 'F4', duration: 2, finger: { hand: 'R', finger: 3 }, lyric: 'F Majör' },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 4 }, lyric: 'G Majör' },
        ],
        recommendedKeyRange: ['C4', 'A4']
      }
    ]
  },
  {
    id: 'ch-5',
    number: 5,
    title: 'Gamlar ve Başparmak Geçiş Tekniği (Thumb-Under)',
    description: 'Piyano klavyesinde özgürce uçmanın sırrı: 1-2-3 başparmağı alttan kaydırma ve arpej çalma tekniği.',
    level: 'Orta',
    lessons: [
      {
        id: 'les-5-1',
        chapterId: 'ch-5',
        number: 13,
        title: 'Do Majör Gamı (C Major Scale)',
        subtitle: 'Başparmağı Alttan Geçirme Sanatı',
        description: 'Do Majör gamı 8 notadan oluşur (C-D-E-F-G-A-B-C). Ancak elimizde 5 parmak vardır! Sır: 3. parmak (Mi) çalındıktan sonra başparmak (1) avuç içinin altından Fa (F) tuşuna süzülür.',
        objective: '1-2-3 ardından alttan 1-2-3-4-5 parmak kombinasyonunu pürüzsüz icra edin.',
        handGuide: 'Sağ El: 1 (C4), 2 (D4), 3 (E4) -> [BAŞPARMAK ALTTAN GEÇER] -> 1 (F4), 2 (G4), 3 (A4), 4 (B4), 5 (C5).',
        tips: [
          'Başparmak alttan geçerken dirseğinizi havaya kaldırmayın.',
          'Geçiş noktasında ses kesilmesin (bağlı çalın).'
        ],
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: '1 (Do)' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: '2 (Re)' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: '3 (Mi)' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: '1 [Alttan] (Fa)' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: '2 (Sol)' },
          { note: 'A4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: '3 (La)' },
          { note: 'B4', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: '4 (Si)' },
          { note: 'C5', duration: 2, finger: { hand: 'R', finger: 5 }, lyric: '5 (Do Zirve)' },
        ],
        recommendedKeyRange: ['C4', 'C5']
      },
      {
        id: 'les-5-2',
        chapterId: 'ch-5',
        number: 14,
        title: 'Do Majör Gamı İniş Tekniği (Thumb-Over)',
        subtitle: 'Zirveden Başlangıca Geri Dönüş',
        description: 'Çıkışın tersine inişte 3. parmak başparmağın üzerinden atlar: 5-4-3-2-1 -> 3. parmak E4\'e atlar -> 2-1.',
        objective: 'C5\'ten C4\'e pürüzsüzce inin.',
        handGuide: 'Sağ El: 5 (C5), 4 (B4), 3 (A4), 2 (G4), 1 (F4) -> [3 ÜSTTEN ATLAR] -> 3 (E4), 2 (D4), 1 (C4).',
        tips: [
          '3. parmak atlarken el bileği yumuşak bir yay çizer.',
          'Tüm notaları eşit sürelerde tutun.'
        ],
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { note: 'C5', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: '5' },
          { note: 'B4', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: '4' },
          { note: 'A4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: '3' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: '2' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: '1' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: '3 [Üstten]' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: '2' },
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: '1' },
        ],
        recommendedKeyRange: ['C4', 'C5']
      },
      {
        id: 'les-5-3',
        chapterId: 'ch-5',
        number: 15,
        title: 'Arpej Tekniği: Su Gibi Akan Notalar',
        subtitle: 'Kırık Akorlar ile Şelale Etkisi',
        description: 'Arpej (Arpeggio), akor notalarının birbiri ardına hızlıca ve akıcı çalınmasıdır. Klasik ve romantik müziğin en büyüleyici tekniğidir.',
        objective: 'C4 - E4 - G4 - C5 arpejini iki oktav boyunca icra edin.',
        handGuide: 'Sağ El: 1 (C4), 2 (E4), 3 (G4) -> [1 geçer] -> 1 (C5), 2 (E5), 3 (G5).',
        tips: [
          'Sustain pedalını açarak tınıların birbirine karışmasını deneyimleyin!',
          'Bilek su dalgası gibi esnek olmalıdır.'
        ],
        tempo: 90,
        timeSignature: '4/4',
        notes: [
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 } },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 2 } },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 3 } },
          { note: 'C5', duration: 1, finger: { hand: 'R', finger: 5 } },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 3 } },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 2 } },
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 } },
        ],
        recommendedKeyRange: ['C4', 'C5']
      }
    ]
  },
  {
    id: 'ch-6',
    number: 6,
    title: 'Şarkı Repertuvarı: Gerçek Başyapıtlar',
    description: 'Öğrendiğiniz tüm teknikleri birleştiren Beethoven, Pachelbel, Bach ve Chopin eserleri.',
    level: 'Orta',
    lessons: [
      {
        id: 'les-6-1',
        chapterId: 'ch-6',
        number: 16,
        title: 'Beethoven: Neşeye Övgü (Ode to Joy)',
        subtitle: '9. Senfoni Teması',
        description: 'Ludwig van Beethoven\'ın ölümsüz eseri. 5 parmak pozisyonunda muhteşem bir müzikalite ve dinamik ifade gerektirir.',
        objective: 'Melodiyi doğru artikülasyon ve legato bağıyla çalın.',
        handGuide: 'Sağ el C4 pozisyonunda: 1-C, 2-D, 3-E, 4-F, 5-G.',
        tips: [
          'Mi (3. parmak) ile başlar.',
          'Notaların ritmik değerlerine (ikilik notalarda duraksamaya) dikkat edin.'
        ],
        tempo: 95,
        timeSignature: '4/4',
        notes: [
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Ne-' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'şe-' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: 'ye' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'Öv-' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'gü' },
          { note: 'F4', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: 'Dün-' },
          { note: 'E4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'ya-' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: 'ya' },
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Dö-' },
          { note: 'C4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'kül-' },
          { note: 'D4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: 'sün' },
          { note: 'E4', duration: 1.5, finger: { hand: 'R', finger: 3 }, lyric: 'Ses' },
          { note: 'D4', duration: 0.5, finger: { hand: 'R', finger: 2 }, lyric: 'ler' },
          { note: 'D4', duration: 2, finger: { hand: 'R', finger: 2 }, lyric: '...' },
        ],
        recommendedKeyRange: ['C4', 'G4']
      },
      {
        id: 'les-6-2',
        chapterId: 'ch-6',
        number: 17,
        title: 'Beethoven: Für Elise (Giriş Teması)',
        subtitle: 'Piyano Tarihinin En Meşhur Girişi',
        description: 'Mi ve Re diyez (E5 - D#5) arasındaki o büyüleyici dokunuş. Siyah tuş ve beyaz tuş arasındaki hassas geçişi öğretir.',
        objective: 'E5 ve D#5 salınımını doğru parmak numaralarıyla çalın.',
        handGuide: 'Sağ El: 5 (E5) ve 4 (D#5). Hassas ve hafif bir dokunuş.',
        tips: [
          'D#5 siyah tuşuna 4. parmağınızla hafifçe dokunun.',
          'Parçanın temposu çok hızlı değildir, melodiye şarkı söyletin.'
        ],
        tempo: 85,
        timeSignature: '3/4',
        notes: [
          { note: 'E5', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'Mi' },
          { note: 'D#5', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: 'Re#' },
          { note: 'E5', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'Mi' },
          { note: 'D#5', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: 'Re#' },
          { note: 'E5', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'Mi' },
          { note: 'B4', duration: 1, finger: { hand: 'R', finger: 2 }, lyric: 'Si' },
          { note: 'D5', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: 'Re' },
          { note: 'C5', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Do' },
          { note: 'A4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'La (Derin)' },
        ],
        recommendedKeyRange: ['A4', 'E5']
      },
      {
        id: 'les-6-3',
        chapterId: 'ch-6',
        number: 18,
        title: 'Pachelbel: Canon in D (Piyano Teması)',
        subtitle: 'Barok Dönemin Zarafeti',
        description: 'Tarihin en çok dinlenen klasik akor döngüsü. İnen ezgisel çizgisi ve dingin tınısıyla piyano çalma hazzını doruğa çıkarır.',
        objective: 'Fa diyez (F#4) arızalı notasını kullanarak melodiyi tamamlayın.',
        handGuide: 'Sağ El: F#4 siyah tuşuna 3. parmak ile basın.',
        tips: [
          'F#4 tuşuna basarken elinizi çok içeri sokmayın.',
          'Melodik inişi nefes alır gibi dingin icra edin.'
        ],
        tempo: 80,
        timeSignature: '4/4',
        notes: [
          { note: 'F#4', duration: 2, finger: { hand: 'R', finger: 3 }, lyric: 'Fa#' },
          { note: 'E4', duration: 2, finger: { hand: 'R', finger: 2 }, lyric: 'Mi' },
          { note: 'D4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'Re' },
          { note: 'C#4', duration: 2, finger: { hand: 'R', finger: 2 }, lyric: 'Do#' },
          { note: 'B3', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'Si' },
          { note: 'A3', duration: 2, finger: { hand: 'L', finger: 1 }, lyric: 'La' },
          { note: 'B3', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'Si' },
          { note: 'C#4', duration: 2, finger: { hand: 'R', finger: 2 }, lyric: 'Do#' },
        ],
        recommendedKeyRange: ['A3', 'F#4']
      },
      {
        id: 'les-6-4',
        chapterId: 'ch-6',
        number: 19,
        title: 'J.S. Bach: Minuet in G',
        subtitle: 'Klasik Dans Formu',
        description: 'Johann Sebastian Bach\'ın Anna Magdalena için yazdığı neşeli 3/4\'lük minuet. Ritmik canlılık ve net parmak vuruşları ister.',
        objective: '3/4 ritim ölçüsünde (1-2-3) dans adımlarını piyanoya yansıtın.',
        handGuide: 'Sağ El: Sol Majör pozisyonunda (G4, A4, B4, C5, D5).',
        tips: [
          '3/4 ritimde ilk vuruş kuvvetli, 2 ve 3 hafif çalınır: GÜM-tek-tek.',
          'Parmağınızı tuştan hafifçe kaldırarak staccato canlılığı katabilirsiniz.'
        ],
        tempo: 90,
        timeSignature: '3/4',
        notes: [
          { note: 'D5', duration: 1, finger: { hand: 'R', finger: 5 }, lyric: 'Re' },
          { note: 'G4', duration: 0.5, finger: { hand: 'R', finger: 1 }, lyric: 'Sol' },
          { note: 'A4', duration: 0.5, finger: { hand: 'R', finger: 2 }, lyric: 'La' },
          { note: 'B4', duration: 1, finger: { hand: 'R', finger: 3 }, lyric: 'Si' },
          { note: 'C5', duration: 1, finger: { hand: 'R', finger: 4 }, lyric: 'Do' },
          { note: 'D5', duration: 2, finger: { hand: 'R', finger: 5 }, lyric: 'Re' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Sol' },
        ],
        recommendedKeyRange: ['G4', 'D5']
      },
      {
        id: 'les-6-5',
        chapterId: 'ch-6',
        number: 20,
        title: 'Chopin: Nocturne Op. 9 No. 2 Teması',
        subtitle: 'Romantik Şaheser Motif',
        description: 'Frédéric Chopin\'in piyano edebiyatındaki en duygusal gece müziği (Nocturne). İnce nüanslar ve şarkı söyler gibi tınlayan bir melodi.',
        objective: 'Geniş aralıkları yumuşak bir el dönüşüyle bağlayın.',
        handGuide: 'Sağ el arpejleri ve melodiyi zarif bir dokunuşla yönlendirir.',
        tips: [
          'Sustain pedalını kullanarak notaların uzamasını sağlayın.',
          'Her nota bir keman yayının çekilişi gibi yumuşak tınlasın.'
        ],
        tempo: 75,
        timeSignature: '12/8',
        notes: [
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Sol' },
          { note: 'G4', duration: 1, finger: { hand: 'R', finger: 1 }, lyric: 'Sol' },
          { note: 'G4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'Sol-' },
          { note: 'F4', duration: 0.5, finger: { hand: 'R', finger: 1 }, lyric: 'Fa' },
          { note: 'G4', duration: 0.5, finger: { hand: 'R', finger: 2 }, lyric: 'Sol' },
          { note: 'Eb4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'Mib' },
          { note: 'C4', duration: 2, finger: { hand: 'R', finger: 1 }, lyric: 'Do' },
        ],
        recommendedKeyRange: ['C4', 'G4']
      }
    ]
  }
];
