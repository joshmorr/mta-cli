interface FeedEndpoints {
  static: string;
  realtime: string;
  alerts: string;
}

interface FeedConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  endpoints: FeedEndpoints;
}

export interface FeedsConfig {
  baseUrls: {
    static: string;
    realtime: string;
  };
  feeds: Record<string, FeedConfig>;
}
