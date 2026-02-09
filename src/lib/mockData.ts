import { useState, useEffect } from 'react';

// Helper to simulate network delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock Data Types ---

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    sales: number;
    image: string;
    status: 'active' | 'draft' | 'archived';
    storeName: string;
}

export interface Store {
    id: string;
    name: string;
    location: string;
    sales: number;
    status: 'active' | 'pending' | 'blocked';
    image: string;
    joinDate: string;
}

export interface Coupon {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    expiryDate: string;
    usageLimit: number;
    usageCount: number;
    status: 'active' | 'expired' | 'disabled';
}

export interface SupportTicket {
    id: string;
    userId: string;
    userName: string;
    subject: string;
    message: string;
    status: 'open' | 'closed' | 'pending';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
}

export interface SupportMessage {
    id: string;
    ticketId: string;
    sender: 'user' | 'admin';
    message: string;
    createdAt: string;
}

export interface CommissionSettings {
    defaultRate: number;
    storeSpecificRates: Record<string, number>;
}

export interface DailyCommission {
    date: string;
    totalSales: number;
    commissionEarned: number;
}

export interface DashboardStats {
    totalRevenue: number;
    activeUsers: number;
    totalOrders: number;
    growth: number;
}

// --- Mock Data Values ---

const mockProducts: Product[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `prod-${i + 1}`,
    name: `Sample Product ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Home', 'Beauty'][Math.floor(Math.random() * 4)],
    price: Math.floor(Math.random() * 500) + 10,
    stock: Math.floor(Math.random() * 100),
    sales: Math.floor(Math.random() * 1000),
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200',
    status: ['active', 'draft', 'archived'][Math.floor(Math.random() * 3)] as any,
    storeName: `Store ${Math.floor(Math.random() * 10) + 1}`,
}));

const mockStores: Store[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `store-${i + 1}`,
    name: `Super Store ${i + 1}`,
    location: ['New York', 'London', 'Tokyo', 'Paris'][Math.floor(Math.random() * 4)],
    sales: Math.floor(Math.random() * 50000),
    status: ['active', 'pending', 'blocked'][Math.floor(Math.random() * 3)] as any,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200',
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
}));

const mockCoupons: Coupon[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `coupon-${i + 1}`,
    code: `SAVE${(i + 1) * 10}`,
    discountType: Math.random() > 0.5 ? 'percentage' : 'fixed',
    discountValue: Math.random() > 0.5 ? 10 : 50,
    minOrderValue: 100,
    expiryDate: new Date(Date.now() + Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
    usageLimit: 100,
    usageCount: Math.floor(Math.random() * 50),
    status: ['active', 'expired', 'disabled'][Math.floor(Math.random() * 3)] as any,
}));

const mockTickets: SupportTicket[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `ticket-${i + 1}`,
    userId: `user-${i + 1}`,
    userName: `User ${i + 1}`,
    subject: `Issue with Order #${i + 100}`,
    message: 'I have not received my order yet.',
    status: ['open', 'closed', 'pending'][Math.floor(Math.random() * 3)] as any,
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
}));

const mockMessages: SupportMessage[] = [
    { id: 'msg-1', ticketId: 'ticket-1', sender: 'user', message: 'Hi, where is my order?', createdAt: new Date().toISOString() },
    { id: 'msg-2', ticketId: 'ticket-1', sender: 'admin', message: 'Hello, checking that for you.', createdAt: new Date().toISOString() },
];

const mockCommissionSettings: CommissionSettings = {
    defaultRate: 10,
    storeSpecificRates: { 'store-1': 15, 'store-2': 8 },
};

const mockDailySummary: DailyCommission[] = Array.from({ length: 7 }).map((_, i) => ({
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    totalSales: Math.floor(Math.random() * 5000),
    commissionEarned: Math.floor(Math.random() * 500),
})).reverse();

const mockDashboardStats: DashboardStats = {
    totalRevenue: 150000,
    activeUsers: 3500,
    totalOrders: 1200,
    growth: 15,
};

// --- Mock API Functions ---

export const fetchMockProducts = async (page: number = 1, limit: number = 10): Promise<{ products: Product[], total: number }> => {
    await delay(500);
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
        products: mockProducts.slice(start, end),
        total: mockProducts.length,
    };
};

export const fetchMockStores = async (): Promise<Store[]> => {
    await delay(600);
    return mockStores;
};

export const fetchMockCoupons = async (): Promise<Coupon[]> => {
    await delay(400);
    return mockCoupons;
};

export const fetchMockTickets = async (): Promise<SupportTicket[]> => {
    await delay(500);
    return mockTickets;
};

export const fetchMockMessages = async (ticketId: string): Promise<SupportMessage[]> => {
    await delay(300);
    return mockMessages.filter(m => m.ticketId === ticketId);
};

export const fetchMockCommissionSettings = async (): Promise<CommissionSettings> => {
    await delay(300);
    return mockCommissionSettings;
}

export const fetchMockDailySummary = async (): Promise<DailyCommission[]> => {
    await delay(400);
    return mockDailySummary;
}

export const fetchMockDashboardStats = async (): Promise<DashboardStats> => {
    await delay(500);
    return mockDashboardStats;
}
