export const USER = {
  name: 'Usuario',
  email: 'usuario@email.com',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSDowoyjRInQNwikV9qKbMW60Xq3jnMJ9TbOdVyNE-Xm55-YFry4euex2XYysEUFySgiTWm6jjREdlG8f2N1xKJKQBL1AjuRrm3mCQ_-GcFHb73jaHkbBBeQzIdG2RseylSxWz0tG1tVx-AiSDpndFbVafVTNqkWg1-gK_V0yJV_itzXwprBKHzqkotEt_GYxXTRRxljzi_GVp2_w5ZRwBuyEN3Wob-cayxH-Kg76bSeVdOqr7YFixX5Hv3GfOBKRv5NiWEQLDog0',
};

export const CARDS = [
  { label: 'Balance General', value: 'ARS $85,000', tone: 'text-slate-900 dark:text-white' },
  { label: 'Total que Debo', value: 'ARS $15,000', tone: 'text-red-500 dark:text-red-400' },
  {
    label: 'Total que Me Deben',
    value: 'ARS $100,000',
    tone: 'text-green-500 dark:text-green-400',
  },
];

export const GROUPS = [
  {
    title: 'Banco Nación',
    cta: 'Pagar Cuota a Todos',
    items: [
      {
        title: 'Cuota 3/12 - Notebook',
        chip: { text: 'Debo', tone: 'red' },
        amount: 'ARS $15.000',
        total: 'de $60.000',
        progressPct: 25,
        action: 'Pagar Cuota',
      },
    ],
  },
  {
    title: 'Personal',
    cta: 'Cobrar Cuota a Todos',
    items: [
      {
        title: 'Préstamo a Juan',
        chip: { text: 'Me deben', tone: 'green' },
        amount: 'ARS $75.000',
        total: 'de $100.000',
        progressPct: 75,
        action: 'Cobrar Cuota',
      },
    ],
  },
  {
    title: 'Inmobiliaria G.',
    cta: 'Pagar Cuota a Todos',
    items: [
      {
        title: 'Alquiler Dpto.',
        chip: { text: 'Debo', tone: 'red' },
        amount: 'ARS $40.000',
        total: 'de $40.000',
        progressPct: 100,
        action: 'Pagar Cuota',
      },
    ],
  },
  {
    title: 'Banco Galicia',
    cta: 'Pagar Cuota a Todos',
    items: [
      {
        title: 'Pago Tarjeta',
        chip: { text: 'Debo', tone: 'red' },
        amount: 'ARS $25.000',
        total: 'de $25.000',
        progressPct: 100,
        action: 'Pagar Cuota',
      },
    ],
  },
];

export const UPCOMING = [
  { tone: 'yellow', title: 'Vence en 2 días', subtitle: 'Alquiler Dpto.', icon: 'calendar_month' },
  { tone: 'red', title: 'Vencido', subtitle: 'Factura de Internet', icon: 'warning' },
  { tone: 'blue', title: 'Vence en 15 días', subtitle: 'Seguro del Auto', icon: 'notifications' },
];
