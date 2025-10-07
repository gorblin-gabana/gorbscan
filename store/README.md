# Blockchain Store (Zustand)

This store manages caching for blockchain data (transactions and addresses) to improve performance and reduce API calls.

## Features

- **Automatic Caching**: Transactions and addresses are automatically cached after fetching
- **Cache Validation**: Data is cached for 5 minutes by default
- **Persistent Storage**: Cache persists across page reloads using localStorage
- **Instant Loading**: Cached data is shown immediately while fresh data loads in background

## Usage

### In Components

```typescript
import { useBlockchainStore } from '@/store/useBlockchainStore';

// Get cached transaction
const { getTransaction, setTransaction } = useBlockchainStore();

const cached = getTransaction(signature);
if (cached) {
  // Use cached data instantly
  setData(cached.data);
} else {
  // Fetch from API and cache
  const data = await fetchFromAPI();
  setTransaction(signature, data);
}
```

## Cache Management

- **Cache Duration**: 5 minutes (configurable via `CACHE_MAX_AGE`)
- **Clear Cache**: Use `clearCache()` to manually clear all cached data
- **Storage**: Data is persisted in localStorage under the key `blockchain-storage`

## Benefits

1. **Faster Navigation**: Revisiting transactions/addresses shows data instantly
2. **Reduced API Calls**: Less load on backend servers
3. **Better UX**: Users see "Cached" badge when viewing cached data
4. **Offline Support**: Previously viewed data available even when offline
