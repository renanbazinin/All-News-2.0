# News Component

A modern, feature-rich news aggregator component for React Native/Expo applications.

## Features

✨ **Multi-source News Aggregation**
- Fetches news from 9 different sources (BBC, NYT, Ynet, Maariv, N12, Rotter, Walla, Calcalist, Haaretz)
- Real-time news updates with pull-to-refresh
- Auto-refresh capability (optional)

🎨 **Flexible Display Modes**
- **List Mode**: Compact view with expandable items
- **Card Mode**: Visual cards with images

🔍 **Search & Filter**
- Real-time search across all news items
- Filter by title, description, or source

🌐 **Multi-language Support**
- RTL (Right-to-Left) support for Hebrew sources
- Automatic language detection

⚙️ **Customization**
- Adjustable font sizes (12px - 24px)
- Source selection/deselection
- Dark mode optimized

## Architecture

### Components Structure

```
components/news/
├── news-source-selector.tsx  # Horizontal scrollable source picker
├── news-card.tsx             # Individual news item (list/card view)
├── news-controls.tsx         # Search, mode switcher, refresh controls
└── news-list.tsx             # FlatList wrapper with loading states

app/(tabs)/
└── news.tsx                  # Main news screen (orchestrator)

hooks/
└── use-news.ts               # Custom hook for news data management

types/
└── news.ts                   # TypeScript interfaces and constants
```

### Key Design Patterns

**1. Custom Hook Pattern**
- `useNews()` encapsulates all data fetching, state management, and business logic
- Separates concerns between data and UI
- Easy to test and reuse

**2. Component Composition**
- Small, focused components with single responsibilities
- Props-based communication
- Easy to maintain and extend

**3. TypeScript First**
- Strongly typed interfaces for all data structures
- Type-safe props and state
- Better IDE support and error catching

**4. Performance Optimizations**
- `useCallback` for stable function references
- `FlatList` for efficient list rendering
- Memoized computed values (filtered news)

## Usage

```tsx
import NewsScreen from '@/app/(tabs)/news';

// The component is self-contained and manages its own state
export default function App() {
  return <NewsScreen />;
}
```

## API Integration

The component fetches news from: `https://allnews-server.onrender.com/{endpoint}`

Endpoints:
- `/bbc` - BBC News
- `/nyt` - New York Times
- `/ynet` - Ynet (Hebrew)
- `/maariv` - Maariv (Hebrew)
- `/n12` - N12 (Hebrew)
- `/rotter` - Rotter (Hebrew)
- `/walla` - Walla (Hebrew)
- `/calcalist` - Calcalist (Hebrew)
- `/haaretz` - Haaretz (Hebrew)

Expected API Response:
```typescript
{
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl?: string;
}[]
```

## Improvements Over Original HTML Version

### 1. **Type Safety**
- TypeScript interfaces prevent runtime errors
- Auto-completion and IntelliSense support
- Compile-time error detection

### 2. **Mobile-First Design**
- Native mobile components (TouchableOpacity, FlatList)
- Optimized for touch interactions
- Better performance on mobile devices

### 3. **Better State Management**
- React hooks for predictable state updates
- No global variables or DOM manipulation
- Centralized state in custom hook

### 4. **Improved UX**
- Pull-to-refresh gesture
- Native loading indicators
- Smooth animations and transitions
- Better error handling

### 5. **Code Organization**
- Modular component structure
- Separation of concerns
- Easier to test and maintain

### 6. **Accessibility**
- Proper semantic elements
- Touch target sizes
- Screen reader support (expandable)

### 7. **Cross-Platform**
- Works on iOS, Android, and Web
- Consistent UI across platforms
- Platform-specific optimizations

## Customization

### Change API Endpoint
Edit `hooks/use-news.ts`:
```typescript
const API_BASE_URL = 'https://your-api-endpoint.com';
```

### Add New Source
Edit `types/news.ts`:
```typescript
export const NEWS_SOURCES: NewsSource[] = [
  // ... existing sources
  {
    id: 'new-source',
    name: 'New Source',
    endpoint: 'new-endpoint',
    logoUrl: 'https://...',
    isHebrew: false,
  },
];
```

### Customize Colors
Edit component styles or create a theme file:
```typescript
const theme = {
  primary: '#007AFF',
  background: '#0a0a0a',
  card: '#1e1e1e',
  // ... more colors
};
```

## Performance Considerations

- **Lazy Loading**: FlatList only renders visible items
- **Async Operations**: All API calls are non-blocking
- **Error Boundaries**: Graceful error handling without crashes
- **Memory Management**: Automatic cleanup of subscriptions

## Future Enhancements

- [ ] Offline support with caching
- [ ] Save favorite articles
- [ ] Share articles
- [ ] Push notifications for breaking news
- [ ] Category filtering
- [ ] Date range selection
- [ ] Dark/Light theme toggle
- [ ] Analytics integration

## License

This component is based on the original Renan News web application and converted to React Native with modern best practices.
