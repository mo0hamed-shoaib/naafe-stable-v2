# Naafe - Service Marketplace

A modern React application that combines category browsing and search functionality for a service marketplace platform. Built with React, TypeScript, Tailwind CSS, and DaisyUI.

## 🎯 Features

### Category Page
- **Browse Service Categories**: View all available service categories with visual cards
- **Advanced Filtering**: Filter categories by search terms, location, price range, and ratings
- **Sorting Options**: Sort categories by popularity, price, or newest
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Custom Task CTA**: Special card for posting custom tasks

### Search Page
- **Service Provider Search**: Search through service providers with real-time filtering
- **Advanced Filters**: Filter by category, location, price range, and minimum rating
- **URL State Management**: Search parameters are maintained in the URL for sharing and navigation
- **Provider Cards**: Detailed service provider cards with ratings, pricing, and contact information
- **No Results Handling**: Graceful handling when no results are found

### Navigation & Routing
- **React Router Integration**: Seamless navigation between pages
- **Category to Search Flow**: Clicking categories navigates to search with pre-filled filters
- **Search Bar Integration**: Global search functionality in the header
- **Breadcrumb Navigation**: Clear navigation hierarchy

## 🛠 Tech Stack

- **React 18.3.1** - Modern React with functional components and hooks
- **TypeScript 5.5.3** - Type-safe development
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **DaisyUI 5.0.46** - Component library built on Tailwind CSS
- **React Router DOM 7.6.3** - Client-side routing
- **Lucide React 0.344.0** - Beautiful icons
- **Vite 5.4.2** - Fast build tool and development server

## 🎨 Design System

### Colors
- **Deep Teal** (`#2D5D4F`) - Primary brand color
- **Warm Cream** (`#F5E6D3`) - Background color
- **Bright Orange** (`#F5A623`) - Accent color
- **Light Cream** (`#FDF8F0`) - Secondary background
- **Text Primary** (`#0e1b18`) - Main text color
- **Text Secondary** (`#50958a`) - Secondary text color

### Typography
- **Plus Jakarta Sans** - Primary font family
- **Responsive text sizes** - Scales appropriately across devices

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx       # Navigation header with search
│   ├── Footer.tsx       # Site footer
│   ├── CategoryCard.tsx # Individual category display
│   ├── ServiceCard.tsx  # Service provider display
│   ├── FilterSidebar.tsx # Search filters
│   ├── Breadcrumb.tsx   # Navigation breadcrumbs
│   ├── SearchFilterSection.tsx # Category page filters
│   └── CustomTaskCTA.tsx # Custom task call-to-action
├── pages/               # Page components
│   └── SearchPage.tsx   # Search results page
├── hooks/               # Custom React hooks
│   ├── useFilters.ts    # Filter state management
│   ├── useSort.ts       # Sorting logic
│   └── useQueryParams.ts # URL parameter management
├── data/                # Static data and mock data
│   ├── categories.tsx   # Service categories
│   └── mockData.ts      # Mock service providers
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared interfaces
├── App.tsx              # Main application component
└── main.tsx            # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd naafe-category-page-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔧 Configuration

### Tailwind CSS Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette matching the design system
- DaisyUI plugin integration
- Custom font family configuration

### DaisyUI Theme
A custom "naafe" theme is configured with:
- Primary: Deep Teal (`#2D5D4F`)
- Secondary: Text Secondary (`#50958a`)
- Accent: Bright Orange (`#F5A623`)
- Base colors: Warm Cream and Light Cream

## 📱 Component Architecture

### Core Components

#### Header Component
- **Props**: `onSearch?: (query: string) => void`, `searchValue?: string`
- **Features**: Navigation links, search bar, responsive mobile menu
- **Integration**: Handles search submission and navigation

#### CategoryCard Component
- **Props**: `category: ServiceCategory`, `onClick: (category: ServiceCategory) => void`
- **Features**: Displays category information with hover effects
- **Integration**: Navigates to search page with category filter

#### ServiceCard Component
- **Props**: `provider: ServiceProvider`, `onViewDetails: (providerId: string) => void`
- **Features**: Star ratings, location, pricing, and provider details
- **Integration**: Handles provider detail navigation

#### FilterSidebar Component
- **Props**: `filters: FilterOptions`, `onFiltersChange: (filters: FilterOptions) => void`
- **Features**: Category, location, price range, and rating filters
- **Integration**: Updates search results in real-time

### Custom Hooks

#### useFilters Hook
- Manages filter state for the category page
- Provides filter update and clear functionality
- Tracks active filter status

#### useSort Hook
- Handles category sorting logic
- Supports multiple sort options (popularity, price, newest)
- Returns sorted categories and sort options

#### useQueryParams Hook
- Manages URL query parameters
- Provides utilities for getting, setting, and clearing parameters
- Maintains URL state for sharing and navigation

## 🔄 Data Flow

### Category Page Flow
1. User visits `/categories`
2. Categories are loaded and displayed with filters
3. User can filter, sort, or search categories
4. Clicking a category navigates to `/search?category=<category>`

### Search Page Flow
1. User visits `/search` with or without query parameters
2. URL parameters are parsed and applied as filters
3. Service providers are filtered based on criteria
4. Results are displayed in a responsive grid
5. User can modify filters to refine results

### Search Integration
- **Header Search**: Global search bar in header
- **Category Navigation**: Direct navigation from category cards
- **URL State**: Search parameters maintained in URL
- **Filter Persistence**: Filters persist across navigation

## 🎯 Key Features Implementation

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive grid layouts for categories and search results
- Collapsible navigation and filters on mobile

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

### Performance
- React.memo for component optimization
- useCallback for event handlers
- Efficient filtering and sorting algorithms
- Lazy loading ready structure

## 🔗 API Integration Ready

The application is structured to easily integrate with backend APIs:

### Data Interfaces
- `ServiceCategory` interface for category data
- `ServiceProvider` interface for provider data
- `FilterOptions` interface for search filters

### Integration Points
- Replace mock data with API calls
- Add authentication and user management
- Implement real-time search and filtering
- Add booking and messaging functionality

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Vercel will automatically detect the Vite configuration
3. Deploy with zero configuration

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure redirects for client-side routing

### Other Platforms
The application can be deployed to any static hosting platform that supports SPA routing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the component examples

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**