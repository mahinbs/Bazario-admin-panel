import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  TrendingUp,
  X,
  Save,
  AlertTriangle
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const initialStores = [
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
  const { toast } = useToast();
  const [stores, setStores] = useState(initialStores);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingStore, setEditingStore] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newStore, setNewStore] = useState({
    name: "",
    owner: "",
    email: "",
    phone: "",
    location: "",
    category: "",
    status: "Pending"
  });

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || store.status === selectedStatus;
    const matchesCategory = selectedCategory === "All" || store.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddStore = () => {
    if (!newStore.name || !newStore.owner || !newStore.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const store = {
      ...newStore,
      id: `STR-${String(stores.length + 1).padStart(3, '0')}`,
      products: 0,
      revenue: "$0.00",
      orders: 0,
      rating: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setStores([...stores, store]);
    setNewStore({
      name: "",
      owner: "",
      email: "",
      phone: "",
      location: "",
      category: "",
      status: "Pending"
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Store Added",
      description: `${store.name} has been added successfully.`,
    });
  };

  const handleEditStore = () => {
    if (!editingStore.name || !editingStore.owner || !editingStore.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setStores(stores.map(store => 
      store.id === editingStore.id ? editingStore : store
    ));
    setIsEditDialogOpen(false);
    setEditingStore(null);

    toast({
      title: "Store Updated",
      description: `${editingStore.name} has been updated successfully.`,
    });
  };

  const handleDeleteStore = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    setStores(stores.filter(s => s.id !== storeId));
    
    toast({
      title: "Store Deleted",
      description: `${store?.name} has been removed from the platform.`,
    });
  };

  const handleStatusChange = (storeId: string, newStatus: string) => {
    setStores(stores.map(store => 
      store.id === storeId ? { ...store, status: newStatus } : store
    ));

    const store = stores.find(s => s.id === storeId);
    toast({
      title: "Status Updated",
      description: `${store?.name} status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Management</h1>
          <p className="text-muted-foreground">Manage store owners and their marketplace presence</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300 animate-scale-in">
              <Plus className="w-4 h-4 mr-2" />
              Add New Store
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Store</DialogTitle>
              <DialogDescription>Create a new store on the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={newStore.name}
                  onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  placeholder="Enter store name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name *</Label>
                <Input
                  id="ownerName"
                  value={newStore.owner}
                  onChange={(e) => setNewStore({...newStore, owner: e.target.value})}
                  placeholder="Enter owner name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email *</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={newStore.email}
                  onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone</Label>
                <Input
                  id="storePhone"
                  value={newStore.phone}
                  onChange={(e) => setNewStore({...newStore, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeLocation">Location</Label>
                <Input
                  id="storeLocation"
                  value={newStore.location}
                  onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeCategory">Category</Label>
                <Select value={newStore.category} onValueChange={(value) => setNewStore({...newStore, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Garden Supplies">Garden Supplies</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Habitats">Habitats</SelectItem>
                    <SelectItem value="Feeders">Feeders</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddStore} className="flex-1 bg-admin-red hover:bg-admin-red/90">
                  <Save className="w-4 h-4 mr-2" />
                  Add Store
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-medium transition-all duration-300 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-red/10 rounded-lg">
                <Store className="w-6 h-6 text-admin-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Stores</p>
                <p className="text-2xl font-bold text-foreground">{stores.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-admin-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Stores</p>
                <p className="text-2xl font-bold text-foreground">
                  {stores.filter(s => s.status === "Active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-warning/10 rounded-lg">
                <Store className="w-6 h-6 text-admin-warning" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">
                  {stores.filter(s => s.status === "Pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-coral/10 rounded-lg">
                <Package className="w-6 h-6 text-admin-coral" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold text-foreground">
                  {stores.reduce((total, store) => total + store.products, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300 animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-success/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-admin-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${stores.reduce((total, store) => total + parseFloat(store.revenue.replace('$', '').replace(',', '')), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stores Table */}
      <Card className="animate-fade-in">
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilters.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryFilters.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <TableRow key={store.id} className="hover:bg-muted/50 transition-colors">
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
                    <Select value={store.status} onValueChange={(value) => handleStatusChange(store.id, value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <DropdownMenuItem 
                          onClick={() => {
                            setEditingStore(store);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Store
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Owner
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-admin-error" onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Store
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the store
                                and remove all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteStore(store.id)}
                                className="bg-admin-error hover:bg-admin-error/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Store Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>Update store information</DialogDescription>
          </DialogHeader>
          {editingStore && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editStoreName">Store Name *</Label>
                <Input
                  id="editStoreName"
                  value={editingStore.name}
                  onChange={(e) => setEditingStore({...editingStore, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editOwnerName">Owner Name *</Label>
                <Input
                  id="editOwnerName"
                  value={editingStore.owner}
                  onChange={(e) => setEditingStore({...editingStore, owner: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStoreEmail">Email *</Label>
                <Input
                  id="editStoreEmail"
                  type="email"
                  value={editingStore.email}
                  onChange={(e) => setEditingStore({...editingStore, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStorePhone">Phone</Label>
                <Input
                  id="editStorePhone"
                  value={editingStore.phone}
                  onChange={(e) => setEditingStore({...editingStore, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStoreLocation">Location</Label>
                <Input
                  id="editStoreLocation"
                  value={editingStore.location}
                  onChange={(e) => setEditingStore({...editingStore, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStoreCategory">Category</Label>
                <Select value={editingStore.category} onValueChange={(value) => setEditingStore({...editingStore, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Garden Supplies">Garden Supplies</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Habitats">Habitats</SelectItem>
                    <SelectItem value="Feeders">Feeders</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleEditStore} className="flex-1 bg-admin-red hover:bg-admin-red/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}