# Design System & Modern Editorial Aesthetic Rules

Whenever creating, modifying, styling, or reviewing UI components and visual assets across the **Janji Suci (EverAfter Planner)** platform, the AI agent MUST strictly and unconditionally adhere to the following design system rules:

---

## 1. Visual Philosophy: Modern Editorial Soft Minimalist

The interface must evoke the calm, luxurious, and organized feel of a premium bridal magazine (*Kinfolk / Cereal magazine vibe*), specifically tailored for mobile-first user interaction:

1. **Flat & Airy Composition (*Zero Clay / Zero 3D*):**
   - Strictly prohibit bubbly, heavy 3D, skeuomorphic, or playful claymorphism elements.
   - Use crisp, flat layout cards (*clean flat cards*) with balanced, generous whitespace (*airy whitespace*).
2. **Hairline Borders & Ambient Glow:**
   - Section dividers, cards, and input fields must use ultra-fine 1px hairline borders (`border border-[#ECE5DE]` or `border-[#F2DFDC]`).
   - Shadows must be subtle, diffused, and ambient (`shadow-sm` or ambient soft glow), never harsh or dark.
3. **Subtle Frosted Glass Accents:**
   - Fixed headers, sticky navigation bars, and floating controls must use semitransparent backgrounds with subtle backdrop blur (`backdrop-blur-md bg-white/85` or `bg-[#FAF8F5]/80`).
4. **Mobile-First Container Constraint:**
   - The primary app shell must be optimized for mobile smartphones (max width constrained, e.g. `max-w-md` or `max-w-lg` centered on wider desktop screens with the Warm Linen ambient background).

---

## 2. Strict Typography System: Editorial Pairing

The application enforces a strict two-font hierarchy. Never introduce ad-hoc system fonts or arbitrary font families:

1. **Headings, Display & Romantic Quotes: *Cormorant Garamond***
   - **Font Family:** `font-serif` (*Cormorant Garamond*).
   - **Application:** Couple names, major section titles, live countdown big labels, and poetic quotes.
   - **Styling Directives:**
     - Elegant tracking on uppercase display text (`tracking-wide` or `tracking-widest`).
     - Poetic quotes must use italic serif styling with balanced line heights.
2. **Body Text, Controls, Labels & Data: *Plus Jakarta Sans***
   - **Font Family:** `font-sans` (*Plus Jakarta Sans*).
   - **Application:** Form inputs, checklist labels, budget figures, navigation items, buttons, and helper text.
   - **Styling Directives:** High legibility, neutral letter spacing, weights ranging between 400 (regular), 500 (medium), and 600 (semi-bold).
3. **Mandatory Tabular Numbers (`tabular-nums`):**
   - Any changing numerical data—including countdown timers (days, hours, minutes, seconds), monetary currency amounts (Rupiah), and percentage meters—**MUST** apply `tabular-nums` (`font-variant-numeric: tabular-nums;`).
   - Prevents visual jitter and horizontal shifting as numeric values tick or update.

---

## 3. Strict Iconography Standard: Lucide Icons Only

1. **Zero Raw Emoji Policy (Absolute Prohibition):**
   - The entire user interface is strictly prohibited from rendering raw OS emojis (e.g., 💍, 📅, 💰, 💐, 👰).
   - All visual symbols, status badges, and affordances must use the official **Lucide Icons** library (`lucide-react`).
2. **Icon Styling Parameters:**
   - Uniform line stroke width: **1.75px** (or 1.5px–1.75px for dense tables).
   - Smooth line caps and joins: `stroke-linecap="round" stroke-linejoin="round"`.
   - Dimension standards:
     - Inline badge/helper icons: `w-3.5 h-3.5` or `w-4 h-4`.
     - Standard button/navigation icons: `w-5 h-5`.
     - Hero/display feature icons: `w-6 h-6` to `w-8 h-8`.
3. **Monochromatic Soft Tinting:**
   - Icons must be tinted according to semantic context using designated palette tokens (Dusty Rose, Sage Dark, Soft Cocoa, Warm Stone), never harsh pure saturated primaries.

---

## 4. Curated Color Palette Tokens

The design system is anchored in an editorial soft palette:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EDITORIAL COLOR PALETTE                         │
├────────────────────────┬─────────────────────────┬─────────────────────┤
│ Token Role             │ Color Name              │ Hex Code            │
├────────────────────────┼─────────────────────────┼─────────────────────┤
│ Base Background        │ Warm Linen Cream        │ #FAF8F5             │
│ Surface Card (Pure)    │ Crisp White             │ #FFFFFF             │
│ Surface Card (Oat)     │ Off-White Oat           │ #F5EFEB             │
│ Hairline Border (Main) │ Subtle Oat Line         │ #ECE5DE             │
│ Hairline Border (Soft) │ Soft Blush Line         │ #F2DFDC             │
│ Primary Accent         │ Dusty Rose              │ #B86B70             │
│ Soft Accent Tint       │ Soft Rose Tint          │ #FDF0EE             │
│ Success / Balanced     │ Soft Sage               │ #E8F0EA             │
│ Success Text / Dark    │ Sage Dark               │ #58755E             │
│ Honor / VIP Accent     │ Champagne Sand          │ #DFB15B             │
│ Primary Text (Heading) │ Dark Espresso Charcoal  │ #3A302C             │
│ Body Text (Readable)   │ Soft Cocoa              │ #73635C             │
│ Muted Text (Captions)  │ Warm Stone              │ #A89B95             │
└────────────────────────┴─────────────────────────┴─────────────────────┘
```

---

## 5. Component Interaction & Micro-Interaction Directives

1. **Minimalist Form Controls:**
   - Checkboxes: Clean rounded-md squares with 1px border, transitioning to Dusty Rose or Soft Sage with smooth ease-in-out animations.
   - Text Inputs: Flat backgrounds (`bg-white` or `bg-[#F5EFEB]/50`), 1px border, subtle focus ring without aggressive outlines.
2. **Pill & Outline Action Badges:**
   - Filter chips and time-phase switchers must use rounded-full pill buttons with delicate hairline outlines.
   - Active state: Subtle filled tint (`bg-[#B86B70] text-white` or `bg-[#FDF0EE] text-[#B86B70] border-[#B86B70]/30`).
3. **Micro-Interactions & Celebrations:**
   - When a checklist task is completed, trigger a tasteful, lightweight pastel confetti particle effect (`#B86B70`, `#58755E`, `#DFB15B`, `#F2DFDC`).
   - Keep animations brief (< 1.5 seconds) and non-blocking.
4. **Progress Indicators:**
   - All progress bars must remain slender (`h-1.5` or `h-2`), rounded-full, with soft gradient or solid muted fills (`bg-[#58755E]` or `bg-[#B86B70]`).

---

## 6. Code & Testing Mandates

1. **Mandatory `data-testid` Attributes:**
   - Every reusable visual component, action button, input field, and navigation tab must include semantic `data-testid` attributes (e.g., `data-testid="home-countdown-card"`, `data-testid="checklist-item-checkbox"`).
2. **Zero `any` TypeScript Rule:**
   - All styling props, variants, and component contracts must define explicit TypeScript interfaces.
3. **Mobile-First Responsiveness:**
   - Always ensure UI elements scale gracefully from narrow mobile viewports (360px–414px) up to tablet and desktop screens.
