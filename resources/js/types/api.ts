export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta: {
        pagination?: PaginationMeta;
        filters?: Record<string, unknown>;
    } | null;
    errors: Record<string, string[]> | string[] | null;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    data: null;
    meta: null;
    errors: Record<string, string[]> | string[] | null;
    code?: string;
}

export interface ListParams {
    page?: number;
    per_page?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    filter?: Record<string, string | number | boolean | undefined>;
    include?: string;
}
