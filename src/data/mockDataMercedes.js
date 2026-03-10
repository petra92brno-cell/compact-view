// ============================================================
// Mercedes-Benz Mock Data
// Global social media presence across markets managed in Emplifi
// ============================================================

import { getRelativeDate, formatDateForDisplay } from './mockData';

// --- Helper for date ranges ---
const getCurrentWeekMonday = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const dayStart = (daysOffset) => {
  const monday = getCurrentWeekMonday();
  const d = new Date(monday);
  d.setDate(monday.getDate() + daysOffset);
  d.setHours(0, 0, 0, 0);
  return d;
};

// ============================================================
// Mercedes-Benz Content Labels
// Used in ContentLabelsDropdown when Mercedes client is active
// ============================================================
export const MERCEDES_LABEL_DATA = [
  // Model Line (Mercedes blue)
  { id: 'mb-eq',      name: 'EQ Electric',     group: 'Model Line',   color: '#00ADEF' },
  { id: 'mb-amg',     name: 'AMG Performance', group: 'Model Line',   color: '#00ADEF' },
  { id: 'mb-maybach', name: 'Maybach',          group: 'Model Line',   color: '#00ADEF' },
  { id: 'mb-glc',     name: 'GLC',             group: 'Model Line',   color: '#00ADEF' },
  { id: 'mb-sclass',  name: 'S-Class',         group: 'Model Line',   color: '#00ADEF' },
  { id: 'mb-cla',     name: 'CLA Coupé',       group: 'Model Line',   color: '#00ADEF' },
  { id: 'mb-gclass',  name: 'G-Class',         group: 'Model Line',   color: '#00ADEF' },
  { id: 'mb-gle',     name: 'GLE',             group: 'Model Line',   color: '#00ADEF' },
  // Content Type (orange)
  { id: 'ct-launch',   name: 'Launch Event',      group: 'Content Type', color: '#F97316' },
  { id: 'ct-testdrive',name: 'Test Drive',         group: 'Content Type', color: '#F97316' },
  { id: 'ct-brand',    name: 'Brand Awareness',    group: 'Content Type', color: '#F97316' },
  { id: 'ct-product',  name: 'Product Highlight',  group: 'Content Type', color: '#F97316' },
  { id: 'ct-bts',      name: 'Behind the Scenes',  group: 'Content Type', color: '#F97316' },
  { id: 'ct-story',    name: 'Social Story',       group: 'Content Type', color: '#F97316' },
  // Market (green)
  { id: 'mkt-de',     name: 'Germany',         group: 'Market',       color: '#22C55E' },
  { id: 'mkt-cz',     name: 'Czech Republic',  group: 'Market',       color: '#22C55E' },
  { id: 'mkt-fr',     name: 'France',          group: 'Market',       color: '#22C55E' },
  { id: 'mkt-us',     name: 'USA',             group: 'Market',       color: '#22C55E' },
  { id: 'mkt-global', name: 'Global',          group: 'Market',       color: '#22C55E' },
  // Campaign Type (purple)
  { id: 'ctype-always-on',   name: 'Always On',    group: 'Campaign Type', color: '#A855F7' },
  { id: 'ctype-seasonal',    name: 'Seasonal',     group: 'Campaign Type', color: '#A855F7' },
  { id: 'ctype-pr',          name: 'PR & Media',   group: 'Campaign Type', color: '#A855F7' },
  { id: 'ctype-influencer',  name: 'Influencer',   group: 'Campaign Type', color: '#A855F7' },
  { id: 'ctype-performance', name: 'Performance',  group: 'Campaign Type', color: '#A855F7' },
];

export const MERCEDES_LABEL_GROUPS = ['Model Line', 'Content Type', 'Market', 'Campaign Type'];

// Helper to pick labels by id
const L = (...ids) => MERCEDES_LABEL_DATA.filter(l => ids.includes(l.id));

// ============================================================
// Mercedes-Benz Profiles (used in ProfileSelector)
// ============================================================
export const MERCEDES_PROFILES = [
  { id: 'mercedes-benz-de-fb',  name: 'Mercedes-Benz Germany',        platform: 'FB',  initials: 'DE' },
  { id: 'mercedes-benz-de-ig',  name: 'Mercedes-Benz Germany',        platform: 'IG',  initials: 'DE' },
  { id: 'mercedes-benz-de-tw',  name: 'Mercedes-Benz Germany',        platform: 'TW',  initials: 'DE' },
  { id: 'mercedes-benz-de-yt',  name: 'Mercedes-Benz Germany',        platform: 'YT',  initials: 'DE' },
  { id: 'mercedes-benz-de-li',  name: 'Mercedes-Benz Germany',        platform: 'LI',  initials: 'DE' },
  { id: 'mercedes-benz-cz-fb',  name: 'Mercedes-Benz Czech Republic', platform: 'FB',  initials: 'CZ' },
  { id: 'mercedes-benz-cz-ig',  name: 'Mercedes-Benz Czech Republic', platform: 'IG',  initials: 'CZ' },
  { id: 'mercedes-benz-fr-fb',  name: 'Mercedes-Benz France',         platform: 'FB',  initials: 'FR' },
  { id: 'mercedes-benz-fr-ig',  name: 'Mercedes-Benz France',         platform: 'IG',  initials: 'FR' },
  { id: 'mercedes-benz-us-fb',  name: 'Mercedes-Benz USA',            platform: 'FB',  initials: 'US' },
  { id: 'mercedes-benz-us-ig',  name: 'Mercedes-Benz USA',            platform: 'IG',  initials: 'US' },
  { id: 'mercedes-benz-us-tw',  name: 'Mercedes-Benz USA',            platform: 'TW',  initials: 'US' },
  { id: 'mercedes-amg-fb',      name: 'Mercedes-AMG',                 platform: 'FB',  initials: 'AMG' },
  { id: 'mercedes-amg-ig',      name: 'Mercedes-AMG',                 platform: 'IG',  initials: 'AMG' },
  { id: 'mercedes-eq-fb',       name: 'Mercedes-Benz EQ',             platform: 'FB',  initials: 'EQ' },
  { id: 'mercedes-eq-ig',       name: 'Mercedes-Benz EQ',             platform: 'IG',  initials: 'EQ' },
];

// Profile map for CreatePost (id → post profile format)
export const MERCEDES_PROFILE_MAP = {
  'mercedes-benz-de-fb':  { name: 'Mercedes-Benz Germany',        url: '/mercedes-benz-de', platform: 'FB',  avatar: null },
  'mercedes-benz-de-ig':  { name: 'Mercedes-Benz Germany',        url: '/mercedes-benz-de', platform: 'IG',  avatar: null },
  'mercedes-benz-de-tw':  { name: 'Mercedes-Benz Germany',        url: '/mercedes-benz-de', platform: 'TW',  avatar: null },
  'mercedes-benz-de-yt':  { name: 'Mercedes-Benz Germany',        url: '/mercedes-benz-de', platform: 'YT',  avatar: null },
  'mercedes-benz-de-li':  { name: 'Mercedes-Benz Germany',        url: '/mercedes-benz-de', platform: 'LI',  avatar: null },
  'mercedes-benz-cz-fb':  { name: 'Mercedes-Benz Czech Republic', url: '/mercedes-benz-cz', platform: 'FB',  avatar: null },
  'mercedes-benz-cz-ig':  { name: 'Mercedes-Benz Czech Republic', url: '/mercedes-benz-cz', platform: 'IG',  avatar: null },
  'mercedes-benz-fr-fb':  { name: 'Mercedes-Benz France',         url: '/mercedes-benz-fr', platform: 'FB',  avatar: null },
  'mercedes-benz-fr-ig':  { name: 'Mercedes-Benz France',         url: '/mercedes-benz-fr', platform: 'IG',  avatar: null },
  'mercedes-benz-us-fb':  { name: 'Mercedes-Benz USA',            url: '/mercedes-benz-us', platform: 'FB',  avatar: null },
  'mercedes-benz-us-ig':  { name: 'Mercedes-Benz USA',            url: '/mercedes-benz-us', platform: 'IG',  avatar: null },
  'mercedes-benz-us-tw':  { name: 'Mercedes-Benz USA',            url: '/mercedes-benz-us', platform: 'TW',  avatar: null },
  'mercedes-amg-fb':      { name: 'Mercedes-AMG',                 url: '/mercedes-amg',     platform: 'FB',  avatar: null },
  'mercedes-amg-ig':      { name: 'Mercedes-AMG',                 url: '/mercedes-amg',     platform: 'IG',  avatar: null },
  'mercedes-eq-fb':       { name: 'Mercedes-Benz EQ',             url: '/mercedes-eq',      platform: 'FB',  avatar: null },
  'mercedes-eq-ig':       { name: 'Mercedes-Benz EQ',             url: '/mercedes-eq',      platform: 'IG',  avatar: null },
};

// ============================================================
// Creators
// ============================================================
const creatorSophie = {
  name: 'Sophie Wagner',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
};
const creatorJan = {
  name: 'Jan Novák',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
};
const creatorPierre = {
  name: 'Pierre Dubois',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
};
const creatorEmma = {
  name: 'Emma Thompson',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
};
const creatorLukas = {
  name: 'Lukas Becker',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
};

// ============================================================
// Mercedes-Benz local images (from /public/mercedes-pic/)
// ============================================================
const imageMercedesAMGGT   = '/mercedes-pic/unsplash_04NLt9nsmGU.png';
const imageMercedesSClass  = '/mercedes-pic/unsplash_8qYE6LGHW-c.png';
const imageMercedesGLE     = '/mercedes-pic/unsplash_DkMliTo7NqA.png';
const imageMercedesGWagon  = '/mercedes-pic/unsplash_MyjVReZ5GLQ.png';
const imageMercedesEClass  = '/mercedes-pic/unsplash_NjQmytqwDGs.png';
const imageMercedesEQS     = '/mercedes-pic/unsplash_YApS6TjKJ9c.png';
const imageMercedesAClass  = '/mercedes-pic/unsplash_bYR-hWhX2so.png';
const imageMercedesSilver  = '/mercedes-pic/unsplash_uxGnSzMFDMo.png';
const imageMercedesRed     = '/mercedes-pic/unsplash_uzNCt8wmnPw.png';
const imageMercedesWhite   = '/mercedes-pic/unsplash_wV8z2-Pem9I.png';

// ============================================================
// Scheduled Posts
// ============================================================
export const mercedesScheduledPosts = [
  // Monday 08:00 – EQ Campaign, Germany FB
  {
    id: 'mb-1',
    profile: { name: 'Mercedes-Benz Germany', url: '/mercedes-benz-de', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(0, 8, 0)),
    creator: creatorSophie,
    text: 'A modern take on movement, shaped by refined design and a premium driving experience. ✨ #MercedesBenz #Design #DrivingExperience',
    badges: [
      { type: 'default', label: 'Multipost', count: '8' },
      { type: 'default', label: 'Story' },
    ],
    comments: { count: 3 },
    media: { type: 'image', src: imageMercedesEQS, alt: 'Mercedes-Benz EQS Electric' },
    status: 'scheduled',
    campaignId: 101,
  },
  // Monday 10:30 – EQ Campaign, Germany IG
  {
    id: 'mb-2',
    profile: { name: 'Mercedes-Benz Germany', url: '/mercedes-benz-de', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(0, 10, 30)),
    creator: creatorSophie,
    text: 'Designed for the way the road feels — smooth, confident, and unmistakably refined. ⚡ #MercedesBenz #Drive #ModernMobility',
    badges: [
      { type: 'default', label: 'Reel' },
      { type: 'default', label: 'Story' },
    ],
    media: { type: 'image', src: imageMercedesEQS, alt: 'Mercedes-Benz EQS Electric' },
    status: 'scheduled',
    campaignId: 101,
  },
  // Monday 14:00 – EQ Campaign, EQ Page FB
  {
    id: 'mb-3',
    profile: { name: 'Mercedes-Benz EQ', url: '/mercedes-eq', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(0, 14, 0)),
    creator: creatorLukas,
    text: 'Ready for the road ahead. Designed to support every journey with confidence, comfort, and modern style. #MercedesBenz #Drive #ModernMobility',
    media: { type: 'image', src: imageMercedesEQS, alt: 'Mercedes-Benz EQS Charging' },
    status: 'scheduled',
    campaignId: 101,
  },
  // Tuesday 09:00 – AMG Campaign, AMG FB
  {
    id: 'mb-4',
    profile: { name: 'Mercedes-AMG', url: '/mercedes-amg', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(1, 9, 0)),
    creator: creatorLukas,
    text: 'Every detail is shaped with intention — creating a premium experience from first glance to every mile ahead. #MercedesBenz #Craftsmanship #Drive',
    badges: [
      { type: 'default', label: 'Multipost', count: '6' },
    ],
    comments: { count: 5 },
    media: { type: 'image', src: imageMercedesAMGGT, alt: 'Mercedes-AMG GT' },
    status: 'scheduled',
    campaignId: 102,
  },
  // Tuesday 12:00 – AMG Campaign, AMG IG
  {
    id: 'mb-5',
    profile: { name: 'Mercedes-AMG', url: '/mercedes-amg', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(1, 12, 0)),
    creator: creatorLukas,
    text: 'Bold design. Distinct presence. A driving experience created to be felt in every detail. #MercedesBenz #DrivingExperience #Design',
    badges: [
      { type: 'default', label: 'Reel' },
    ],
    media: { type: 'image', src: imageMercedesAMGGT, alt: 'Mercedes-AMG GT Performance' },
    status: 'scheduled',
    campaignId: 102,
  },
  // Tuesday 18:00 – CZ Market, Czech Republic FB
  {
    id: 'mb-6',
    profile: { name: 'Mercedes-Benz Czech Republic', url: '/mercedes-benz-cz', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(1, 18, 0)),
    creator: creatorJan,
    text: 'Every drive begins with a moment worth discovering. Experience the road through design, comfort, and presence. ✨ #MercedesBenz #DrivingExperience #Journey',
    badges: [
      { type: 'default', label: 'Story' },
    ],
    media: { type: 'image', src: imageMercedesGLE, alt: 'Mercedes-Benz GLC Test Drive' },
    status: 'scheduled',
    campaignId: 103,
  },
  // Wednesday 08:30 – Always On, Germany IG
  {
    id: 'mb-7',
    profile: { name: 'Mercedes-Benz Germany', url: '/mercedes-benz-de', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(2, 8, 30)),
    creator: creatorSophie,
    text: 'Built around timeless values: quality, design, and a driving experience that feels effortless. ✨ #MercedesBenz #Craftsmanship #Luxury',
    badges: [
      { type: 'default', label: 'Story' },
    ],
    media: { type: 'image', src: imageMercedesSClass, alt: 'Mercedes-Benz S-Class' },
    status: 'scheduled',
    campaignId: 105,
  },
  // Wednesday 15:00 – Maybach, Germany FB
  {
    id: 'mb-8',
    profile: { name: 'Mercedes-Benz Germany', url: '/mercedes-benz-de', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(2, 15, 0)),
    creator: creatorSophie,
    text: 'Refined details. Elevated presence. A driving experience designed to leave a lasting impression. ✨ #MercedesBenz #Craftsmanship #Luxury',
    badges: [
      { type: 'default', label: 'Multipost', count: '4' },
    ],
    comments: { count: 2 },
    media: { type: 'image', src: imageMercedesSClass, alt: 'Mercedes-Maybach S-Class' },
    status: 'scheduled',
    campaignId: 104,
  },
  // Thursday 10:00 – France FB
  {
    id: 'mb-9',
    profile: { name: 'Mercedes-Benz France', url: '/mercedes-benz-fr', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(3, 10, 0)),
    creator: creatorPierre,
    text: 'L\'élégance prend la route à travers un design soigné et une présence affirmée. Une vision moderne du mouvement. ✨ #MercedesBenz #Design #Journey',
    badges: [
      { type: 'draft', label: 'Draft' },
    ],
    media: { type: 'image', src: imageMercedesSilver, alt: 'Mercedes-Benz CLA Coupé' },
    status: 'scheduled',
    campaignId: 106,
  },
  // Thursday 14:30 – USA IG
  {
    id: 'mb-10',
    profile: { name: 'Mercedes-Benz USA', url: '/mercedes-benz-us', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(3, 14, 30)),
    creator: creatorEmma,
    text: 'Take the long route and enjoy the experience along the way. Some journeys are defined by the moments they create. 🌅 #MercedesBenz #Journey #Drive',
    badges: [
      { type: 'default', label: 'Reel' },
      { type: 'default', label: 'Story' },
    ],
    media: { type: 'image', src: imageMercedesGLE, alt: 'Mercedes-Benz GLE Road Trip' },
    status: 'scheduled',
    campaignId: 107,
  },
  // Friday 09:00 – Germany LI
  {
    id: 'mb-11',
    profile: { name: 'Mercedes-Benz Germany', url: '/mercedes-benz-de', platform: 'LI', avatar: null },
    date: formatDateForDisplay(getRelativeDate(4, 9, 0)),
    creator: creatorSophie,
    text: 'Designed to move forward with confidence, clarity, and a strong sense of purpose. #MercedesBenz #ModernMobility #Journey',
    media: { type: 'image', src: imageMercedesEQS, alt: 'Mercedes-Benz EQ Sustainability' },
    status: 'scheduled',
    campaignId: 105,
  },
  // Friday 16:00 – Czech Republic IG
  {
    id: 'mb-12',
    profile: { name: 'Mercedes-Benz Czech Republic', url: '/mercedes-benz-cz', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(4, 16, 0)),
    creator: creatorJan,
    text: 'The weekend starts with the journey. Make every moment on the road count. ✨ #MercedesBenz #Drive #Journey',
    badges: [
      { type: 'default', label: 'Story' },
    ],
    media: { type: 'image', src: imageMercedesAClass, alt: 'Mercedes-Benz A-Class Weekend' },
    status: 'scheduled',
    campaignId: 105,
  },
  // Saturday 11:00 – USA FB
  {
    id: 'mb-13',
    profile: { name: 'Mercedes-Benz USA', url: '/mercedes-benz-us', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(5, 11, 0)),
    creator: creatorEmma,
    text: 'Some moments on the road speak for themselves. Designed to stand out day or night. 🌙 #MercedesBenz #Drive #Style',
    badges: [
      { type: 'default', label: 'Multipost', count: '3' },
    ],
    media: { type: 'image', src: imageMercedesEQS, alt: 'Mercedes-Benz EQS SUV' },
    status: 'scheduled',
    campaignId: 101,
  },
  // Saturday 15:00 – G-Wagon Germany IG
  {
    id: 'mb-14',
    profile: { name: 'Mercedes-Benz Germany', url: '/mercedes-benz-de', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(5, 15, 0)),
    creator: creatorSophie,
    text: 'Timeless design and a strong presence never go out of style. Some impressions stay with you. #MercedesBenz #Design #Presence',
    badges: [
      { type: 'default', label: 'Reel' },
    ],
    media: { type: 'image', src: imageMercedesGWagon, alt: 'Mercedes-Benz G-Class G63 AMG' },
    status: 'scheduled',
    campaignId: 105,
  },
];

// ============================================================
// Draft Posts
// ============================================================
export const mercesDraftPosts = [
  // Sunday draft – Experience Center Germany FB
  {
    id: 'mb-draft-1',
    profile: { name: 'Mercedes-Benz Germany', url: '/mercedes-benz-de', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(-1, 10, 0)),
    creator: creatorSophie,
    text: 'A premium experience begins long before the first mile. Discover what design, craftsmanship, and presence truly feel like. 🏛️ #MercedesBenz #Luxury #Drive',
    media: { type: 'image', src: imageMercedesEClass, alt: 'Mercedes-Benz E-Class showroom' },
    status: 'draft',
    campaignId: 105,
  },
  // Monday draft – AMG IG
  {
    id: 'mb-draft-2',
    profile: { name: 'Mercedes-AMG', url: '/mercedes-amg', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(0, 16, 0)),
    creator: creatorLukas,
    text: 'Every detail tells a story shaped by movement, presence, and design. A driving experience created to be felt in every mile. ⚡ #MercedesBenz #DrivingExperience #Design',
    media: { type: 'image', src: imageMercedesAMGGT, alt: 'Mercedes-AMG GT Track' },
    status: 'draft',
    campaignId: 102,
  },
  // Tuesday draft – Czech Republic FB
  {
    id: 'mb-draft-3',
    profile: { name: 'Mercedes-Benz Czech Republic', url: '/mercedes-benz-cz', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(1, 9, 30)),
    creator: creatorJan,
    text: 'Wherever the road leads, the experience is what matters most. Discover refined design and premium presence — nechte se inspirovat. 🚗 #MercedesBenz #Journey #Design',
    media: { type: 'image', src: imageMercedesGLE, alt: 'Mercedes-Benz GLC Czech Republic' },
    status: 'draft',
    campaignId: 103,
  },
  // Wednesday draft – France IG – Maybach
  {
    id: 'mb-draft-4',
    profile: { name: 'Mercedes-Benz France', url: '/mercedes-benz-fr', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(2, 11, 0)),
    creator: creatorPierre,
    text: 'Chaque détail, une œuvre de raffinement. Chaque trajet, une expérience à part entière. 🌟 #MercedesBenz #Craftsmanship #Journey',
    media: { type: 'image', src: imageMercedesSClass, alt: 'Mercedes-Maybach S-Class France' },
    status: 'draft',
    campaignId: 104,
  },
  // Wednesday draft – Germany YT – AMG Factory
  {
    id: 'mb-draft-5',
    profile: { name: 'Mercedes-Benz Germany', url: '/mercedes-benz-de', platform: 'YT', avatar: null },
    date: formatDateForDisplay(getRelativeDate(2, 14, 0)),
    creator: creatorSophie,
    text: 'NEW VIDEO: Behind the scenes — how craftsmanship and precision come together to create a premium driving experience. Watch now. ▶️ #MercedesBenz #Craftsmanship #Design',
    media: { type: 'image', src: imageMercedesAMGGT, alt: 'Mercedes-AMG Affalterbach Factory YouTube' },
    status: 'draft',
    campaignId: 102,
  },
  // Thursday draft – USA TW – Road Trip
  {
    id: 'mb-draft-6',
    profile: { name: 'Mercedes-Benz USA', url: '/mercedes-benz-us', platform: 'TW', avatar: null },
    date: formatDateForDisplay(getRelativeDate(3, 8, 0)),
    creator: creatorEmma,
    text: 'Some journeys begin with a destination. Others begin with a feeling. Where would you take the road this season? 🌄 #MercedesBenz #Drive #Journey',
    media: { type: 'image', src: imageMercedesGLE, alt: 'Mercedes-Benz GLE Road Trip USA' },
    status: 'draft',
    campaignId: 107,
  },
  // Friday draft – EQ Page IG – Charging
  {
    id: 'mb-draft-7',
    profile: { name: 'Mercedes-Benz EQ', url: '/mercedes-eq', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(4, 13, 0)),
    creator: creatorLukas,
    text: 'Designed for the way modern journeys feel — seamless, confident, and effortlessly refined. Just drive. 🔌✨ #MercedesBenz #ModernMobility #Drive',
    media: { type: 'image', src: imageMercedesEQS, alt: 'Mercedes-Benz EQS Charging Technology' },
    status: 'draft',
    campaignId: 101,
  },
  // Saturday draft – Germany IG – S-Class interior
  {
    id: 'mb-draft-8',
    profile: { name: 'Mercedes-Benz Germany', url: '/mercedes-benz-de', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(5, 17, 0)),
    creator: creatorSophie,
    text: 'Crafted for moments that stay with you long after the drive. Every surface, every detail, shaped with purpose. 🖥️ #MercedesBenz #Craftsmanship #Luxury',
    media: { type: 'image', src: imageMercedesSClass, alt: 'Mercedes-Benz S-Class Interior' },
    status: 'draft',
    campaignId: 105,
  },
  // Saturday draft – G-Wagon USA FB
  {
    id: 'mb-draft-9',
    profile: { name: 'Mercedes-Benz USA', url: '/mercedes-benz-us', platform: 'FB', avatar: null },
    date: formatDateForDisplay(getRelativeDate(5, 12, 0)),
    creator: creatorEmma,
    text: 'Design that moves you — before the journey even begins. For those who define their own road. 🏔️ #MercedesBenz #Design #Presence',
    media: { type: 'image', src: imageMercedesGWagon, alt: 'Mercedes-Benz G-Wagon USA' },
    status: 'draft',
    campaignId: 105,
  },
  // Sunday draft – A-Class CZ IG
  {
    id: 'mb-draft-10',
    profile: { name: 'Mercedes-Benz Czech Republic', url: '/mercedes-benz-cz', platform: 'IG', avatar: null },
    date: formatDateForDisplay(getRelativeDate(6, 10, 0)),
    creator: creatorJan,
    text: 'Začněte svůj týden výjimečnou jízdou. Nechte se inspirovat designem, komfortem a prémiovou atmosférou. ✨ #MercedesBenz #Drive #Premium',
    media: { type: 'image', src: imageMercedesAClass, alt: 'Mercedes-Benz A-Class Czech Republic' },
    status: 'draft',
    campaignId: 105,
  },
];

// --- All posts combined ---
export const mercedesAllPosts = [...mercedesScheduledPosts, ...mercesDraftPosts];

// ============================================================
// Campaigns  (with labels as full objects + UTM settings)
// ============================================================
export const mercedesCampaigns = [
  // RUNNING
  {
    id: 101,
    title: 'The Road Ahead',
    name: 'The Road Ahead',
    description: '',
    startDate: dayStart(-2),
    endDate: dayStart(5),
    color: '#00ADEF',
    uniqueId: 'MB-EQ-SPRING-2026',
    labels: L('mb-eq', 'mkt-global', 'ct-launch', 'ctype-performance'),
    // UTM pre-configuration
    linkTrackingEnabled: true,
    utmSourceMode: 'social-channel-id',
    utmSourceValue: '',
    utmSourceEnabled: true,
    utmMediumMode: 'custom',
    utmMediumValue: 'cpc',
    utmMediumEnabled: true,
    utmCampaignMode: 'custom',
    utmCampaignValue: 'MB-EQ-Spring-2026',
    utmCampaignEnabled: true,
    utmContentMode: 'post-id',
    utmContentValue: '',
    utmContentEnabled: true,
    briefContent: `<p>Brand awareness campaign focused on design, modern mobility, and the premium driving experience. Highlights refined visual moments and contemporary brand expression through educational and inspirational content.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_YApS6TjKJ9c.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_bYR-hWhX2so.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_wV8z2-Pem9I.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 102,
    title: 'Crafted to Move',
    name: 'Crafted to Move',
    description: '',
    startDate: dayStart(-1),
    endDate: dayStart(4),
    color: '#D50000',
    uniqueId: 'MB-AMG-PERF-2026',
    labels: L('mb-amg', 'mkt-de', 'ct-product', 'ct-bts', 'ctype-pr'),
    linkTrackingEnabled: true,
    utmSourceMode: 'social-channel-id',
    utmSourceValue: '',
    utmSourceEnabled: true,
    utmMediumMode: 'custom',
    utmMediumValue: 'social',
    utmMediumEnabled: true,
    utmCampaignMode: 'custom',
    utmCampaignValue: 'MB-AMG-PERF-2026',
    utmCampaignEnabled: true,
    utmContentMode: 'asset-id',
    utmContentValue: '',
    utmContentEnabled: true,
    briefContent: `<p>High-impact campaign built around craftsmanship, driving experience, and bold design. Combines social activations, video content, and premium brand storytelling to create a strong and consistent presence.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_04NLt9nsmGU.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_uzNCt8wmnPw.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_uxGnSzMFDMo.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 104,
    title: 'Refined Journey',
    name: 'Refined Journey',
    description: '',
    startDate: dayStart(-3),
    endDate: dayStart(6),
    color: '#B8860B',
    uniqueId: 'MB-MAYBACH-2026',
    labels: L('mb-maybach', 'mb-sclass', 'mkt-global', 'ct-brand', 'ctype-influencer'),
    linkTrackingEnabled: true,
    utmSourceMode: 'social-channel-id',
    utmSourceValue: '',
    utmSourceEnabled: true,
    utmMediumMode: 'custom',
    utmMediumValue: 'social',
    utmMediumEnabled: true,
    utmCampaignMode: 'custom',
    utmCampaignValue: 'MB-MAYBACH-2026',
    utmCampaignEnabled: true,
    utmContentMode: 'none',
    utmContentValue: '',
    utmContentEnabled: false,
    briefContent: `<p>Ultra-premium brand experience campaign centered on refined design, craftsmanship, and elevated presence. Focused on premium audiences with curated storytelling and exclusive brand moments.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_8qYE6LGHW-c.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_uxGnSzMFDMo.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_NjQmytqwDGs.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 105,
    title: 'Moments on the Road',
    name: 'Moments on the Road',
    description: '',
    startDate: dayStart(-7),
    endDate: dayStart(21),
    color: '#1B5E20',
    uniqueId: 'MB-ALWAYS-ON-Q1-2026',
    labels: L('mkt-global', 'ct-brand', 'ct-story', 'ctype-always-on'),
    linkTrackingEnabled: true,
    utmSourceMode: 'social-channel-id',
    utmSourceValue: '',
    utmSourceEnabled: true,
    utmMediumMode: 'custom',
    utmMediumValue: 'organic',
    utmMediumEnabled: true,
    utmCampaignMode: 'campaign-id',
    utmCampaignValue: '',
    utmCampaignEnabled: true,
    utmContentMode: 'post-id',
    utmContentValue: '',
    utmContentEnabled: true,
    briefContent: `<p>Ongoing brand presence campaign maintaining continuous visibility across channels. Mix of product highlights, lifestyle content, and brand storytelling to sustain engagement year-round.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_MyjVReZ5GLQ.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_8qYE6LGHW-c.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_04NLt9nsmGU.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  // SCHEDULED
  {
    id: 103,
    title: 'Signature Drive',
    name: 'Signature Drive',
    description: '',
    startDate: dayStart(6),
    endDate: dayStart(13),
    color: '#4A148C',
    uniqueId: 'MB-GLC-CE-2026',
    labels: L('mb-glc', 'mkt-cz', 'ct-launch', 'ct-testdrive', 'ctype-seasonal'),
    linkTrackingEnabled: true,
    utmSourceMode: 'social-channel-id',
    utmSourceValue: '',
    utmSourceEnabled: true,
    utmMediumMode: 'custom',
    utmMediumValue: 'cpc',
    utmMediumEnabled: true,
    utmCampaignMode: 'unique-id',
    utmCampaignValue: '',
    utmCampaignEnabled: true,
    utmContentMode: 'none',
    utmContentValue: '',
    utmContentEnabled: false,
    briefContent: `<p>Regional brand campaign targeting Central European markets. Emphasizes design, premium positioning, and the driving experience, supported by localized messaging and market-specific content.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_DkMliTo7NqA.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_bYR-hWhX2so.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_NjQmytqwDGs.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 107,
    title: 'Drive the Moment',
    name: 'Drive the Moment',
    description: '',
    startDate: dayStart(8),
    endDate: dayStart(18),
    color: '#E65100',
    uniqueId: 'MB-SUMMER-DRIVE-2026',
    labels: L('mb-gle', 'mkt-us', 'ct-brand', 'ct-story', 'ctype-seasonal'),
    linkTrackingEnabled: true,
    utmSourceMode: 'social-channel-id',
    utmSourceValue: '',
    utmSourceEnabled: true,
    utmMediumMode: 'custom',
    utmMediumValue: 'social',
    utmMediumEnabled: true,
    utmCampaignMode: 'custom',
    utmCampaignValue: 'MB-SummerDrive-2026',
    utmCampaignEnabled: true,
    utmContentMode: 'asset-id',
    utmContentValue: '',
    utmContentEnabled: true,
    briefContent: `<p>Seasonal lifestyle campaign celebrating freedom, travel, and exploration. Showcases vehicle versatility, comfort, and connectivity features through aspirational road trip storytelling across multiple regions.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_uzNCt8wmnPw.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_DkMliTo7NqA.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_wV8z2-Pem9I.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 106,
    title: 'Spring Brand Story',
    name: 'Spring Brand Story',
    description: '',
    startDate: dayStart(10),
    endDate: dayStart(17),
    color: '#880E4F',
    uniqueId: 'MB-CLA-REVEAL-EU-2026',
    labels: L('mb-cla', 'ct-launch', 'mkt-fr', 'mkt-de', 'ctype-pr'),
    linkTrackingEnabled: false,
    utmSourceMode: 'social-channel-id',
    utmSourceValue: '',
    utmSourceEnabled: true,
    utmMediumMode: 'none',
    utmMediumValue: '',
    utmMediumEnabled: false,
    utmCampaignMode: 'none',
    utmCampaignValue: '',
    utmCampaignEnabled: false,
    utmContentMode: 'none',
    utmContentValue: '',
    utmContentEnabled: false,
    briefContent: `<p>Brand storytelling campaign focused on design, craftsmanship, and the driving experience. Content highlights premium visual moments from the road, combining style, movement, and modern brand expression. Posts are designed to support a cohesive campaign narrative through refined imagery and concise captions.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_uxGnSzMFDMo.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_wV8z2-Pem9I.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_YApS6TjKJ9c.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  // COMPLETED
  {
    id: 108,
    title: 'Seasonal Brand Story',
    name: 'Seasonal Brand Story',
    description: '',
    startDate: dayStart(-28),
    endDate: dayStart(-15),
    color: '#37474F',
    uniqueId: 'MB-YEAR-END-2025',
    labels: L('mkt-global', 'ctype-seasonal', 'ctype-performance'),
    linkTrackingEnabled: false,
    utmSourceMode: 'social-channel-id',
    utmSourceValue: '',
    utmSourceEnabled: true,
    utmMediumMode: 'none',
    utmMediumValue: '',
    utmMediumEnabled: false,
    utmCampaignMode: 'none',
    utmCampaignValue: '',
    utmCampaignEnabled: false,
    utmContentMode: 'none',
    utmContentValue: '',
    utmContentEnabled: false,
    briefContent: `<p>Seasonal brand campaign focused on premium presence and refined messaging. Designed to strengthen brand visibility with an aspirational and consistent tone of voice.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_uzNCt8wmnPw.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_MyjVReZ5GLQ.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 109,
    title: 'Drive in Focus',
    name: 'Drive in Focus',
    description: '',
    startDate: dayStart(-42),
    endDate: dayStart(-22),
    color: '#546E7A',
    uniqueId: 'MB-WINTER-Q4-2025',
    labels: L('mkt-de', 'mkt-cz', 'ct-brand', 'ctype-seasonal'),
    linkTrackingEnabled: false,
    utmSourceMode: 'social-channel-id',
    utmSourceValue: '',
    utmSourceEnabled: true,
    utmMediumMode: 'none',
    utmMediumValue: '',
    utmMediumEnabled: false,
    utmCampaignMode: 'none',
    utmCampaignValue: '',
    utmCampaignEnabled: false,
    utmContentMode: 'none',
    utmContentValue: '',
    utmContentEnabled: false,
    briefContent: `<p>Seasonal campaign focused on premium driving experience and brand confidence. Combines inspirational imagery with refined messaging to maintain engagement and brand presence.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_MyjVReZ5GLQ.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_DkMliTo7NqA.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
];

// --- Enrich posts with campaign objects ---
const campaignsById = {};
mercedesCampaigns.forEach(c => { campaignsById[c.id] = c; });

mercedesScheduledPosts.forEach(post => {
  if (post.campaignId && campaignsById[post.campaignId]) {
    post.campaign = campaignsById[post.campaignId];
  }
});

mercesDraftPosts.forEach(post => {
  if (post.campaignId && campaignsById[post.campaignId]) {
    post.campaign = campaignsById[post.campaignId];
  }
});

// --- Notes ---
export const mercedesNotes = [
  {
    id: 101,
    text: 'The Road Ahead — go-live',
    date: dayStart(0),
    color: '#00ADEF',
  },
  {
    id: 102,
    text: 'Crafted to Move — kick-off',
    date: dayStart(1),
    color: '#D50000',
  },
  {
    id: 103,
    text: 'Refined Journey — approval deadline',
    date: dayStart(2),
    color: '#B8860B',
  },
  {
    id: 104,
    text: 'Signature Drive — CZ content approval',
    date: dayStart(4),
    color: '#4A148C',
  },
];

// ============================================================
// Brand groups for ProfileGroupSelector (filter panel)
// ============================================================
export const MERCEDES_BRAND_GROUPS = [
  {
    id: 'mercedes-benz-global',
    name: 'Mercedes-Benz Global',
    profiles: [
      { id: 'mercedes-benz-de-fb', name: 'Mercedes-Benz Germany',       platform: 'FB', url: '/mercedes-benz-de' },
      { id: 'mercedes-benz-de-ig', name: 'Mercedes-Benz Germany',       platform: 'IG', url: '/mercedes-benz-de' },
      { id: 'mercedes-benz-cz-fb', name: 'Mercedes-Benz Czech Republic',platform: 'FB', url: '/mercedes-benz-cz' },
      { id: 'mercedes-benz-cz-ig', name: 'Mercedes-Benz Czech Republic',platform: 'IG', url: '/mercedes-benz-cz' },
      { id: 'mercedes-benz-us-fb', name: 'Mercedes-Benz USA',           platform: 'FB', url: '/mercedes-benz-us' },
      { id: 'mercedes-benz-us-ig', name: 'Mercedes-Benz USA',           platform: 'IG', url: '/mercedes-benz-us' },
      { id: 'mercedes-benz-us-tw', name: 'Mercedes-Benz USA',           platform: 'TW', url: '/mercedes-benz-us' },
    ],
  },
  {
    id: 'mercedes-amg',
    name: 'Mercedes-AMG',
    profiles: [
      { id: 'mercedes-amg-fb', name: 'Mercedes-AMG', platform: 'FB', url: '/mercedes-amg' },
      { id: 'mercedes-amg-ig', name: 'Mercedes-AMG', platform: 'IG', url: '/mercedes-amg' },
    ],
  },
  {
    id: 'mercedes-eq',
    name: 'Mercedes-Benz EQ',
    profiles: [
      { id: 'mercedes-eq-fb', name: 'Mercedes-Benz EQ', platform: 'FB', url: '/mercedes-eq' },
      { id: 'mercedes-eq-ig', name: 'Mercedes-Benz EQ', platform: 'IG', url: '/mercedes-eq' },
    ],
  },
];

// ============================================================
// Mock images for Create Post (shown as upload suggestions)
// ============================================================
export const MERCEDES_MOCK_IMAGES = [
  imageMercedesAMGGT,
  imageMercedesSClass,
  imageMercedesGLE,
  imageMercedesGWagon,
  imageMercedesEClass,
  imageMercedesEQS,
  imageMercedesAClass,
  imageMercedesSilver,
  imageMercedesRed,
  imageMercedesWhite,
];
