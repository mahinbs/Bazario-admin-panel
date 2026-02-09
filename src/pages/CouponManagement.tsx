import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    TicketPercent,
    Plus,
    Trash2,
    Search,
    Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchMockCoupons, delay, Coupon as MockCoupon } from "@/lib/mockData";

// Extend MockCoupon or redefine to match component needs if slightly different
// Using local interface for component adapting mock data
interface Coupon {
    id: string;
    code: string;
    name: string;
    description: string;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    minimum_order_amount: number;
    maximum_discount_amount?: number;
    usage_limit_per_customer: number;
    total_usage_limit?: number;
    total_used_count: number;
    is_active: boolean;
    valid_from: string;
    valid_until: string;
    created_at: string;
    updated_at: string;
}

const CouponManagement: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [copiedCode, setCopiedCode] = useState('');
    const [deletingCoupon, setDeletingCoupon] = useState<string | null>(null);
    const { toast } = useToast();

    // Helper function to get IST date-time string
    const getISTDateTime = (date: Date) => {
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const istDate = new Date(date.getTime() + istOffset);
        return istDate.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        discount_type: 'percentage' as 'percentage' | 'fixed_amount',
        discount_value: '',
        minimum_order_amount: '',
        maximum_discount_amount: '',
        usage_limit_per_customer: '1',
        total_usage_limit: '',
        valid_from: getISTDateTime(new Date()),
        valid_until: getISTDateTime(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        is_user_specific: false,
        specific_user_email: ''
    });

    // Load coupons
    const loadCoupons = async () => {
        setLoading(true);
        try {
            const mockData = await fetchMockCoupons();
            const mappedCoupons: Coupon[] = mockData.map(c => ({
                id: c.id,
                code: c.code,
                name: `Discount ${c.code}`,
                description: `Get ${c.discountValue}${c.discountType === 'percentage' ? '%' : ' OFF'}`,
                discount_type: c.discountType === 'percentage' ? 'percentage' : 'fixed_amount',
                discount_value: c.discountValue,
                minimum_order_amount: c.minOrderValue,
                usage_limit_per_customer: 1,
                total_usage_limit: c.usageLimit,
                total_used_count: c.usageCount,
                is_active: c.status === 'active',
                valid_from: new Date().toISOString(),
                valid_until: c.expiryDate,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }));
            setCoupons(mappedCoupons);
        } catch (error) {
            console.error('Error loading coupons:', error);
            toast({
                title: "Error",
                description: "Failed to load coupons. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoupons();
    }, []);

    // Filter coupons
    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch =
            coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && coupon.is_active && new Date(coupon.valid_until) > new Date()) ||
            (statusFilter === 'inactive' && (!coupon.is_active || new Date(coupon.valid_until) <= new Date())) ||
            (statusFilter === 'expired' && new Date(coupon.valid_until) <= new Date());

        return matchesSearch && matchesStatus;
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            description: '',
            discount_type: 'percentage',
            discount_value: '',
            minimum_order_amount: '',
            maximum_discount_amount: '',
            usage_limit_per_customer: '1',
            total_usage_limit: '',
            valid_from: getISTDateTime(new Date()),
            valid_until: getISTDateTime(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
            is_user_specific: false,
            specific_user_email: ''
        });
        setEditingCoupon(null);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await delay(500); // Simulate API

            const newCoupon: Coupon = {
                id: editingCoupon ? editingCoupon.id : `coupon-${Date.now()}`,
                code: formData.code.toUpperCase(),
                name: formData.name,
                description: formData.description,
                discount_type: formData.discount_type,
                discount_value: parseFloat(formData.discount_value),
                minimum_order_amount: parseFloat(formData.minimum_order_amount) || 0,
                usage_limit_per_customer: parseInt(formData.usage_limit_per_customer),
                total_usage_limit: formData.total_usage_limit ? parseInt(formData.total_usage_limit) : undefined,
                total_used_count: editingCoupon ? editingCoupon.total_used_count : 0,
                is_active: true,
                valid_from: new Date(formData.valid_from).toISOString(),
                valid_until: new Date(formData.valid_until).toISOString(),
                created_at: editingCoupon ? editingCoupon.created_at : new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            if (editingCoupon) {
                setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? newCoupon : c));
                toast({
                    title: "Success",
                    description: "Coupon updated successfully!",
                });
            } else {
                setCoupons(prev => [newCoupon, ...prev]);
                toast({
                    title: "Success",
                    description: "Coupon created successfully!",
                });
            }

            setIsDialogOpen(false);
            resetForm();
        } catch (error: any) {
            console.error('Error saving coupon:', error);
            toast({
                title: "Error",
                description: "Failed to save coupon. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Edit coupon
    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);

        const istOffset = 5.5 * 60 * 60 * 1000;
        const validFromIST = getISTDateTime(new Date(coupon.valid_from || coupon.created_at));
        const validUntilIST = getISTDateTime(new Date(coupon.valid_until));

        setFormData({
            code: coupon.code,
            name: coupon.name,
            description: coupon.description,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value.toString(),
            minimum_order_amount: coupon.minimum_order_amount.toString(),
            maximum_discount_amount: coupon.maximum_discount_amount?.toString() || '',
            usage_limit_per_customer: coupon.usage_limit_per_customer.toString(),
            total_usage_limit: coupon.total_usage_limit?.toString() || '',
            valid_from: validFromIST,
            valid_until: validUntilIST,
            is_user_specific: false,
            specific_user_email: ''
        });
        setIsDialogOpen(true);
    };

    // Toggle coupon status
    const toggleCouponStatus = async (coupon: Coupon) => {
        try {
            await delay(300); // Simulate API
            setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, is_active: !c.is_active } : c));

            toast({
                title: "Success",
                description: `Coupon ${!coupon.is_active ? 'activated' : 'deactivated'} successfully!`,
            });

        } catch (error) {
            console.error('Error toggling coupon status:', error);
            toast({
                title: "Error",
                description: "Failed to update coupon status.",
                variant: "destructive",
            });
        }
    };

    // Copy coupon code
    const copyCouponCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast({
            title: "Copied!",
            description: `Coupon code "${code}" copied to clipboard.`,
        });
        setTimeout(() => setCopiedCode(''), 2000);
    };

    // Delete coupon
    const deleteCoupon = async (coupon: Coupon) => {
        if (!confirm(`Are you sure you want to delete the coupon "${coupon.code}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingCoupon(coupon.id);
        try {
            await delay(500); // Simulate API
            setCoupons(prev => prev.filter(c => c.id !== coupon.id));

            toast({
                title: "Success",
                description: `Coupon "${coupon.code}" has been deleted successfully.`,
            });

        } catch (error: any) {
            console.error('Error deleting coupon:', error);
            toast({
                title: "Error",
                description: "Failed to delete coupon. Please try again.",
                variant: "destructive",
            });
        } finally {
            setDeletingCoupon(null);
        }
    };

    // Get status badge
    const getStatusBadge = (coupon: Coupon) => {
        const isExpired = new Date(coupon.valid_until) <= new Date();
        const isLimitReached = coupon.total_usage_limit && coupon.total_used_count >= coupon.total_usage_limit;

        if (!coupon.is_active) {
            return <Badge variant="secondary">Inactive</Badge>;
        } else if (isExpired) {
            return <Badge variant="destructive">Expired</Badge>;
        } else if (isLimitReached) {
            return <Badge variant="outline">Limit Reached</Badge>;
        } else {
            return <Badge className="bg-admin-success hover:bg-admin-success/90">Active</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Coupon Management</h1>
                    <p className="text-gray-600">Create and manage discount coupons for your customers</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-primary hover:shadow-lg transition-all duration-300">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Coupon
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
                            <DialogDescription>
                                {editingCoupon ? 'Update the coupon details' : 'Create a new discount coupon for customers'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Coupon Code *</label>
                                    <Input
                                        value={formData.code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                        placeholder="SAVE20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Coupon Name *</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="20% Off Special"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Get 20% off on all orders above $100"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Discount Type *</label>
                                    <Select value={formData.discount_type} onValueChange={(value: 'percentage' | 'fixed_amount') => setFormData(prev => ({ ...prev, discount_type: value }))}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                            <SelectItem value="fixed_amount">Fixed Amount (₹)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.discount_value}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                                        placeholder={formData.discount_type === 'percentage' ? '20' : '50'}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Minimum Order Amount (₹)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.minimum_order_amount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, minimum_order_amount: e.target.value }))}
                                        placeholder="0"
                                    />
                                </div>
                                {formData.discount_type === 'percentage' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Maximum Discount (₹)</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.maximum_discount_amount}
                                            onChange={(e) => setFormData(prev => ({ ...prev, maximum_discount_amount: e.target.value }))}
                                            placeholder="100"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Usage Limit Per Customer *</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.usage_limit_per_customer}
                                        onChange={(e) => setFormData(prev => ({ ...prev, usage_limit_per_customer: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Usage Limit</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.total_usage_limit}
                                        onChange={(e) => setFormData(prev => ({ ...prev, total_usage_limit: e.target.value }))}
                                        placeholder="Leave empty for unlimited"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Valid From * (IST)</label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.valid_from}
                                        onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Valid Until * (IST)</label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.valid_until}
                                        onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={loading} className="bg-primary hover:shadow-lg transition-all duration-300">
                                    {loading ? 'Saving...' : (editingCoupon ? 'Update Coupon' : 'Create Coupon')}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search coupons by code or name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Coupons List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : filteredCoupons.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <TicketPercent className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-2">
                                {searchTerm || statusFilter !== 'all' ? 'No coupons found' : 'No coupons created yet'}
                            </p>
                            <p className="text-sm text-gray-400">
                                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first coupon to get started'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredCoupons.map((coupon) => (
                        <Card key={coupon.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold">{coupon.name}</h3>
                                            <div className="flex items-center gap-2 bg-secondary/20 px-3 py-1 rounded-md cursor-pointer hover:bg-secondary/30 transition-colors"
                                                onClick={() => copyCouponCode(coupon.code)}>
                                                <code className="text-primary font-mono font-bold">{coupon.code}</code>
                                                {copiedCode === coupon.code ? <span className="text-xs text-green-600 font-medium">Copied!</span> : <Copy className="h-3 w-3 text-muted-foreground" />}
                                            </div>
                                            {getStatusBadge(coupon)}
                                        </div>
                                        <p className="text-gray-600 mb-4">{coupon.description}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                                            <div>
                                                <span className="font-medium text-gray-700 block">Date Range</span>
                                                {new Date(coupon.valid_from).toLocaleDateString()} - {new Date(coupon.valid_until).toLocaleDateString()}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 block">Usage</span>
                                                {coupon.total_used_count} / {coupon.total_usage_limit || '∞'}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 block">Min. Order</span>
                                                ₹{coupon.minimum_order_amount}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700 block">Discount</span>
                                                {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={coupon.is_active ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                            onClick={() => toggleCouponStatus(coupon)}
                                        >
                                            {coupon.is_active ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteCoupon(coupon)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default CouponManagement;
