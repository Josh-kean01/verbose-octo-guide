// Scrapes YouTube Video Metadata via allorigins.win (No API Key needed)

export interface ScrapedVideoMetadata {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
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
}

/**
 * Clean strings extracted from raw JSON
 */
function cleanText(text: string): string {
  if (!text) return "";
  try {
    return text.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\r/g, "");
  } catch {
    return text;
  }
}

/**
 * Attempts to parse the complete Video Metadata by extracting raw YouTube HTML content
 * via the AllOrigins CORS-free proxy.
 */
export async function scrapeYouTubeMetadata(videoId: string): Promise<ScrapedVideoMetadata> {
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(watchUrl)}`;

  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch page data via cross-origin proxy.");
  }

  const json = await response.json();
  const htmlContent = json.contents;

  if (!htmlContent) {
    throw new Error("Proxy did not return valid web content.");
  }

  // 1. Title
  let title = "Unknown Title";
  const titleMatch = htmlContent.match(/<meta\s+name="title"\s+content="([^"]+)"/) || 
                     htmlContent.match(/<title>([^<]+)<\/title>/);
  if (titleMatch && titleMatch[1]) {
    title = cleanText(titleMatch[1].replace(" - YouTube", ""));
  }

  // 2. Description
  let description = "No description found.";
  const descMatch = htmlContent.match(/"shortDescription":"([^"]+)"/) ||
                    htmlContent.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  if (descMatch && descMatch[1]) {
    description = cleanText(descMatch[1]);
  }

  // 3. Tags / Keywords
  let tags: string[] = [];
  const tagsMatch = htmlContent.match(/<meta\s+name="keywords"\s+content="([^"]+)"/);
  if (tagsMatch && tagsMatch[1]) {
    tags = tagsMatch[1].split(",").map((t: string) => t.trim()).filter(Boolean);
  } else {
    // Alternative extraction from scripts: keywords: [...]
    const keywordsRegex = /"keywords":\s*\[(.*?)\]/;
    const scriptTagsMatch = htmlContent.match(keywordsRegex);
    if (scriptTagsMatch && scriptTagsMatch[1]) {
      try {
        const parsedTags = JSON.parse(`[${scriptTagsMatch[1]}]`);
        if (Array.isArray(parsedTags)) {
          tags = parsedTags;
        }
      } catch (e) {
        console.warn("Failed to parse script tags:", e);
      }
    }
  }

  // 4. Views
  let viewCount = "N/A";
  const viewMatch = htmlContent.match(/"viewCount":"([^"]+)"/);
  if (viewMatch && viewMatch[1]) {
    viewCount = viewMatch[1];
  }

  // 5. Channel Title
  let channelTitle = "Unknown Creator";
  const channelMatch = htmlContent.match(/"ownerChannelName":"([^"]+)"/) ||
                       htmlContent.match(/<link\s+itemprop="name"\s+content="([^"]+)"/);
  if (channelMatch && channelMatch[1]) {
    channelTitle = cleanText(channelMatch[1]);
  }

  // 6. Category
  let category = "Unknown Category";
  const categoryMatch = htmlContent.match(/"category":"([^"]+)"/);
  if (categoryMatch && categoryMatch[1]) {
    category = cleanText(categoryMatch[1]);
  }

  // 7. Publish Date
  let publishedAt = new Date().toISOString();
  const publishMatch = htmlContent.match(/"publishDate":"([^"]+)"/) ||
                       htmlContent.match(/<meta\s+itemprop="datePublished"\s+content="([^"]+)"/);
  if (publishMatch && publishMatch[1]) {
    publishedAt = publishMatch[1];
  }

  return {
    id: videoId,
    title,
    description,
    publishedAt,
    channelTitle,
    category,
    tags,
    viewCount,
    likeCount: "N/A", // Like counts are usually hidden deeper in initial data
    commentCount: "N/A",
    thumbnails: {
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    },
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
  };
}
