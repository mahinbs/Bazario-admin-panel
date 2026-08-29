import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    UserPlus,
    MoreHorizontal,
    Edit,
    Trash2,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    Calendar,
    Filter,
    Users,
    Store,
    Bike
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
}

interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    created_at: string;
    status?: string;
}

export default function UsersManagementNew() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [customersLoading, setCustomersLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    const fetchCustomers = async () => {
        try {
            setCustomersLoading(true);
            const response = await api.getCustomers({
                limit: 50,
                search: searchTerm || undefined,
            });
            if (response.success && response.data) {
                setCustomers(response.data as Customer[]);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to load customers",
                variant: "destructive",
            });
        } finally {
            setCustomersLoading(false);
        }
    };

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
                description: "Failed to load user statistics",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchCustomers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchCustomers(), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

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
                    <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                    <p className="text-muted-foreground">Manage stores, riders, and platform users</p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-orange/10 rounded-lg">
                                    <Store className="w-6 h-6 text-brand-orange" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Store Owners</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.stores.total}</p>
                                    <p className="text-xs text-muted-foreground">{stats.stores.active} active, {stats.stores.pending} pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-pink/10 rounded-lg">
                                    <Bike className="w-6 h-6 text-brand-pink" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Delivery Riders</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.riders.total}</p>
                                    <p className="text-xs text-muted-foreground">{stats.riders.active} active, {stats.riders.pending} pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-gradient/10 rounded-lg">
                                    <Users className="w-6 h-6 text-brand-pink" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Platform Users</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.stores.total + stats.riders.total}</p>
                                    <p className="text-xs text-muted-foreground">Stores + Riders</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* User Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-brand-orange" />
                            Store Owners
                        </CardTitle>
                        <CardDescription>
                            Manage store owner accounts and applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-xl font-bold text-admin-success">{stats.stores.active}</div>
                                        <div className="text-xs text-muted-foreground">Active</div>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-xl font-bold text-admin-warning">{stats.stores.pending}</div>
                                        <div className="text-xs text-muted-foreground">Pending</div>
                                    </div>
                                </div>
                                <Button className="w-full bg-brand-gradient text-white shadow-soft hover:shadow-glow transition-all duration-300" onClick={() => window.location.href = '/stores'}>
                                    <Store className="w-4 h-4 mr-2" />
                                    Manage Stores
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bike className="w-5 h-5 text-brand-pink" />
                            Delivery Riders
                        </CardTitle>
                        <CardDescription>
                            Manage delivery rider accounts and applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-xl font-bold text-admin-success">{stats.riders.active}</div>
                                        <div className="text-xs text-muted-foreground">Active</div>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-xl font-bold text-admin-warning">{stats.riders.pending}</div>
                                        <div className="text-xs text-muted-foreground">Pending</div>
                                    </div>
                                </div>
                                <Button className="w-full bg-brand-gradient text-white shadow-soft hover:shadow-glow transition-all duration-300" onClick={() => window.location.href = '/riders'}>
                                    <Bike className="w-4 h-4 mr-2" />
                                    Manage Riders
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>User Management Actions</CardTitle>
                    <CardDescription>Quick actions for managing platform users</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2"
                            onClick={() => window.location.href = '/stores'}
                        >
                            <Store className="w-6 h-6" />
                            <span>View All Stores</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2"
                            onClick={() => window.location.href = '/riders'}
                        >
                            <Bike className="w-6 h-6" />
                            <span>View All Riders</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2"
                            onClick={() => fetchStats()}
                        >
                            <Users className="w-6 h-6" />
                            <span>Refresh Stats</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Customers List */}
            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>Registered customers on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Input
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-md"
                        />
                    </div>
                    {customersLoading ? (
                        <p className="text-muted-foreground text-center py-8">Loading customers...</p>
                    ) : customers.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No customers found</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Joined</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="font-medium">{customer.name || '—'}</TableCell>
                                        <TableCell>{customer.email || '—'}</TableCell>
                                        <TableCell>{customer.phone || '—'}</TableCell>
                                        <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>User Management Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold mb-2">Store Owners</h4>
                            <p className="text-sm text-muted-foreground">
                                Store owners can register their businesses, add products, and manage orders.
                                They need admin approval before they can start selling on the platform.
                            </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold mb-2">Delivery Riders</h4>
                            <p className="text-sm text-muted-foreground">
                                Delivery riders handle the pickup and delivery of orders.
                                They need admin approval and must provide valid vehicle and license information.
                            </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold mb-2">User Management</h4>
                            <p className="text-sm text-muted-foreground">
                                Use the dedicated store and rider management pages to approve, reject, or manage individual accounts.
                                All user actions are logged for audit purposes.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}






