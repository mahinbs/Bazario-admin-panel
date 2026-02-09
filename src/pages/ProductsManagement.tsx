import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Star,
  DollarSign,
  TrendingUp,
  Filter,
  Image as ImageIcon
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

const products = [
  {
    id: "PRD-001",
    name: "Monarch Bazario Garden Kit",
    category: "Garden Kits",
    store: "Bazario Wings Co",
    price: "$89.99",
    stock: 156,
    status: "Active",
    sales: 234,
    rating: 4.8,
    image: "/api/placeholder/60/60"
  },
  {
    id: "PRD-002", 
    name: "Bazario Habitat Dome",
    category: "Habitats",
    store: "Nature's Beauty",
    price: "$124.50",
    stock: 89,
    status: "Active",
    sales: 187,
    rating: 4.9,
    image: "/api/placeholder/60/60"
  },
  {
    id: "PRD-003",
    name: "Bazario Life Cycle Set",
    category: "Educational",
    store: "Garden Paradise", 
    price: "$45.99",
    stock: 0,
    status: "Out of Stock",
    sales: 145,
    rating: 4.7,
    image: "/api/placeholder/60/60"
  },
  {
    id: "PRD-004",
    name: "Premium Nectar Feeder",
    category: "Feeders",
    store: "Eco Butterflies",
    price: "$32.99",
    stock: 234,
    status: "Active", 
    sales: 298,
    rating: 4.6,
    image: "/api/placeholder/60/60"
  },
  {
    id: "PRD-005",
    name: "Bazario Identification Guide",
    category: "Books",
    store: "Nature's Library",
    price: "$19.99",
    stock: 67,
    status: "Low Stock",
    sales: 89,
    rating: 4.5,
    image: "/api/placeholder/60/60"
  }
];

const categories = ["All", "Garden Kits", "Habitats", "Educational", "Feeders", "Books"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-admin-success text-white";
    case "Out of Stock": return "bg-admin-error text-white";
    case "Low Stock": return "bg-admin-warning text-white";
    case "Inactive": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStockColor = (stock: number) => {
  if (stock === 0) return "text-admin-error";
  if (stock < 50) return "text-admin-warning";
  return "text-admin-success";
};

export default function ProductsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground">Manage all products across your marketplace</p>
        </div>
        <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-red/10 rounded-lg">
                <Package className="w-6 h-6 text-admin-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-foreground">8,932</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold text-foreground">7,845</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-warning/10 rounded-lg">
                <Package className="w-6 h-6 text-admin-warning" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-foreground">234</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-coral/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-admin-coral" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">$2.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Products</CardTitle>
              <CardDescription>Manage product catalog across all stores</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    {selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-admin-coral border-admin-coral">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.store}</TableCell>
                  <TableCell className="font-semibold text-admin-success">{product.price}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getStockColor(product.stock)}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{product.sales}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-admin-warning text-admin-warning" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-admin-error">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}