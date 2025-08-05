# 🎨 UI Component Library

This directory contains reusable UI components that provide consistent styling and behavior across the Naafe' application.

## 📦 Components

### BaseCard
A foundational card component with consistent styling and hover effects.

```tsx
import { BaseCard } from '../components/ui';

<BaseCard hover padding="lg" shadow="md">
  <h3>Card Content</h3>
  <p>Your content here</p>
</BaseCard>
```

**Props:**
- `children`: React.ReactNode
- `className?: string` - Additional CSS classes
- `onClick?: () => void` - Click handler
- `hover?: boolean` - Enable hover effects
- `padding?: 'sm' | 'md' | 'lg'` - Padding size
- `shadow?: 'sm' | 'md' | 'lg'` - Shadow intensity

### Button
A versatile button component with multiple variants and states.

```tsx
import { Button } from '../components/ui';

<Button variant="primary" size="md" loading={false}>
  Click Me
</Button>
```

**Props:**
- `children`: React.ReactNode
- `variant?: 'primary' | 'secondary' | 'ghost' | 'outline'`
- `size?: 'sm' | 'md' | 'lg'`
- `loading?: boolean` - Show loading spinner
- `fullWidth?: boolean` - Full width button
- `disabled?: boolean` - Disable button
- All standard button HTML attributes

### RatingDisplay
A star rating component with configurable display options.

```tsx
import { RatingDisplay } from '../components/ui';

<RatingDisplay rating={4.5} size="md" showNumber={true} />
```

**Props:**
- `rating`: number - The rating value (0-5)
- `maxRating?: number` - Maximum rating (default: 5)
- `size?: 'sm' | 'md' | 'lg'` - Star size
- `showNumber?: boolean` - Show rating number
- `className?: string` - Additional CSS classes

### FormInput
A standardized form input with label and error handling.

```tsx
import { FormInput } from '../components/ui';
import { Search } from 'lucide-react';

<FormInput
  label="Search"
  icon={<Search className="h-4 w-4" />}
  variant="search"
  placeholder="Search services..."
/>
```

**Props:**
- `label?: string` - Input label
- `error?: string` - Error message
- `icon?: React.ReactNode` - Input icon
- `variant?: 'default' | 'search'` - Input style variant
- `size?: 'sm' | 'md' | 'lg'` - Input size
- All standard input HTML attributes

### FilterForm
A unified filter component with inline and sidebar variants.

```tsx
import { FilterForm } from '../components/ui';

<FilterForm
  filters={filters}
  onFiltersChange={updateFilters}
  onClearFilters={clearFilters}
  onSearch={handleSearch}
  variant="sidebar"
/>
```

**Props:**
- `filters`: FilterState - Current filter values
- `onFiltersChange`: (filters: FilterState) => void - Filter change handler
- `onClearFilters`: () => void - Clear filters handler
- `onSearch?: (query: string) => void` - Search handler
- `variant?: 'inline' | 'sidebar'` - Display variant
- `className?: string` - Additional CSS classes

### PageLayout
A standardized page layout wrapper with header, footer, and breadcrumbs.

```tsx
import { PageLayout } from '../components/ui';

<PageLayout
  title="Page Title"
  subtitle="Page description"
  breadcrumbItems={breadcrumbItems}
  onSearch={handleSearch}
>
  <div>Page content</div>
</PageLayout>
```

**Props:**
- `children`: React.ReactNode - Page content
- `title?: string` - Page title
- `subtitle?: string` - Page subtitle
- `breadcrumbItems?: BreadcrumbItem[]` - Breadcrumb navigation
- `onSearch?: (query: string) => void` - Search handler
- `searchValue?: string` - Current search value
- `className?: string` - Additional CSS classes
- `showHeader?: boolean` - Show header (default: true)
- `showFooter?: boolean` - Show footer (default: true)
- `showBreadcrumb?: boolean` - Show breadcrumbs (default: true)

## 🎨 Design System

### Colors
- **Primary**: `deep-teal` (#2D5D4F)
- **Secondary**: `bright-orange` (#F5A623)
- **Background**: `warm-cream` (#F5E6D3)
- **Text Primary**: `text-primary` (#0e1b18)
- **Text Secondary**: `text-secondary` (#50958a)

### Spacing
- **Container**: `px-4 sm:px-6 lg:px-8 py-8`
- **Card Padding**: `p-3` (sm), `p-5` (md), `p-8` (lg)
- **Component Gap**: `gap-4` (default), `gap-6` (larger)

### Typography
- **Headings**: `text-4xl font-extrabold` (h1), `text-2xl font-bold` (h2)
- **Body**: `text-lg` (large), `text-base` (default), `text-sm` (small)
- **Interactive**: `font-medium` for buttons and links

## 🔧 Usage Guidelines

### Importing Components
```tsx
// Individual imports
import { BaseCard } from '../components/ui/BaseCard';
import { Button } from '../components/ui/Button';

// Or use the index file
import { BaseCard, Button, RatingDisplay } from '../components/ui';
```

### TypeScript Best Practices (2025)
```tsx
// ✅ Modern: Explicit typing (recommended)
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ variant = 'primary', children, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{children}</button>;
};

// ❌ Legacy: React.FC (avoid in new code)
const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

### Styling
- Use the `className` prop for additional styling
- Leverage the `cn()` utility for conditional classes
- Follow the established design system colors and spacing

### Accessibility
- All components include proper ARIA attributes
- Focus states are consistently implemented
- Screen reader support is built-in

### Responsive Design
- Components are mobile-first by default
- Use responsive utilities for breakpoint-specific styling
- Test on various screen sizes

## 🚀 Best Practices

1. **Consistency**: Always use these components instead of custom styling
2. **Composition**: Combine components to create complex UI patterns
3. **Props**: Use the provided props for customization
4. **Accessibility**: Don't override accessibility features
5. **Performance**: Components are optimized for performance

## 🔄 Migration Guide

When migrating existing components:

1. Replace custom card divs with `BaseCard`
2. Replace button elements with `Button` component
3. Replace star rating logic with `RatingDisplay`
4. Replace form inputs with `FormInput`
5. Replace page layouts with `PageLayout`

## 📝 Examples

### Complex Card Layout
```tsx
<BaseCard hover padding="lg" className="max-w-md">
  <div className="space-y-4">
    <h3 className="text-xl font-semibold">Card Title</h3>
    <p className="text-text-secondary">Card description</p>
    <div className="flex items-center justify-between">
      <RatingDisplay rating={4.5} />
      <Button variant="primary" size="sm">
        Action
      </Button>
    </div>
  </div>
</BaseCard>
```

### Form with Validation
```tsx
<FormInput
  label="Email Address"
  type="email"
  error={emailError}
  placeholder="Enter your email"
  required
/>
```

### Filter Section
```tsx
<FilterForm
  filters={filters}
  onFiltersChange={updateFilters}
  onClearFilters={clearFilters}
  variant="inline"
  className="mb-6"
/>
``` 