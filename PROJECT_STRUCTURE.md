# Affiliate Web - Project Structure

## Clean Architecture Implementation

This project follows Clean Architecture principles with clear separation of concerns:

```
src/
├── domain/                 # Business logic layer
│   ├── entities/          # Core business entities
│   │   ├── Offer.ts       # Offer entity
│   │   └── Deeplink.ts    # Deeplink entity
│   └── repositories/      # Repository interfaces
│       ├── IOfferRepository.ts
│       └── IDeeplinkRepository.ts
│
├── data/                  # Data layer
│   ├── dto/              # Data Transfer Objects
│   │   ├── OfferDTO.ts
│   │   └── DeeplinkDTO.ts
│   ├── mappers/          # DTO to Entity mappers
│   │   └── OfferMapper.ts
│   ├── repositories/     # Repository implementations
│   │   ├── OfferRepositoryImpl.ts
│   │   └── DeeplinkRepositoryImpl.ts
│   └── mockData.ts       # Mock data for development
│
├── di/                   # Dependency Injection
│   └── container.ts      # DI Container
│
├── api/                  # API layer
│   └── mockServer.ts     # Mock API server
│
├── stores/               # State management (Pinia)
│   ├── offerStore.ts
│   └── deeplinkStore.ts
│
└── views/                # UI layer
    ├── HomeView.vue      # Home page with offer grid
    └── OfferDetailView.vue # Offer detail page
```

## Features

### 1. Home Page
- **Gradient Background**: Purple to blue gradient (667eea → 764ba2 → 4facfe)
- **Header**: Search bar, register button, language selector
- **Categories**: Marketplace, Travel, Fashion, Electronics, Kecantikan
- **Offer Grid**: Displays all offers with logos and categories
- **Click to Detail**: Navigate to offer detail page

### 2. Offer Detail Page
- **Hero Section**: Gradient background with offer logo
- **Cashback Information**: Dynamic cashback rates by category
- **Timeline**: Visual timeline showing:
  - Pembelian (Purchase)
  - Dilacak dalam (Tracked in X days)
  - Terkonfirmasi dalam (Confirmed in X days)
- **Terms & Exclusions**: Expandable section with exclusions
- **Generate Deeplink**: Button to generate and open deeplink

### 3. API Routes

#### GET /api/offers?page=1
Returns list of offers with pagination

#### POST /api/deeplink/generate
Generates deeplink for an offer
```json
{
  "offer_id": 5032,
  "url": "https://shopee.com.my",
  "user_id": "abcd"
}
```

Response:
```json
{
  "deeplink": "https://tracking.example.com/deeplink/5032/abcd",
  "offer_id": 5032,
  "status": "success"
}
```

## Technology Stack

- **Vue 3**: Composition API with `<script setup>`
- **TypeScript**: Full type safety
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **Vite**: Build tool and dev server

## Running the Project

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Type check
bun run type-check

# Lint
bun lint
```

## Design Highlights

- **Modern UI**: Clean, card-based design
- **Gradient Backgrounds**: Purple-blue gradient matching reference
- **Responsive**: Mobile-first design
- **Smooth Animations**: Hover effects and transitions
- **Accessible**: Semantic HTML and ARIA labels

## Mock Data

The application uses mock data for development. The mock API intercepts fetch requests to `/api/*` endpoints and returns dummy data. This allows full functionality without a backend server.

## Future Enhancements

- Real API integration
- User authentication
- Search functionality
- Category filtering
- Pagination
- Favorites/bookmarks
- Transaction history
