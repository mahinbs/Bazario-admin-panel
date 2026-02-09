import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Filter
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

const users = [
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
  },
  {
    id: "STR-002",
    name: "Lisa Rodriguez",
    email: "lisa@gardenbazario.com",
    phone: "+1 (555) 567-8901",
    type: "Store Owner", 
    status: "Pending",
    orders: 0,
    totalSpent: "$0.00",
    joinDate: "2024-03-15",
    location: "Austin, TX"
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || user.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage customers, store owners, and delivery partners</p>
        </div>
        <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
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
                <p className="text-2xl font-bold text-foreground">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-dark/10 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-admin-dark" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Store Owners</p>
                <p className="text-2xl font-bold text-foreground">156</p>
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
                <p className="text-2xl font-bold text-foreground">67</p>
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
                <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                <p className="text-2xl font-bold text-foreground">89</p>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    {selectedType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedType("All")}>
                    All Users
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("Customer")}>
                    Customers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("Store Owner")}>
                    Store Owners
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("Delivery Partner")}>
                    Delivery Partners
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              {filteredUsers.map((user) => (
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
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-admin-error">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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