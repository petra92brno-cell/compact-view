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
    text: 'The future is electric. Introducing the all-new EQ series — designed for those who drive change. 🌿⚡ #MercedesBenz #EQ #ElectricDrive #Sustainability',
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
    text: 'Zero emissions. 100% performance. The Mercedes-Benz EQ lineup redefines what it means to drive responsibly without compromise. ⚡ #EQElectric #MercedesBenz #ElectricCar',
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
    text: 'Charged up and ready to go — our EQ charging network now covers 95% of European highways. Plan your next road trip with zero range anxiety. 🗺️ #EQCharging #ElectricMobility',
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
    text: 'Handcrafted performance. Every AMG engine is assembled by one master engineer — their signature on every block. This is Driving Performance. 🏎️ #MercedesAMG #PerformanceWeek #AMGOne',
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
    text: '0–100 in 3.2 seconds. The AMG GT is the most exhilarating performance car ever. Handcrafted. Unstoppable. 💥 #AMGGT #PerformanceWeek #MercedesAMG',
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
    text: 'Přijďte si vyzkoušet nový Mercedes-Benz GLC na naše testovací jízdy v Praze, Brně a Ostravě. Rezervujte si místo ještě dnes. 🚗 #MercedesBenz #GLC #TestDrive #CeskaRepublika',
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
    text: 'The best or nothing. A philosophy born in 1886 — alive in every car we build today. ✨ #MercedesBenz #TheBestandNothing #Heritage #Luxury',
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
    text: 'Silence is the new luxury. The Mercedes-Maybach S-Class offers an unparalleled sanctuary on wheels — crafted for those who demand the extraordinary. 🥂 #MercedesMaybach #Luxury #SClass',
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
    text: 'L\'élégance rencontre la performance. Découvrez la nouvelle CLA Coupé — une silhouette qui redéfinit le design automobile. 🎨 #MercedesBenz #CLACoupé #Design #France',
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
    text: 'Summer is calling. Take the long route. The Mercedes-Benz GLE is your perfect road trip companion — spacious, powerful, and effortlessly elegant. 🌅 #SummerDrive #MercedesBenz #GLE',
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
    text: 'Innovation at scale: Mercedes-Benz has invested €14 billion in electrification through 2026. Our commitment to a carbon-neutral future is more than a promise — it\'s our roadmap. #MercedesBenz #Sustainability #EV',
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
    text: 'Víkend je tu. Ať je každá jízda nezapomenutelná. ✨ #MercedesBenz #CeskaRepublika #Weekend #Drive',
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
    text: 'The night belongs to those who dare. The new Mercedes-Benz EQS SUV — arriving this summer at your local dealership. Configure yours today. 🌙 #EQSSUV #MercedesBenz #USA #Electric',
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
    text: 'An icon redefined. The Mercedes-Benz G-Class has conquered every terrain for over 45 years. Some legends never age. 🏔️ #GClass #MercedesBenz #OffRoad #Icon',
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
    text: 'Step inside the future. Our brand-new Experience Centers now open in Berlin, Munich and Hamburg — immersive showrooms where design, technology and craftsmanship come alive. Book your visit now. 🏛️ #MercedesBenz #ExperienceCenter #Germany',
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
    text: 'Track-proven. Road-approved. The AMG GT delivers breathtaking performance that you feel on every curve. Pure. Unbridled. Extraordinary. ⚡🏎️ #AMG #AMGGT #PerformanceWeek',
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
    text: 'Nový Mercedes-Benz GLC přijíždí do českých showroomů. Moderní design, inteligentní technologie a prémiový komfort — zažijte to sami. Domluvte si testovací jízdu. 🚗 #GLC #MercedesBenz #CZ #Novinka',
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
    text: 'La Maybach S-Class, symbole de l\'excellence automobile. Chaque détail, une œuvre d\'art. Chaque trajet, une expérience unique. 🌟 #MercedesMaybach #Luxe #Prestige #France',
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
    text: 'NEW VIDEO: Behind the scenes — how we build the AMG GT. From the forge to the final sign-off drive, this is the most detailed look yet inside our Affalterbach facility. Watch now. ▶️ #MercedesAMG #BehindTheScenes #Affalterbach',
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
    text: 'Summer road trip season is here. Which Mercedes-Benz would you take on the ultimate American road trip? 🌄 Drop your pick below 👇 #MercedesBenz #RoadTrip #SummerDrive',
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
    text: 'Charging should feel effortless. With our new Plug & Charge technology, your EQ connects automatically — no app, no card needed. Just drive. 🔌✨ #EQ #PlugAndCharge #ElectricDrive',
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
    text: 'Interior perfection. The S-Class cabin is the most intelligent, most luxurious space on four wheels — featuring the MBUX Hyperscreen spanning the entire dashboard. 🖥️ #SClass #MBUX #Luxury #MercedesBenz',
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
    text: 'There is only one G. The Mercedes-Benz G-Class — for those who refuse to follow the path because they\'re busy making their own. 🏔️ #GClass #GAMG #MercedesBenz #USA',
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
    text: 'Začněte svůj týden za volantem výjimečného auta. Mercedes-Benz čeká na vás — navštivte nejbližší showroom a nechte se inspirovat. ✨ #MercedesBenz #CeskaRepublika #Premium',
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
    title: 'EQ Electric Drive – Spring 2026',
    name: 'EQ Electric Drive – Spring 2026',
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
    briefContent: `<p>Electric mobility awareness campaign promoting the EQ lineup. Highlights sustainability, charging convenience, and smart technology features with educational and inspirational content mix.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_YApS6TjKJ9c.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_bYR-hWhX2so.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_wV8z2-Pem9I.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 102,
    title: 'Mercedes-AMG Performance Week',
    name: 'Mercedes-AMG Performance Week',
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
    briefContent: `<p>High-impact performance-focused campaign spotlighting AMG models. Built around power, driving dynamics, and motorsport DNA, combining social activations, video content, and limited-time offers.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_04NLt9nsmGU.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_uzNCt8wmnPw.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_uxGnSzMFDMo.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 104,
    title: 'Maybach Luxury Experience',
    name: 'Maybach Luxury Experience',
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
    briefContent: `<p>Ultra-premium brand experience campaign centered on exclusivity, craftsmanship, and bespoke services. Focused on high-net-worth audiences with curated storytelling and invitation-only events.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_8qYE6LGHW-c.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_uxGnSzMFDMo.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_NjQmytqwDGs.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 105,
    title: 'Always On – Brand & Awareness',
    name: 'Always On – Brand & Awareness',
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
    title: 'New GLC Launch – Central Europe',
    name: 'New GLC Launch – Central Europe',
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
    briefContent: `<p>Regional product launch campaign targeting Central European markets. Emphasizes innovation, practicality, and premium positioning of the new GLC, supported by localized messaging and dealer collaboration.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_DkMliTo7NqA.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_bYR-hWhX2so.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_NjQmytqwDGs.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 107,
    title: 'Summer Road Trip – Open Your World',
    name: 'Summer Road Trip – Open Your World',
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
    title: 'CLA Coupé Reveal – Europe',
    name: 'CLA Coupé Reveal – Europe',
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
    briefContent: `<p>Pan-European launch campaign introducing the new CLA Coupé. Focused on design evolution, performance highlights, and digital-first reveal moments across key European markets. Content includes teaser phase, reveal day assets, and post-launch engagement wave.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_uxGnSzMFDMo.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_wV8z2-Pem9I.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_YApS6TjKJ9c.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  // COMPLETED
  {
    id: 108,
    title: 'Year-End Sales Event – Dec 2025',
    name: 'Year-End Sales Event – Dec 2025',
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
    briefContent: `<p>Tactical conversion-driven campaign focused on limited-time offers and dealership incentives. Designed to maximize Q4 sales performance with strong call-to-action messaging.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_uzNCt8wmnPw.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_MyjVReZ5GLQ.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
  },
  {
    id: 109,
    title: 'Winter Driving Campaign – Q4 2025',
    name: 'Winter Driving Campaign – Q4 2025',
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
    briefContent: `<p>Seasonal safety and performance campaign highlighting winter driving features, 4MATIC capabilities, and seasonal service offers. Combines educational and promotional messaging.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;"><img src="/mercedes-pic/unsplash_MyjVReZ5GLQ.png" style="height:160px;border-radius:8px;object-fit:cover;"><img src="/mercedes-pic/unsplash_DkMliTo7NqA.png" style="height:160px;border-radius:8px;object-fit:cover;"></div>`,
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
    text: 'EQ Spring 2026 — go-live',
    date: dayStart(0),
    color: '#00ADEF',
  },
  {
    id: 102,
    text: 'AMG Performance Week kick-off',
    date: dayStart(1),
    color: '#D50000',
  },
  {
    id: 103,
    text: 'Maybach S-Class approval deadline',
    date: dayStart(2),
    color: '#B8860B',
  },
  {
    id: 104,
    text: 'GLC Launch — CZ content approval',
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
