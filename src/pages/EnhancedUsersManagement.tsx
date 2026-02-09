import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  Filter,
  Save,
  Eye,
  Package,
  Heart
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { api } from "@/lib/api";

const initialUsers = [
  {
    id: "USR-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    type: "Customer",
    status: "Active",
    orders: 23,
    totalSpent: "$2,847.50",
    joinDate: "2024-01-15",
    location: "New York, NY"
  },
  {
    id: "STR-001",
    name: "Mike Chen",
    email: "mike@bazariostore.com",
    phone: "+1 (555) 234-5678",
    type: "Store Owner",
    status: "Active",
    orders: 156,
    totalSpent: "$18,924.00",
    joinDate: "2023-11-20",
    location: "Los Angeles, CA"
  },
  {
    id: "DEL-001",
    name: "Emma Davis",
    email: "emma.delivery@email.com",
    phone: "+1 (555) 345-6789",
    type: "Delivery Partner",
    status: "Active",
    orders: 89,
    totalSpent: "$3,456.00",
    joinDate: "2024-02-01",
    location: "Chicago, IL"
  },
  {
    id: "USR-002",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1 (555) 456-7890",
    type: "Customer",
    status: "Inactive",
    orders: 5,
    totalSpent: "$412.30",
    joinDate: "2024-03-10",
    location: "Miami, FL"
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "Customer": return "bg-admin-red text-white";
    case "Store Owner": return "bg-admin-coral text-white";
    case "Delivery Partner": return "bg-admin-success text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-admin-success text-white";
    case "Inactive": return "bg-admin-error text-white";
    case "Pending": return "bg-admin-warning text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function UsersManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Customer",
    status: "Active",
    location: ""
  });

  // Load customer details
  const loadCustomerDetails = async (customerId: string) => {
    try {
      setLoadingDetails(true);
      const response = await api.getCustomerDetails(customerId);
      setCustomerDetails(response.data);
    } catch (error) {
      console.error('Failed to load customer details:', error);
      toast({
        title: "Error",
        description: "Failed to load customer details",
        variant: "destructive",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Load users data
  const loadUsers = async () => {
    try {
      setLoading(true);

      // Fetch customers, stores, and riders
      const [customersResponse, storesResponse, ridersResponse] = await Promise.all([
        api.getCustomers({ limit: 100 }),
        api.getStores({ limit: 100 }),
        api.getRiders({ limit: 100 })
      ]);

      const allUsers = [
        ...(customersResponse.data || []).map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          type: "Customer",
          status: customer.status || "Active",
          orders: customer.totalOrders || 0,
          totalSpent: `₹${customer.totalSpent?.toFixed(2) || '0.00'}`,
          joinDate: new Date(customer.created_at).toLocaleDateString(),
          location: customer.current_address || "Not provided"
        })),
        ...(storesResponse.data || []).map((store: any) => ({
          id: store.id,
          name: store.owner_name,
          email: store.email,
          phone: store.phone,
          type: "Store Owner",
          status: store.status === 'approved' ? 'Active' : store.status === 'pending' ? 'Pending' : 'Inactive',
          orders: 0, // We could fetch this if needed
          totalSpent: "₹0.00",
          joinDate: new Date(store.created_at).toLocaleDateString(),
          location: store.address || "Not provided"
        })),
        ...(ridersResponse.data || []).map((rider: any) => ({
          id: rider.id,
          name: rider.name,
          email: rider.email,
          phone: rider.phone,
          type: "Delivery Partner",
          status: rider.status === 'approved' ? 'Active' : rider.status === 'pending' ? 'Pending' : 'Inactive',
          orders: 0, // We could fetch this if needed
          totalSpent: "₹0.00",
          joinDate: new Date(rider.created_at).toLocaleDateString(),
          location: rider.address || "Not provided"
        }))
      ];

      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({
        title: "Error",
        description: "Failed to load users data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || user.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const userPrefix = newUser.type === "Customer" ? "USR" :
      newUser.type === "Store Owner" ? "STR" : "DEL";
    const userCount = users.filter(u => u.type === newUser.type).length + 1;

    const user = {
      ...newUser,
      id: `${userPrefix}-${String(userCount).padStart(3, '0')}`,
      orders: 0,
      totalSpent: "$0.00",
      joinDate: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, user]);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      type: "Customer",
      status: "Active",
      location: ""
    });
    setIsAddDialogOpen(false);

    toast({
      title: "User Added",
      description: `${user.name} has been added successfully.`,
    });
  };

  const handleEditUser = () => {
    if (!editingUser.name || !editingUser.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user =>
      user.id === editingUser.id ? editingUser : user
    ));
    setIsEditDialogOpen(false);
    setEditingUser(null);

    toast({
      title: "User Updated",
      description: `${editingUser.name} has been updated successfully.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));

    toast({
      title: "User Deleted",
      description: `${user?.name} has been removed from the platform.`,
    });
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));

    const user = users.find(u => u.id === userId);
    toast({
      title: "Status Updated",
      description: `${user?.name} status changed to ${newStatus}.`,
    });
  };

  const sendMessage = (user: any) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${user.name} successfully.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage customers, store owners, and delivery partners</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300">
              <UserPlus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Full Name *</Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email *</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userPhone">Phone</Label>
                <Input
                  id="userPhone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userLocation">Location</Label>
                <Input
                  id="userLocation"
                  value={newUser.location}
                  onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select value={newUser.type} onValueChange={(value) => setNewUser({ ...newUser, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Store Owner">Store Owner</SelectItem>
                    <SelectItem value="Delivery Partner">Delivery Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddUser} className="flex-1 bg-admin-red hover:bg-admin-red/90">
                  <Save className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-red/10 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-admin-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.type === "Customer").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-coral/10 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-admin-coral" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Store Owners</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.type === "Store Owner").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-success/10 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-admin-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Delivery Partners</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.type === "Delivery Partner").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-warning/10 rounded-lg">
                <Calendar className="w-6 h-6 text-admin-warning" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage all platform users in one place</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Users</SelectItem>
                  <SelectItem value="Customer">Customers</SelectItem>
                  <SelectItem value="Store Owner">Store Owners</SelectItem>
                  <SelectItem value="Delivery Partner">Delivery Partners</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span>Loading users...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm || selectedType !== "All" ? "No users found matching your criteria" : "No users found"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/avatars/${user.id}.png`} alt={user.name} />
                          <AvatarFallback className="bg-gradient-admin text-primary-foreground">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(user.type)}>
                        {user.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={user.status} onValueChange={(value) => handleStatusChange(user.id, value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {user.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.orders}</TableCell>
                    <TableCell className="font-medium text-admin-success">{user.totalSpent}</TableCell>
                    <TableCell className="text-muted-foreground">{user.joinDate}</TableCell>
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
                          <DropdownMenuItem
                            onClick={async () => {
                              setSelectedUser(user);
                              setIsViewDialogOpen(true);
                              if (user.type === 'Customer') {
                                await loadCustomerDetails(user.id);
                              }
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => sendMessage(user)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-admin-error" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user
                                  and remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editUserName">Full Name *</Label>
                <Input
                  id="editUserName"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserEmail">Email *</Label>
                <Input
                  id="editUserEmail"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserPhone">Phone</Label>
                <Input
                  id="editUserPhone"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserLocation">Location</Label>
                <Input
                  id="editUserLocation"
                  value={editingUser.location}
                  onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserType">User Type</Label>
                <Select value={editingUser.type} onValueChange={(value) => setEditingUser({ ...editingUser, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Store Owner">Store Owner</SelectItem>
                    <SelectItem value="Delivery Partner">Delivery Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleEditUser} className="flex-1 bg-admin-red hover:bg-admin-red/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Customer Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {selectedUser?.type === 'Customer' ? 'Customer Details' : 'User Profile'}
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Basic User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <Badge className={getTypeColor(selectedUser.type)}>
                    {selectedUser.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Join Date</p>
                  <p className="text-sm">{new Date(selectedUser.created_at || selectedUser.joinDate).toLocaleDateString()}</p>
                </div>
                {selectedUser.type === 'Customer' && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Orders</p>
                      <p className="text-lg font-semibold">{selectedUser.totalOrders || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Spent</p>
                      <p className="text-lg font-semibold">₹{selectedUser.totalSpent || 0}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Customer-specific details */}
              {selectedUser.type === 'Customer' && (
                <>
                  {loadingDetails ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading customer details...</span>
                    </div>
                  ) : customerDetails ? (
                    <>
                      {/* Order History */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Order History ({customerDetails.orders?.length || 0})
                        </h3>
                        {customerDetails.orders && customerDetails.orders.length > 0 ? (
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {customerDetails.orders.slice(0, 10).map((order: any) => (
                              <div key={order.id} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <p className="font-medium text-sm">Order #{order.id.slice(-8)}</p>
                                    <p className="text-xs text-gray-500">{order.store_owners?.store_name}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-sm">₹{order.total_amount}</p>
                                    <Badge className={`text-xs ${order.status === 'delivered' ? 'bg-green-500' :
                                      order.status === 'cancelled' ? 'bg-red-500' :
                                        order.status === 'pending' ? 'bg-yellow-500' :
                                          'bg-blue-500'
                                      } text-white`}>
                                      {order.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                  {order.riders && <span>Rider: {order.riders.name}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No orders found</p>
                        )}
                      </div>

                      {/* Favorite Stores */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Favorite Stores ({customerDetails.favorites?.length || 0})
                        </h3>
                        {customerDetails.favorites && customerDetails.favorites.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {customerDetails.favorites.map((favorite: any) => (
                              <div key={favorite.store_id} className="p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  {favorite.store_owners?.store_images?.[0] && (
                                    <img
                                      src={favorite.store_owners.store_images[0]}
                                      alt={favorite.store_owners.store_name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{favorite.store_owners?.store_name}</p>
                                    <p className="text-xs text-gray-500">{favorite.store_owners?.category}</p>
                                    <p className="text-xs text-gray-500">₹{favorite.store_owners?.delivery_fee} delivery</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No favorite stores</p>
                        )}
                      </div>
                    </>
                  ) : null}
                </>
              )}

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}