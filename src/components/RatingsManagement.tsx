import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Star,
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    Users,
    Store,
    Package,
    Truck
} from 'lucide-react';

interface Rating {
    id: string;
    rating_type: string;
    rating: number;
    review_text?: string;
    created_at: string;
    customers: {
        name: string;
    };
    store_owners?: {
        store_name: string;
    };
    products?: {
        name: string;
    };
    riders?: {
        name: string;
    };
    orders: {
        id: string;
        order_number: string;
    };
}

interface RatingAnalytics {
    entity_type: string;
    entity_id: string;
    entity_name: string;
    average_rating: number;
    total_ratings: number;
    review_count: number;
}

const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: string }) => {
    const sizeClass = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${sizeClass} ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                />
            ))}
            <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
    );
};

const RatingsManagement = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [analytics, setAnalytics] = useState<RatingAnalytics[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        loadRatingsData();
    }, []);

    const loadRatingsData = async () => {
        try {
            setLoading(true);

            // Load rating analytics
            const analyticsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/ratings/analytics`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (analyticsResponse.ok) {
                const analyticsData = await analyticsResponse.json();
                setAnalytics(analyticsData.data?.analytics || []);
            }

        } catch (error) {
            console.error('Failed to load ratings data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRatingsByType = async (type: string) => {
        try {
            setLoading(true);

            // This would need to be implemented in the backend
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ratings/all?type=${type}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRatings(data.data || []);
            }
        } catch (error) {
            console.error('Failed to load ratings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAnalytics = analytics.filter(item => {
        const matchesSearch = item.entity_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || item.entity_type === filterType;
        return matchesSearch && matchesFilter;
    });

    const getEntityIcon = (type: string) => {
        switch (type) {
            case 'store': return <Store className="h-4 w-4 text-orange-600" />;
            case 'product': return <Package className="h-4 w-4 text-green-600" />;
            case 'rider': return <Truck className="h-4 w-4 text-blue-600" />;
            default: return <Users className="h-4 w-4 text-gray-600" />;
        }
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return 'text-green-600';
        if (rating >= 4.0) return 'text-yellow-600';
        if (rating >= 3.0) return 'text-orange-600';
        return 'text-red-600';
    };

    const overviewStats = {
        totalRatings: analytics.reduce((sum, item) => sum + item.total_ratings, 0),
        averageRating: analytics.length > 0
            ? analytics.reduce((sum, item) => sum + item.average_rating, 0) / analytics.length
            : 0,
        storesRated: analytics.filter(item => item.entity_type === 'store').length,
        productsRated: analytics.filter(item => item.entity_type === 'product').length,
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Ratings Management</h2>
                </div>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading ratings data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Ratings Management</h2>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
                        <Star className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewStats.totalRatings.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all stores and products
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewStats.averageRating.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Overall platform rating
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rated Stores</CardTitle>
                        <Store className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewStats.storesRated}</div>
                        <p className="text-xs text-muted-foreground">
                            Stores with reviews
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rated Products</CardTitle>
                        <Package className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overviewStats.productsRated}</div>
                        <p className="text-xs text-muted-foreground">
                            Products with reviews
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Rating Analytics Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Rating Analytics</CardTitle>
                    <CardDescription>
                        View and manage ratings across all stores, products, and delivery partners
                    </CardDescription>

                    {/* Search and Filter */}
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search stores, products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 border rounded-md bg-white"
                        >
                            <option value="all">All Types</option>
                            <option value="store">Stores</option>
                            <option value="product">Products</option>
                            <option value="rider">Delivery Partners</option>
                        </select>
                    </div>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Average Rating</TableHead>
                                <TableHead>Total Ratings</TableHead>
                                <TableHead>Reviews</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAnalytics.map((item) => (
                                <TableRow key={`${item.entity_type}-${item.entity_id}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getEntityIcon(item.entity_type)}
                                            <span className="capitalize">{item.entity_type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{item.entity_name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <StarRating rating={item.average_rating} />
                                            <span className={`text-sm ${getRatingColor(item.average_rating)}`}>
                                                ({item.average_rating.toFixed(1)})
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {item.total_ratings}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {item.review_count}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={item.average_rating >= 4.0 ? "default" :
                                                item.average_rating >= 3.0 ? "secondary" : "destructive"}
                                        >
                                            {item.average_rating >= 4.0 ? 'Excellent' :
                                                item.average_rating >= 3.0 ? 'Good' : 'Needs Improvement'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredAnalytics.length === 0 && (
                        <div className="text-center py-8">
                            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings found</h3>
                            <p className="text-gray-500">No ratings match your current filters.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RatingsManagement;
