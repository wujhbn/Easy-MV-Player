import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Speaks using the Web Speech API
export function speak(text: string, enabled: boolean) {
  if (!enabled) return;
  if ('speechSynthesis' in window) {
    // cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // You could customize rate, pitch here
    utterance.rate = 0.9; 
    utterance.pitch = 1.1; // Make it sound a bit friendlier
    window.speechSynthesis.speak(utterance);
  }
}

// Parses youtube url to get ID
export async function fetchYouTubeVideoInfo(url: string) {
  // Extract ID from different formats
  // https://youtube.com/watch?v=xxxxx
  // https://music.youtube.com/watch?v=xxxxx
  // https://youtu.be/xxxxx
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  const videoId = (match && match[2].length === 11) ? match[2] : null;

  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  // We normally need an API key to get standard titles reliably without scraping
  // But we can fetch oembed data as a free way to get title and thumbnail!
  try {
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    
    if (data.error) {
       throw new Error(data.error);
    }

    return {
      id: videoId,
      title: data.title,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, // usually better quality than what oembed returns
      url: `https://www.youtube.com/watch?v=${videoId}`
    };
  } catch (err) {
      console.warn("Failed to fetch youtube details from noembed, building fallback:", err);
      return {
          id: videoId,
          title: `Video ${videoId}`,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`
      }
  }
}
