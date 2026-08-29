import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Search,
    MoreHorizontal,
    Eye,
    Trash2,
    Store,
    DollarSign,
    Package,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Filter,
    TrendingUp,
    Check,
    X,
    Pause,
    Clock,
    Building,
    CreditCard,
    FileText,
    Truck,
    Settings
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Store {
    id: string;
    store_name: string;
    owner_name: string;
    email: string;
    phone: string;
    address: string;
    business_type: string;
    category: string;
    description?: string;
    gst_number?: string;
    pan_number?: string;
    upi_id?: string;
    bank_account_number?: string;
    bank_name?: string;
    ifsc_code?: string;
    account_holder_name?: string;
    delivery_radius_km?: number;
    min_order_amount?: number;
    delivery_fee?: number;
    estimated_delivery_time?: number;
    service_types?: string[];
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    admin_notes?: string;
    created_at: string;
    reviewed_at?: string;
    reviewed_by?: {
        full_name: string;
    };
}

interface DashboardStats {
    stores: {
        total: number;
        active: number;
        pending: number;
        rejected: number;
    };
    products: {
        total: number;
    };
    revenue: {
        total: number;
    };
}

const statusFilters = ["all", "pending", "approved", "rejected", "suspended"];

const getStatusColor = (status: string) => {
    switch (status) {
        case "approved": return "bg-admin-success text-white";
        case "pending": return "bg-admin-warning text-white";
        case "rejected": return "bg-admin-error text-white";
        case "suspended": return "bg-gray-500 text-white";
        default: return "bg-muted text-muted-foreground";
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "approved": return <Check className="w-4 h-4" />;
        case "pending": return <Clock className="w-4 h-4" />;
        case "rejected": return <X className="w-4 h-4" />;
        case "suspended": return <Pause className="w-4 h-4" />;
        default: return null;
    }
};

export default function StoresManagementNew() {
    const [stores, setStores] = useState<Store[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        action: 'approve' | 'reject' | 'suspend' | 'delete' | null;
        store: Store | null;
    }>({ open: false, action: null, store: null });
    const [notes, setNotes] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const { toast } = useToast();

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await api.getStores({
                status: selectedStatus !== 'all' ? selectedStatus : undefined,
                search: searchTerm || undefined,
                limit: 100,
            });

            if (response.success && response.data) {
                setStores(response.data as Store[]);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to fetch stores",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.getDashboardStats();
            if (response.success && response.data) {
                const data = response.data as DashboardStats;
                setStats(data);
            }
        } catch (error: any) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        fetchStores();
    }, [selectedStatus]); // Search term usually doesn't trigger refetch if client-side filtering, but if valid API it would. Here we just fetch once or on status change.

    useEffect(() => {
        fetchStats();
    }, []);

    const handleStoreAction = async (action: 'approve' | 'reject' | 'suspend', storeId: string, notes?: string) => {
        try {
            setActionLoading(true);
            const statusMap = {
                approve: 'approved',
                reject: 'rejected',
                suspend: 'suspended',
            } as const;

            const response = await api.updateStoreStatus(storeId, statusMap[action], notes);
            if (!response.success) {
                throw new Error(response.message || `Failed to ${action} store`);
            }

            await fetchStores();
            toast({
                title: "Success",
                description: `Store ${action}d successfully`,
            });
            fetchStats();
            setActionDialog({ open: false, action: null, store: null });
            setNotes("");

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || `Failed to ${action} store`,
                variant: "destructive",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteStore = async (storeId: string) => {
        try {
            setActionLoading(true);
            const response = await api.deleteStore(storeId);
            if (!response.success) {
                throw new Error(response.message || 'Failed to delete store');
            }

            await fetchStores();
            toast({
                title: "Success",
                description: "Store deleted successfully",
            });
            fetchStats();
            setActionDialog({ open: false, action: null, store: null });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete store",
                variant: "destructive",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const openActionDialog = (action: 'approve' | 'reject' | 'suspend' | 'delete', store: Store) => {
        setActionDialog({ open: true, action, store });
        setNotes("");
    };

    const filteredStores = stores.filter(store => {
        // Filter by status if selectedStatus is not all (since we have all stores in memory now)
        if (selectedStatus !== 'all' && store.status !== selectedStatus) return false;

        const matchesSearch = !searchTerm ||
            store.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            store.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading && stores.length === 0) {
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
                    <h1 className="text-3xl font-bold text-foreground">Store Management</h1>
                    <p className="text-muted-foreground">Manage store owners and their marketplace presence</p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-orange/10 rounded-lg">
                                    <Store className="w-6 h-6 text-brand-orange" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.stores.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-admin-success/10 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-admin-success" />
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
                                <div className="p-2 bg-admin-warning/10 rounded-lg">
                                    <Store className="w-6 h-6 text-admin-warning" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.stores.pending}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-pink/10 rounded-lg">
                                    <Package className="w-6 h-6 text-brand-pink" />
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

            {/* Stores Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Stores</CardTitle>
                            <CardDescription>Manage store owners and their performance</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search stores..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2">
                                        <Filter className="w-4 h-4" />
                                        {selectedStatus === 'all' ? 'All' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {statusFilters.map((status) => (
                                        <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="w-6 h-6 border-4 border-admin-red/20 border-t-admin-red rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Store</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStores.map((store) => (
                                    <TableRow key={store.id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-brand-gradient text-primary-foreground">
                                                        {store.store_name ? store.store_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'S'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-foreground">{store.store_name}</div>
                                                    <div className="text-sm text-muted-foreground">{store.business_type}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium text-foreground">{store.owner_name}</div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    Joined {new Date(store.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {store.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Mail className="w-3 h-3" />
                                                    {store.email}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Phone className="w-3 h-3" />
                                                    {store.phone}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    {store.address.slice(0, 30)}...
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(store.status)}>
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(store.status)}
                                                    {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                                                </span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(store.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => setSelectedStore(store)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {store.status === 'pending' && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => openActionDialog('approve', store)}>
                                                                <Check className="mr-2 h-4 w-4" />
                                                                Approve Store
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openActionDialog('reject', store)}>
                                                                <X className="mr-2 h-4 w-4" />
                                                                Reject Store
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {store.status === 'approved' && (
                                                        <DropdownMenuItem onClick={() => openActionDialog('suspend', store)}>
                                                            <Pause className="mr-2 h-4 w-4" />
                                                            Suspend Store
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-admin-error"
                                                        onClick={() => openActionDialog('delete', store)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Store
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Action Dialog */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionDialog.action === 'approve' && 'Approve Store'}
                            {actionDialog.action === 'reject' && 'Reject Store'}
                            {actionDialog.action === 'suspend' && 'Suspend Store'}
                            {actionDialog.action === 'delete' && 'Delete Store'}
                        </DialogTitle>
                        <DialogDescription>
                            {actionDialog.action === 'approve' && `Are you sure you want to approve "${actionDialog.store?.store_name}"?`}
                            {actionDialog.action === 'reject' && `Are you sure you want to reject "${actionDialog.store?.store_name}"?`}
                            {actionDialog.action === 'suspend' && `Are you sure you want to suspend "${actionDialog.store?.store_name}"?`}
                            {actionDialog.action === 'delete' && `Are you sure you want to delete "${actionDialog.store?.store_name}"? This action cannot be undone.`}
                        </DialogDescription>
                    </DialogHeader>

                    {actionDialog.action !== 'delete' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes (optional)</label>
                            <Textarea
                                placeholder="Add any notes about this action..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setActionDialog({ open: false, action: null, store: null })}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={actionDialog.action === 'delete' ? 'destructive' : 'default'}
                            onClick={() => {
                                if (actionDialog.action === 'delete' && actionDialog.store) {
                                    handleDeleteStore(actionDialog.store.id);
                                } else if (actionDialog.action && actionDialog.store) {
                                    handleStoreAction(actionDialog.action, actionDialog.store.id, notes);
                                }
                            }}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Processing...' : 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Store Details Dialog */}
            <Dialog open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Store Details</DialogTitle>
                    </DialogHeader>
                    {selectedStore && (
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Basic Information */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    Store Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Store Name</label>
                                        <p className="text-sm text-muted-foreground">{selectedStore.store_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Owner Name</label>
                                        <p className="text-sm text-muted-foreground">{selectedStore.owner_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p className="text-sm text-muted-foreground">{selectedStore.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <p className="text-sm text-muted-foreground">{selectedStore.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Business Type</label>
                                        <p className="text-sm text-muted-foreground">{selectedStore.business_type}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Category</label>
                                        <p className="text-sm text-muted-foreground">{selectedStore.category}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium">Address</label>
                                        <p className="text-sm text-muted-foreground">{selectedStore.address}</p>
                                    </div>
                                    {selectedStore.description && (
                                        <div className="col-span-2">
                                            <label className="text-sm font-medium">Description</label>
                                            <p className="text-sm text-muted-foreground">{selectedStore.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Business Documents */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Business Documents
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedStore.gst_number && (
                                        <div>
                                            <label className="text-sm font-medium">GST Number</label>
                                            <p className="text-sm text-muted-foreground">{selectedStore.gst_number}</p>
                                        </div>
                                    )}
                                    {selectedStore.pan_number && (
                                        <div>
                                            <label className="text-sm font-medium">PAN Number</label>
                                            <p className="text-sm text-muted-foreground">{selectedStore.pan_number}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
