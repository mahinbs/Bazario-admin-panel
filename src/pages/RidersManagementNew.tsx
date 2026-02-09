import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Search,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Users,
    Star,
    DollarSign,
    Package,
    ShoppingCart,
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
    Bike,
    Download,
    Image as ImageIcon,
    FileText,
    User,
    CreditCard
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

interface Rider {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicle_type: string;
    vehicle_number: string;
    address: string;
    city: string;
    pincode: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    profile_photo_url?: string;
    driving_license_url?: string;
    vehicle_registration_url?: string;
    aadhaar_card_url?: string;
    status: 'pending' | 'verified' | 'approved' | 'rejected' | 'suspended';
    admin_notes?: string;
    created_at: string;
    reviewed_at?: string;
    reviewed_by?: {
        full_name: string;
    };
    rating: number;
    total_deliveries: number;
    total_earnings: number;
    is_online: boolean;
    last_online_at?: string;
}

interface DashboardStats {
    riders: {
        total: number;
        active: number;
        pending: number;
        rejected: number;
    };
}

const statusFilters = ["all", "pending", "pending_verification", "approved", "rejected", "suspended"];

const getStatusColor = (status: string) => {
    switch (status) {
        case "approved": return "bg-admin-success text-white";
        case "pending": return "bg-admin-warning text-white";
        case "verified": return "bg-admin-warning text-white";
        case "pending_verification": return "bg-admin-warning text-white";
        case "rejected": return "bg-admin-error text-white";
        case "suspended": return "bg-gray-500 text-white";
        default: return "bg-muted text-muted-foreground";
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "approved": return <Check className="w-4 h-4" />;
        case "pending": return <Clock className="w-4 h-4" />;
        case "verified": return <Clock className="w-4 h-4" />;
        case "pending_verification": return <Clock className="w-4 h-4" />;
        case "rejected": return <X className="w-4 h-4" />;
        case "suspended": return <Pause className="w-4 h-4" />;
        default: return null;
    }
};

export default function RidersManagementNew() {
    const [riders, setRiders] = useState<Rider[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        action: 'approve' | 'reject' | 'suspend' | 'delete' | null;
        rider: Rider | null;
    }>({ open: false, action: null, rider: null });
    const [notes, setNotes] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const { toast } = useToast();

    // Helper function to download images
    const downloadImage = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            toast({
                title: "Success",
                description: "Image downloaded successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to download image",
                variant: "destructive",
            });
        }
    };

    // Helper function to open image in new tab
    const openImage = (url: string) => {
        window.open(url, '_blank');
    };

    const fetchRiders = async () => {
        try {
            setLoading(true);
            const response = await api.getRiders({
                status: selectedStatus,
                search: searchTerm || undefined,
                limit: 100
            });

            if (response.success && response.data) {
                setRiders(response.data);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to fetch riders",
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
                setStats(response.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        fetchRiders();
    }, [selectedStatus, searchTerm]);

    useEffect(() => {
        fetchStats();
    }, []);

    const handleRiderAction = async (action: 'approve' | 'reject' | 'suspend', riderId: string, notes?: string) => {
        try {
            setActionLoading(true);
            const statusMap = {
                approve: 'approved',
                reject: 'rejected',
                suspend: 'suspended'
            } as const;

            const response = await api.updateRiderStatus(riderId, statusMap[action], notes);

            if (response.success) {
                toast({
                    title: "Success",
                    description: `Rider ${action}d successfully`,
                });
                fetchRiders();
                fetchStats();
                setActionDialog({ open: false, action: null, rider: null });
                setNotes("");
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || `Failed to ${action} rider`,
                variant: "destructive",
            });
        } finally {
            setActionLoading(false);
        }
    };

    /* const handleDeleteRider = async (riderId: string) => {
        try {
            setActionLoading(true);
            const response = await api.deleteRider(riderId);

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Rider deleted successfully",
                });
                fetchRiders();
                fetchStats();
                setActionDialog({ open: false, action: null, rider: null });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete rider",
                variant: "destructive",
            });
        } finally {
            setActionLoading(false);
        }
    }; */

    const openActionDialog = (action: 'approve' | 'reject' | 'suspend' /* | 'delete' */, rider: Rider) => {
        setActionDialog({ open: true, action, rider });
        setNotes("");
    };

    const filteredRiders = riders.filter(rider => {
        const matchesSearch = !searchTerm ||
            (rider.name && rider.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rider.phone.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading && riders.length === 0) {
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
                    <h1 className="text-3xl font-bold text-foreground">Riders Management</h1>
                    <p className="text-muted-foreground">Manage delivery riders and their status</p>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-orange/10 rounded-lg">
                                    <Bike className="w-6 h-6 text-brand-orange" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Riders</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.riders.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-brand-pink/10 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-brand-pink" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Active Riders</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.riders.active}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-admin-warning/10 rounded-lg">
                                    <Clock className="w-6 h-6 text-admin-warning" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.riders.pending}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-medium transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-admin-error/10 rounded-lg">
                                    <X className="w-6 h-6 text-admin-error" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.riders.rejected}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Riders Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Riders</CardTitle>
                            <CardDescription>Manage delivery riders and their status</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search riders..."
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
                                    <TableHead>Rider</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRiders.map((rider) => (
                                    <TableRow key={rider.id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-brand-gradient text-primary-foreground">
                                                        {rider.name ? rider.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'R'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-foreground">{rider.name || 'Unknown Rider'}</div>
                                                    <div className="text-sm text-muted-foreground">ID: {rider.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Mail className="w-3 h-3" />
                                                    {rider.email}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Phone className="w-3 h-3" />
                                                    {rider.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium text-foreground">{rider.vehicle_type}</div>
                                                <div className="text-sm text-muted-foreground">{rider.vehicle_number}</div>
                                                {rider.driving_license_url && (
                                                    <div className="text-xs text-muted-foreground">License: Available</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(rider.status)}>
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(rider.status)}
                                                    {rider.status.charAt(0).toUpperCase() + rider.status.slice(1)}
                                                </span>
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(rider.created_at).toLocaleDateString()}
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
                                                    <DropdownMenuItem onClick={() => setSelectedRider(rider)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {(rider.status === 'pending' || rider.status === 'verified') && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => openActionDialog('approve', rider)}>
                                                                <Check className="mr-2 h-4 w-4" />
                                                                Approve Rider
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => openActionDialog('reject', rider)}>
                                                                <X className="mr-2 h-4 w-4" />
                                                                Reject Rider
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {rider.status === 'approved' && (
                                                        <DropdownMenuItem onClick={() => openActionDialog('suspend', rider)}>
                                                            <Pause className="mr-2 h-4 w-4" />
                                                            Suspend Rider
                                                        </DropdownMenuItem>
                                                    )}
                                                    {/* <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-admin-error"
                                                        onClick={() => openActionDialog('delete', rider)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Rider
                                                    </DropdownMenuItem> */}
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
                            {actionDialog.action === 'approve' && 'Approve Rider'}
                            {actionDialog.action === 'reject' && 'Reject Rider'}
                            {actionDialog.action === 'suspend' && 'Suspend Rider'}
                            {/* {actionDialog.action === 'delete' && 'Delete Rider'} */}
                        </DialogTitle>
                        <DialogDescription>
                            {actionDialog.action === 'approve' && `Are you sure you want to approve "${actionDialog.rider?.name}"?`}
                            {actionDialog.action === 'reject' && `Are you sure you want to reject "${actionDialog.rider?.name}"?`}
                            {actionDialog.action === 'suspend' && `Are you sure you want to suspend "${actionDialog.rider?.name}"?`}
                            {/* {actionDialog.action === 'delete' && `Are you sure you want to delete "${actionDialog.rider?.name}"? This action cannot be undone.`} */}
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
                            onClick={() => setActionDialog({ open: false, action: null, rider: null })}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                // if (actionDialog.action === 'delete' && actionDialog.rider) {
                                //     handleDeleteRider(actionDialog.rider.id);
                                // } else 
                                if (actionDialog.action && actionDialog.rider && actionDialog.action !== 'delete') {
                                    handleRiderAction(actionDialog.action, actionDialog.rider.id, notes);
                                }
                            }}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Processing...' : 'Confirm'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rider Details Dialog */}
            <Dialog open={!!selectedRider} onOpenChange={() => setSelectedRider(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Rider Details</DialogTitle>
                    </DialogHeader>
                    {selectedRider && (
                        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Profile Photo Section */}
                            {selectedRider.profile_photo_url && (
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Profile Photo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 border rounded-lg overflow-hidden">
                                            <img
                                                src={selectedRider.profile_photo_url}
                                                alt="Profile"
                                                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => openImage(selectedRider.profile_photo_url!)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openImage(selectedRider.profile_photo_url!)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Full Size
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => downloadImage(selectedRider.profile_photo_url!, `${selectedRider.name}_profile.jpg`)}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Personal Information */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Personal Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Full Name</label>
                                        <p className="text-sm text-muted-foreground">{selectedRider.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p className="text-sm text-muted-foreground">{selectedRider.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <p className="text-sm text-muted-foreground">{selectedRider.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">City</label>
                                        <p className="text-sm text-muted-foreground">{selectedRider.city}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium">Address</label>
                                        <p className="text-sm text-muted-foreground">{selectedRider.address}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Pincode</label>
                                        <p className="text-sm text-muted-foreground">{selectedRider.pincode}</p>
                                    </div>
                                    {selectedRider.emergency_contact_name && (
                                        <div>
                                            <label className="text-sm font-medium">Emergency Contact</label>
                                            <p className="text-sm text-muted-foreground">
                                                {selectedRider.emergency_contact_name}
                                                {selectedRider.emergency_contact_phone && ` - ${selectedRider.emergency_contact_phone}`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Vehicle Information */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Bike className="w-4 h-4" />
                                    Vehicle Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Vehicle Type</label>
                                        <p className="text-sm text-muted-foreground">{selectedRider.vehicle_type}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Vehicle Number</label>
                                        <p className="text-sm text-muted-foreground">{selectedRider.vehicle_number}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Documents
                                </h4>
                                <div className="space-y-4">
                                    {/* Driving License */}
                                    {selectedRider.driving_license_url && (
                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-sm font-medium">Driving License</label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openImage(selectedRider.driving_license_url!)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => downloadImage(selectedRider.driving_license_url!, `${selectedRider.name}_license.jpg`)}
                                                    >
                                                        <Download className="w-4 h-4 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="w-full h-32 border rounded-lg overflow-hidden bg-muted">
                                                <img
                                                    src={selectedRider.driving_license_url}
                                                    alt="Driving License"
                                                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => openImage(selectedRider.driving_license_url!)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Vehicle Registration */}
                                    {selectedRider.vehicle_registration_url && (
                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-sm font-medium">Vehicle Registration</label>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openImage(selectedRider.vehicle_registration_url!)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => downloadImage(selectedRider.vehicle_registration_url!, `${selectedRider.name}_registration.jpg`)}
                                                    >
                                                        <Download className="w-4 h-4 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="w-full h-32 border rounded-lg overflow-hidden bg-muted">
                                                <img
                                                    src={selectedRider.vehicle_registration_url}
                                                    alt="Vehicle Registration"
                                                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                    onClick={() => openImage(selectedRider.vehicle_registration_url!)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Performance Stats */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    Performance Stats
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-lg font-bold text-admin-success">{selectedRider.rating.toFixed(1)}</div>
                                        <div className="text-xs text-muted-foreground">Rating</div>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-lg font-bold text-admin-coral">{selectedRider.total_deliveries}</div>
                                        <div className="text-xs text-muted-foreground">Deliveries</div>
                                    </div>
                                    <div className="text-center p-3 border rounded-lg">
                                        <div className="text-lg font-bold text-admin-warning">₹{selectedRider.total_earnings}</div>
                                        <div className="text-xs text-muted-foreground">Earnings</div>
                                    </div>
                                </div>
                            </div>

                            {/* Status and Admin Info */}
                            <div>
                                <h4 className="font-semibold mb-3">Status Information</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Current Status:</span>
                                        <Badge className={getStatusColor(selectedRider.status)}>
                                            {selectedRider.status.charAt(0).toUpperCase() + selectedRider.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Online Status:</span>
                                        <Badge className={selectedRider.is_online ? "bg-admin-success/10 text-admin-success border-admin-success/20" : "bg-muted text-muted-foreground border-muted-foreground/20"}>
                                            {selectedRider.is_online ? 'Online' : 'Offline'}
                                        </Badge>
                                    </div>
                                    {selectedRider.last_online_at && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Last Online:</span>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(selectedRider.last_online_at).toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedRider.admin_notes && (
                                <div>
                                    <label className="text-sm font-medium">Admin Notes</label>
                                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted/50 rounded-lg">{selectedRider.admin_notes}</p>
                                </div>
                            )}

                            {selectedRider.reviewed_at && (
                                <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                                    Reviewed on {new Date(selectedRider.reviewed_at).toLocaleDateString()}
                                    {selectedRider.reviewed_by && ` by ${selectedRider.reviewed_by.full_name}`}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
