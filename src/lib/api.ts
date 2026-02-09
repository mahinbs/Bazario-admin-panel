
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

    private async mockDelay() {
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    // Authentication
    async login(email: string, password: string) {
        await this.mockDelay();
        const response: ApiResponse<{
            token: string;
            admin: {
                id: string;
                email: string;
                full_name: string;
                role: string;
            };
        }> = {
            success: true,
            data: {
                token: 'mock-token-' + Date.now(),
                admin: {
                    id: '1',
                    email: email || 'admin@bazario.com',
                    full_name: 'Bazario Admin',
                    role: 'SUPER_ADMIN',
                }
            }
        };

        if (response.success && response.data) {
            this.setToken(response.data.token);
        }

        return response;
    }

    async logout() {
        await this.mockDelay();
        this.setToken(null);
    }

    async getProfile() {
        await this.mockDelay();
        return {
            success: true,
            data: {
                id: '1',
                email: 'admin@bazario.com',
                full_name: 'Bazario Admin',
                role: 'SUPER_ADMIN',
                last_login: new Date().toISOString(),
                created_at: new Date().toISOString(),
            }
        };
    }

    // Dashboard
    async getDashboardStats() {
        await this.mockDelay();
        return {
            success: true,
            data: {
                stores: {
                    total: 125,
                    active: 98,
                    pending: 15,
                    rejected: 12,
                },
                riders: {
                    total: 450,
                    active: 380,
                    pending: 40,
                    rejected: 30,
                },
                orders: {
                    total: 12540,
                    thisMonth: 1250,
                },
                products: {
                    total: 8500,
                },
                revenue: {
                    total: 580000,
                    thisMonth: 45000,
                },
            }
        };
    }

    // Stores Management
    async getStores(params: {
        status?: string;
        page?: number;
        limit?: number;
        search?: string;
    } = {}) {
        await this.mockDelay();
        const stores = [
            { id: '1', name: 'Bazario Store 1', owner: 'John Doe', status: 'ACTIVE', category: 'Electronics', revenue: 5000 },
            { id: '2', name: 'Bazario Store 2', owner: 'Jane Smith', status: 'ACTIVE', category: 'Fashion', revenue: 3500 },
            { id: '3', name: 'Fresh Market', owner: 'Mike Brown', status: 'PENDING', category: 'Groceries', revenue: 0 },
            { id: '4', name: 'Tech Zone', owner: 'Sarah Wilson', status: 'REJECTED', category: 'Electronics', revenue: 0 },
            { id: '5', name: 'Style Hub', owner: 'Amy Lee', status: 'ACTIVE', category: 'Fashion', revenue: 2100 },
        ];
        return {
            success: true,
            data: stores,
            pagination: {
                page: params.page || 1,
                limit: params.limit || 10,
                total: stores.length,
                totalPages: 1
            }
        };
    }

    async updateStoreStatus(id: string, status: string, notes?: string) {
        await this.mockDelay();
        return { success: true, message: `Store ${id} status updated to ${status}` };
    }

    async deleteStore(id: string) {
        await this.mockDelay();
        return { success: true, message: `Store ${id} deleted` };
    }

    // Riders Management
    async getRiders(params: {
        status?: string;
        page?: number;
        limit?: number;
        search?: string;
    } = {}) {
        await this.mockDelay();
        const riders = [
            {
                id: '1',
                name: 'Express Rider 1',
                email: 'rider1@bazario.com',
                phone: '+91 98765 43210',
                vehicle_type: 'Bike',
                vehicle_number: 'KA-01-AB-1234',
                address: '123 Main St, Koramangala',
                city: 'Bangalore',
                pincode: '560034',
                emergency_contact_name: 'Jane Doe',
                emergency_contact_phone: '+91 98765 43211',
                status: 'approved',
                total_deliveries: 150,
                rating: 4.8,
                total_earnings: 15000,
                is_online: true,
                created_at: new Date(Date.now() - 10000000).toISOString(),
                last_online_at: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Express Rider 2',
                email: 'rider2@bazario.com',
                phone: '+91 98765 43212',
                vehicle_type: 'Scooter',
                vehicle_number: 'KA-05-CD-5678',
                address: '456 2nd Ave, Indiranagar',
                city: 'Bangalore',
                pincode: '560038',
                emergency_contact_name: 'John Smith',
                emergency_contact_phone: '+91 98765 43213',
                status: 'approved',
                total_deliveries: 85,
                rating: 4.5,
                total_earnings: 8500,
                is_online: false,
                created_at: new Date(Date.now() - 5000000).toISOString(),
                last_online_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: '3',
                name: 'New Delivery Guy',
                email: 'rider3@bazario.com',
                phone: '+91 98765 43214',
                vehicle_type: 'Bike',
                vehicle_number: 'KA-03-EF-9012',
                address: '789 3rd Cross, Jayanagar',
                city: 'Bangalore',
                pincode: '560041',
                emergency_contact_name: 'Mom',
                emergency_contact_phone: '+91 98765 43215',
                status: 'pending',
                total_deliveries: 0,
                rating: 0,
                total_earnings: 0,
                is_online: false,
                created_at: new Date().toISOString()
            },
        ];
        return {
            success: true,
            data: riders,
            pagination: {
                page: params.page || 1,
                limit: params.limit || 10,
                total: riders.length,
                totalPages: 1
            }
        };
    }

    async updateRiderStatus(id: string, status: string, notes?: string) {
        await this.mockDelay();
        return { success: true, message: `Rider ${id} status updated to ${status}` };
    }

    async deleteRider(id: string) {
        await this.mockDelay();
        return { success: true, message: `Rider ${id} deleted` };
    }

    // Products Management
    async getProducts(params?: {
        page?: number;
        limit?: number;
        search?: string;
        store_id?: string;
    }) {
        await this.mockDelay();
        const products = [
            { id: '1', name: 'Bazario Pro X', price: 999, category: 'Electronics', stock: 50, status: 'PUBLISHED' },
            { id: '2', name: 'Summer Tee', price: 29, category: 'Fashion', stock: 200, status: 'PUBLISHED' },
            { id: '3', name: 'Organic Honey', price: 15, category: 'Groceries', stock: 150, status: 'DRAFT' },
        ];
        return {
            success: true,
            data: products,
            pagination: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                total: products.length,
                totalPages: 1
            }
        };
    }

    async getProduct(id: string) {
        await this.mockDelay();
        return {
            success: true,
            data: { id, name: 'Sample Product', price: 100, description: 'Mock description' }
        };
    }

    // Customers Management
    async getCustomers(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }) {
        await this.mockDelay();
        const customers = [
            { id: '1', name: 'Alice Johnson', email: 'alice@example.com', orders: 12, status: 'ACTIVE' },
            { id: '2', name: 'Bob Smith', email: 'bob@example.com', orders: 5, status: 'ACTIVE' },
        ];
        return {
            success: true,
            data: customers,
            pagination: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                total: customers.length,
                totalPages: 1
            }
        };
    }

    // Orders Management
    async getOrders(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
    }) {
        await this.mockDelay();
        const orders = [
            { id: 'ORD001', customer: 'Alice Johnson', total: 150.50, status: 'DELIVERED', date: new Date().toISOString() },
            { id: 'ORD002', customer: 'Bob Smith', total: 45.00, status: 'PENDING', date: new Date().toISOString() },
            { id: 'ORD003', customer: 'Charlie Brown', total: 299.99, status: 'PROCESSING', date: new Date().toISOString() },
        ];
        return {
            success: true,
            data: orders,
            pagination: {
                page: params?.page || 1,
                limit: params?.limit || 10,
                total: orders.length,
                totalPages: 1
            }
        };
    }

    async getCustomerDetails(customerId: string) {
        await this.mockDelay();
        return { success: true, data: { id: customerId, name: 'Mock Customer', email: 'mock@example.com' } };
    }

    async getOrderDetails(orderId: string) {
        await this.mockDelay();
        return { success: true, data: { id: orderId, total: 100, items: [] } };
    }

    async getActivityLog(params: {
        page?: number;
        limit?: number;
    } = {}) {
        await this.mockDelay();
        return {
            success: true,
            data: [
                { id: '1', action: 'Store Approved', admin: 'Bazario Admin', timestamp: new Date().toISOString() },
                { id: '2', action: 'New Rider Registered', admin: 'System', timestamp: new Date().toISOString() },
            ]
        };
    }
}

export const api = new ApiClient();
export { ApiError };
export type { ApiResponse };
