import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Store,
    Package,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Eye,
    Bike
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { fetchMockDailySummary } from "@/lib/mockData";

interface DashboardStats {
    stores: {
        total: number;
        active: number;
        pending: number;
        rejected: number;
    };
    riders: {
        total: number;
        active: number;
        pending: number;
        rejected: number;
    };
    orders: {
        total: number;
        thisMonth: number;
    };
    products: {
        total: number;
    };
    revenue: {
        total: number;
        thisMonth: number;
    };
    commission?: {
        todayPlatformCommission: number;
        todayRiderEarnings: number;
        totalCashCollected: number;
        avgCommissionPerOrder: number;
        pendingSettlements: number;
    };
}

export default function DashboardNew() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.getDashboardStats();

            // Also fetch commission data via mock
            let commissionData = null;
            try {
                const dailySummary = await fetchMockDailySummary();
                if (dailySummary && dailySummary.length > 0) {
                    const todayData = dailySummary[0]; // Assuming first item is latest/today
                    commissionData = {
                        todayPlatformCommission: todayData.commissionEarned,
                        todayRiderEarnings: Math.floor(todayData.totalSales * 0.1), // Mock calculation based on sales
                        totalCashCollected: todayData.totalSales,
                        avgCommissionPerOrder: todayData.totalSales > 0 ? (todayData.commissionEarned / (todayData.totalSales / 500)) : 15,
                        pendingSettlements: 5 // Mock value
                    };
                }
            } catch (commissionError) {
                console.warn('Failed to fetch commission data:', commissionError);
            }

            if (response.success && response.data) {
                // Ensure response.data has the shape of DashboardStats parts we need, 
                // but api.ts returns a specific shape. We need to cast or ensure it matches.
                // The api.ts getDashboardStats returns strict structure.

                const apiStats = response.data as any; // Cast to avoid strict type mismatch if api.ts differs slightly

                setStats({
                    stores: apiStats.stores,
                    riders: apiStats.riders,
                    orders: apiStats.orders,
                    products: apiStats.products,
                    revenue: apiStats.revenue,
                    commission: commissionData || undefined
                });
            }
        } catch (error: any) {
            console.error('Failed to fetch stats:', error);
            toast({
                title: "Error",
                description: "Failed to load dashboard statistics",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-admin-red/20 border-t-admin-red rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-muted-foreground">Failed to load dashboard data</p>
                        <Button onClick={fetchStats} className="mt-4">
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Stores",
            value: stats.stores.total.toString(),
            change: `${stats.stores.pending} pending`,
            trend: "up" as const,
            icon: Store,
            className: "text-brand-orange bg-brand-orange/10"
        },
        {
            title: "Active Stores",
            value: stats.stores.active.toString(),
            change: `${stats.stores.rejected} rejected`,
            trend: "up" as const,
            icon: Store,
            className: "text-admin-success bg-admin-success/10"
        },
        {
            title: "Total Riders",
            value: stats.riders.total.toString(),
            change: `${stats.riders.pending} pending`,
            trend: "up" as const,
            icon: Bike,
            className: "text-brand-pink bg-brand-pink/10"
        },
        {
            title: "Active Riders",
            value: stats.riders.active.toString(),
            change: `${stats.riders.rejected} rejected`,
            trend: "up" as const,
            icon: Bike,
            className: "text-admin-success bg-admin-success/10"
        },
        {
            title: "Total Products",
            value: stats.products.total.toString(),
            change: "All stores",
            trend: "up" as const,
            icon: Package,
            className: "text-admin-warning bg-admin-warning/10"
        },
        {
            title: "Total Orders",
            value: stats.orders.total.toString(),
            change: `${stats.orders.thisMonth} this month`,
            trend: "up" as const,
            icon: ShoppingCart,
            className: "text-brand-orange bg-brand-orange/10"
        },
        {
            title: "Total Revenue",
            value: `₹${stats.revenue.total.toLocaleString()}`,
            change: `₹${stats.revenue.thisMonth.toLocaleString()} this month`,
            trend: "up" as const,
            icon: DollarSign,
            className: "text-admin-success bg-admin-success/10"
        },
        ...(stats.commission ? [{
            title: "Today's Commission",
            value: `₹${stats.commission.todayPlatformCommission.toFixed(2)}`,
            change: `₹${stats.commission.todayRiderEarnings.toFixed(2)} to riders`,
            trend: "up" as const,
            icon: DollarSign,
            className: "text-admin-warning bg-admin-warning/10"
        }] : [])
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening with your platform.
                    </p>
                </div>
                <Button onClick={fetchStats} variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Refresh Data
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="hover:shadow-medium transition-all duration-300 border-l-4 border-l-transparent hover:border-l-brand-orange group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`p-2 rounded-lg ${stat.className}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    {stat.trend === "up" ? (
                                        <TrendingUp className="w-4 h-4 text-admin-success mr-1" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-admin-error mr-1" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-brand-orange" />
                            Store Management
                        </CardTitle>
                        <CardDescription>
                            Manage store applications and approvals
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Pending Approval:</span>
                                <Badge variant="outline">{stats.stores.pending}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Active Stores:</span>
                                <Badge variant="outline">{stats.stores.active}</Badge>
                            </div>
                        </div>
                        <Button className="w-full mt-4 bg-brand-gradient text-white shadow-soft hover:shadow-glow transition-all duration-300">
                            <Eye className="w-4 h-4 mr-2" />
                            View All Stores
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bike className="w-5 h-5 text-brand-pink" />
                            Rider Management
                        </CardTitle>
                        <CardDescription>
                            Manage delivery rider applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Pending Approval:</span>
                                <Badge variant="outline">{stats.riders.pending}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Active Riders:</span>
                                <Badge variant="outline">{stats.riders.active}</Badge>
                            </div>
                        </div>
                        <Button className="w-full mt-4 bg-brand-gradient text-white shadow-soft hover:shadow-glow transition-all duration-300">
                            <Eye className="w-4 h-4 mr-2" />
                            View All Riders
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-admin-success" />
                            Commission & COD Overview
                        </CardTitle>
                        <CardDescription>
                            Today's commission and cash collection data
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {stats.commission ? (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Platform Commission:</span>
                                        <span className="text-sm font-medium text-admin-success">₹{stats.commission.todayPlatformCommission.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Rider Earnings:</span>
                                        <span className="text-sm font-medium text-admin-coral">₹{stats.commission.todayRiderEarnings.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Cash Collected:</span>
                                        <span className="text-sm font-medium text-admin-warning">₹{stats.commission.totalCashCollected.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Pending Settlements:</span>
                                        <Badge variant="outline" className="text-xs">{stats.commission.pendingSettlements}</Badge>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-2">
                                    <span className="text-sm text-muted-foreground">Loading commission data...</span>
                                </div>
                            )}
                        </div>
                        <Button
                            className="w-full mt-4 bg-brand-gradient text-white shadow-soft hover:shadow-glow transition-all duration-300"
                            onClick={() => navigate('/commission')}
                        >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Manage Commission
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Platform Status</CardTitle>
                    <CardDescription>Current status of your delivery platform</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-admin-success">{stats.stores.active}</div>
                            <div className="text-sm text-muted-foreground">Active Stores</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-admin-success">{stats.riders.active}</div>
                            <div className="text-sm text-muted-foreground">Active Riders</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-admin-warning">{stats.orders.total}</div>
                            <div className="text-sm text-muted-foreground">Total Orders</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-admin-coral">{stats.products.total}</div>
                            <div className="text-sm text-muted-foreground">Total Products</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
