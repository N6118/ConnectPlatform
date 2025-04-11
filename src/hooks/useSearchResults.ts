import { useState, useEffect, useMemo } from 'react';
import type { SearchResult, Person, Project, Event, Resource } from '../types/search';

// API call to search users
const fetchSearchResults = async (query: string, filters: string[], searchType: string) => {
  try {
    // Construct the query URL with proper formatting
    const encodedName = encodeURIComponent(query); // Encode the search query
    const url = `/api/search/user?role=${searchType.toUpperCase()}&name=${encodedName}`;
    
    // Add filters as query params if any exist
    const urlWithFilters = filters.length > 0 
      ? `${url}&filters=${encodeURIComponent(JSON.stringify(filters))}` 
      : url;
    
    console.log('Fetching search results from:', urlWithFilters);
    
    const response = await fetch(urlWithFilters);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Search API error:', response.status, errorText);
      throw new Error(`Search failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    // Handle different response formats
    if (Array.isArray(data)) {
      // Convert array of users to our SearchResult format
      return {
        people: data.map(user => ({
          id: user.id || String(Math.random()),
          type: 'person',
          title: user.name || user.fullName || 'Unknown',
          description: user.department || user.role || '',
          role: user.role || searchType,
          department: user.department || '',
          skills: user.skills || [],
          tags: user.tags || [],
          timestamp: new Date().toISOString(),
          imageUrl: user.imageUrl || user.avatar || undefined
        })),
        projects: [],
        events: [],
        resources: []
      };
    }
    
    // If already in the expected format, return it; otherwise provide a default structure
    if (data && typeof data === 'object') {
      // Ensure we have all required properties with defaults
      return {
        people: Array.isArray(data.people) ? data.people : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        events: Array.isArray(data.events) ? data.events : [],
        resources: Array.isArray(data.resources) ? data.resources : []
      };
    }
    
    // If response format is completely unexpected, return empty results
    return { people: [], projects: [], events: [], resources: [] };
  } catch (error) {
    console.error('Search error:', error);
    // Return empty results on error
    return { people: [], projects: [], events: [], resources: [] };
  }
};

export const useSearchResults = (query: string, filters: string[], searchType: string | null) => {
  const [results, setResults] = useState<{
    people: Person[];
    projects: Project[];
    events: Event[];
    resources: Resource[];
  }>({
    people: [],
    projects: [],
    events: [],
    resources: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      // Required: query and searchType
      if (!query.trim() || !searchType) {
        setResults({
          people: [],
          projects: [],
          events: [],
          resources: []
        });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Try to get search results
        const data = await fetchSearchResults(query, filters, searchType);
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setResults({
          people: [],
          projects: [],
          events: [],
          resources: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, filters, searchType]);

  return {
    results,
    isLoading,
    error
  };
};

export default useSearchResults;