import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Search,
    Package,
    Store,
    Eye,
    ShoppingCart,
    DollarSign,
    ImageIcon
} from "lucide-react";
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    sales: number;
    image: string;
    status: 'active' | 'draft' | 'archived';
    storeName: string;
    description?: string;
}

interface ProductsListProps {
    storeId?: string;
    showStoreInfo?: boolean;
}

export default function ProductsList({ storeId, showStoreInfo = true }: ProductsListProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const { toast } = useToast();

    const mapBackendProduct = (p: any): Product => ({
        id: p.id,
        name: p.name,
        category: p.category || 'General',
        price: Number(p.price) || 0,
        stock: p.stock ?? 0,
        sales: p.sales_count ?? 0,
        image: p.image_url || '',
        status: p.is_active ? 'active' : 'draft',
        storeName: p.store_owners?.store_name || 'Unknown Store',
        description: p.description,
    });

    const loadProducts = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.getProducts({
                page,
                limit: pagination.limit,
                search: searchTerm || undefined,
                store_id: storeId,
            });

            if (response.success && response.data) {
                const mapped = (response.data as any[]).map(mapBackendProduct);
                setProducts(mapped);
                setPagination(prev => ({
                    ...prev,
                    page,
                    total: response.pagination?.total ?? mapped.length,
                    totalPages: response.pagination?.totalPages ?? 1,
                }));
            }
        } catch (error: any) {
            console.error('Failed to fetch products:', error);
            toast({
                title: "Error",
                description: "Failed to load products",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts(1);
    }, [searchTerm, storeId]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

    const getStatusColor = (status: string) =>
        status === 'active'
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-800 border-gray-200";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Products List</h2>
                    <p className="text-muted-foreground">
                        {storeId ? 'Store products' : 'All products across platform'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Package className="w-8 h-8 text-admin-coral mr-3" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                                <p className="text-2xl font-bold">{pagination.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <ShoppingCart className="w-8 h-8 text-admin-success mr-3" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active</p>
                                <p className="text-2xl font-bold">{products.filter(p => p.status === 'active').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Store className="w-8 h-8 text-admin-red mr-3" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Stores</p>
                                <p className="text-2xl font-bold">{new Set(products.map(p => p.storeName)).size}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <DollarSign className="w-8 h-8 text-admin-warning mr-3" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Price</p>
                                <p className="text-2xl font-bold">
                                    ₹{products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Products ({pagination.total})
                    </CardTitle>
                    <CardDescription>Browse and manage products across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                {searchTerm ? 'No products found matching your search.' : 'No products available.'}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    {showStoreInfo && <TableHead>Store</TableHead>}
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id} className="hover:bg-muted/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="font-medium text-foreground">{product.name}</div>
                                            </div>
                                        </TableCell>
                                        {showStoreInfo && (
                                            <TableCell><div className="font-medium">{product.storeName}</div></TableCell>
                                        )}
                                        <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                                        <TableCell><span className="font-medium">{formatPrice(product.price)}</span></TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(product.status)} variant="outline">{product.status}</Badge>
                                        </TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                                                <Eye className="w-4 h-4 mr-1" />View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => loadProducts(pagination.page - 1)} disabled={pagination.page <= 1}>
                                    Previous
                                </Button>
                                <span className="text-sm">Page {pagination.page} of {pagination.totalPages}</span>
                                <Button variant="outline" size="sm" onClick={() => loadProducts(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedProduct?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-2 text-sm">
                            <p><strong>Store:</strong> {selectedProduct.storeName}</p>
                            <p><strong>Category:</strong> {selectedProduct.category}</p>
                            <p><strong>Price:</strong> {formatPrice(selectedProduct.price)}</p>
                            <p><strong>Status:</strong> {selectedProduct.status}</p>
                            {selectedProduct.description && <p><strong>Description:</strong> {selectedProduct.description}</p>}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
