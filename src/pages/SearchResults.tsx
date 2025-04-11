import React, { useState, useCallback, useEffect } from 'react';
import { Filter, Grid, List, Star, Calendar, Download, MessageSquare, UserPlus, ChevronRight, BookOpen, Users, Briefcase, UserCog, AlertCircle, User } from 'lucide-react';
import FilterSearch from '../components/FilterSearch';
import useSearchResults from '../hooks/useSearchResults';
import type { FilterOption } from '../types/search';
import { useLocation } from 'wouter';
import StudentNavbar from '../components/navigation/StudentNavbar';
import { Badge } from '@/components/ui/badge';

const SearchResults: React.FC = () => {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.includes('?') ? location.split('?')[1] : '');
  const query = urlParams.get('q') || '';
  const searchType = urlParams.get('type') as 'faculty' | 'student' | null;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  // Redirect if no query or search type
  useEffect(() => {
    if (!query || !searchType) {
      setLocation('/student');
    }
  }, [query, searchType, setLocation]);

  // Initial filter options
  const [filterOptions, setFilterOptions] = useState<{
    departments: FilterOption[];
    years: FilterOption[];
    skills: FilterOption[];
  }>({
    departments: [
      { id: 'cse', label: 'CSE', value: 'CSE', type: 'department' },
      { id: 'ece', label: 'ECE', value: 'ECE', type: 'department' },
      { id: 'me', label: 'ME', value: 'ME', type: 'department' },
      { id: 'civil', label: 'Civil', value: 'Civil', type: 'department' }
    ],
    years: Array.from({ length: 5 }, (_, i) => {
      const year = new Date().getFullYear() - i;
      return {
        id: year.toString(),
        label: year.toString(),
        value: year.toString(),
        type: 'year' as const
      };
    }),
    skills: [
      { id: 'python', label: 'Python', value: 'Python', type: 'skill' },
      { id: 'tensorflow', label: 'TensorFlow', value: 'TensorFlow', type: 'skill' },
      { id: 'cv', label: 'Computer Vision', value: 'Computer Vision', type: 'skill' },
      { id: 'ds', label: 'Data Science', value: 'Data Science', type: 'skill' }
    ]
  });

  const { results, isLoading, error } = useSearchResults(query, selectedFilters, searchType);

  // Log search parameters and results for debugging
  useEffect(() => {
    console.log('Search params:', { query, searchType, filters: selectedFilters });
    console.log('Search results:', results);
  }, [query, searchType, selectedFilters, results]);

  const toggleFilter = useCallback((filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const addCustomOption = useCallback((type: 'department' | 'year' | 'skill', value: string) => {
    const newOption: FilterOption = {
      id: value.toLowerCase(),
      label: value,
      value: value,
      type: type
    };

    setFilterOptions(prev => {
      switch (type) {
        case 'department':
          return { ...prev, departments: [...prev.departments, newOption] };
        case 'year':
          return { ...prev, years: [...prev.years, newOption] };
        case 'skill':
          return { ...prev, skills: [...prev.skills, newOption] };
      }
    });

    toggleFilter(value);
  }, [toggleFilter]);

  const filteredResults = React.useMemo(() => {
    if (selectedType === 'all') return results;

    const type = selectedType.toLowerCase();
    return {
      people: type === 'people' ? results.people : [],
      projects: type === 'projects' ? results.projects : [],
      events: type === 'events' ? results.events : [],
      resources: type === 'resources' ? results.resources : []
    };
  }, [results, selectedType]);

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
  };

  if (!searchType) {
    return (
      <>
        <StudentNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center p-4 text-amber-800 bg-amber-50 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>Please select a search type (faculty or student) to continue.</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <StudentNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">Error: {error}</p>
            <p className="text-sm text-red-600 mt-2">
              Please try again or contact support if the problem persists.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudentNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for "{query}"
              {searchType && (
                <span className="ml-2 inline-flex items-center">
                  <Badge className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800">
                    {searchType === "faculty" ? (
                      <Briefcase className="h-3 w-3 mr-1" />
                    ) : (
                      <User className="h-3 w-3 mr-1" />
                    )}
                    {searchType}
                  </Badge>
                </span>
              )}
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {Object.values(filteredResults).reduce((acc, curr) => acc + curr.length, 0)} results
            </span>
          </div>

          {/* Active Filters */}
          {selectedFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedFilters.map(filter => (
                <span
                  key={filter}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm"
                >
                  {filter}
                  <button
                    onClick={() => toggleFilter(filter)}
                    className="ml-2 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setSelectedFilters([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {['All', 'People', 'Projects', 'Events', 'Resources'].map((filter) => (
              <button
                key={filter}
                onClick={() => handleTypeFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedType.toLowerCase() === filter.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Panel */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Filters</h2>
                <Filter className="h-5 w-5 text-gray-400" />
              </div>

              {/* Department Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Department</h3>
                <FilterSearch
                  type="department"
                  options={filterOptions.departments}
                  selectedOptions={selectedFilters}
                  onToggleOption={toggleFilter}
                  onAddCustomOption={(value) => addCustomOption('department', value)}
                  placeholder="Search departments..."
                />
              </div>

              {/* Year Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Year</h3>
                <FilterSearch
                  type="year"
                  options={filterOptions.years}
                  selectedOptions={selectedFilters}
                  onToggleOption={toggleFilter}
                  placeholder="Enter year..."
                />
              </div>

              {/* Skills Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Skills</h3>
                <FilterSearch
                  type="skill"
                  options={filterOptions.skills}
                  selectedOptions={selectedFilters}
                  onToggleOption={toggleFilter}
                  onAddCustomOption={(value) => addCustomOption('skill', value)}
                  placeholder="Search skills..."
                />
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1">
            {/* View Options */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              <select className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Most Relevant</option>
                <option>Most Recent</option>
                <option>Most Popular</option>
              </select>
            </div>

            {/* Results Grid with Loading State */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
                <p className="text-center text-gray-500 mt-4">Loading results...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* People Section */}
                {filteredResults.people.length > 0 ? (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        People
                      </h2>
                      <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                        View all
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                      {filteredResults.people.map((person) => (
                        <div
                          key={person.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={person.imageUrl || "https://via.placeholder.com/40"}
                              alt={person.title}
                              className="h-12 w-12 rounded-full"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/40";
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-900">
                                {person.title}
                              </h3>
                              <p className="text-sm text-gray-500">{person.description}</p>
                              {person.role && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                                  {person.role}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : (
                  selectedType === 'all' || selectedType === 'people' ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No people found for your search criteria.</p>
                    </div>
                  ) : null
                )}

                {/* Projects Section */}
                {filteredResults.projects.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        Projects
                      </h2>
                      <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                        View all
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                      {filteredResults.projects.map((project) => (
                        <div
                          key={project.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <h3 className="text-sm font-medium text-gray-900">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {project.description}
                          </p>
                          <div className="mt-4 flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              project.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              Team Size: {project.teamSize}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Events Section */}
                {filteredResults.events.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Events
                      </h2>
                      <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                        View all
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                      {filteredResults.events.map((event) => (
                        <div
                          key={event.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <h3 className="text-sm font-medium text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(event.date).toLocaleDateString()} • {event.location}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Organizer: {event.organizer}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {event.spotsLeft} spots left
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Resources Section */}
                {filteredResults.resources.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Resources
                      </h2>
                      <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center">
                        View all
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                    <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                      {filteredResults.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                By {resource.author}
                              </p>
                            </div>
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Download className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              Downloads: {resource.downloads}
                            </span>
                            <span className="text-xs text-gray-500">
                              Rating: {resource.rating}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* No Results Message */}
                {Object.values(filteredResults).every(arr => arr.length === 0) && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <AlertCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-700 font-medium">No results found for your search criteria.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Try adjusting your filters or search terms.
                    </p>
                    <p className="text-xs text-gray-500 mt-4">
                      Search query: {query} | Type: {searchType} | Filters: {selectedFilters.join(', ') || 'None'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;