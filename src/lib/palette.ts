import { ThemeDefinition } from '@/types';

export interface PaletteColor {
  id: string;
  name: string;
  hex: string;
  family: string;
  description?: string;
}

export const PALETTE_FAMILIES = [
  'Emerald & Green',
  'Blue & Teal',
  'Purple & Wine',
  'Neutral',
  'Brown',
  'Rose & Peach',
  'Peach & Amber',
  'Gold',
] as const;

export const COLOR_PALETTE: PaletteColor[] = [
  // 1. Emerald & Green Collection
  { id: 'soft-emerald', name: 'Soft Emerald', hex: '#529871', family: 'Emerald & Green' },
  { id: 'eucalyptus-jade', name: 'Eucalyptus Jade', hex: '#3B7A57', family: 'Emerald & Green' },
  { id: 'mossy-jade', name: 'Mossy Jade', hex: '#4C7855', family: 'Emerald & Green' },
  { id: 'faded-moss', name: 'Faded Moss', hex: '#7E9F80', family: 'Emerald & Green' },
  { id: 'laurel-green', name: 'Laurel Green', hex: '#5C8258', family: 'Emerald & Green' },
  { id: 'willow-green', name: 'Willow Green', hex: '#85A376', family: 'Emerald & Green' },
  { id: 'fern-green', name: 'Fern Green', hex: '#4F7942', family: 'Emerald & Green' },
  { id: 'warm-sage', name: 'Warm Sage', hex: '#9BAA88', family: 'Emerald & Green' },
  { id: 'dusty-sage', name: 'Dusty Sage', hex: '#8B9E87', family: 'Emerald & Green' },
  { id: 'olive-mist', name: 'Olive Mist', hex: '#9DA376', family: 'Emerald & Green' },
  { id: 'soft-olive', name: 'Soft Olive', hex: '#808C5D', family: 'Emerald & Green' },
  { id: 'celadon', name: 'Celadon', hex: '#A3C1AD', family: 'Emerald & Green' },

  // 2. Blue & Teal Collection
  { id: 'dusky-sapphire', name: 'Dusky Sapphire', hex: '#35526B', family: 'Blue & Teal' },
  { id: 'velvet-sapphire', name: 'Velvet Sapphire', hex: '#22384D', family: 'Blue & Teal' },
  { id: 'twilight-blue', name: 'Twilight Blue', hex: '#3E5C76', family: 'Blue & Teal' },
  { id: 'moonlit-teal', name: 'Moonlit Teal', hex: '#2C5E68', family: 'Blue & Teal' },
  { id: 'muted-turquoise', name: 'Muted Turquoise', hex: '#4F8F99', family: 'Blue & Teal' },
  { id: 'sea-glass', name: 'Sea Glass', hex: '#75A8A3', family: 'Blue & Teal' },
  { id: 'soft-aquamarine', name: 'Soft Aquamarine', hex: '#87C0B8', family: 'Blue & Teal' },

  // 3. Purple & Wine Collection
  { id: 'dusty-amethyst', name: 'Dusty Amethyst', hex: '#6F5977', family: 'Purple & Wine' },
  { id: 'wisteria-jewel', name: 'Wisteria Jewel', hex: '#7E6388', family: 'Purple & Wine' },
  { id: 'hushed-violet', name: 'Hushed Violet', hex: '#8C7799', family: 'Purple & Wine' },
  { id: 'heathered-plum', name: 'Heathered Plum', hex: '#5D455E', family: 'Purple & Wine' },
  { id: 'velvet-aubergine', name: 'Velvet Aubergine', hex: '#442E46', family: 'Purple & Wine' },
  { id: 'dusty-orchid', name: 'Dusty Orchid', hex: '#967493', family: 'Purple & Wine' },
  { id: 'antique-mauve', name: 'Antique Mauve', hex: '#8B6D7A', family: 'Purple & Wine' },
  { id: 'mulberry-wine', name: 'Mulberry Wine', hex: '#66334D', family: 'Purple & Wine' },
  { id: 'garnet-rose', name: 'Garnet Rose', hex: '#7C3A4D', family: 'Purple & Wine' },
  { id: 'soft-burgundy', name: 'Soft Burgundy', hex: '#612B3B', family: 'Purple & Wine' },
  { id: 'dusty-ruby', name: 'Dusty Ruby', hex: '#853E51', family: 'Purple & Wine' },
  { id: 'bluebell', name: 'Bluebell', hex: '#7785AC', family: 'Purple & Wine' },

  // 4. Neutral Collection
  { id: 'antique-ivory', name: 'Antique Ivory', hex: '#FDFBF7', family: 'Neutral' },
  { id: 'aged-linen', name: 'Aged Linen', hex: '#F7F4EE', family: 'Neutral' },
  { id: 'warm-alabaster', name: 'Warm Alabaster', hex: '#F3EFE6', family: 'Neutral' },
  { id: 'bone-cream', name: 'Bone Cream', hex: '#EFEADF', family: 'Neutral' },
  { id: 'oatmeal', name: 'Oatmeal', hex: '#E5DFC5', family: 'Neutral' },
  { id: 'natural-flax', name: 'Natural Flax', hex: '#DDD5C7', family: 'Neutral' },
  { id: 'raw-silk', name: 'Raw Silk', hex: '#D4CBBF', family: 'Neutral' },
  { id: 'sandstone', name: 'Sandstone', hex: '#C2B6A6', family: 'Neutral' },
  { id: 'warm-taupe', name: 'Warm Taupe', hex: '#A89887', family: 'Neutral' },
  { id: 'mushroom', name: 'Mushroom', hex: '#8C7D6F', family: 'Neutral' },

  // 5. Brown Collection
  { id: 'mocha-mist', name: 'Mocha Mist', hex: '#9C8474', family: 'Brown' },
  { id: 'cocoa-bean', name: 'Cocoa Bean', hex: '#543D37', family: 'Brown' },
  { id: 'walnut', name: 'Walnut', hex: '#48382F', family: 'Brown' },
  { id: 'chestnut', name: 'Chestnut', hex: '#634033', family: 'Brown' },
  { id: 'roasted-chestnut', name: 'Roasted Chestnut', hex: '#523226', family: 'Brown' },
  { id: 'hazelnut', name: 'Hazelnut', hex: '#7B5945', family: 'Brown' },
  { id: 'almond-brown', name: 'Almond Brown', hex: '#8A6752', family: 'Brown' },
  { id: 'caramel-earth', name: 'Caramel Earth', hex: '#9E6F4B', family: 'Brown' },
  { id: 'burnished-tan', name: 'Burnished Tan', hex: '#A37854', family: 'Brown' },
  { id: 'camel', name: 'Camel', hex: '#B88B5E', family: 'Brown' },
  { id: 'soft-umber', name: 'Soft Umber', hex: '#6E5646', family: 'Brown' },
  { id: 'burnt-umber', name: 'Burnt Umber', hex: '#563D31', family: 'Brown' },
  { id: 'sepia', name: 'Sepia', hex: '#704214', family: 'Brown' },
  { id: 'weathered-cedar', name: 'Weathered Cedar', hex: '#78564B', family: 'Brown' },
  { id: 'terracotta-earth', name: 'Terracotta Earth', hex: '#945642', family: 'Brown' },
  { id: 'clay-beige', name: 'Clay Beige', hex: '#B08C78', family: 'Brown' },
  { id: 'dusty-sienna', name: 'Dusty Sienna', hex: '#8B4F39', family: 'Brown' },
  { id: 'russet', name: 'Russet', hex: '#7A3E2A', family: 'Brown' },
  { id: 'copper-brown', name: 'Copper Brown', hex: '#934E33', family: 'Brown' },
  { id: 'mahogany', name: 'Mahogany', hex: '#4D231E', family: 'Brown' },

  // 6. Rose & Peach Collection
  { id: 'dusty-rose', name: 'Dusty Rose', hex: '#B77B82', family: 'Rose & Peach' },
  { id: 'antique-rose', name: 'Antique Rose', hex: '#A56870', family: 'Rose & Peach' },
  { id: 'tea-rose', name: 'Tea Rose', hex: '#C98E96', family: 'Rose & Peach' },
  { id: 'old-rose', name: 'Old Rose', hex: '#9E5E67', family: 'Rose & Peach' },
  { id: 'blushwood', name: 'Blushwood', hex: '#BA8E8E', family: 'Rose & Peach' },
  { id: 'faded-peony', name: 'Faded Peony', hex: '#D0A1A8', family: 'Rose & Peach' },
  { id: 'rosewood', name: 'Rosewood', hex: '#65383E', family: 'Rose & Peach' },
  { id: 'soft-coral', name: 'Soft Coral', hex: '#D68C7A', family: 'Rose & Peach' },
  { id: 'muted-apricot', name: 'Muted Apricot', hex: '#E09F7A', family: 'Rose & Peach' },
  { id: 'apricot-cream', name: 'Apricot Cream', hex: '#E8BA9B', family: 'Rose & Peach' },

  // 7. Peach & Amber Collection
  { id: 'burnished-peach', name: 'Burnished Peach', hex: '#CB7B5A', family: 'Peach & Amber' },
  { id: 'honeyed-peach', name: 'Honeyed Peach', hex: '#D98C64', family: 'Peach & Amber' },
  { id: 'dusty-salmon', name: 'Dusty Salmon', hex: '#C47D68', family: 'Peach & Amber' },
  { id: 'muted-terracotta', name: 'Muted Terracotta', hex: '#AD5D4E', family: 'Peach & Amber' },
  { id: 'old-terracotta', name: 'Old Terracotta', hex: '#8F4839', family: 'Peach & Amber' },
  { id: 'burnt-peach', name: 'Burnt Peach', hex: '#BF6A50', family: 'Peach & Amber' },
  { id: 'cinnamon', name: 'Cinnamon', hex: '#9E5338', family: 'Peach & Amber' },
  { id: 'soft-cinnamon', name: 'Soft Cinnamon', hex: '#B3674D', family: 'Peach & Amber' },
  { id: 'spiced-amber', name: 'Spiced Amber', hex: '#B8713D', family: 'Peach & Amber' },
  { id: 'honey-amber', name: 'Honey Amber', hex: '#C97F37', family: 'Peach & Amber' },

  // 8. Gold Collection
  { id: 'antique-gold', name: 'Antique Gold', hex: '#B59445', family: 'Gold' },
  { id: 'soft-ochre', name: 'Soft Ochre', hex: '#C29F52', family: 'Gold' },
  { id: 'mustard-silk', name: 'Mustard Silk', hex: '#B58E3A', family: 'Gold' },
  { id: 'golden-wheat', name: 'Golden Wheat', hex: '#CDB16B', family: 'Gold' },
  { id: 'harvest-gold', name: 'Harvest Gold', hex: '#BF8C34', family: 'Gold' },
  { id: 'toasted-saffron', name: 'Toasted Saffron', hex: '#C87C28', family: 'Gold' },
];

export const PREDEFINED_THEMES: ThemeDefinition[] = [
  {
    id: 'emerald-garden',
    name: 'Emerald Garden',
    description: 'Calming soft emerald and sage greens inspired by lush botanicals.',
    family: 'Emerald & Green',
    mode: 'light',
    colors: {
      primary: '#529871', // Soft Emerald
      primaryHover: '#3B7A57',
      secondary: '#8B9E87', // Dusty Sage
      background: '#F7F9F7',
      backgroundCard: '#FFFFFF',
      backgroundSidebar: '#F0F5F1',
      textPrimary: '#1E2F23',
      textSecondary: '#4A6353',
      textMuted: '#7D9686',
      border: '#DCE6DF',
      accent: '#61A882',
      glow: 'rgba(82, 152, 113, 0.15)',
    },
  },
  {
    id: 'ocean-mist',
    name: 'Ocean Mist',
    description: 'Refreshing muted turquoise and deep sapphire for tranquil focus.',
    family: 'Blue & Teal',
    mode: 'light',
    colors: {
      primary: '#35526B', // Dusky Sapphire
      primaryHover: '#22384D',
      secondary: '#4F8F99', // Muted Turquoise
      background: '#F5F8FA',
      backgroundCard: '#FFFFFF',
      backgroundSidebar: '#EDF2F6',
      textPrimary: '#142533',
      textSecondary: '#3C5569',
      textMuted: '#6E8597',
      border: '#D8E2E9',
      accent: '#75A8A3',
      glow: 'rgba(53, 82, 107, 0.15)',
    },
  },
  {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    description: 'Dusty amethyst, hushed violet, and gentle lilac for creative clarity.',
    family: 'Purple & Wine',
    mode: 'light',
    colors: {
      primary: '#6F5977', // Dusty Amethyst
      primaryHover: '#5D455E',
      secondary: '#8C7799', // Hushed Violet
      background: '#F9F7FA',
      backgroundCard: '#FFFFFF',
      backgroundSidebar: '#F2EEF5',
      textPrimary: '#2B1E30',
      textSecondary: '#524059',
      textMuted: '#84738C',
      border: '#E4DDE9',
      accent: '#7E6388',
      glow: 'rgba(111, 89, 119, 0.15)',
    },
  },
  {
    id: 'rosewood-romance',
    name: 'Rosewood Romance',
    description: 'Dusty rose and soft burgundy evoking warmth, vintage books, and tea.',
    family: 'Rose & Peach',
    mode: 'light',
    colors: {
      primary: '#A56870', // Antique Rose
      primaryHover: '#65383E', // Rosewood
      secondary: '#B77B82', // Dusty Rose
      background: '#FAF6F6',
      backgroundCard: '#FFFFFF',
      backgroundSidebar: '#F4ECEE',
      textPrimary: '#361D22',
      textSecondary: '#664249',
      textMuted: '#967078',
      border: '#EADCE0',
      accent: '#612B3B',
      glow: 'rgba(165, 104, 112, 0.15)',
    },
  },
  {
    id: 'vanilla-cream',
    name: 'Vanilla Cream',
    description: 'Aged linen, oatmeal, warm alabaster, and organic flax neutrals.',
    family: 'Neutral',
    mode: 'soft_neutral',
    colors: {
      primary: '#7B5945', // Hazelnut
      primaryHover: '#543D37',
      secondary: '#A89887', // Warm Taupe
      background: '#FBF9F5', // Antique Ivory
      backgroundCard: '#FFFFFF',
      backgroundSidebar: '#F4EFE6', // Warm Alabaster
      textPrimary: '#2D2621',
      textSecondary: '#594F46',
      textMuted: '#8F8377',
      border: '#E5DFC5', // Oatmeal
      accent: '#C2B6A6',
      glow: 'rgba(123, 89, 69, 0.12)',
    },
  },
  {
    id: 'mocha-atelier',
    name: 'Mocha Atelier',
    description: 'Rich mocha, walnut, and caramel earth for an artisanal executive touch.',
    family: 'Brown',
    mode: 'light',
    colors: {
      primary: '#6E5646', // Soft Umber
      primaryHover: '#48382F', // Walnut
      secondary: '#9E6F4B', // Caramel Earth
      background: '#F8F5F2',
      backgroundCard: '#FFFFFF',
      backgroundSidebar: '#EFE9E2',
      textPrimary: '#291E18',
      textSecondary: '#544238',
      textMuted: '#877366',
      border: '#DFD5CA',
      accent: '#B88B5E', // Camel
      glow: 'rgba(110, 86, 70, 0.15)',
    },
  },
  {
    id: 'sunset-peach',
    name: 'Sunset Peach',
    description: 'Golden peach, muted terracotta, and toasted amber glow.',
    family: 'Peach & Amber',
    mode: 'light',
    colors: {
      primary: '#CB7B5A', // Burnished Peach
      primaryHover: '#AD5D4E', // Muted Terracotta
      secondary: '#D98C64', // Honeyed Peach
      background: '#FAF6F2',
      backgroundCard: '#FFFFFF',
      backgroundSidebar: '#F5ECE3',
      textPrimary: '#382218',
      textSecondary: '#664638',
      textMuted: '#9C7565',
      border: '#EBDCCE',
      accent: '#C97F37',
      glow: 'rgba(203, 123, 90, 0.15)',
    },
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Antique gold, golden wheat, and soft ochre for an optimistic day.',
    family: 'Gold',
    mode: 'light',
    colors: {
      primary: '#B59445', // Antique Gold
      primaryHover: '#BF8C34', // Harvest Gold
      secondary: '#CDB16B', // Golden Wheat
      background: '#FAF8F2',
      backgroundCard: '#FFFFFF',
      backgroundSidebar: '#F3EEDF',
      textPrimary: '#332912',
      textSecondary: '#5E4F2B',
      textMuted: '#94835A',
      border: '#E8DEC4',
      accent: '#C29F52',
      glow: 'rgba(181, 148, 69, 0.15)',
    },
  },
  {
    id: 'forest-calm',
    name: 'Forest Calm',
    description: 'Deep mossy jade, willow, and laurel greens with grounding warmth.',
    family: 'Emerald & Green',
    mode: 'light',
    colors: {
      primary: '#4C7855', // Mossy Jade
      primaryHover: '#3B7A57',
      secondary: '#5C8258', // Laurel Green
      background: '#F6F8F5',
      backgroundCard: '#FFFFFF',
      backgroundSidebar: '#EDF2EC',
      textPrimary: '#1B2B1F',
      textSecondary: '#405445',
      textMuted: '#738C7A',
      border: '#D9E3DA',
      accent: '#85A376',
      glow: 'rgba(76, 120, 85, 0.15)',
    },
  },
  {
    id: 'midnight-plum',
    name: 'Midnight Plum',
    description: 'Deep velvet aubergine, mulberry wine, and twilight violet dark mode.',
    family: 'Purple & Wine',
    mode: 'dark',
    colors: {
      primary: '#967493', // Dusty Orchid
      primaryHover: '#B28EB0',
      secondary: '#7785AC', // Bluebell
      background: '#19131C', // Dark Aubergine base
      backgroundCard: '#241B28',
      backgroundSidebar: '#1E1621',
      textPrimary: '#F6F1F7',
      textSecondary: '#C5BAC9',
      textMuted: '#8F8294',
      border: '#3D2F44',
      accent: '#7E6388',
      glow: 'rgba(150, 116, 147, 0.25)',
    },
  },
];
