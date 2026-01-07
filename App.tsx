
import React, { useState, useEffect } from 'react';
import { SearchQuery, TrendData, RelatedTopic, RelatedQuery } from './types';
import { getTrendInsights, getRelatedData } from './services/trendService';
import TrendChart from './components/TrendChart';

const App: React.FC = () => {
  const [query, setQuery] = useState<SearchQuery>({
    term: 'Indonesia',
    category: 'Arts & Entertainment',
    region: 'Indonesia',
    timeframe: 'Past day',
    property: 'YouTube Search'
  });

  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [relatedTopics, setRelatedTopics] = useState<RelatedTopic[]>([]);
  const [relatedQueries, setRelatedQueries] = useState<RelatedQuery[]>([]);
  const [insights, setInsights] = useState<string>(''); // New state for insights
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query.term);

  const fetchData = async (currentQuery: SearchQuery) => {
    setLoading(true);
    setInsights(''); // Clear insights on new fetch
    setRelatedTopics([]); // Clear related data on new fetch
    setRelatedQueries([]); // Clear related data on new fetch

    try {
      // Simulasi fluktuasi data berdasarkan parameter
      const baseInterest = currentQuery.timeframe === 'Past hour' ? 80 : 40;
      const mockTrend: TrendData[] = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        interest: Math.floor(Math.random() * 30) + (i > 15 ? baseInterest : 20)
      }));
      setTrendData(mockTrend);

      // Fetch AI-generated insights
      const fetchedInsights = await getTrendInsights(currentQuery.term);
      setInsights(fetchedInsights);

      // Fetch AI-generated related data
      const related = await getRelatedData(currentQuery.term);
      setRelatedTopics(related.topics);
      setRelatedQueries(related.queries);

    } catch (error) {
      console.error("Error fetching data:", error);
      setInsights("Failed to load insights. Please try again.");
      setRelatedTopics([
        { title: "Fallback Topic A", type: "Topic", value: "Breakout", trend: "rising" },
        { title: "Fallback Topic B", type: "Topic", value: "120", trend: "rising" }
      ]);
      setRelatedQueries([
        { query: "Fallback Query X", value: "Breakout", trend: "rising" },
        { query: "Fallback Query Y", value: "80", trend: "rising" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(query);
  }, [query.term, query.region, query.timeframe, query.category, query.property]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setQuery(prev => ({ ...prev, term: searchInput }));
    }
  };

  const updateFilter = (key: keyof SearchQuery, value: string) => {
    setQuery(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar */}
      <nav className="nav-border flex items-center h-16 px-4 justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full text-[#5f6368]">
            <i className="fas fa-bars text-lg"></i>
          </button>
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => window.location.reload()}>
            <span className="text-[#4285F4] text-2xl font-medium tracking-tight">Google</span>
            <span className="text-[#5f6368] text-2xl font-normal tracking-tight">Trends</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-2xl mx-10">
          <form onSubmit={handleSearch} className="w-full relative group">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-12 px-12 py-2 bg-[#f1f3f4] border-none rounded-md focus:bg-white focus:shadow-md transition-all outline-none text-black text-base"
              placeholder="Explore"
            />
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#5f6368]"></i>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-[#5f6368]">
            <i className="fas fa-th text-lg"></i>
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-medium ml-2 cursor-default">
            A
          </div>
        </div>
      </nav>

      {/* Explore Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
                 <i className="fas fa-search text-blue-600"></i>
               </div>
               <div>
                 <h1 className="text-2xl font-normal text-[#202124]">{query.term}</h1>
                 <p className="text-xs text-[#70757a] uppercase tracking-wider font-medium">Search term</p>
               </div>
            </div>
            <div className="h-8 w-px bg-gray-300 hidden md:block"></div>
            <button className="text-blue-600 font-medium text-sm hover:bg-blue-50 px-4 py-2 rounded uppercase tracking-wide transition-colors">
              + Compare
            </button>
          </div>
        </div>

        {/* Filters Bar - Sekarang Interaktif */}
        <div className="max-w-7xl mx-auto px-4 flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
          <div className="relative group filter-item pb-3 pt-1">
            <select 
              value={query.region}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="appearance-none bg-transparent pr-5 text-sm font-medium text-[#5f6368] outline-none cursor-pointer focus:text-blue-600"
            >
              <option value="Indonesia">Indonesia</option>
              <option value="United States">United States</option>
              <option value="Worldwide">Worldwide</option>
            </select>
            <i className="fas fa-caret-down absolute right-0 top-1/2 -translate-y-full text-[10px] text-[#5f6368] pointer-events-none"></i>
            {query.region !== 'Indonesia' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
            {query.region === 'Indonesia' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>}
          </div>

          <div className="relative group filter-item pb-3 pt-1">
            <select 
              value={query.timeframe}
              onChange={(e) => updateFilter('timeframe', e.target.value)}
              className="appearance-none bg-transparent pr-5 text-sm font-medium text-[#5f6368] outline-none cursor-pointer focus:text-blue-600"
            >
              <option value="Past hour">Past hour</option>
              <option value="Past day">Past day</option>
              <option value="Past 7 days">Past 7 days</option>
              <option value="Past 30 days">Past 30 days</option>
            </select>
            <i className="fas fa-caret-down absolute right-0 top-1/2 -translate-y-full text-[10px] text-[#5f6368] pointer-events-none"></i>
          </div>

          <div className="relative group filter-item pb-3 pt-1">
            <select 
              value={query.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="appearance-none bg-transparent pr-5 text-sm font-medium text-[#5f6368] outline-none cursor-pointer focus:text-blue-600"
            >
              <option value="All categories">All categories</option>
              <option value="Arts & Entertainment">Arts & Entertainment</option>
              <option value="Games">Games</option>
              <option value="News">News</option>
            </select>
            <i className="fas fa-caret-down absolute right-0 top-1/2 -translate-y-full text-[10px] text-[#5f6368] pointer-events-none"></i>
          </div>

          <div className="relative group filter-item pb-3 pt-1">
            <select 
              value={query.property}
              onChange={(e) => updateFilter('property', e.target.value)}
              className="appearance-none bg-transparent pr-5 text-sm font-medium text-[#5f6368] outline-none cursor-pointer focus:text-blue-600"
            >
              <option value="Web Search">Web Search</option>
              <option value="Image Search">Image Search</option>
              <option value="YouTube Search">YouTube Search</option>
              <option value="Google Shopping">Google Shopping</option>
            </select>
            <i className="fas fa-caret-down absolute right-0 top-1/2 -translate-y-full text-[10px] text-[#5f6368] pointer-events-none"></i>
          </div>
        </div>
      </div>

      {/* Main Analysis Section */}
      <main className="max-w-7xl mx-auto px-4 py-8 bg-[#f8f9fa]">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 font-medium tracking-wide">Updating results...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Interest Over Time Card */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-[#202124] text-lg font-normal">Interest over time</h2>
                <div className="flex gap-2 text-[#5f6368]">
                   <button className="p-2 hover:bg-gray-100 rounded-full" title="Download"><i className="fas fa-download text-sm"></i></button>
                   <button className="p-2 hover:bg-gray-100 rounded-full" title="Share"><i className="fas fa-share-alt text-sm"></i></button>
                   <button className="p-2 hover:bg-gray-100 rounded-full" title="Embed"><i className="fas fa-code text-sm"></i></button>
                </div>
              </div>
              <div className="p-6">
                <TrendChart data={trendData} />
              </div>
            </div>

            {/* Key Insights & Predictions Card */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-[#202124] text-lg font-normal">Key Insights & Predictions</h2>
                <div className="flex gap-2 text-[#5f6368]">
                   <button className="p-2 hover:bg-gray-100 rounded-full" title="Download"><i className="fas fa-download text-sm"></i></button>
                   <button className="p-2 hover:bg-gray-100 rounded-full" title="Share"><i className="fas fa-share-alt text-sm"></i></button>
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#70757a] text-sm italic py-8">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
                    <span>Generating insights...</span>
                  </div>
                ) : (
                  <p className="text-base text-[#3c4043] leading-relaxed whitespace-pre-wrap">{insights || "No insights available for this query."}</p>
                )}
              </div>
            </div>

            {/* Related Data Grid - Berjejer Kesamping */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Related Topics Card */}
              <div className="bg-white rounded-sm border border-gray-200 shadow-sm flex flex-col min-h-[400px]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-[#202124] text-lg font-normal">Related topics</h2>
                  <div className="flex items-center gap-4 text-sm text-[#70757a]">
                    <span className="cursor-pointer font-medium text-blue-600 border-b border-blue-600">Rising</span>
                    <i className="fas fa-ellipsis-v cursor-pointer"></i>
                  </div>
                </div>
                <div className="flex-1 p-2">
                  {relatedTopics.length > 0 ? relatedTopics.slice(0, 5).map((topic, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded transition-colors group">
                      <span className="text-sm text-[#3c4043] truncate pr-4 group-hover:text-blue-600">{idx + 1}. {topic.title}</span>
                      <span className="text-sm font-medium text-[#70757a] whitespace-nowrap">{topic.value === 'Breakout' ? 'Breakout' : `+${topic.value}%`}</span>
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center text-[#70757a] text-sm italic">No data available</div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-100 text-center">
                  <button className="text-blue-600 text-xs font-bold uppercase tracking-wide hover:bg-blue-50 px-3 py-1 rounded">1-5 / {relatedTopics.length || 0} <i className="fas fa-chevron-right ml-2 text-[10px]"></i></button>
                </div>
              </div>

              {/* Related Queries Card */}
              <div className="bg-white rounded-sm border border-gray-200 shadow-sm flex flex-col min-h-[400px]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-[#202124] text-lg font-normal">Related queries</h2>
                  <div className="flex items-center gap-4 text-sm text-[#70757a]">
                    <span className="cursor-pointer font-medium text-blue-600 border-b border-blue-600">Rising</span>
                    <i className="fas fa-ellipsis-v cursor-pointer"></i>
                  </div>
                </div>
                <div className="flex-1 p-2">
                  {relatedQueries.length > 0 ? relatedQueries.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded transition-colors group">
                      <span className="text-sm text-[#3c4043] truncate pr-4 group-hover:text-blue-600">{idx + 1}. {item.query}</span>
                      <span className="text-sm font-medium text-[#70757a] whitespace-nowrap">{item.value === 'Breakout' ? 'Breakout' : `+${item.value}%`}</span>
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center text-[#70757a] text-sm italic">No data available</div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-100 text-center">
                  <button className="text-blue-600 text-xs font-bold uppercase tracking-wide hover:bg-blue-50 px-3 py-1 rounded">1-5 / {relatedQueries.length || 0} <i className="fas fa-chevron-right ml-2 text-[10px]"></i></button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[#70757a] text-sm">
           <div className="flex gap-6 mb-4 md:mb-0">
             <a href="#" className="hover:underline">Privacy</a>
             <a href="#" className="hover:underline">Terms</a>
             <a href="#" className="hover:underline">About Google</a>
             <a href="#" className="hover:underline">Google Products</a>
           </div>
           <div className="flex items-center gap-2">
             <i className="fas fa-question-circle"></i>
             <span>Help</span>
             <select className="ml-4 bg-transparent outline-none cursor-pointer hover:text-blue-600 transition-colors">
               <option>English</option>
               <option>Indonesia</option>
             </select>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
