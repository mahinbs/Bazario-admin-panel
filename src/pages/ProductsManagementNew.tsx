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
    Store,
    ShoppingCart,
    Filter,
    TrendingUp,
    DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchMockProducts, fetchMockStores, fetchMockDashboardStats } from "@/lib/mockData";
import ProductsList from "@/components/ProductsList";

interface DashboardStats {
    stores: {
        total: number;
        active: number;
    };
    products: {
        total: number;
    };
    revenue: {
        total: number;
    };
}

export default function ProductsManagementNew() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const fetchStats = async () => {
        try {
            // Fetch necessary data to calculate stats
            const [stores, productsData, dashboardStats] = await Promise.all([
                fetchMockStores(),
                fetchMockProducts(1, 1), // We just need the total count
                fetchMockDashboardStats()
            ]);

            setStats({
                stores: {
                    total: stores.length,
                    active: stores.filter(s => s.status === 'active').length
                },
                products: {
                    total: productsData.total
                },
                revenue: {
                    total: dashboardStats.totalRevenue
                }
            });
        } catch (error: any) {
            console.error('Failed to fetch stats:', error);
            toast({
                title: "Error",
                description: "Failed to load product statistics",
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
                    <h1 className="text-3xl font-bold text-foreground">Products Management</h1>
                    <p className="text-muted-foreground">Overview of products across all stores</p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-orange/10 rounded-lg">
                                    <Package className="w-6 h-6 text-brand-orange" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.products.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-pink/10 rounded-lg">
                                    <Store className="w-6 h-6 text-brand-pink" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Active Stores</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.stores.active}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-gradient/10 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-brand-pink" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Avg Products/Store</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {stats.stores.active > 0 ? Math.round(stats.products.total / stats.stores.active) : 0}
                                    </p>
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
                </div>
            )}

            {/* Product Management Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-brand-orange" />
                            Product Overview
                        </CardTitle>
                        <CardDescription>
                            Products are managed by individual store owners
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-semibold mb-2">How Products Work</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Store owners add and manage their own products</li>
                                    <li>• Products include images, descriptions, and pricing</li>
                                    <li>• Stores can categorize products for better organization</li>
                                    <li>• Products are automatically available to customers</li>
                                </ul>
                            </div>
                            <Button className="w-full bg-brand-gradient text-white shadow-soft hover:shadow-glow transition-all duration-300" onClick={() => window.location.href = '/stores'}>
                                <Store className="w-4 h-4 mr-2" />
                                View Store Products
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-admin-success" />
                            Product Statistics
                        </CardTitle>
                        <CardDescription>
                            Platform-wide product metrics
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-xl font-bold text-admin-coral">{stats.products.total}</div>
                                        <div className="text-xs text-muted-foreground">Total Products</div>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-xl font-bold text-admin-success">{stats.stores.active}</div>
                                        <div className="text-xs text-muted-foreground">Active Stores</div>
                                    </div>
                                </div>
                                <div className="p-3 bg-admin-success/10 rounded-lg text-center">
                                    <div className="text-lg font-bold text-admin-success">
                                        ₹{stats.revenue.total.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Total Revenue Generated</div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Management Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Management Actions</CardTitle>
                    <CardDescription>Actions available for product oversight</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:border-brand-orange hover:text-brand-orange transition-colors"
                            onClick={() => window.location.href = '/stores'}
                        >
                            <Store className="w-6 h-6" />
                            <span>View Store Products</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:border-brand-pink hover:text-brand-pink transition-colors"
                            onClick={() => window.location.href = '/analytics'}
                        >
                            <TrendingUp className="w-6 h-6" />
                            <span>Product Analytics</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:border-brand-orange hover:text-brand-orange transition-colors"
                            onClick={() => fetchStats()}
                        >
                            <Package className="w-6 h-6" />
                            <span>Refresh Stats</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Management Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                <h5 className="font-semibold text-blue-800">Store Responsibility</h5>
                                <p className="text-sm text-blue-700">
                                    Individual stores are responsible for adding, updating, and managing their product catalog.
                                </p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                <h5 className="font-semibold text-green-800">Quality Control</h5>
                                <p className="text-sm text-green-700">
                                    While stores manage products, admins can monitor overall quality and platform standards.
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                <h5 className="font-semibold text-yellow-800">Revenue Tracking</h5>
                                <p className="text-sm text-yellow-700">
                                    All product sales contribute to platform revenue through commission structures.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Products per Active Store:</span>
                                    <Badge variant="outline">
                                        {stats.stores.active > 0 ? Math.round(stats.products.total / stats.stores.active) : 0} avg
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Total Platform Products:</span>
                                    <Badge variant="outline">{stats.products.total}</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Revenue Generated:</span>
                                    <Badge variant="outline">₹{stats.revenue.total.toLocaleString()}</Badge>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Products List */}
            <ProductsList showStoreInfo={true} />
        </div>
    );
}
