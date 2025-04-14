import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BlogPost, BlogGenerationParams, BlogGenerationResponse } from '../services/blog';

interface BlogState {
  // Draft management
  currentDraft: Partial<BlogPost> | null;
  setCurrentDraft: (draft: Partial<BlogPost> | null) => void;
  clearCurrentDraft: () => void;

  // Generation status
  isGenerating: boolean;
  generationError: string | null;
  setGenerationStatus: (isGenerating: boolean, error?: string) => void;

  // Cached generations
  cachedGenerations: Record<string, BlogGenerationResponse>;
  cacheGeneration: (params: BlogGenerationParams, response: BlogGenerationResponse) => void;
  getCachedGeneration: (params: BlogGenerationParams) => BlogGenerationResponse | null;

  // Recent blogs
  recentBlogs: BlogPost[];
  addRecentBlog: (blog: BlogPost) => void;
  clearRecentBlogs: () => void;
}

// Helper function to create a cache key from generation params
const createCacheKey = (params: BlogGenerationParams): string => {
  return JSON.stringify({
    topic: params.topic,
    tone: params.tone,
    length: params.length,
    target_audience: params.target_audience,
    keywords: params.keywords.sort(), // Sort keywords for consistent key
  });
};

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      // Draft management
      currentDraft: null,
      setCurrentDraft: (draft) => set({ currentDraft: draft }),
      clearCurrentDraft: () => set({ currentDraft: null }),

      // Generation status
      isGenerating: false,
      generationError: null,
      setGenerationStatus: (isGenerating, error = null) => 
        set({ isGenerating, generationError: error }),

      // Cached generations
      cachedGenerations: {},
      cacheGeneration: (params, response) => {
        const key = createCacheKey(params);
        set((state) => ({
          cachedGenerations: {
            ...state.cachedGenerations,
            [key]: response,
          },
        }));
      },
      getCachedGeneration: (params) => {
        const key = createCacheKey(params);
        return get().cachedGenerations[key] || null;
      },

      // Recent blogs
      recentBlogs: [],
      addRecentBlog: (blog) =>
        set((state) => ({
          recentBlogs: [blog, ...state.recentBlogs].slice(0, 5), // Keep only 5 most recent
        })),
      clearRecentBlogs: () => set({ recentBlogs: [] }),
    }),
    {
      name: 'blog-storage',
      partialize: (state) => ({
        cachedGenerations: state.cachedGenerations,
        recentBlogs: state.recentBlogs,
      }),
    }
  )
); 