# News App Architecture

## Component Hierarchy

```
NewsScreen (news.tsx)
├── State Management
│   ├── displayMode: 'list' | 'card'
│   ├── fontSize: 12-24
│   └── useNews() hook
│       ├── newsData: Record<string, NewsItem[]>
│       ├── selectedSources: Set<string>
│       ├── loading: boolean
│       ├── lastUpdate: Date | null
│       ├── searchQuery: string
│       └── error: string | null
│
├── NewsSourceSelector
│   ├── Props: selectedSources, onToggleSource
│   └── Renders: Horizontal ScrollView with logo buttons
│
├── NewsControls
│   ├── Props: searchQuery, displayMode, fontSize, etc.
│   ├── Search bar (TextInput)
│   ├── Mode switcher (List/Card buttons)
│   ├── Font size controls (A+/A-)
│   └── Refresh button with timestamp
│
└── NewsList
    ├── Props: news[], displayMode, loading, onRefresh
    ├── FlatList (virtualized)
    │   └── NewsCard (for each item)
    │       ├── Props: item, mode, isHebrew
    │       ├── Header: source + time
    │       ├── Title (with text direction)
    │       ├── Description (expandable in list mode)
    │       ├── Image (in card mode)
    │       └── Read more link
    └── RefreshControl
```

## Data Flow

```
User Action → Component → Hook → API → State → Re-render

Examples:

1. Toggle Source:
   [User taps logo]
   → NewsSourceSelector.onToggleSource('bbc')
   → useNews.toggleSource('bbc')
   → If selecting: fetch('/bbc')
   → Update newsData state
   → NewsList re-renders with new data

2. Search:
   [User types in search]
   → NewsControls.onSearchChange('biden')
   → useNews.setSearchQuery('biden')
   → getFilteredNews() recomputes
   → NewsList receives filtered news
   → Re-renders with matching items

3. Refresh:
   [User pulls down]
   → NewsList.onRefresh()
   → useNews.refreshNews()
   → Fetches all selected sources
   → Updates newsData + lastUpdate
   → Loading state toggles
   → NewsList re-renders
```

## State Management Flow

```
┌─────────────────────────────────────────────────────┐
│                    useNews Hook                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Local State:                                       │
│  ├── newsData: Record<string, NewsItem[]>         │
│  ├── selectedSources: Set<string>                  │
│  ├── loading: boolean                              │
│  ├── lastUpdate: Date | null                       │
│  ├── searchQuery: string                           │
│  └── error: string | null                          │
│                                                     │
│  Actions:                                           │
│  ├── fetchNewsForSource(source)                    │
│  ├── fetchAllNews()                                │
│  ├── toggleSource(id)                              │
│  ├── setSearchQuery(query)                         │
│  └── refreshNews()                                 │
│                                                     │
│  Computed Values:                                   │
│  ├── getAllNews() → NewsItem[]                     │
│  └── getFilteredNews() → NewsItem[]                │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## API Integration

```
Client (App)                  Server
     │                           │
     │  GET /bbc                │
     ├──────────────────────────>│
     │                           │
     │  [{ title, description,   │
     │     link, pubDate,        │
     │     imageUrl }]           │
     │<──────────────────────────┤
     │                           │
     │  Store in newsData['bbc'] │
     │                           │
     │  GET /ynet               │
     ├──────────────────────────>│
     │                           │
     │  [NewsItem[]]             │
     │<──────────────────────────┤
     │                           │
     │  Store in newsData['ynet']│
     │                           │
     │  ... (for all selected)   │
     │                           │
     │  Merge & Sort by date     │
     │  Display in FlatList      │
     │                           │
```

## Component Communication

```
┌─────────────────────────────────────────────┐
│               NewsScreen                    │
│  (Orchestrator - manages state)             │
└──────────┬──────────┬──────────┬───────────┘
           │          │          │
           ▼          ▼          ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Selector │ │ Controls │ │   List   │
    │          │ │          │ │          │
    │ Props:   │ │ Props:   │ │ Props:   │
    │ • sources│ │ • query  │ │ • news[] │
    │ • toggle │ │ • mode   │ │ • mode   │
    │          │ │ • refresh│ │ • loading│
    └──────────┘ └──────────┘ └────┬─────┘
                                    │
                                    ▼
                            ┌──────────────┐
                            │   NewsCard   │
                            │              │
                            │ Props:       │
                            │ • item       │
                            │ • mode       │
                            │ • isHebrew   │
                            └──────────────┘
```

## Type System

```typescript
// Core Types
NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  imageUrl?: string
  newsType: string
}

NewsSource {
  id: string
  name: string
  endpoint: string
  logoUrl: string
  isHebrew: boolean
}

DisplayMode = 'list' | 'card'

// State Shape
AppState {
  newsData: {
    'bbc': NewsItem[],
    'ynet': NewsItem[],
    ...
  }
  selectedSources: Set<'bbc', 'ynet', ...>
  loading: boolean
  lastUpdate: Date | null
  searchQuery: string
  error: string | null
}
```

## Rendering Pipeline

```
1. User opens News tab
   └─> NewsScreen mounts
       └─> useNews() initializes
           └─> useEffect runs
               └─> fetchAllNews()
                   └─> For each selected source:
                       └─> fetch(API_URL/endpoint)
                           └─> Update newsData state

2. State updates trigger re-render
   └─> NewsScreen renders with new data
       ├─> NewsSourceSelector (sources)
       ├─> NewsControls (search, buttons)
       └─> NewsList (filtered news)
           └─> FlatList renders visible items
               └─> NewsCard for each visible item

3. User scrolls
   └─> FlatList virtualizes
       └─> Unmounts off-screen items
       └─> Mounts newly visible items
           └─> Smooth, performant scrolling

4. User searches "biden"
   └─> NewsControls.onSearchChange
       └─> setSearchQuery('biden')
           └─> getFilteredNews() recomputes
               └─> NewsList re-renders
                   └─> Only matching items shown

5. User pulls to refresh
   └─> NewsList.onRefresh
       └─> useNews.refreshNews()
           └─> loading = true
           └─> fetchAllNews()
           └─> loading = false
           └─> lastUpdate = new Date()
           └─> Re-render with fresh data
```

## Performance Optimizations

```
1. FlatList Virtualization
   • Only renders visible items
   • Recycles components
   • Handles thousands of items

2. useCallback
   • Stable function references
   • Prevents unnecessary re-renders
   • Used in useNews hook

3. useMemo (implicitly via callbacks)
   • getFilteredNews computed on demand
   • Only recalculates when dependencies change

4. Promise.allSettled
   • Parallel API calls
   • Doesn't fail fast
   • Better error handling

5. Conditional Rendering
   • Loading states
   • Empty states
   • Error boundaries
```

## Error Handling Strategy

```
API Call
   │
   ├─ Success ──> Update newsData
   │
   ├─ Network Error ──> Catch in try/catch
   │                    └─> Add to errors[]
   │                    └─> Display error message
   │                    └─> Keep partial data
   │
   └─ Invalid Data ──> Validate with TypeScript
                       └─> Type guards
                       └─> Fallback values
                       └─> User feedback
```

## Best Practices Applied

✅ **Single Responsibility**: Each component does one thing
✅ **DRY**: Reusable components and hooks
✅ **Type Safety**: Full TypeScript coverage
✅ **Performance**: FlatList, callbacks, virtualization
✅ **UX**: Loading states, error messages, pull-to-refresh
✅ **Accessibility**: Touch targets, contrast, RTL support
✅ **Maintainability**: Clear structure, documented code
✅ **Testability**: Pure functions, separated concerns
