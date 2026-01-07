
export interface TrendData {
  time: string;
  interest: number;
}

export interface SearchQuery {
  term: string;
  category: string;
  region: string;
  timeframe: string;
  property: string;
}

export interface RelatedTopic {
  title: string;
  type: string;
  value: string;
  trend: 'rising' | 'top';
}

export interface RelatedQuery {
  query: string;
  value: string;
  trend: 'rising' | 'top';
}
