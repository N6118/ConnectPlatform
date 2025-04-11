import { api, ApiResponse } from './api';

/**
 * Interface for event data
 */
export interface Event {
  id: number;
  title: string;
  natureOfEvent: string;
  typeOfEvent: string;
  theme: string[];
  fundingAgency: string;
  dates: {
    start: string;
    end: string;
  };
  location: string;
  registrationLink?: string;
  chiefGuest: string;
  otherSpeakers: string[];
  participantsCount: number;
  highlights: string;
  isCompleted?: boolean;
}

/**
 * Interface for creating a new event
 */
export interface CreateEventData {
  title: string;
  natureOfEvent: string;
  typeOfEvent: string;
  theme: string[];
  fundingAgency: string;
  dates: {
    start: string;
    end: string;
  };
  location: string;
  registrationLink?: string;
  chiefGuest: string;
  otherSpeakers: string[];
  participantsCount: number;
  highlights?: string;
  isCompleted?: boolean;
}

/**
 * Interface for event search parameters
 */
export interface EventSearchParams {
  searchTerm?: string;
  typeOfEvent?: string;
  natureOfEvent?: string;
  page?: number;
  limit?: number;
  isCompleted?: boolean;
}

/**
 * Interface for event statistics data
 */
export interface EventStatistics {
  totalEvents: number;
  totalParticipants: number;
  eventsByType: Record<string, number>;
  eventsByNature: Record<string, number>;
}

/**
 * Transform raw API event data to format dates properly
 */
export const transformEvent = (event: Event): Event => ({
  ...event,
  dates: {
    start: new Date(event.dates.start).toLocaleDateString(),
    end: new Date(event.dates.end).toLocaleDateString(),
  }
});

/**
 * Event service methods
 */
export const eventService = {
  /**
   * Get all events with pagination
   */
  getAllEvents: async (page: number = 1, limit: number = 10): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<Event[]>(`events?page=${page}&limit=${limit}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformEvent)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get events',
    };
  },

  /**
   * Get event by ID
   */
  getEventById: async (id: number): Promise<ApiResponse<Event>> => {
    const response = await api.get<Event>(`events/${id}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformEvent(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get event',
    };
  },

  /**
   * Create a new event
   */
  createEvent: async (eventData: CreateEventData): Promise<ApiResponse<Event>> => {
    const response = await api.post<Event>('events', eventData);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformEvent(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to create event',
    };
  },

  /**
   * Update an event
   */
  updateEvent: async (id: number, eventData: Partial<CreateEventData>): Promise<ApiResponse<Event>> => {
    const response = await api.put<Event>(`events/${id}`, eventData);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: transformEvent(response.data)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to update event',
    };
  },

  /**
   * Delete an event
   */
  deleteEvent: async (id: number): Promise<ApiResponse<void>> => {
    return api.delete(`events/${id}`);
  },

  /**
   * Search events
   */
  searchEvents: async (params: EventSearchParams): Promise<ApiResponse<Event[]>> => {
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    }
    
    const queryString = queryParams.toString();
    const endpoint = `events/search${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<Event[]>(endpoint);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformEvent)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to search events',
    };
  },

  /**
   * Get events by type
   */
  getEventsByType: async (typeOfEvent: string, page: number = 1, limit: number = 10): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<Event[]>(`events/type/${typeOfEvent}?page=${page}&limit=${limit}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformEvent)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get events by type',
    };
  },

  /**
   * Get events by nature
   */
  getEventsByNature: async (natureOfEvent: string, page: number = 1, limit: number = 10): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<Event[]>(`events/nature/${natureOfEvent}?page=${page}&limit=${limit}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformEvent)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get events by nature',
    };
  },

  /**
   * Get upcoming events
   */
  getUpcomingEvents: async (page: number = 1, limit: number = 10): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<Event[]>(`events/upcoming?page=${page}&limit=${limit}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformEvent)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get upcoming events',
    };
  },

  /**
   * Get completed events
   */
  getCompletedEvents: async (page: number = 1, limit: number = 10): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<Event[]>(`events/completed?page=${page}&limit=${limit}`);
    
    if (response.success && response.data) {
      return {
        ...response,
        data: response.data.map(transformEvent)
      };
    }
    
    return {
      success: false,
      error: response.error || 'Failed to get completed events',
    };
  },

  /**
   * Get event statistics
   */
  getEventStatistics: async (): Promise<ApiResponse<EventStatistics>> => {
    return api.get<EventStatistics>('events/statistics');
  },
}; 