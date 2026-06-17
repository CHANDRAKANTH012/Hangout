---
name: Hangout
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e8'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#efecfc'
  surface-container-high: '#e9e6f7'
  surface-container-highest: '#e3e0f1'
  on-surface: '#1b1a26'
  on-surface-variant: '#5a403f'
  inverse-surface: '#302f3b'
  inverse-on-surface: '#f2efff'
  outline: '#8e706e'
  outline-variant: '#e2bebc'
  surface-tint: '#b4252d'
  primary: '#b4252d'
  on-primary: '#ffffff'
  primary-container: '#ff5c5c'
  on-primary-container: '#62000c'
  inverse-primary: '#ffb3af'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#8c5000'
  on-tertiary: '#ffffff'
  tertiary-container: '#d97e00'
  on-tertiary-container: '#462500'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3af'
  on-primary-fixed: '#410005'
  on-primary-fixed-variant: '#920418'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#ffb874'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#fcf8ff'
  on-background: '#1b1a26'
  surface-variant: '#e3e0f1'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.1'
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  gutter: 24px
  card-gap: 24px
---

## Brand & Style
The design system for this platform centers on the "Spontaneous Connection" narrative. It targets a youthful, urban demographic seeking high-quality local interactions. The visual language is defined by **Advanced Glassmorphism**, utilizing multi-layered transparency to create a sense of depth and airiness. 

The emotional response should be one of warmth, energy, and premium accessibility. By mixing vibrant "Sunrise to Sunset" accents with sophisticated glass surfaces, the UI feels both high-tech and human-centric. The aesthetic is polished, utilizing background blurs and soft shadows to establish a hierarchy that feels light rather than heavy.

## Colors
The palette leverages a "Sunrise to Sunset" spectrum. The primary background is a soft lavender-white (#F5F7FF), meant to be layered with deep, low-opacity radial gradients of Coral and Blue to create a "blob" atmosphere.

- **Primary (Coral Red):** Used for main actions and urgent spontaneous markers.
- **Secondary (Cool Blue):** Used for scheduled events and professional settings.
- **Accents (Orange/Yellow/Purple):** Used for categorization (e.g., Food & Drink, Fitness, Nightlife).
- **Glass Surfaces:** High-opacity white (80-90%) for text legibility, transitioning to 15% for decorative containers.

## Typography
The typography uses **Plus Jakarta Sans** for headlines to achieve a modern, geometric look that pairs perfectly with the Glassmorphism style. Headlines must always use tight tracking to maintain a premium, editorial feel. 

**Be Vietnam Pro** is selected for body and labels due to its exceptional readability and friendly, contemporary character. Use 500 weight for body text on glass surfaces to ensure high contrast and legibility against varying background blurs.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high internal padding to accommodate the "breathing room" required by glass elements. 

- **Desktop:** 12-column grid, 1200px max-width, 24px gutters.
- **Mobile:** Single column with 20px side margins.
- **Spacing Rhythm:** Use a strict 8px base unit. Components should favor generous vertical margins (32px+) to prevent the glass layers from looking cluttered.

## Elevation & Depth
Depth is created through a combination of **Backdrop Blurs** and **Ambient Shadows**. 

1.  **Level 0 (Base):** Lavender-white background with soft radial gradients.
2.  **Level 1 (Cards/Containers):** 15% White opacity, 16px blur, 1px solid white border (40% opacity), and a soft 15% black shadow with a 30px spread.
3.  **Level 2 (Modals/Popovers):** 40% White opacity, 24px blur, 2px solid white border, and a more pronounced 20% shadow to indicate high priority.

All glass elements must include a "inner glow" (white 1px border) to define the edges against the vibrant background blobs.

## Shapes
The shape language is highly varied to distinguish between content types. 
- **Pill-shapes (9999px):** Reserved for interactive elements like buttons, search bars, and tags.
- **Large Radii (24px):** Used for event cards, profile headers, and main glass containers.
- **Small Radii (8px):** Used for utility items like input fields (internal), checkboxes, and small tooltips.

## Components
### Buttons
- **Primary:** Pill-shaped, using the Sunrise gradient. Must include a CSS shimmer animation (a diagonal white glint moving left-to-right) and a `translateY(-4px)` lift on hover.
- **Secondary:** Pill-shaped, glass background (rgba(255,255,255,0.3)), white border.

### Cards
- **Event Card:** 24px radius, glass background. Images should have a 16px internal radius to create a "nested" look. Use "Sunset" gradient overlays on images to maintain brand consistency.

### Input Fields
- Semi-transparent white background (rgba(255,255,255,0.5)) with an 8px radius. On focus, the border should glow with the Primary Coral Red.

### Chips & Tags
- Always pill-shaped. Use low-opacity versions of the accent colors (e.g., 10% Coral Red background with 100% Coral Red text) for a soft, premium feel.

### Navigation
- A floating glass dock at the bottom of the screen (Mobile) or top (Desktop) with a 24px blur and pill-shaped active state indicators.