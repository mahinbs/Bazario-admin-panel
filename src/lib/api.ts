
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
    private token: string | null = null;

    constructor() {
        this.token = localStorage.getItem('adminToken');
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('adminToken', token);
        } else {
            localStorage.removeItem('adminToken');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        requireAuth = true
    ): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (requireAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: { ...headers, ...(options.headers as Record<string, string>) },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new ApiError(
                data.message || data.error?.message || 'Request failed',
                response.status,
                data
            );
        }

        return data;
    }

    async login(email: string, password: string) {
        const response = await this.request<{
            token: string;
            admin: {
                id: string;
                email: string;
                full_name: string;
                role: string;
            };
        }>('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }, false);

        if (response.success && response.data) {
            this.setToken(response.data.token);
        }

        return response;
    }

    async logout() {
        try {
            await this.request('/admin/logout', { method: 'POST' });
        } finally {
            this.setToken(null);
        }
    }

    async getProfile() {
        return this.request('/admin/profile');
    }

    async updateProfile(data: { full_name?: string; phone?: string; bio?: string }) {
        return this.request('/admin/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async getDashboardStats() {
        return this.request('/admin/dashboard/stats');
    }

    async getStores(params: {
        status?: string;
        page?: number;
        limit?: number;
        search?: string;
    } = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) query.append(key, String(value));
        });
        const qs = query.toString() ? `?${query.toString()}` : '';
        return this.request(`/admin/stores${qs}`);
    }

    async updateStoreStatus(id: string, status: string, notes?: string) {
        return this.request(`/admin/stores/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, notes }),
        });
    }

    async deleteStore(id: string) {
        return this.request(`/admin/stores/${id}`, { method: 'DELETE' });
    }

    async getRiders(params: {
        status?: string;
        page?: number;
        limit?: number;
        search?: string;
    } = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) query.append(key, String(value));
        });
        const qs = query.toString() ? `?${query.toString()}` : '';
        return this.request(`/admin/riders${qs}`);
    }

    async updateRiderStatus(id: string, status: string, notes?: string) {
        return this.request(`/admin/riders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, notes }),
        });
    }

    async deleteRider(id: string) {
        return this.request(`/admin/riders/${id}`, { method: 'DELETE' });
    }

    async getProducts(params?: {
        page?: number;
        limit?: number;
        search?: string;
        store_id?: string;
    }) {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) query.append(key, String(value));
            });
        }
        const qs = query.toString() ? `?${query.toString()}` : '';
        return this.request(`/admin/products${qs}`);
    }

    async getProduct(id: string) {
        return this.request(`/admin/products/${id}`);
    }

    async getCustomers(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }) {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) query.append(key, String(value));
            });
        }
        const qs = query.toString() ? `?${query.toString()}` : '';
        return this.request(`/admin/customers${qs}`);
    }

    async getCustomerDetails(customerId: string) {
        return this.request(`/admin/customers/${customerId}`);
    }

    async getOrders(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
    }) {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) query.append(key, String(value));
            });
        }
        const qs = query.toString() ? `?${query.toString()}` : '';
        return this.request(`/admin/orders${qs}`);
    }

    async getOrderDetails(orderId: string) {
        return this.request(`/admin/orders/${orderId}`);
    }

    async getActivityLog(params: { page?: number; limit?: number } = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) query.append(key, String(value));
        });
        const qs = query.toString() ? `?${query.toString()}` : '';
        return this.request(`/admin/activity${qs}`);
    }

    // Commission endpoints
    async getCommissionSettings() {
        return this.request('/commissions/settings');
    }

    async updateCommissionSettings(settings: Record<string, unknown>) {
        return this.request('/commissions/settings', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    }

    async getCommissionDailySummary(params?: { date?: string }) {
        const query = params?.date ? `?date=${params.date}` : '';
        return this.request(`/commissions/daily-summary${query}`);
    }

    // Coupon admin endpoints
    async getCoupons(params?: { page?: number; limit?: number; search?: string; is_active?: boolean }) {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) query.append(key, String(value));
            });
        }
        const qs = query.toString() ? `?${query.toString()}` : '';
        return this.request(`/coupons/admin${qs}`);
    }

    async createCoupon(coupon: Record<string, unknown>) {
        return this.request('/coupons/admin', {
            method: 'POST',
            body: JSON.stringify(coupon),
        });
    }

    async updateCoupon(id: string, coupon: Record<string, unknown>) {
        return this.request(`/coupons/admin/${id}`, {
            method: 'PUT',
            body: JSON.stringify(coupon),
        });
    }

    async deleteCoupon(id: string) {
        return this.request(`/coupons/admin/${id}`, { method: 'DELETE' });
    }

    async toggleCoupon(id: string) {
        return this.request(`/coupons/admin/${id}/toggle`, { method: 'PATCH' });
    }

    // Support endpoints
    async getSupportTickets(params?: { status?: string; category?: string }) {
        const query = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) query.append(key, String(value));
            });
        }
        const qs = query.toString() ? `?${query.toString()}` : '';
        return this.request(`/support/tickets${qs}`);
    }

    async getSupportMessages(ticketId: string) {
        return this.request(`/support/tickets/${ticketId}/messages`);
    }

    async getSupportTicket(ticketId: string) {
        const response = await this.request<{ ticket: unknown }>(`/support/tickets/${ticketId}`);
        return response;
    }

    async sendSupportMessage(ticketId: string, message: string, senderId: string, senderType = 'admin') {
        return this.request(`/support/tickets/${ticketId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ message, senderId, senderType }),
        });
    }

    async updateTicketStatus(ticketId: string, status: string) {
        return this.request(`/support/tickets/${ticketId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async getSupportStats() {
        return this.request('/support/stats');
    }

    // Ratings
    async getRatingsAnalytics() {
        return this.request('/ratings/analytics');
    }

    async getAllRatings(type?: string) {
        const query = type ? `?type=${type}` : '';
        return this.request(`/ratings/all${query}`);
    }
}

export const api = new ApiClient();
export { ApiError };
export type { ApiResponse };
