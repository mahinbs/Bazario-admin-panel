import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    DollarSign,
    Percent,
    Calculator,
    Save,
    RefreshCw,
    TrendingUp,
    Users,
    Bike,
    Target,
    Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export default function Commission() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingStats, setLoadingStats] = useState(true);

    // Commission settings
    const [commissionSettings, setCommissionSettings] = useState({
        platformCommissionPercentage: "15.00",
        platformCommissionFixed: "0.00",
        riderBaseFee: "50.00",
        riderCommissionPercentage: "5.00",
        riderCommissionMaxCap: "30.00",
        riderDistanceBonusPerKm: "5.00",
        riderTimeBonusPerMinute: "0.50",
        deliveryFeeBase: "25.00",
        deliveryFeePerKm: "3.00",
        freeDeliveryThreshold: "500.00",
        codHandlingFee: "5.00",
        codFeePercentage: "1.00"
    });

    // Commission statistics
    const [stats, setStats] = useState({
        todayCommission: 0,
        todayRiderEarnings: 0,
        todayOrders: 0,
        totalCashCollected: 0,
        avgCommissionPerOrder: 0,
        activeRiders: 0,
        pendingSettlements: 0,
        settledToday: 0
    });

    const loadCommissionSettings = async () => {
        try {
            const response = await api.getCommissionSettings();
            if (response.success && response.data) {
                const s = response.data as Record<string, number>;
                setCommissionSettings({
                    platformCommissionPercentage: String(s.platform_commission_percentage ?? 15),
                    platformCommissionFixed: String(s.platform_commission_fixed ?? 0),
                    riderBaseFee: String(s.rider_base_fee ?? 50),
                    riderCommissionPercentage: String(s.rider_commission_percentage ?? 5),
                    riderCommissionMaxCap: String(s.rider_commission_max_cap ?? 30),
                    riderDistanceBonusPerKm: String(s.rider_distance_bonus_per_km ?? 5),
                    riderTimeBonusPerMinute: String(s.rider_time_bonus_per_minute ?? 0.5),
                    deliveryFeeBase: String(s.delivery_fee_base ?? 25),
                    deliveryFeePerKm: String(s.delivery_fee_per_km ?? 3),
                    freeDeliveryThreshold: String(s.free_delivery_threshold ?? 500),
                    codHandlingFee: String(s.cod_handling_fee ?? 5),
                    codFeePercentage: String(s.cod_fee_percentage ?? 1),
                });
            }
        } catch (error) {
            console.error('Failed to load commission settings:', error);
        }
    };

    const loadCommissionStats = async () => {
        setLoadingStats(true);
        try {
            const [summaryResponse, dashboardResponse] = await Promise.all([
                api.getCommissionDailySummary(),
                api.getDashboardStats(),
            ]);

            const summary = summaryResponse.success
                ? (summaryResponse.data as any)?.summary
                : null;

            const riders = dashboardResponse.success
                ? (dashboardResponse.data as any)?.riders
                : null;

            setStats({
                todayCommission: summary?.total_platform_commission ?? 0,
                todayRiderEarnings: summary?.total_rider_earnings ?? 0,
                todayOrders: summary?.total_orders ?? 0,
                totalCashCollected: summary?.total_cash_collected ?? 0,
                avgCommissionPerOrder: summary?.total_orders > 0
                    ? (summary.total_platform_commission ?? 0) / summary.total_orders
                    : 0,
                activeRiders: riders?.active ?? 0,
                pendingSettlements: summary?.is_settled ? 0 : 1,
                settledToday: summary?.is_settled ? 1 : 0,
            });
        } catch (error) {
            console.error('Failed to load commission stats:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        loadCommissionSettings();
        loadCommissionStats();
    }, []);

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            const payload = {
                platform_commission_percentage: parseFloat(commissionSettings.platformCommissionPercentage),
                platform_commission_fixed: parseFloat(commissionSettings.platformCommissionFixed),
                rider_base_fee: parseFloat(commissionSettings.riderBaseFee),
                rider_commission_percentage: parseFloat(commissionSettings.riderCommissionPercentage),
                rider_commission_max_cap: parseFloat(commissionSettings.riderCommissionMaxCap),
                rider_distance_bonus_per_km: parseFloat(commissionSettings.riderDistanceBonusPerKm),
                rider_time_bonus_per_minute: parseFloat(commissionSettings.riderTimeBonusPerMinute),
                delivery_fee_base: parseFloat(commissionSettings.deliveryFeeBase),
                delivery_fee_per_km: parseFloat(commissionSettings.deliveryFeePerKm),
                free_delivery_threshold: parseFloat(commissionSettings.freeDeliveryThreshold),
                cod_handling_fee: parseFloat(commissionSettings.codHandlingFee),
                cod_fee_percentage: parseFloat(commissionSettings.codFeePercentage),
            };

            const response = await api.updateCommissionSettings(payload);
            if (!response.success) {
                throw new Error(response.message || 'Failed to save settings');
            }

            toast({
                title: "Commission Settings Saved",
                description: "All commission and COD settings have been updated successfully.",
                duration: 3000,
            });

            loadCommissionStats();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save commission settings. Please try again.",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Commission Management</h1>
                    <p className="text-muted-foreground">Manage platform commissions, rider earnings, and cash-on-delivery settings</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { loadCommissionStats(); loadCommissionSettings(); }}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={handleSaveSettings} disabled={loading} className="bg-brand-gradient hover:shadow-glow transition-all duration-300">
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </div>

            {/* Commission Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-lg bg-brand-orange/10">
                                <DollarSign className="w-8 h-8 text-brand-orange" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">
                                    {loadingStats ? '...' : `₹${stats.todayCommission.toFixed(2)}`}
                                </p>
                                <p className="text-sm text-muted-foreground">Platform Commission Today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-lg bg-brand-pink/10">
                                <Bike className="w-8 h-8 text-brand-pink" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">
                                    {loadingStats ? '...' : `₹${stats.todayRiderEarnings.toFixed(2)}`}
                                </p>
                                <p className="text-sm text-muted-foreground">Rider Earnings Today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-lg bg-admin-warning/10">
                                <TrendingUp className="w-8 h-8 text-admin-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">
                                    {loadingStats ? '...' : `₹${stats.totalCashCollected.toFixed(2)}`}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Cash Collected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 rounded-lg bg-admin-success/10">
                                <Target className="w-8 h-8 text-admin-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">
                                    {loadingStats ? '...' : stats.todayOrders}
                                </p>
                                <p className="text-sm text-muted-foreground">Orders Today</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Commission/Order</p>
                                <p className="text-lg font-semibold">₹{stats.avgCommissionPerOrder.toFixed(2)}</p>
                            </div>
                            <Calculator className="w-6 h-6 text-brand-orange" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Riders</p>
                                <p className="text-lg font-semibold">{stats.activeRiders}</p>
                            </div>
                            <Users className="w-6 h-6 text-brand-pink" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending Settlements</p>
                                <p className="text-lg font-semibold">{stats.pendingSettlements}</p>
                            </div>
                            <Clock className="w-6 h-6 text-admin-warning" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Commission Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Commission */}
                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="w-5 h-5 text-brand-pink" />
                            Platform Commission
                        </CardTitle>
                        <CardDescription>Configure platform commission rates and fees</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="platformCommissionPercentage">Commission Percentage (%)</Label>
                                <Input
                                    id="platformCommissionPercentage"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="50"
                                    value={commissionSettings.platformCommissionPercentage}
                                    onChange={(e) => setCommissionSettings({
                                        ...commissionSettings,
                                        platformCommissionPercentage: e.target.value
                                    })}
                                    placeholder="15.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="platformCommissionFixed">Fixed Fee (₹)</Label>
                                <Input
                                    id="platformCommissionFixed"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={commissionSettings.platformCommissionFixed}
                                    onChange={(e) => setCommissionSettings({
                                        ...commissionSettings,
                                        platformCommissionFixed: e.target.value
                                    })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="bg-brand-gradient/5 border border-brand-pink/20 p-3 rounded-lg">
                            <p className="text-sm text-brand-pink">
                                <strong>Current Rate:</strong> {commissionSettings.platformCommissionPercentage}% + ₹{commissionSettings.platformCommissionFixed}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Example: On ₹500 order = ₹{((500 * parseFloat(commissionSettings.platformCommissionPercentage) / 100) + parseFloat(commissionSettings.platformCommissionFixed)).toFixed(2)} commission
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Rider Earnings */}
                <Card className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-brand-orange" />
                            Rider Earnings Structure
                        </CardTitle>
                        <CardDescription>Configure how riders earn from deliveries</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="riderBaseFee">Base Fee per Delivery (₹)</Label>
                                <Input
                                    id="riderBaseFee"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={commissionSettings.riderBaseFee}
                                    onChange={(e) => setCommissionSettings({
                                        ...commissionSettings,
                                        riderBaseFee: e.target.value
                                    })}
                                    placeholder="50.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="riderCommissionPercentage">Commission % of Order</Label>
                                <Input
                                    id="riderCommissionPercentage"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="20"
                                    value={commissionSettings.riderCommissionPercentage}
                                    onChange={(e) => setCommissionSettings({
                                        ...commissionSettings,
                                        riderCommissionPercentage: e.target.value
                                    })}
                                    placeholder="5.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="riderCommissionMaxCap">Max Commission Cap (₹)</Label>
                                <Input
                                    id="riderCommissionMaxCap"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={commissionSettings.riderCommissionMaxCap}
                                    onChange={(e) => setCommissionSettings({
                                        ...commissionSettings,
                                        riderCommissionMaxCap: e.target.value
                                    })}
                                    placeholder="30.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="riderDistanceBonusPerKm">Distance Bonus per KM (₹)</Label>
                                <Input
                                    id="riderDistanceBonusPerKm"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={commissionSettings.riderDistanceBonusPerKm}
                                    onChange={(e) => setCommissionSettings({
                                        ...commissionSettings,
                                        riderDistanceBonusPerKm: e.target.value
                                    })}
                                    placeholder="5.00"
                                />
                            </div>
                        </div>

                        <div className="bg-brand-orange/5 border border-brand-orange/20 p-3 rounded-lg">
                            <p className="text-sm text-brand-orange">
                                <strong>Example Earnings:</strong> ₹500 order, 3km delivery
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Base: ₹{commissionSettings.riderBaseFee} + Commission: ₹{Math.min(500 * parseFloat(commissionSettings.riderCommissionPercentage) / 100, parseFloat(commissionSettings.riderCommissionMaxCap)).toFixed(2)} + Distance: ₹{(3 * parseFloat(commissionSettings.riderDistanceBonusPerKm)).toFixed(2)} = ₹{(parseFloat(commissionSettings.riderBaseFee) + Math.min(500 * parseFloat(commissionSettings.riderCommissionPercentage) / 100, parseFloat(commissionSettings.riderCommissionMaxCap)) + (3 * parseFloat(commissionSettings.riderDistanceBonusPerKm))).toFixed(2)}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delivery & COD Fees */}
            <Card className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-admin-warning" />
                        Delivery & COD Fees
                    </CardTitle>
                    <CardDescription>Configure delivery charges and cash-on-delivery fees</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="deliveryFeeBase">Base Delivery Fee (₹)</Label>
                            <Input
                                id="deliveryFeeBase"
                                type="number"
                                step="0.01"
                                min="0"
                                value={commissionSettings.deliveryFeeBase}
                                onChange={(e) => setCommissionSettings({
                                    ...commissionSettings,
                                    deliveryFeeBase: e.target.value
                                })}
                                placeholder="25.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deliveryFeePerKm">Additional Fee per KM (₹)</Label>
                            <Input
                                id="deliveryFeePerKm"
                                type="number"
                                step="0.01"
                                min="0"
                                value={commissionSettings.deliveryFeePerKm}
                                onChange={(e) => setCommissionSettings({
                                    ...commissionSettings,
                                    deliveryFeePerKm: e.target.value
                                })}
                                placeholder="3.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="freeDeliveryThreshold">Free Delivery Above (₹)</Label>
                            <Input
                                id="freeDeliveryThreshold"
                                type="number"
                                step="0.01"
                                min="0"
                                value={commissionSettings.freeDeliveryThreshold}
                                onChange={(e) => setCommissionSettings({
                                    ...commissionSettings,
                                    freeDeliveryThreshold: e.target.value
                                })}
                                placeholder="500.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="codHandlingFee">COD Handling Fee (₹)</Label>
                            <Input
                                id="codHandlingFee"
                                type="number"
                                step="0.01"
                                min="0"
                                value={commissionSettings.codHandlingFee}
                                onChange={(e) => setCommissionSettings({
                                    ...commissionSettings,
                                    codHandlingFee: e.target.value
                                })}
                                placeholder="5.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="codFeePercentage">COD Fee Percentage (%)</Label>
                            <Input
                                id="codFeePercentage"
                                type="number"
                                step="0.01"
                                min="0"
                                max="5"
                                value={commissionSettings.codFeePercentage}
                                onChange={(e) => setCommissionSettings({
                                    ...commissionSettings,
                                    codFeePercentage: e.target.value
                                })}
                                placeholder="1.00"
                            />
                        </div>
                    </div>

                    <div className="bg-admin-warning/5 border border-admin-warning/20 p-3 rounded-lg">
                        <p className="text-sm text-admin-warning font-semibold">
                            <strong>COD System:</strong> All orders are cash-on-delivery. Riders collect cash and settle with admin later.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            COD Fee Example: ₹500 order = ₹{commissionSettings.codHandlingFee} + ₹{(500 * parseFloat(commissionSettings.codFeePercentage) / 100).toFixed(2)} = ₹{(parseFloat(commissionSettings.codHandlingFee) + (500 * parseFloat(commissionSettings.codFeePercentage) / 100)).toFixed(2)}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
