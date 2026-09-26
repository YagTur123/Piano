import { ChordItem, ScaleItem } from '../types/piano';

export const CHORDS_LIST: ChordItem[] = [
  {
    id: 'chord-c-maj',
    name: 'Do Majör (C Major)',
    root: 'C',
    type: 'Majör',
    symbol: 'C',
    category: 'Majör',
    notes: ['C4', 'E4', 'G4'],
    fingeringRight: [1, 3, 5],
    fingeringLeft: [5, 3, 1],
    description: 'En temel majör akor. Parlak, neşeli ve dengeli bir tınısı vardır. Notalar: Do - Mi - Sol.'
  },
  {
    id: 'chord-g-maj',
    name: 'Sol Majör (G Major)',
    root: 'G',
    type: 'Majör',
    symbol: 'G',
    category: 'Majör',
    notes: ['G3', 'B3', 'D4'],
    fingeringRight: [1, 3, 5],
    fingeringLeft: [5, 3, 1],
    description: 'Do Majör tonunun 5. derecesi (Dominant akor). Müziği Do\'ya çeker. Notalar: Sol - Si - Re.'
  },
  {
    id: 'chord-f-maj',
    name: 'Fa Majör (F Major)',
    root: 'F',
    type: 'Majör',
    symbol: 'F',
    category: 'Majör',
    notes: ['F3', 'A3', 'C4'],
    fingeringRight: [1, 3, 5],
    fingeringLeft: [5, 3, 1],
    description: 'Do Majör tonunun 4. derecesi (Subdominant). Ferah ve huzurlu bir tınısı vardır. Notalar: Fa - La - Do.'
  },
  {
    id: 'chord-d-min',
    name: 'Re Minör (D Minor)',
    root: 'D',
    type: 'Minör',
    symbol: 'Dm',
    category: 'Minör',
    notes: ['D4', 'F4', 'A4'],
    fingeringRight: [1, 3, 5],
    fingeringLeft: [5, 3, 1],
    description: 'Duygusal ve lirik bir minör akor. Pop ve caz eserlerinde sıkça kullanılır. Notalar: Re - Fa - La.'
  },
  {
    id: 'chord-e-min',
    name: 'Mi Minör (E Minor)',
    root: 'E',
    type: 'Minör',
    symbol: 'Em',
    category: 'Minör',
    notes: ['E3', 'G3', 'B3'],
    fingeringRight: [1, 3, 5],
    fingeringLeft: [5, 3, 1],
    description: 'Derin ve melankolik tını. Sol Majör dizisinin ilgili minörüdür. Notalar: Mi - Sol - Si.'
  },
  {
    id: 'chord-a-min',
    name: 'La Minör (A Minor)',
    root: 'A',
    type: 'Minör',
    symbol: 'Am',
    category: 'Minör',
    notes: ['A3', 'C4', 'E4'],
    fingeringRight: [1, 3, 5],
    fingeringLeft: [5, 3, 1],
    description: 'Do Majörün doğal kardeş minörüdür (İlgili minör). Arıza almaz. Notalar: La - Do - Mi.'
  },
  {
    id: 'chord-g-7',
    name: 'Sol Dominant Yedili (G7)',
    root: 'G',
    type: 'Yedili',
    symbol: 'G7',
    category: 'Yedili (7th)',
    notes: ['G3', 'B3', 'D4', 'F4'],
    fingeringRight: [1, 2, 4, 5],
    fingeringLeft: [5, 3, 2, 1],
    description: 'Klasik ve caz müziğinde Do Majöre güçlü bir çözülme isteği yaratan 4 sesli akor. Notalar: Sol - Si - Re - Fa.'
  },
  {
    id: 'chord-c-maj7',
    name: 'Do Majör Yedili (Cmaj7)',
    root: 'C',
    type: 'Maj7',
    symbol: 'Cmaj7',
    category: 'Yedili (7th)',
    notes: ['C4', 'E4', 'G4', 'B4'],
    fingeringRight: [1, 2, 3, 5],
    fingeringLeft: [5, 3, 2, 1],
    description: 'Rüya gibi, dingin, sinematik ve modern tını. Notalar: Do - Mi - Sol - Si.'
  },
  {
    id: 'chord-c-sus4',
    name: 'Do Askıda Dörtlü (Csus4)',
    root: 'C',
    type: 'Askıda (Sus)',
    symbol: 'Csus4',
    category: 'Askıda (Sus)',
    notes: ['C4', 'F4', 'G4'],
    fingeringRight: [1, 4, 5],
    fingeringLeft: [5, 2, 1],
    description: 'Üçüncü ses (Mi) yerine dördüncü ses (Fa) kullanılarak gerilim ve askıda kalma hissi yaratılır.'
  },
  {
    id: 'chord-d-maj',
    name: 'Re Majör (D Major)',
    root: 'D',
    type: 'Majör',
    symbol: 'D',
    category: 'Majör',
    notes: ['D4', 'F#4', 'A4'],
    fingeringRight: [1, 3, 5],
    fingeringLeft: [5, 3, 1],
    description: 'Parlak ve coşkulu bir ton. Fa diyez (F#) siyah tuşunu içerir. Notalar: Re - Fa# - La.'
  },
  {
    id: 'chord-a-maj',
    name: 'La Majör (A Major)',
    root: 'A',
    type: 'Majör',
    symbol: 'A',
    category: 'Majör',
    notes: ['A3', 'C#4', 'E4'],
    fingeringRight: [1, 3, 5],
    fingeringLeft: [5, 3, 1],
    description: 'Sıcak ve zengin ses. Do diyez (C#) siyah tuşu kullanılır. Notalar: La - Do# - Mi.'
  },
  {
    id: 'chord-e-maj',
    name: 'Mi Majör (E Major)',
    root: 'E',
    type: 'Majör',
    symbol: 'E',
    category: 'Majör',
    notes: ['E3', 'G#3', 'B3'],
    fingeringRight: [1, 3, 5],
    fingeringLeft: [5, 3, 1],
    description: 'Güçlü ve parlak. Sol diyez (G#) barındırır. Notalar: Mi - Sol# - Si.'
  }
];

export const SCALES_LIST: ScaleItem[] = [
  {
    id: 'scale-c-major',
    name: 'Do Majör Gamı (C Major Scale)',
    root: 'C',
    type: 'Doğal Majör',
    category: 'Majör',
    notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    fingeringRight: [1, 2, 3, 1, 2, 3, 4, 5],
    fingeringLeft: [5, 4, 3, 2, 1, 3, 2, 1],
    description: 'Piyano eğitiminin temel gamıdır. Hiçbir arıza (diyez/bemol) almaz; tüm beyaz tuşları kapsar. Parmak geçişi 3. notadan sonradır.'
  },
  {
    id: 'scale-a-minor',
    name: 'La Doğal Minör Gamı (A Natural Minor)',
    root: 'A',
    type: 'Doğal Minör',
    category: 'Doğal Minör',
    notes: ['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4'],
    fingeringRight: [1, 2, 3, 1, 2, 3, 4, 5],
    fingeringLeft: [5, 4, 3, 2, 1, 3, 2, 1],
    description: 'Do Majörün ilgili doğal minörüdür. Arıza almaz, hüzünlü ve doğal bir akışı vardır.'
  },
  {
    id: 'scale-g-major',
    name: 'Sol Majör Gamı (G Major Scale)',
    root: 'G',
    type: 'Majör',
    category: 'Majör',
    notes: ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F#4', 'G4'],
    fingeringRight: [1, 2, 3, 1, 2, 3, 4, 5],
    fingeringLeft: [5, 4, 3, 2, 1, 3, 2, 1],
    description: 'Tek bir arıza alır: Fa diyez (F#). 7. derece (sansibl) Fa# tuşuna 4. parmak basar.'
  },
  {
    id: 'scale-f-major',
    name: 'Fa Majör Gamı (F Major Scale)',
    root: 'F',
    type: 'Majör',
    category: 'Majör',
    notes: ['F3', 'G3', 'A3', 'A#3', 'C4', 'D4', 'E4', 'F4'],
    fingeringRight: [1, 2, 3, 4, 1, 2, 3, 4],
    fingeringLeft: [5, 4, 3, 2, 1, 3, 2, 1],
    description: 'Si bemol (Bb / A#) siyah tuşunu içerir. Sağ elde 4. parmak siyah tuşa basar ve hemen ardından başparmak Do\'ya geçer.'
  },
  {
    id: 'scale-c-pentatonic',
    name: 'Do Majör Pentatonik Gam (5 Sesli)',
    root: 'C',
    type: 'Pentatonik',
    category: 'Pentatonik',
    notes: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
    fingeringRight: [1, 2, 3, 4, 5, 1],
    fingeringLeft: [5, 4, 3, 2, 1, 1],
    description: 'Yarım ses barındırmayan 5 sesli kadim gam. Hangi notaya basarsanız basın asla kulağa detone gelmez; doğaçlama için mükemmeldir.'
  }
];
