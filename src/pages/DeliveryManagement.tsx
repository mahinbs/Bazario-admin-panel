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
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Navigation,
  Package
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

const deliveryPartners = [
  {
    id: "DEL-001",
    name: "Emma Davis",
    email: "emma.delivery@email.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    status: "Active",
    vehicle: "Electric Bike",
    rating: 4.9,
    deliveries: 234,
    completedToday: 8,
    earnings: "$3,456.00",
    joinDate: "2024-02-01",
    zone: "North Zone",
    currentOrder: "ORD-234"
  },
  {
    id: "DEL-002",
    name: "John Smith", 
    email: "john.delivery@email.com",
    phone: "+1 (555) 456-7890",
    location: "Los Angeles, CA",
    status: "Active",
    vehicle: "Motorcycle",
    rating: 4.8,
    deliveries: 187,
    completedToday: 12,
    earnings: "$2,847.00",
    joinDate: "2024-01-15",
    zone: "West Zone",
    currentOrder: "ORD-187"
  },
  {
    id: "DEL-003",
    name: "Lisa Rodriguez",
    email: "lisa.delivery@email.com",
    phone: "+1 (555) 567-8901", 
    location: "Miami, FL",
    status: "Offline",
    vehicle: "Bicycle",
    rating: 4.7,
    deliveries: 145,
    completedToday: 0,
    earnings: "$1,934.00",
    joinDate: "2024-02-20",
    zone: "South Zone",
    currentOrder: null
  },
  {
    id: "DEL-004",
    name: "Alex Johnson",
    email: "alex.delivery@email.com",
    phone: "+1 (555) 678-9012",
    location: "New York, NY",
    status: "Busy",
    vehicle: "Electric Scooter",
    rating: 4.6,
    deliveries: 298,
    completedToday: 15,
    earnings: "$4,123.00",
    joinDate: "2023-12-10",
    zone: "East Zone",
    currentOrder: "ORD-345"
  },
  {
    id: "DEL-005",
    name: "Maria Garcia",
    email: "maria.delivery@email.com",
    phone: "+1 (555) 789-0123",
    location: "Austin, TX",
    status: "Pending",
    vehicle: "Car",
    rating: 0,
    deliveries: 0,
    completedToday: 0,
    earnings: "$0.00",
    joinDate: "2024-03-15",
    zone: "Central Zone",
    currentOrder: null
  }
];

const statusFilters = ["All", "Active", "Offline", "Busy", "Pending"];
const zoneFilters = ["All", "North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-admin-success text-white";
    case "Busy": return "bg-admin-warning text-white";
    case "Offline": return "bg-muted text-muted-foreground";
    case "Pending": return "bg-admin-coral text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active": return CheckCircle;
    case "Busy": return Clock;
    case "Offline": return AlertCircle;
    case "Pending": return Clock;
    default: return AlertCircle;
  }
};

const getVehicleColor = (vehicle: string) => {
  switch (vehicle) {
    case "Electric Bike": return "text-admin-success";
    case "Motorcycle": return "text-admin-red";
    case "Bicycle": return "text-admin-coral";
    case "Electric Scooter": return "text-admin-warning";
    case "Car": return "text-foreground";
    default: return "text-muted-foreground";
  }
};

export default function DeliveryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedZone, setSelectedZone] = useState("All");

  const filteredPartners = deliveryPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || partner.status === selectedStatus;
    const matchesZone = selectedZone === "All" || partner.zone === selectedZone;
    return matchesSearch && matchesStatus && matchesZone;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Delivery Management</h1>
          <p className="text-muted-foreground">Manage delivery partners and logistics operations</p>
        </div>
        <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add Delivery Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-red/10 rounded-lg">
                <Truck className="w-6 h-6 text-admin-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Partners</p>
                <p className="text-2xl font-bold text-foreground">67</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-success/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-admin-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold text-foreground">45</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-warning/10 rounded-lg">
                <Clock className="w-6 h-6 text-admin-warning" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">On Delivery</p>
                <p className="text-2xl font-bold text-foreground">23</p>
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
                <p className="text-sm font-medium text-muted-foreground">Deliveries Today</p>
                <p className="text-2xl font-bold text-foreground">156</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-success/10 rounded-lg">
                <Star className="w-6 h-6 text-admin-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold text-foreground">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Partners Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Delivery Partners</CardTitle>
              <CardDescription>Monitor and manage delivery partner performance</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search partners..."
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
                    <Navigation className="w-4 h-4" />
                    {selectedZone}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Zone</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {zoneFilters.map((zone) => (
                    <DropdownMenuItem key={zone} onClick={() => setSelectedZone(zone)}>
                      {zone}
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
                <TableHead>Partner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Today</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => {
                const StatusIcon = getStatusIcon(partner.status);
                return (
                  <TableRow key={partner.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/delivery/${partner.id}.png`} alt={partner.name} />
                          <AvatarFallback className="bg-gradient-admin text-primary-foreground">
                            {partner.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{partner.name}</div>
                          <div className="text-sm text-muted-foreground">{partner.id}</div>
                          {partner.currentOrder && (
                            <div className="text-xs text-admin-coral">Currently: {partner.currentOrder}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {partner.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {partner.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {partner.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-admin-coral border-admin-coral">
                        {partner.zone}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Truck className={`w-4 h-4 ${getVehicleColor(partner.vehicle)}`} />
                        <span className="text-sm">{partner.vehicle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" />
                        <Badge className={getStatusColor(partner.status)}>
                          {partner.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {partner.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-admin-warning text-admin-warning" />
                          <span className="font-medium">{partner.rating}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{partner.completedToday}</TableCell>
                    <TableCell className="font-medium">{partner.deliveries}</TableCell>
                    <TableCell className="font-semibold text-admin-success">{partner.earnings}</TableCell>
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
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Partner
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Navigation className="mr-2 h-4 w-4" />
                            Track Location
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}