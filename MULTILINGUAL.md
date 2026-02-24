# Multilingual Support

The website now supports three languages:

## Available Languages

1. **English (EN)** 🇬🇧
2. **Russian (RU)** 🇷🇺
3. **Armenian (HY)** 🇦🇲

## How to Use

### Language Switcher Location

- **Desktop**: Look for the language switcher in the top-right corner of the header (next to the hamburger menu button position)
- **Mobile**: Open the mobile menu, and you'll find the language switcher at the bottom of the menu

### Switching Languages

1. Click on the language button (shows current language flag + code, e.g., "🇬🇧 EN")
2. A dropdown menu will appear with all available languages
3. Click on your desired language
4. The entire website will instantly translate to that language
5. Your language preference is saved in browser storage

## Features

✅ **Complete Translation**: All pages are fully translated
- Home page
- Portfolio page
- About page
- Contact page
- Order form (all 3 steps)
- Rent page
- Header navigation
- Footer

✅ **Persistent**: Your language choice is saved and remembered across sessions

✅ **Instant Switch**: No page reload required

✅ **Responsive**: Works perfectly on all devices

## Translation Coverage

### Pages Translated:
- ✓ Navigation menu
- ✓ Hero sections
- ✓ Feature cards
- ✓ Forms and inputs
- ✓ Buttons and CTAs
- ✓ Footers
- ✓ Error/success messages
- ✓ Placeholders
- ✓ FAQ sections

### What Gets Translated:
- All text content
- Button labels
- Form labels and placeholders
- Success/error messages
- Menu items
- Headings and descriptions

### What Stays the Same:
- Company name "NEON DREAMS"
- Logo
- Icons and emojis
- Colors and design
- Layout structure

## Testing the Translation

1. **Go to Home Page** - Switch languages and see the hero text change
2. **Try the Order Form** - All form steps are translated
3. **Check Portfolio** - Category filters are translated
4. **View Contact Page** - Form and FAQ are in selected language

## Technical Implementation

The multilingual system uses:
- React Context API for state management
- LocalStorage for persistence
- Translation keys system
- Component-level translation hooks

## Language Files

All translations are stored in: `src/i18n/translations.js`

Each language has complete translations for all pages and components.
