import axios from 'axios';
import { toast } from 'react-hot-toast';

export const getBaseUrl = () => {
    if (typeof window === 'undefined') {
        return process.env.INTERNAL_API_URL || process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    }
    return process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || '';
};

export const getBaseUrlNoApi = () => getBaseUrl().replace(/\/api$/, '');

const API_BASE_URL = getBaseUrl();



const api = axios.create({
    baseURL: '/api/backend',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Globally unwrap backend responseFormatter payloads { status: 'success', data: ... }
api.interceptors.response.use((response) => {
    if (
        response.data &&
        typeof response.data === 'object' &&
        response.data.status === 'success' &&
        'data' in response.data
    ) {
        response.data = response.data.data;
    }
    return response;
}, async (error) => {
    const originalRequest = error.config;
    
    // Skip auth redirect for these paths — they handle 401 themselves
    const skipPaths = [
      '/skc/official-messages/invitations/verify',
      '/skc/official-messages/session',
      '/skc/official-messages/submit',
      // Donation payment flow — never redirect mid-payment
      '/donation/intent',       // POST (create) + DELETE (cancel on failure)
      '/donation/offline-submit',
      '/donation/verify-payment',
    ];
    const isSkippedPath = skipPaths.some(p => originalRequest?.url?.includes(p));
    
    // Check if error is 401 (Unauthorized) OR 403 with specific message, and we haven't already retried
    // Skip redirect for /auth/me call (handled gracefully by AuthContext)
    const isAuthError = error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message === 'Forbidden: Invalid token');
    if (isAuthError && !originalRequest._retry && !originalRequest._skipAuthRedirect && !isSkippedPath) {
      if (typeof window !== 'undefined') {
          // Clear local storage
          localStorage.removeItem('user');
          // Redirect to login page
          window.location.href = '/login';
      }
    } else if (!error.response && typeof window !== 'undefined') {
      // Network error, CORS, DNS failure, or blocked by browser extension (e.g. adblocker)
      toast.error("A browser extension or network issue may be blocking this request.", { id: 'global-network-error' });
    }
    return Promise.reject(error);
  }
);

export const contactApi = {
    submit: async (data: any) => {
        const response = await api.post('/contact/submit', data);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/contact');
        return response.data;
    }
}

export const apprenticeshipApi = {
    getOpenings: async () => {
        const response = await api.get('/apprenticeship/openings');
        return response.data;
    },
    createOpening: async (data: any) => {
        const response = await api.post('/apprenticeship/openings', data);
        return response.data;
    },
    updateOpening: async (id: string, data: any) => {
        const response = await api.put(`/apprenticeship/openings/${id}`, data);
        return response.data;
    },
    deleteOpening: async (id: string) => {
        const response = await api.delete(`/apprenticeship/openings/${id}`);
        return response.data;
    }
}

export const cmsApi = {
    getContent: async (slug: string) => {
        try {
            const response = await api.get(`/cms/${slug}`);
            return response.data;
        } catch (error: unknown) {
            const err = error as { response?: { status?: number } };
            if (err.response?.status === 404 || err.response?.status === 500) {
                return null; // Gracefully fallback if CMS content isn't created yet or backend returns 500
            }
            throw error;
        }
    },
    updateContent: async (slug: string, data: any) => {
        const response = await api.post(`/cms/${slug}`, data);
        return response.data;
    }
}

export const careerApi = {
    getJobs: async (status?: string) => {
        const response = await api.get('/career/jobs', { params: { status } });
        return response.data;
    },
    getJobById: async (id: string) => {
        const response = await api.get(`/career/jobs/${id}`);
        return response.data;
    },
    createJob: async (data: any) => {
        const response = await api.post('/career/jobs', data);
        return response.data;
    },
    updateJob: async (id: string, data: any) => {
        const response = await api.put(`/career/jobs/${id}`, data);
        return response.data;
    },
    deleteJob: async (id: string) => {
        const response = await api.delete(`/career/jobs/${id}`);
        return response.data;
    },
    submitApplication: async (data: any) => {
        const response = await api.post('/career/apply', data);
        return response.data;
    },
    getApplications: async (jobId?: string) => {
        const response = await api.get('/career/applications', { params: { jobId } });
        return response.data;
    },
    getApplicationById: async (id: string) => {
        const response = await api.get(`/career/applications/${id}`);
        return response.data;
    },
    updateApplicationStatus: async (id: string, status: string) => {
        const response = await api.put(`/career/applications/${id}/status`, { status });
        return response.data;
    }
}

export const partnerApi = {
    getAll: async () => {
        const response = await api.get('/partner');
        return response.data;
    },
    getPublic: async () => {
        const response = await api.get('/partner/registry');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/partner/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/partner', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/partner/${id}`, data);
        return response.data;
    }
}

export const initiativeApi = {
    getAll: async (type?: string) => {
        const response = await api.get('/initiatives', { params: { type } });
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/initiatives/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/initiatives', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/initiatives/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/initiatives/${id}`);
        return response.data;
    }
}

export const adminApi = {
    getStats: async () => {
        const response = await api.get('/admin/overview');
        return response.data;
    },
    getRecentActivity: async () => {
        const response = await api.get('/admin/activity');
        return response.data;
    },
    getUserHistory: async (userId: string) => {
        const response = await api.get(`/admin/users/${userId}/history`);
        return response.data;
    },
    getPublicationTemplate: async () => {
        const response = await api.get('/admin/publications/template', { responseType: 'blob' });
        return response.data;
    },
    // Donation detail
    getDonation: async (id: string) => {
        const response = await api.get(`/donation/management/record/${id}`);
        return response;
    },
    // Membership detail
    getMember: async (id: string) => {
        const response = await api.get(`/membership/${id}`);
        return response;
    },
    // Job Application detail
    getJobApplication: async (id: string) => {
        const response = await api.get(`/career/applications/${id}`);
        return response;
    },
}

export const publicationApi = {
    getAll: async (category?: string) => {
        try {
            const response = await api.get('/publications', { params: { category } });
            return response.data;
        } catch (err) {
            console.warn('[publicationApi.getAll] Gracefully handling fetch failure:', err);
            throw err;
        }
    },
    getBySlug: async (slug: string) => {
        const response = await api.get(`/publications/${slug}`);
        return response.data;
    }
}

export const userApi = {
    getSidebarStats: async () => { const response = await api.get("/users/sidebar-stats"); return response.data?.data || response.data; },
    getMyLegislativeOffice: async () => {
        const response = await api.get('/legislative/my-office');
        return response.data || null;
    },
    updateMyLegislativeOffice: async (data: any) => {
        const response = await api.put('/legislative/my-office', data);
        return response.data;
    },
    impersonate: async (id: string) => {
        const response = await api.post(`/users/impersonate/${id}`);
        return response.data;
    },
    stopImpersonation: async () => {
        const response = await api.post('/users/stop-impersonation');
        return response.data;
    }
}

export default api;
