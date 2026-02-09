import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Truck,
    MapPin,
    Clock,
    CheckCircle,
    AlertTriangle,
    Users,
    Package,
    Route,
    Activity,
    RefreshCw,
    TrendingUp,
    Eye,
    Phone,
    Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface DashboardStats {
    stores: {
        total: number;
        active: number;
    };
    riders: {
        total: number;
        active: number;
    };
    orders: {
        total: number;
        thisMonth: number;
    };
    revenue: {
        total: number;
        thisMonth: number;
    };
}

export default function DeliveryManagementNew() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
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
                description: "Failed to load delivery statistics",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const loadOrderDetails = async (orderId: string) => {
        try {
            setLoadingOrderDetails(true);
            const response = await api.getOrderDetails(orderId);
            setOrderDetails(response.data);
        } catch (error) {
            console.error('Failed to load order details:', error);
            toast({
                title: "Error",
                description: "Failed to load order details",
                variant: "destructive",
            });
        } finally {
            setLoadingOrderDetails(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setOrdersLoading(true);
            const response = await api.getOrders({ limit: 50 });
            if (response.success && response.data) {
                setOrders(response.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch orders:', error);
            toast({
                title: "Error",
                description: "Failed to load orders",
                variant: "destructive",
            });
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchOrders();

        // Set up real-time updates for orders
        const interval = setInterval(() => {
            fetchOrders();
        }, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval);
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
                    <h1 className="text-3xl font-bold text-foreground">Delivery Management</h1>
                    <p className="text-muted-foreground">Monitor and manage delivery operations</p>
                </div>
                <Button onClick={fetchStats} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                </Button>
            </div>

            {/* Key Metrics */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 rounded-lg bg-brand-orange/10">
                                        <Truck className="w-6 h-6 text-brand-orange" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-foreground">{stats.riders.active}</p>
                                    <p className="text-sm text-muted-foreground">Active Riders</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center text-sm text-brand-orange">
                                    <Activity className="w-4 h-4 mr-1" />
                                    {stats.riders.total} total riders
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 rounded-lg bg-brand-pink/10">
                                        <Package className="w-6 h-6 text-brand-pink" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-foreground">{stats.orders.total}</p>
                                    <p className="text-sm text-muted-foreground">Total Deliveries</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center text-sm text-brand-pink">
                                    <TrendingUp className="w-4 h-4 mr-1" />
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
                                        <MapPin className="w-6 h-6 text-admin-warning" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-foreground">{stats.stores.active}</p>
                                    <p className="text-sm text-muted-foreground">Pickup Locations</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center text-sm text-admin-warning">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    Active stores
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 rounded-lg bg-admin-success/10">
                                        <Clock className="w-6 h-6 text-admin-success" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-foreground">
                                        {stats.orders.total > 0 ? '~25' : '0'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center text-sm text-admin-success">
                                    <Clock className="w-4 h-4 mr-1" />
                                    minutes
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delivery Operations Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-brand-orange" />
                            Delivery Network
                        </CardTitle>
                        <CardDescription>Current delivery infrastructure status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-xl font-bold text-brand-orange">{stats.riders.active}</div>
                                        <div className="text-sm text-muted-foreground">Active Riders</div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg">
                                        <div className="text-xl font-bold text-brand-pink">{stats.stores.active}</div>
                                        <div className="text-sm text-muted-foreground">Pickup Points</div>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="font-semibold mb-2">Network Coverage</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Our delivery network spans across {stats.stores.active} active store locations
                                        with {stats.riders.active} dedicated riders ensuring fast and reliable delivery service.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-brand-pink" />
                            Delivery Performance
                        </CardTitle>
                        <CardDescription>Key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-4">
                                <div className="p-3 bg-brand-gradient/10 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-brand-orange">{stats.orders.total}</div>
                                    <div className="text-sm text-muted-foreground">Total Deliveries Completed</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-lg font-bold text-brand-pink">{stats.orders.thisMonth}</div>
                                        <div className="text-xs text-muted-foreground">This Month</div>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-lg font-bold text-admin-warning">
                                            {stats.riders.active > 0 ? Math.round(stats.orders.total / stats.riders.active) : 0}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Avg/Rider</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delivery Management Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Delivery Management Actions</CardTitle>
                    <CardDescription>Monitor and manage delivery operations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange/50 transition-all"
                            onClick={() => window.location.href = '/riders'}
                        >
                            <Truck className="w-6 h-6" />
                            <span>Manage Riders</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:bg-brand-pink/10 hover:text-brand-pink hover:border-brand-pink/50 transition-all"
                            onClick={() => window.location.href = '/stores'}
                        >
                            <MapPin className="w-6 h-6" />
                            <span>Pickup Locations</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:bg-admin-warning/10 hover:text-admin-warning hover:border-admin-warning/50 transition-all"
                            onClick={() => window.location.href = '/orders'}
                        >
                            <Package className="w-6 h-6" />
                            <span>Track Deliveries</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:bg-admin-success/10 hover:text-admin-success hover:border-admin-success/50 transition-all"
                            onClick={() => fetchStats()}
                        >
                            <Activity className="w-6 h-6" />
                            <span>Live Monitoring</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Delivery Status Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Process Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-brand-orange/5 rounded-lg border border-brand-orange/10">
                                <Package className="w-5 h-5 text-brand-orange" />
                                <div>
                                    <h5 className="font-semibold text-foreground">Order Received</h5>
                                    <p className="text-sm text-muted-foreground">Store receives order and begins preparation</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-brand-pink/5 rounded-lg border border-brand-pink/10">
                                <Clock className="w-5 h-5 text-brand-pink" />
                                <div>
                                    <h5 className="font-semibold text-foreground">Ready for Pickup</h5>
                                    <p className="text-sm text-muted-foreground">Rider is assigned and notified</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-admin-warning/5 rounded-lg border border-admin-warning/10">
                                <Truck className="w-5 h-5 text-admin-warning" />
                                <div>
                                    <h5 className="font-semibold text-foreground">Out for Delivery</h5>
                                    <p className="text-sm text-muted-foreground">Rider picks up and delivers to customer</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-admin-success/5 rounded-lg border border-admin-success/10">
                                <CheckCircle className="w-5 h-5 text-admin-success" />
                                <div>
                                    <h5 className="font-semibold text-foreground">Delivered</h5>
                                    <p className="text-sm text-muted-foreground">Order successfully completed</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Delivery Network:</span>
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                        {stats.riders.active > 0 ? 'Operational' : 'Limited'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Active Riders:</span>
                                    <Badge variant="outline">{stats.riders.active}/{stats.riders.total}</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Pickup Locations:</span>
                                    <Badge variant="outline">{stats.stores.active} active</Badge>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm font-medium">Total Deliveries:</span>
                                    <Badge variant="outline">{stats.orders.total}</Badge>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Delivery Management Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-brand-gradient/5 rounded-lg border border-brand-pink/20">
                        <h5 className="font-semibold text-brand-pink mb-2">Automated Delivery System</h5>
                        <p className="text-sm text-muted-foreground mb-3">
                            Our delivery system operates through a network of independent riders and store partners.
                            Orders are automatically assigned to available riders for efficient delivery.
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Real-time rider tracking and assignment</li>
                            <li>• Automated notifications to customers</li>
                            <li>• Performance monitoring and analytics</li>
                            <li>• Quality control and feedback systems</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5" />
                        <span>Recent Orders</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchOrders}
                            disabled={ordersLoading}
                            className="ml-auto"
                        >
                            <RefreshCw className={`h-4 w-4 ${ordersLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </CardTitle>
                    <CardDescription>
                        Real-time order status updates
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {ordersLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No orders found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.slice(0, 10).map((order: any) => (
                                <Card key={order.id} className="border border-border/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-3">
                                                    <span className="font-medium">#{order.id.slice(-8)}</span>
                                                    <Badge
                                                        variant={
                                                            order.status === 'delivered' ? 'default' :
                                                                order.status === 'cancelled' ? 'destructive' :
                                                                    order.status === 'on_the_way' ? 'secondary' :
                                                                        'outline'
                                                        }
                                                    >
                                                        {order.status.replace('_', ' ').toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center space-x-1">
                                                        <Users className="h-3 w-3" />
                                                        <span>{order.customer_name}</span>
                                                    </span>
                                                    <span className="flex items-center space-x-1">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{order.store_owners?.store_name || 'Unknown Store'}</span>
                                                    </span>
                                                    <span className="flex items-center space-x-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{new Date(order.created_at).toLocaleTimeString()}</span>
                                                    </span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {order.order_items?.length || 0} items • ₹{order.total_amount}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={async () => {
                                                        setSelectedOrder(order);
                                                        setIsOrderDialogOpen(true);
                                                        await loadOrderDetails(order.id);
                                                    }}
                                                    className="mr-2"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View Details
                                                </Button>
                                                {order.status === 'delivered' && (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                )}
                                                {order.status === 'cancelled' && (
                                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                                )}
                                                {['on_the_way', 'picked_up'].includes(order.status) && (
                                                    <Truck className="h-5 w-5 text-blue-500" />
                                                )}
                                                {['pending', 'preparing', 'ready_for_pickup'].includes(order.status) && (
                                                    <Activity className="h-5 w-5 text-orange-500 animate-pulse" />
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {orders.length > 10 && (
                                <div className="text-center pt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Showing 10 of {orders.length} orders
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Order Details {selectedOrder && `#${selectedOrder.id.slice(-8)}`}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Order Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Order ID</p>
                                    <p className="text-lg font-semibold">#{selectedOrder.id.slice(-8)}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                    <Badge className={`${selectedOrder.status === 'delivered' ? 'bg-green-500' :
                                        selectedOrder.status === 'cancelled' ? 'bg-red-500' :
                                            selectedOrder.status === 'pending' ? 'bg-yellow-500' :
                                                'bg-blue-500'
                                        } text-white`}>
                                        {selectedOrder.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                    <p className="text-lg font-semibold">₹{selectedOrder.total_amount}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Order Date</p>
                                    <p className="text-sm">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Order Type</p>
                                    <p className="text-sm capitalize">{selectedOrder.order_type || 'delivery'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                                    <p className="text-sm capitalize">{selectedOrder.payment_method || 'COD'}</p>
                                </div>
                            </div>

                            {loadingOrderDetails ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <span className="ml-2">Loading order details...</span>
                                </div>
                            ) : orderDetails ? (
                                <>
                                    {/* Customer Details */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Customer Information
                                        </h3>
                                        <div className="p-4 border rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                                    <p className="font-medium">{orderDetails.customer_name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">{orderDetails.customer_phone}</p>
                                                        <a
                                                            href={`tel:${orderDetails.customer_phone}`}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                                                    <p className="font-medium">{orderDetails.customer_address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Store Details */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            Store Information
                                        </h3>
                                        {orderDetails.store_owners && (
                                            <div className="p-4 border rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Store Name</p>
                                                        <p className="font-medium">{orderDetails.store_owners.store_name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Category</p>
                                                        <p className="font-medium">{orderDetails.store_owners.category || 'Restaurant'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Phone</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">{orderDetails.store_owners.phone}</p>
                                                            <a
                                                                href={`tel:${orderDetails.store_owners.phone}`}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                <Phone className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Address</p>
                                                        <p className="font-medium">{orderDetails.store_owners.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Delivery Partner Details (only if assigned) */}
                                    {orderDetails.riders && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                <Truck className="w-5 h-5" />
                                                Delivery Partner
                                            </h3>
                                            <div className="p-4 border rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Rider Name</p>
                                                        <p className="font-medium">{orderDetails.riders.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Phone</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">{orderDetails.riders.phone}</p>
                                                            <a
                                                                href={`tel:${orderDetails.riders.phone}`}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                <Phone className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Experience</p>
                                                        <p className="font-medium">{orderDetails.riders.total_deliveries || 0} deliveries</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Package className="w-5 h-5" />
                                            Order Items ({orderDetails.order_items?.length || 0})
                                        </h3>
                                        {orderDetails.order_items && orderDetails.order_items.length > 0 ? (
                                            <div className="space-y-3">
                                                {orderDetails.order_items.map((item: any, index: number) => (
                                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            {item.products?.image_url && (
                                                                <img
                                                                    src={item.products.image_url}
                                                                    alt={item.products.name}
                                                                    className="w-12 h-12 rounded object-cover"
                                                                />
                                                            )}
                                                            <div>
                                                                <p className="font-medium">{item.products?.name || 'Product'}</p>
                                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold">₹{item.price}</p>
                                                            <p className="text-sm text-gray-500">₹{item.price / item.quantity} each</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm">Subtotal:</span>
                                                        <span className="font-medium">₹{orderDetails.total_amount - (orderDetails.delivery_fee || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm">Delivery Fee:</span>
                                                        <span className="font-medium">₹{orderDetails.delivery_fee || 0}</span>
                                                    </div>
                                                    <hr className="my-2" />
                                                    <div className="flex justify-between items-center font-semibold">
                                                        <span>Total:</span>
                                                        <span>₹{orderDetails.total_amount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No items found</p>
                                        )}
                                    </div>

                                    {/* Timestamps */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            Order Timeline
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span className="text-sm">Order Placed:</span>
                                                <span className="text-sm font-medium">{new Date(orderDetails.created_at).toLocaleString()}</span>
                                            </div>
                                            {orderDetails.confirmed_at && (
                                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                    <span className="text-sm">Confirmed:</span>
                                                    <span className="text-sm font-medium">{new Date(orderDetails.confirmed_at).toLocaleString()}</span>
                                                </div>
                                            )}
                                            {orderDetails.rider_assigned_at && (
                                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                    <span className="text-sm">Rider Assigned:</span>
                                                    <span className="text-sm font-medium">{new Date(orderDetails.rider_assigned_at).toLocaleString()}</span>
                                                </div>
                                            )}
                                            {orderDetails.picked_up_at && (
                                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                    <span className="text-sm">Picked Up:</span>
                                                    <span className="text-sm font-medium">{new Date(orderDetails.picked_up_at).toLocaleString()}</span>
                                                </div>
                                            )}
                                            {orderDetails.delivered_at && (
                                                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                    <span className="text-sm">Delivered:</span>
                                                    <span className="text-sm font-medium">{new Date(orderDetails.delivered_at).toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : null}

                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}


