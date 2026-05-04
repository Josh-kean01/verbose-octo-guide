// YouTube Video Metadata Extraction Service
import { scrapeYouTubeMetadata } from "./scraper";

export interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  category: string;
  tags: string[];
  viewCount: string;
  likeCount: string;
  commentCount: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    standard?: string;
    maxres?: string;
  };
  embedUrl: string;
  isMockData?: boolean;
}

// Categories mapping for YouTube
export const YOUTUBE_CATEGORIES: Record<string, string> = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "18": "Short Movies",
  "19": "Travel & Events",
  "20": "Gaming",
  "21": "Videoblogging",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism",
  "30": "Movies",
  "31": "Anime/Animation",
  "32": "Action/Adventure",
  "33": "Classics",
  "34": "Comedy",
  "35": "Documentary",
  "36": "Drama",
  "37": "Family",
  "38": "Foreign",
  "39": "Horror",
  "40": "Sci-Fi/Fantasy",
  "41": "Thriller",
  "42": "Shorts",
  "43": "Shows",
  "44": "Trailers",
};

// Mock data for demo purposes
export const MOCK_VIDEOS: Record<string, VideoMetadata> = {
  "dQw4w9WgXcQ": {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    description: `The official video for “Never Gonna Give You Up” by Rick Astley.

Subscribe to the official Rick Astley YouTube channel: https://RickAstley.lnk.to/YTSubID

Follow Rick Astley:
Facebook: https://RickAstley.lnk.to/FBID
Twitter: https://RickAstley.lnk.to/TWID
Instagram: https://RickAstley.lnk.to/IGID

#RickAstley #NeverGonnaGiveYouUp #MusicVideo`,
    publishedAt: "2009-10-25T06:57:33Z",
    channelId: "UCuAXFkgKe1R80vDe7LD99eA",
    channelTitle: "Rick Astley",
    category: "Music",
    tags: [
      "Rick Astley",
      "Never Gonna Give You Up",
      "Music Video",
      "Official Music Video",
      "Rick Roll",
      "Rickroll",
      "Dance Pop",
      "80s Hits",
      "Retro Pop",
      "Classic Hits"
    ],
    viewCount: "1512395811",
    likeCount: "17200000",
    commentCount: "1400000",
    thumbnails: {
      default: "https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg",
      medium: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      high: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      standard: "https://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg",
      maxres: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isMockData: true,
  },
  "EngW7tLk6R8": {
    id: "EngW7tLk6R8",
    title: "Apple Vision Pro Review: The Magic and the Madness!",
    description: `Apple Vision Pro is finally here. After a week of testing, here is the good, the bad, and the weird.

0:00 Intro
1:23 The Hardware
4:12 The Display
6:45 Personas
9:20 The Magic
13:50 The Madness
19:10 Conclusion

#AppleVisionPro #MKBHD #VisionPro`,
    publishedAt: "2024-02-09T18:00:10Z",
    channelId: "UCBJycsmduvYELg8RUMz2uvA",
    channelTitle: "Marques Brownlee",
    category: "Science & Technology",
    tags: [
      "Apple Vision Pro",
      "Vision Pro Review",
      "MKBHD",
      "Marques Brownlee",
      "Spatial Computing",
      "Tech Review",
      "Apple",
      "VR",
      "AR",
      "Headset",
      "Review",
      "Gadgets"
    ],
    viewCount: "8450123",
    likeCount: "320000",
    commentCount: "28000",
    thumbnails: {
      default: "https://img.youtube.com/vi/EngW7tLk6R8/default.jpg",
      medium: "https://img.youtube.com/vi/EngW7tLk6R8/mqdefault.jpg",
      high: "https://img.youtube.com/vi/EngW7tLk6R8/hqdefault.jpg",
      standard: "https://img.youtube.com/vi/EngW7tLk6R8/sddefault.jpg",
      maxres: "https://img.youtube.com/vi/EngW7tLk6R8/maxresdefault.jpg",
    },
    embedUrl: "https://www.youtube.com/embed/EngW7tLk6R8",
    isMockData: true,
  }
};

/**
 * Extracts YouTube Video ID from any standard URL format
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null;
  
  // Clean URL
  const trimmed = url.trim();
  
  // Regex patterns
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?\s]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?\s]+)/,
    /^[a-zA-Z0-9_-]{11}$/ // Direct ID
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    } else if (pattern.source === '^[a-zA-Z0-9_-]{11}$' && pattern.test(trimmed)) {
      return trimmed;
    }
  }

  return null;
}

/**
 * Fetches basic info via oEmbed (No API Key required)
 */
export async function fetchOEmbedData(videoId: string): Promise<Partial<VideoMetadata>> {
  try {
    // We use noembed.com which provides robust CORS-free oEmbed data for YouTube
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    if (!response.ok) throw new Error("Failed to fetch oEmbed data");
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);

    return {
      id: videoId,
      title: data.title || "Unknown Title",
      channelTitle: data.author_name || "Unknown Creator",
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnails: {
        default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
        medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      }
    };
  } catch (error) {
    console.error("oEmbed fetch failed:", error);
    // Return minimum usable state based on ID
    return {
      id: videoId,
      title: `YouTube Video (${videoId})`,
      channelTitle: "Unknown Channel",
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnails: {
        default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
        medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      }
    };
  }
}

/**
 * Fetches complete data from YouTube API v3 (API Key required)
 */
export async function fetchYouTubeApiData(videoId: string, apiKey: string): Promise<VideoMetadata> {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "YouTube API Error");
  }

  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error("Video not found. Check the URL and privacy settings.");
  }

  const item = data.items[0];
  const snippet = item.snippet;
  const stats = item.statistics;

  return {
    id: videoId,
    title: snippet.title || "",
    description: snippet.description || "",
    publishedAt: snippet.publishedAt || "",
    channelId: snippet.channelId || "",
    channelTitle: snippet.channelTitle || "",
    category: YOUTUBE_CATEGORIES[snippet.categoryId] || "Unknown Category",
    tags: snippet.tags || [],
    viewCount: stats.viewCount || "0",
    likeCount: stats.likeCount || "0",
    commentCount: stats.commentCount || "0",
    thumbnails: {
      default: snippet.thumbnails?.default?.url || `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium: snippet.thumbnails?.medium?.url || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high: snippet.thumbnails?.high?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      standard: snippet.thumbnails?.standard?.url || `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      maxres: snippet.thumbnails?.maxres?.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    },
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    isMockData: false,
  };
}

/**
 * Main function to retrieve video data
 */
export async function getVideoData(videoId: string, apiKey?: string): Promise<VideoMetadata> {
  // Check if it matches mock data
  if (!apiKey && MOCK_VIDEOS[videoId]) {
    return MOCK_VIDEOS[videoId];
  }

  if (apiKey) {
    return fetchYouTubeApiData(videoId, apiKey);
  } else {
    try {
      // Use advanced scraper
      const scraped = await scrapeYouTubeMetadata(videoId);
      return {
        ...scraped,
        channelId: "",
        isMockData: false
      };
    } catch (e) {
      console.warn("Direct scraping failed, falling back to oEmbed:", e);
      // Fallback to oEmbed for basic details
      const oEmbed = await fetchOEmbedData(videoId);
      return {
        id: videoId,
        title: oEmbed.title || "",
        description: "Scraping failed. Insert an API Key above for reliable fetching.",
        publishedAt: new Date().toISOString(),
        channelId: "",
        channelTitle: oEmbed.channelTitle || "",
        category: "Unknown",
        tags: [],
        viewCount: "N/A",
        likeCount: "N/A",
        commentCount: "N/A",
        thumbnails: oEmbed.thumbnails || {
          default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
          medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        },
        embedUrl: oEmbed.embedUrl || `https://www.youtube.com/embed/${videoId}`,
        isMockData: true
      };
    }
  }
}
