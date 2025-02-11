import { useState, useEffect, useMemo } from 'react';
import type { SearchResult, Person, Project, Event, Resource } from '../types/search';

// In production, this would be fetched from an API
const fetchSearchResults = async (query: string, filters: string[]) => {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&filters=${encodeURIComponent(JSON.stringify(filters))}`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const useSearchResults = (query: string, filters: string[]) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim() && filters.length === 0) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // In development, use mock data
        if (process.env.NODE_ENV === 'development') {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockResults = await import('./mockSearchData').then(m => m.default);
          setResults(mockResults);
        } else {
          // In production, use real API
          const data = await fetchSearchResults(query, filters);
          setResults(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, filters]);

  const groupedResults = useMemo(() => {
    return {
      people: results.filter((r): r is Person => r.type === 'person'),
      projects: results.filter((r): r is Project => r.type === 'project'),
      events: results.filter((r): r is Event => r.type === 'event'),
      resources: results.filter((r): r is Resource => r.type === 'resource')
    };
  }, [results]);

  return {
    results: groupedResults,
    isLoading,
    error
  };
};

export default useSearchResults;