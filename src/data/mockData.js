// ============================================================
// Shared mock data with dynamic dates pinned to the CURRENT WEEK
// All date calculations happen once at module load time.
// Posts keep their day-of-week (Mon posts stay Mon, etc.)
// and their time (08:00 stays 08:00) — only the week shifts.
// ============================================================

// --- Helper functions ---

/**
 * Returns the Monday of the current week (weeks start on Monday).
 */
const getCurrentWeekMonday = () => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, …, 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // Sun → go back 6 days
  const monday = new Date(now);
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * Returns a Date for a specific day in the current week at the given time.
 * @param {number} daysOffset — offset from this week's Monday
 *   0 = Monday, 1 = Tuesday, …, 5 = Saturday, 6 = Sunday
 *   Negative values (e.g. -1) land before the week starts.
 */
export const getRelativeDate = (daysOffset, hours, minutes) => {
  const monday = getCurrentWeekMonday();
  const date = new Date(monday);
  date.setDate(monday.getDate() + daysOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Formats a Date object to the display format used across the app: "Nov 17, 2025 08:00"
 */
export const formatDateForDisplay = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${year} ${hours}:${mins}`;
};

/**
 * Returns midnight of a specific day in the current week.
 * @param {number} daysOffset — offset from this week's Monday (same as getRelativeDate)
 */
const dayStart = (daysOffset) => {
  const monday = getCurrentWeekMonday();
  const d = new Date(monday);
  d.setDate(monday.getDate() + daysOffset);
  d.setHours(0, 0, 0, 0);
  return d;
};

// --- Image URLs (same as originals) ---

// Scheduled feed images
const imagePalette = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=540&h=350&fit=crop';
const imageLipstick = 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=540&h=350&fit=crop';
const imageSerum = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=540&h=350&fit=crop';
const imageCream = 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=540&h=350&fit=crop';

// Draft feed images
const imageEyeCream = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=540&h=350&fit=crop';
const imageGiftSet = 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=540&h=350&fit=crop';
const imageFoundation = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=540&h=350&fit=crop';
const imageWinterLipstick = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=540&h=350&fit=crop';
const imageVitaminSerum = 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=540&h=350&fit=crop';
const imageBodyCream = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=540&h=350&fit=crop';
const imageMetallicPalette = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=540&h=350&fit=crop';
const imageBeautyBox = 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=540&h=350&fit=crop';

// --- Scheduled Posts (8 posts, spread across the current week) ---

export const scheduledPosts = [
  // Monday, 08:00
  {
    id: '1',
    profile: {
      name: 'FakeCosmetic CZ',
      url: '/fakecosmetic-cz',
      platform: 'FB',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(0, 8, 0)),
    creator: {
      name: 'Klára Novotná',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Let your natural beauty shine ✨ Our new lipstick shades bring confidence to every smile.',
    badges: [
      { type: 'draft', label: 'Draft' },
      { type: 'default', label: 'Multipost', count: '12' },
      { type: 'default', label: 'Story' },
      { type: 'default', label: 'LIB' }
    ],
    comments: { count: 2 },
    media: {
      type: 'image',
      src: imageLipstick,
      alt: 'Lipstick'
    },
    status: 'scheduled',
    campaignId: 1
  },
  // Monday, 14:30
  {
    id: '2',
    profile: {
      name: 'FakeCosmetic CZ',
      url: '/fakecosmetic-cz',
      platform: 'IG',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(0, 14, 30)),
    creator: {
      name: 'Klára Novotná',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    text: 'New lipstick tones for a new season 💋 Which one will be yours?',
    badges: [
      { type: 'draft', label: 'Draft' },
      { type: 'default', label: 'Multipost' },
      { type: 'default', label: 'Story' },
      { type: 'default', label: 'LIB' }
    ],
    media: {
      type: 'image',
      src: imageLipstick,
      alt: 'Lipstick'
    },
    status: 'scheduled',
    campaignId: 2
  },
  // Sunday (before week start), 09:15
  {
    id: '3',
    profile: {
      name: 'FakeCosmetic CZ',
      url: '/fakecosmetic-cz',
      platform: 'FB',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(-1, 9, 15)),
    creator: {
      name: 'Klára Novotná',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Give your skin the hydration it deserves. Our serum keeps your glow all day long.',
    media: {
      type: 'image',
      src: imageSerum,
      alt: 'Facial Serum'
    },
    status: 'sent'
  },
  // Tuesday, 10:00
  {
    id: '4',
    profile: {
      name: 'FakeCosmetic CZ',
      url: '/fakecosmetic-cz',
      platform: 'IG',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(1, 10, 0)),
    creator: {
      name: 'Klára Novotná',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Hydrate, glow, repeat ✨ Winter skin has a new best friend.',
    media: {
      type: 'image',
      src: imageSerum,
      alt: 'Facial Serum'
    },
    status: 'scheduled',
    campaignId: 3
  },
  // Tuesday, 16:00
  {
    id: '5',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'FB',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(1, 16, 0)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Découvrez notre nouvelle palette d\'ombres ✨ Parfaite pour un look doux ou glamour.',
    media: {
      type: 'image',
      src: imagePalette,
      alt: 'Eyeshadow Palette'
    },
    status: 'scheduled',
    campaignId: 4
  },
  // Wednesday, 08:30
  {
    id: '6',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'IG',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(2, 8, 30)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Une palette, mille possibilités 🎨 Quel look allez-vous créer aujourd\'hui ?',
    media: {
      type: 'image',
      src: imagePalette,
      alt: 'Eyeshadow Palette'
    },
    status: 'scheduled',
    campaignId: 1
  },
  // Wednesday, 13:45
  {
    id: '7',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'FB',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(2, 13, 45)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Offrez à votre peau l\'hydratation ultime 💛 Notre crème nourrissante est un must-have.',
    media: {
      type: 'image',
      src: imageCream,
      alt: 'Nourishing Face Cream'
    },
    status: 'scheduled',
    campaignId: 4
  },
  // Thursday, 11:00
  {
    id: '8',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'IG',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(3, 11, 0)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Texture soyeuse, éclat garanti ✨ Votre peau va adorer.',
    media: {
      type: 'image',
      src: imageCream,
      alt: 'Nourishing Face Cream'
    },
    status: 'scheduled'
  }
];

// --- Draft Posts (10 posts, spread across the current week) ---

export const draftPosts = [
  // Sunday (before week start), 10:15
  {
    id: 'draft-1',
    profile: {
      name: 'FakeCosmetic CZ',
      url: '/fakecosmetic-cz',
      platform: 'FB',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(-1, 10, 15)),
    creator: {
      name: 'Klára Novotná',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Your autumn look starts with the lips 💄 Try our new shades inspired by warm fall tones.',
    media: {
      type: 'image',
      src: imageLipstick,
      alt: 'Autumn Lipstick'
    },
    status: 'draft',
    campaignId: 1
  },
  // Monday, 14:40
  {
    id: 'draft-2',
    profile: {
      name: 'FakeCosmetic CZ',
      url: '/fakecosmetic-cz',
      platform: 'IG',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(0, 14, 40)),
    creator: {
      name: 'Klára Novotná',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Dry skin in cold weather? Our hydrating face mist brings instant freshness and softness ✨.',
    media: {
      type: 'image',
      src: imageSerum,
      alt: 'Hydrating Face Mist'
    },
    status: 'draft',
    campaignId: 2
  },
  // Wednesday, 09:30
  {
    id: 'draft-3',
    profile: {
      name: 'FakeCosmetic CZ',
      url: '/fakecosmetic-cz',
      platform: 'FB',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(2, 9, 30)),
    creator: {
      name: 'Klára Novotná',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Eye creams that truly work — our new retinol line delivers visible results in just 7 days.',
    media: {
      type: 'image',
      src: imageEyeCream,
      alt: 'Eye Cream with Retinol'
    },
    status: 'draft',
    campaignId: 3
  },
  // Friday, 17:20
  {
    id: 'draft-4',
    profile: {
      name: 'FakeCosmetic CZ',
      url: '/fakecosmetic-cz',
      platform: 'IG',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(4, 17, 20)),
    creator: {
      name: 'Klára Novotná',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Looking for the perfect gift for a beauty lover? Our mini sets are the ideal choice 🎁.',
    media: {
      type: 'image',
      src: imageGiftSet,
      alt: 'Beauty Gift Set'
    },
    status: 'draft',
    campaignId: 2
  },
  // Sunday (before week start), 11:00
  {
    id: 'draft-5',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'FB',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(-1, 11, 0)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Commencez votre semaine avec un teint radieux ✨ Notre nouvelle base illuminatrice arrive bientôt !',
    media: {
      type: 'image',
      src: imageFoundation,
      alt: 'Illuminating Foundation'
    },
    status: 'draft'
  },
  // Monday, 18:15
  {
    id: 'draft-6',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'IG',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(0, 18, 15)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Rouges à lèvres d\'hiver ❄️ Des teintes profondes pour un look chic et sophistiqué.',
    media: {
      type: 'image',
      src: imageWinterLipstick,
      alt: 'Winter Lipstick'
    },
    status: 'draft'
  },
  // Tuesday, 13:20
  {
    id: 'draft-7',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'FB',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(1, 13, 20)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Prenez soin de votre peau avec notre sérum vitaminé — éclat instantané garanti 🍊.',
    media: {
      type: 'image',
      src: imageVitaminSerum,
      alt: 'Vitamin Serum'
    },
    status: 'draft',
    campaignId: 4
  },
  // Thursday, 10:45
  {
    id: 'draft-8',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'IG',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(3, 10, 45)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Un parfum doux, une hydratation intense 💛 Découvrez notre crème corps édition limitée.',
    media: {
      type: 'image',
      src: imageBodyCream,
      alt: 'Body Cream'
    },
    status: 'draft'
  },
  // Friday, 19:00
  {
    id: 'draft-9',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'FB',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(4, 19, 0)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Pour un regard qui capte la lumière ✨ Notre nouvelle palette métallisée sera votre coup de cœur.',
    media: {
      type: 'image',
      src: imageMetallicPalette,
      alt: 'Metallic Palette'
    },
    status: 'draft'
  },
  // Saturday, 16:20
  {
    id: 'draft-10',
    profile: {
      name: 'FakeCompany FR',
      url: '/fakecompany-fr',
      platform: 'IG',
      avatar: null
    },
    date: formatDateForDisplay(getRelativeDate(5, 16, 20)),
    creator: {
      name: 'Élodie Marceau',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    text: 'Préparez vos cadeaux de fin d\'année 🎁 Nos coffrets beauté arrivent la semaine prochaine.',
    media: {
      type: 'image',
      src: imageBeautyBox,
      alt: 'Beauty Gift Box'
    },
    status: 'draft'
  }
];

// --- All posts combined (for Calendar view — single source of truth) ---

export const allPosts = [...scheduledPosts, ...draftPosts];

// --- Campaigns (pinned to current week, with varied statuses) ---

export const mockCampaigns = [
  // RUNNING campaigns (start in the past or today, end in the future)
  {
    id: 1,
    title: 'Spring Glow Collection',
    name: 'Spring Glow Collection',
    description: '',
    startDate: dayStart(-1),
    endDate: dayStart(3),
    color: '#E91E63',
    uniqueId: 'SEPH-SPRING-2026',
    labels: [],
    briefContent: '',
  },
  {
    id: 2,
    title: "Valentine's Day Gift Sets",
    name: "Valentine's Day Gift Sets",
    description: '',
    startDate: dayStart(0),
    endDate: dayStart(5),
    color: '#F44336',
    uniqueId: 'SEPH-VDAY-2026',
    labels: [],
    briefContent: '',
  },
  // SCHEDULED campaigns (start in the future)
  {
    id: 3,
    title: 'New Skincare Launch (CZ)',
    name: 'New Skincare Launch (CZ)',
    description: '',
    startDate: dayStart(5),
    endDate: dayStart(10),
    color: '#4CAF50',
    uniqueId: 'SEPH-SKIN-CZ-2026',
    labels: [],
    briefContent: '',
  },
  {
    id: 4,
    title: 'Fragrance Week (FR)',
    name: 'Fragrance Week (FR)',
    description: '',
    startDate: dayStart(7),
    endDate: dayStart(11),
    color: '#9C27B0',
    uniqueId: 'SEPH-FRAG-FR-2026',
    labels: [],
    briefContent: '',
  },
  // COMPLETED campaigns (ended in the past)
  {
    id: 5,
    title: 'Winter Essentials Sale',
    name: 'Winter Essentials Sale',
    description: '',
    startDate: dayStart(-14),
    endDate: dayStart(-8),
    color: '#2196F3',
    uniqueId: 'SEPH-WINTER-2026',
    labels: [],
    briefContent: '',
  },
  {
    id: 6,
    title: 'New Year Beauty Countdown',
    name: 'New Year Beauty Countdown',
    description: '',
    startDate: dayStart(-21),
    endDate: dayStart(-15),
    color: '#FF9800',
    uniqueId: 'SEPH-NEWYEAR-2026',
    labels: [],
    briefContent: '',
  },
];

// --- Enrich posts with full campaign objects (resolve campaignId → campaign) ---

const campaignsById = {};
mockCampaigns.forEach(c => { campaignsById[c.id] = c; });

scheduledPosts.forEach(post => {
  if (post.campaignId && campaignsById[post.campaignId]) {
    post.campaign = campaignsById[post.campaignId];
  }
});

draftPosts.forEach(post => {
  if (post.campaignId && campaignsById[post.campaignId]) {
    post.campaign = campaignsById[post.campaignId];
  }
});

// --- Notes (pinned to current week) ---

export const mockNotes = [
  {
    id: 1,
    text: '15:30 Highlight',
    date: dayStart(0),   // Monday
    color: '#FF9800'
  },
  {
    id: 2,
    text: '🌸 Spring Glow launch day!',
    date: dayStart(0),   // Monday
    color: '#FF9800'
  },
  {
    id: 3,
    text: '15:30 Highlight',
    date: dayStart(3),   // Thursday
    color: '#2196f3'
  },
  {
    id: 4,
    text: 'Post: skincare routine tips',
    date: dayStart(3),   // Thursday
    color: '#E91E63'
  }
];
