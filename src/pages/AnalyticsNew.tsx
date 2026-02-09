import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Store,
    Users,
    Package,
    Bike,
    Calendar,
    RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

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
}

export default function AnalyticsNew() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.getDashboardStats();
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch stats:', error);
            toast({
                title: "Error",
                description: "Failed to load analytics data",
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
                        <p className="text-muted-foreground">Failed to load analytics data</p>
                        <Button onClick={fetchStats} className="mt-4">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Platform performance metrics and insights</p>
                </div>
                <Button onClick={fetchStats} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-lg bg-brand-orange/10">
                                    <DollarSign className="w-6 h-6 text-brand-orange" />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">₹{stats.revenue.total.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center text-sm text-brand-orange">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                ₹{stats.revenue.thisMonth.toLocaleString()} this month
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-lg bg-brand-pink/10">
                                    <ShoppingCart className="w-6 h-6 text-brand-pink" />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">{stats.orders.total}</p>
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center text-sm text-brand-pink">
                                <Calendar className="w-4 h-4 mr-1" />
                                {stats.orders.thisMonth} this month
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-lg bg-admin-warning/10">
                                    <Store className="w-6 h-6 text-admin-warning" />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">{stats.stores.total}</p>
                                <p className="text-sm text-muted-foreground">Total Stores</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center text-sm text-admin-warning">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {stats.stores.active} active
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-lg bg-admin-success/10">
                                    <Bike className="w-6 h-6 text-admin-success" />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">{stats.riders.total}</p>
                                <p className="text-sm text-muted-foreground">Total Riders</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center text-sm text-admin-success">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {stats.riders.active} active
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Platform Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-brand-pink" />
                            Platform Growth
                        </CardTitle>
                        <CardDescription>Key growth metrics and performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-xl font-bold text-brand-pink">{stats.stores.active}</div>
                                    <div className="text-sm text-muted-foreground">Active Stores</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-xl font-bold text-admin-warning">{stats.stores.pending}</div>
                                    <div className="text-sm text-muted-foreground">Pending Stores</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-xl font-bold text-brand-orange">{stats.riders.active}</div>
                                    <div className="text-sm text-muted-foreground">Active Riders</div>
                                </div>
                                <div className="text-center p-4 border rounded-lg">
                                    <div className="text-xl font-bold text-admin-warning">{stats.riders.pending}</div>
                                    <div className="text-sm text-muted-foreground">Pending Riders</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-brand-orange" />
                            Revenue Analytics
                        </CardTitle>
                        <CardDescription>Revenue breakdown and financial metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-brand-gradient/10 rounded-lg text-center">
                                <div className="text-2xl font-bold text-brand-orange">
                                    ₹{stats.revenue.total.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">Total Platform Revenue</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 border rounded-lg">
                                    <div className="text-lg font-bold text-brand-pink">₹{stats.revenue.thisMonth.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground">This Month</div>
                                </div>
                                <div className="text-center p-3 border rounded-lg">
                                    <div className="text-lg font-bold text-admin-warning">
                                        ₹{stats.orders.total > 0 ? Math.round(stats.revenue.total / stats.orders.total) : 0}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Avg Order Value</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-admin-warning" />
                            Store Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Total Stores:</span>
                                <Badge variant="outline">{stats.stores.total}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Active:</span>
                                <Badge className="bg-brand-pink text-white">{stats.stores.active}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Pending:</span>
                                <Badge className="bg-admin-warning text-white">{stats.stores.pending}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Rejected:</span>
                                <Badge className="bg-admin-error text-white">{stats.stores.rejected}</Badge>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="text-xs text-muted-foreground">
                                    Approval Rate: {stats.stores.total > 0 ? Math.round((stats.stores.active / stats.stores.total) * 100) : 0}%
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bike className="w-5 h-5 text-admin-success" />
                            Rider Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Total Riders:</span>
                                <Badge variant="outline">{stats.riders.total}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Active:</span>
                                <Badge className="bg-brand-orange text-white">{stats.riders.active}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Pending:</span>
                                <Badge className="bg-admin-warning text-white">{stats.riders.pending}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Rejected:</span>
                                <Badge className="bg-admin-error text-white">{stats.riders.rejected}</Badge>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="text-xs text-muted-foreground">
                                    Approval Rate: {stats.riders.total > 0 ? Math.round((stats.riders.active / stats.riders.total) * 100) : 0}%
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-brand-pink" />
                            Product Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Total Products:</span>
                                <Badge variant="outline">{stats.products.total}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Products per Store:</span>
                                <Badge className="bg-brand-pink text-white">
                                    {stats.stores.active > 0 ? Math.round(stats.products.total / stats.stores.active) : 0}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Total Orders:</span>
                                <Badge className="bg-brand-orange text-white">{stats.orders.total}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Monthly Orders:</span>
                                <Badge className="bg-admin-warning text-white">{stats.orders.thisMonth}</Badge>
                            </div>
                            <div className="pt-2 border-t">
                                <div className="text-xs text-muted-foreground">
                                    Orders per Product: {stats.products.total > 0 ? (stats.orders.total / stats.products.total).toFixed(1) : 0}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Platform Health */}
            <Card>
                <CardHeader>
                    <CardTitle>Platform Health Overview</CardTitle>
                    <CardDescription>Overall platform performance and status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-brand-orange">{stats.stores.active + stats.riders.active}</div>
                            <div className="text-sm text-muted-foreground">Active Users</div>
                            <div className="text-xs text-brand-orange mt-1">Stores + Riders</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-admin-warning">{stats.stores.pending + stats.riders.pending}</div>
                            <div className="text-sm text-muted-foreground">Pending Approvals</div>
                            <div className="text-xs text-admin-warning mt-1">Requires Action</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-brand-pink">{stats.orders.total}</div>
                            <div className="text-sm text-muted-foreground">Total Orders</div>
                            <div className="text-xs text-brand-pink mt-1">All Time</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold text-brand-orange">₹{stats.revenue.total.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Platform Revenue</div>
                            <div className="text-xs text-brand-orange mt-1">Commission Earned</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}






