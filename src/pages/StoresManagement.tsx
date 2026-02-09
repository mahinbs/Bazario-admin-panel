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
  Eye,
  Trash2,
  Store,
  Star,
  DollarSign,
  Package,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Filter,
  TrendingUp
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

const stores = [
  {
    id: "STR-001",
    name: "Bazario Wings Co",
    owner: "Mike Chen",
    email: "mike@bazariostore.com",
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, CA",
    status: "Active",
    products: 89,
    revenue: "$18,924.00",
    orders: 234,
    rating: 4.9,
    joinDate: "2023-11-20",
    category: "Garden Supplies"
  },
  {
    id: "STR-002", 
    name: "Nature's Beauty",
    owner: "Sarah Rodriguez",
    email: "sarah@naturesbeauty.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    status: "Active",
    products: 67,
    revenue: "$14,567.00",
    orders: 187,
    rating: 4.8,
    joinDate: "2023-12-10",
    category: "Educational"
  },
  {
    id: "STR-003",
    name: "Garden Paradise",
    owner: "John Smith",
    email: "john@gardenparadise.com", 
    phone: "+1 (555) 456-7890",
    location: "Miami, FL",
    status: "Active",
    products: 125,
    revenue: "$22,341.00",
    orders: 298,
    rating: 4.7,
    joinDate: "2024-01-05",
    category: "Habitats"
  },
  {
    id: "STR-004",
    name: "Eco Butterflies",
    owner: "Lisa Davis",
    email: "lisa@ecobutterflies.com",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA",
    status: "Pending",
    products: 0,
    revenue: "$0.00",
    orders: 0,
    rating: 0,
    joinDate: "2024-03-15",
    category: "Feeders"
  },
  {
    id: "STR-005",
    name: "Bazario Dreams",
    owner: "James Wilson",
    email: "james@bazariodreams.com",
    phone: "+1 (555) 678-9012",
    location: "Denver, CO",
    status: "Inactive",
    products: 23,
    revenue: "$3,456.00",
    orders: 45,
    rating: 4.5,
    joinDate: "2023-09-15",
    category: "Books"
  }
];

const statusFilters = ["All", "Active", "Pending", "Inactive"];
const categoryFilters = ["All", "Garden Supplies", "Educational", "Habitats", "Feeders", "Books"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-admin-success text-white";
    case "Pending": return "bg-admin-warning text-white";
    case "Inactive": return "bg-admin-error text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Garden Supplies": return "bg-admin-red text-white";
    case "Educational": return "bg-admin-coral text-white";
    case "Habitats": return "bg-admin-success text-white";
    case "Feeders": return "bg-admin-warning text-white";
    case "Books": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function StoresManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || store.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || store.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Management</h1>
          <p className="text-muted-foreground">Manage store owners and their marketplace presence</p>
        </div>
        <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add New Store
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-red/10 rounded-lg">
                <Store className="w-6 h-6 text-admin-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
                <p className="text-2xl font-bold text-foreground">156</p>
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
                <p className="text-2xl font-bold text-foreground">134</p>
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
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-coral/10 rounded-lg">
                <Package className="w-6 h-6 text-admin-coral" />
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
                <DollarSign className="w-6 h-6 text-admin-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">$2.4M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                    {selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statusFilters.map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                  {categoryFilters.map((category) => (
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
                <TableHead>Store</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStores.map((store) => (
                <TableRow key={store.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/stores/${store.id}.png`} alt={store.name} />
                        <AvatarFallback className="bg-gradient-admin text-primary-foreground">
                          {store.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{store.name}</div>
                        <div className="text-sm text-muted-foreground">{store.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{store.owner}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Joined {store.joinDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(store.category)}>
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
                        {store.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-admin-coral" />
                      <span className="font-medium">{store.products}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="w-4 h-4 text-admin-red" />
                      <span className="font-medium">{store.orders}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-admin-success">{store.revenue}</TableCell>
                  <TableCell>
                    {store.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-admin-warning text-admin-warning" />
                        <span className="font-medium">{store.rating}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(store.status)}>
                      {store.status}
                    </Badge>
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
                          View Store
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Store
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Owner
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-admin-error">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Suspend Store
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