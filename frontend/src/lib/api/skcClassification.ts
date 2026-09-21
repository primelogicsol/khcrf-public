import { api } from './index';

// ─── Request/Response types ───────────────────────────────────────────────────

export interface ClassificationQueueParams {
  provenance?: string;
  entityType?: string;
  sourceSystem?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ClassificationQueueRecord {
  id: string;
  name: string;
  referenceNumber?: string;
  entityType: string;
  dataProvenance: string;
  sourceSystem?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassificationQueueResponse {
  records: ClassificationQueueRecord[];
  total: number;
  batchLimit?: number;
}

export interface ClassificationHistoryParams {
  entityType?: string;
  recordId?: string;
  actorId?: string;
  page?: number;
  pageSize?: number;
}

export interface ClassificationAuditRecord {
  id: string;
  entityType: string;
  recordId: string;
  previousProvenance: string;
  newProvenance: string;
  previousSource: string;
  newSource: string;
  reason: string;
  batchId: string;
  classifiedAt: string;
  classifiedBy?: { id: string; name: string; email: string } | null;
}

export interface ClassificationHistoryResponse {
  records: ClassificationAuditRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ClassificationPreviewRequest {
  entityType: string;
  recordIds: string[];
  targetProvenance: string;
}

export interface ClassificationPreviewResponse {
  success: boolean;
  affectedCount: number;
  blockedCount: number;
  missingCount: number;
  blockedIds: string[];
  missingIds: string[];
  warnings: string[];
  previewToken: string;
  expiresAt?: string;
}

export interface ClassificationSubmitRequest {
  entityType: string;
  recordIds: string[];
  targetProvenance: string;
  reason: string;
  idempotencyKey: string;
  previewToken: string;
}

export interface ClassificationSubmitResponse {
  success?: boolean;
  classifiedCount: number;
  batchId?: string;
  idempotent?: boolean;
  error?: string;
}

// ─── API client ───────────────────────────────────────────────────────────────

export const skcClassificationApi = {
  getQueue: async (params: ClassificationQueueParams): Promise<ClassificationQueueResponse> => {
    const res = await api.get('/admin/skc/classification/queue', { params });
    return res.data as ClassificationQueueResponse;
  },

  preview: async (data: ClassificationPreviewRequest): Promise<ClassificationPreviewResponse> => {
    const res = await api.post('/admin/skc/classification/preview', data);
    return res.data as ClassificationPreviewResponse;
  },

  submit: async (data: ClassificationSubmitRequest): Promise<ClassificationSubmitResponse> => {
    const res = await api.patch('/admin/skc/classification', data);
    return res.data as ClassificationSubmitResponse;
  },

  getHistory: async (params: ClassificationHistoryParams): Promise<ClassificationHistoryResponse> => {
    const res = await api.get('/admin/skc/classification/history', { params });
    return res.data as ClassificationHistoryResponse;
  },
};
