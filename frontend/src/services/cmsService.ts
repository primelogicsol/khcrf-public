import api from "@/lib/api";

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: unknown;
  updatedAt: string;
}

export const cmsService = {
  // Get content by slug
  get: async (slug: string): Promise<PageContent | null> => {
    try {
      const response = await api.get(`/cms/${slug}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response && (err.response.status === 404 || err.response.status === 500)) {
        return null;
      }
      throw error;
    }
  },

  // Update content
  update: async (slug: string, data: { title?: string; content: unknown }) => {
    const response = await api.post(`/cms/${slug}`, data);
    return response.data;
  },
};
