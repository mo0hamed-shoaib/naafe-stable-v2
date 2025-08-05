Naafe Project Conventions & Guidelines

🎨 Design System & Styling

Color Palette
/* Primary Colors */
--deep-teal: #0e1b18      /* Main brand color */
--soft-teal: #2D5D4F      /* Secondary brand */
--bright-orange: #F5A623  /* Accent/CTA color */

/* Background Colors */
--warm-cream: #F5E6D3     /* Main background */
--light-cream: #FDF8F3    /* Light background */

/* Text Colors */
--text-primary: #0e1b18   /* Main text */
--text-secondary: #6B7280 /* Secondary text */


Typography
Primary Font: Cairo (Arabic)
Secondary Font: Jakarta (English)
RTL Support: All components support right-to-left layout
Font Weights: Regular, Medium, Semibold, Bold, Extrabold

Spacing & Layout
Container: container mx-auto max-w-4xl
Card Padding: p-6 sm:p-8 md:p-10
Border Radius: rounded-lg (default), rounded-xl (cards), rounded-2xl (large cards)
Gap System: gap-2, gap-4, gap-6 for consistent spacing


🧩 Component Architecture

Unified Form Components
// Always use these unified components instead of HTML inputs
import { FormInput, FormTextarea, FormSelect } from '../components/ui';

// Enhanced with maximum visibility:
// - border-2 border-gray-300 (strong borders)
// - shadow-md → hover:shadow-lg → focus:shadow-xl
// - focus:ring-deep-teal/40 (clear focus indicators)

Component Structure
src/
├── components/
│   ├── ui/                    # Unified UI components
│   │   ├── FormInput.tsx      # Enhanced input with visibility
│   │   ├── FormTextarea.tsx   # Enhanced textarea
│   │   ├── FormSelect.tsx     # Enhanced select
│   │   ├── Button.tsx         # DaisyUI-based buttons
│   │   └── index.ts           # Export all UI components
│   ├── Header.tsx             # Main navbar with search
│   ├── Footer.tsx             # Site footer
│   └── layout/
│       └── PageLayout.tsx     # Standard page wrapper
├── admin/                     # Admin dashboard components
│   ├── components/UI/         # Admin-specific UI
│   └── pages/                 # Admin pages
├── pages/                     # Main application pages
└── contexts/                  # React contexts


🔧 Technical Conventions

Import Paths
// For pages (src/pages/)
import { FormInput } from '../components/ui';

// For components (src/components/)
import { FormInput } from './ui';

// For help-center components
import { FormInput } from '../ui';

// For admin pages
import { FormInput } from '../../components/ui';

File Naming
Components: PascalCase (FormInput.tsx)
Pages: PascalCase (LoginPage.tsx)
Utilities: camelCase (helpers.ts)
Types: PascalCase (User.ts)

Component Props
// Always include proper TypeScript interfaces
interface ComponentProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}


Localization & RTL
Arabic Support
All text in Arabic with proper RTL layout
Date formats: Arabic calendar support
Number formatting: Arabic numerals
Direction: dir="rtl" on main containers

Text Examples
// Common Arabic text patterns
const labels = {
  search: "البحث عن الخدمات...",
  login: "تسجيل الدخول",
  register: "إنشاء حساب",
  submit: "إرسال",
  cancel: "إلغاء",
  loading: "جاري التحميل...",
  error: "حدث خطأ",
  success: "تم بنجاح"
};


🎯 Key Features & Components

Authentication System
JWT-based with refresh tokens
Role-based access: seeker, provider, admin
Protected routes with automatic redirect
Logout with token invalidation

Form Validation
Client-side validation with error messages
Server-side validation with proper error handling
Real-time feedback with success/error states

File Upload
Multer middleware for backend file handling
ImgBB integration for image hosting
Multiple file support with size limits
File type validation (images, PDFs)

Search & Filtering
Unified search across services and requests
Category filtering with dynamic options
Location-based filtering
Price range filtering


Development Workflow

Component Development
Always use unified components for forms
Include proper TypeScript types
Add accessibility attributes (aria-label, title)
Test RTL layout and Arabic text
Ensure responsive design (mobile-first)

Styling Guidelines
Use Tailwind CSS with custom color variables
Follow mobile-first responsive design
Maintain consistent spacing with gap system
Use enhanced shadows for depth and visibility
Ensure proper contrast for accessibility

Code Quality
ESLint configuration for code consistency
TypeScript strict mode enabled
Proper error handling with try-catch blocks
Loading states for all async operations
Success/error feedback for user actions


📱 Responsive Design

Breakpoints
/* Mobile-first approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */

Layout Patterns
// Standard responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive flexbox
<div className="flex flex-col md:flex-row gap-4">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">


🔒 Security & Best Practices

Authentication
Secure token storage in HTTP-only cookies
CSRF protection enabled
Rate limiting on sensitive endpoints
Input sanitization on all forms

Data Handling
Proper error boundaries for React components
Loading states for all async operations
Optimistic updates where appropriate
Proper cleanup in useEffect hooks
This comprehensive guide ensures consistency across the entire Naafe application and maintains the high standards we've established!