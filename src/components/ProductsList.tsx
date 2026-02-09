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
import { fetchMockProducts, Product } from "@/lib/mockData";

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

    const loadProducts = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetchMockProducts(page, pagination.limit);

            // Filter by storeId if present
            let filteredProducts = response.products;
            if (storeId) {
                // Since mock data logic for filtering by store is simplistic in this context
                // we might just filter client side or accept all for now as it is a mock
                filteredProducts = response.products.filter(p => p.storeName.includes(storeId) || true);
            }

            if (searchTerm) {
                filteredProducts = filteredProducts.filter(p =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setProducts(filteredProducts);
            setPagination(prev => ({
                ...prev,
                page,
                total: response.total,
                totalPages: Math.ceil(response.total / prev.limit)
            }));

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
        loadProducts();
    }, [searchTerm, storeId]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const formatPrice = (price: number) => {
        return `₹${price.toLocaleString()}`;
    };

    const getStatusColor = (status: string) => {
        return status === 'active'
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-800 border-gray-200";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
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

            {/* Stats */}
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
                                <p className="text-2xl font-bold">
                                    {new Set(products.map(p => p.storeName)).size}
                                </p>
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

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Products ({pagination.total})
                    </CardTitle>
                    <CardDescription>
                        Browse and manage products across the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {products.length === 0 && !loading ? (
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
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">{product.name}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        {showStoreInfo && (
                                            <TableCell>
                                                <div className="font-medium text-foreground">{product.storeName}</div>
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium">{formatPrice(product.price)}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(product.status)} variant="outline">
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {product.stock}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedProduct(product)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                {pagination.total} products
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadProducts(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => loadProducts(pagination.page + 1)}
                                    disabled={pagination.page >= pagination.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Product Details Dialog */}
            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Product Name</label>
                                    <p className="text-sm text-muted-foreground">{selectedProduct.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Price</label>
                                    <p className="text-sm text-muted-foreground">{formatPrice(selectedProduct.price)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Category</label>
                                    <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <Badge className={getStatusColor(selectedProduct.status)}>
                                        {selectedProduct.status}
                                    </Badge>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Stock</label>
                                    <p className="text-sm text-muted-foreground">{selectedProduct.stock}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Store</label>
                                    <p className="text-sm text-muted-foreground">{selectedProduct.storeName}</p>
                                </div>
                            </div>
                            {selectedProduct.image && (
                                <div>
                                    <label className="text-sm font-medium">Product Image</label>
                                    <div className="mt-2">
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.name}
                                            className="max-w-full h-48 object-cover rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
