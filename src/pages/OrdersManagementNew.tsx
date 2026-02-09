import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Store
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface DashboardStats {
    orders: {
        total: number;
        thisMonth: number;
    };
    revenue: {
        total: number;
        thisMonth: number;
    };
    stores: {
        active: number;
    };
    riders: {
        active: number;
    };
}

export default function OrdersManagementNew() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const fetchStats = async () => {
        try {
            const response = await api.getDashboardStats();
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch stats:', error);
            toast({
                title: "Error",
                description: "Failed to load order statistics",
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
                    <p className="text-muted-foreground">Monitor and manage orders across all stores</p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-orange/10 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-brand-orange" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.orders.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-pink/10 rounded-lg">
                                    <Clock className="w-6 h-6 text-brand-pink" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.orders.thisMonth}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-admin-success/10 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-admin-success" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                    <p className="text-2xl font-bold text-foreground">₹{stats.revenue.total.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-admin-warning/10 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-admin-warning" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                                    <p className="text-2xl font-bold text-foreground">₹{stats.revenue.thisMonth.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Order Management Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-brand-orange" />
                            Order Processing
                        </CardTitle>
                        <CardDescription>
                            Orders are processed through the store and rider systems
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-semibold mb-2">Order Flow</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Customers place orders through the app</li>
                                    <li>• Store owners receive and process orders</li>
                                    <li>• Riders pick up and deliver orders</li>
                                    <li>• Payment and commission are processed</li>
                                </ul>
                            </div>
                            {stats && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-lg font-bold text-admin-success">{stats.stores.active}</div>
                                        <div className="text-xs text-muted-foreground">Active Stores</div>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-lg font-bold text-brand-pink">{stats.riders.active}</div>
                                        <div className="text-xs text-muted-foreground">Active Riders</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-admin-success" />
                            Revenue Analytics
                        </CardTitle>
                        <CardDescription>
                            Platform revenue from order processing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-4">
                                <div className="p-3 bg-admin-success/10 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-admin-success">
                                        ₹{stats.revenue.total.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-lg font-bold text-admin-warning">₹{stats.revenue.thisMonth.toLocaleString()}</div>
                                        <div className="text-xs text-muted-foreground">This Month</div>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-lg font-bold text-brand-orange">{stats.orders.total}</div>
                                        <div className="text-xs text-muted-foreground">Total Orders</div>
                                    </div>
                                </div>
                                <div className="text-center text-sm text-muted-foreground">
                                    Avg Order Value: ₹{stats.orders.total > 0 ? Math.round(stats.revenue.total / stats.orders.total) : 0}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Management Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Management Actions</CardTitle>
                    <CardDescription>Monitor and manage the order ecosystem</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:border-brand-orange hover:text-brand-orange transition-colors"
                            onClick={() => window.location.href = '/stores'}
                        >
                            <Store className="w-6 h-6" />
                            <span>Store Orders</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:border-brand-pink hover:text-brand-pink transition-colors"
                            onClick={() => window.location.href = '/riders'}
                        >
                            <Truck className="w-6 h-6" />
                            <span>Delivery Status</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:border-brand-orange hover:text-brand-orange transition-colors"
                            onClick={() => window.location.href = '/analytics'}
                        >
                            <TrendingUp className="w-6 h-6" />
                            <span>Order Analytics</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:border-brand-pink hover:text-brand-pink transition-colors"
                            onClick={() => fetchStats()}
                        >
                            <ShoppingCart className="w-6 h-6" />
                            <span>Refresh Data</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Order Status Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Status Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <h5 className="font-semibold text-yellow-800">Pending</h5>
                                    <p className="text-sm text-yellow-700">Order placed, waiting for store confirmation</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <Package className="w-5 h-5 text-blue-600" />
                                <div>
                                    <h5 className="font-semibold text-blue-800">Preparing</h5>
                                    <p className="text-sm text-blue-700">Store is preparing the order</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <Truck className="w-5 h-5 text-purple-600" />
                                <div>
                                    <h5 className="font-semibold text-purple-800">Out for Delivery</h5>
                                    <p className="text-sm text-purple-700">Rider has picked up and is delivering</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <div>
                                    <h5 className="font-semibold text-green-800">Delivered</h5>
                                    <p className="text-sm text-green-700">Order successfully delivered to customer</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Platform Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Average Order Value:</span>
                                    <Badge variant="outline">
                                        ₹{stats.orders.total > 0 ? Math.round(stats.revenue.total / stats.orders.total) : 0}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Total Orders Processed:</span>
                                    <Badge variant="outline">{stats.orders.total}</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Monthly Order Volume:</span>
                                    <Badge variant="outline">{stats.orders.thisMonth}</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Platform Revenue:</span>
                                    <Badge variant="outline">₹{stats.revenue.total.toLocaleString()}</Badge>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Information Note */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Management Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <h5 className="font-semibold text-blue-800 mb-2">Decentralized Order Management</h5>
                        <p className="text-sm text-blue-700 mb-3">
                            Orders are managed directly by store owners and riders through their respective dashboards.
                            As an admin, you can monitor overall statistics and performance metrics.
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Store owners handle order acceptance and preparation</li>
                            <li>• Riders manage pickup and delivery processes</li>
                            <li>• Real-time updates are provided to customers</li>
                            <li>• Commission and payments are processed automatically</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}






