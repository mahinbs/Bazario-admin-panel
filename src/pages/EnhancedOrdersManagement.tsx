import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  DollarSign,
  ShoppingCart,
  Filter,
  Calendar,
  MapPin,
  User,
  Edit,
  RefreshCw,
  Save
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
import { useToast } from "@/hooks/use-toast";

const initialOrders = [
  {
    id: "ORD-001",
    customer: "Sarah Johnson",
    store: "Bazario Wings Co",
    products: 3,
    total: "$189.99",
    status: "delivered",
    payment: "paid",
    date: "2024-03-15",
    deliveryPartner: "Emma Davis",
    address: "123 Main St, New York, NY",
    trackingId: "BWC001234"
  },
  {
    id: "ORD-002",
    customer: "Mike Chen",
    store: "Nature's Beauty",
    products: 2,
    total: "$156.50",
    status: "shipping",
    payment: "paid",
    date: "2024-03-14",
    deliveryPartner: "John Smith",
    address: "456 Oak Ave, Los Angeles, CA",
    trackingId: "NB002345"
  },
  {
    id: "ORD-003",
    customer: "Emma Davis",
    store: "Garden Paradise",
    products: 1,
    total: "$73.25",
    status: "processing",
    payment: "paid",
    date: "2024-03-14",
    deliveryPartner: "Pending",
    address: "789 Pine St, Chicago, IL",
    trackingId: "GP003456"
  },
  {
    id: "ORD-004",
    customer: "James Wilson",
    store: "Eco Butterflies",
    products: 4,
    total: "$301.00",
    status: "confirmed",
    payment: "paid",
    date: "2024-03-13",
    deliveryPartner: "Lisa Rodriguez",
    address: "321 Elm Dr, Miami, FL",
    trackingId: "EB004567"
  },
  {
    id: "ORD-005",
    customer: "Lisa Brown",
    store: "Bazario Wings Co",
    products: 2,
    total: "$124.99",
    status: "cancelled",
    payment: "refunded",
    date: "2024-03-12",
    deliveryPartner: "N/A",
    address: "654 Maple Ln, Seattle, WA",
    trackingId: "BWC005678"
  }
];

const statusFilters = ["All", "Confirmed", "Processing", "Shipping", "Delivered", "Cancelled"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-admin-success text-white";
    case "shipping": return "bg-admin-coral text-white";
    case "processing": return "bg-admin-warning text-white";
    case "confirmed": return "bg-admin-red text-white";
    case "cancelled": return "bg-admin-error text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const getPaymentColor = (payment: string) => {
  switch (payment) {
    case "paid": return "bg-admin-success text-white";
    case "pending": return "bg-admin-warning text-white";
    case "refunded": return "bg-admin-coral text-white";
    case "failed": return "bg-admin-error text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered": return CheckCircle;
    case "shipping": return Truck;
    case "processing": return Package;
    case "confirmed": return Clock;
    case "cancelled": return XCircle;
    default: return Clock;
  }
};

export default function OrdersManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    const order = orders.find(o => o.id === orderId);
    toast({
      title: "Status Updated",
      description: `Order ${order?.id} status changed to ${newStatus}.`,
    });
  };

  const handleEditOrder = () => {
    if (!editingOrder.customer || !editingOrder.store) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setOrders(orders.map(order => 
      order.id === editingOrder.id ? editingOrder : order
    ));
    setIsEditDialogOpen(false);
    setEditingOrder(null);

    toast({
      title: "Order Updated",
      description: `Order ${editingOrder.id} has been updated successfully.`,
    });
  };

  const trackOrder = (order: any) => {
    toast({
      title: "Tracking Order",
      description: `Tracking ID: ${order.trackingId} - Status: ${order.status}`,
    });
  };

  const viewDetails = (order: any) => {
    toast({
      title: "Order Details",
      description: `Viewing details for order ${order.id}`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders Management</h1>
          <p className="text-muted-foreground">Track and manage all orders across your platform</p>
        </div>
        <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300">
          <Package className="w-4 h-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-red/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-admin-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-foreground">{orders.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === "processing").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-medium transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-admin-coral/10 rounded-lg">
                <Truck className="w-6 h-6 text-admin-coral" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Shipping</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === "shipping").length}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === "delivered").length}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  ${orders.reduce((total, order) => total + parseFloat(order.total.replace('$', '')), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Monitor and manage order lifecycle</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">{order.id}</div>
                          <div className="text-xs text-muted-foreground">{order.trackingId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{order.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.store}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-admin-coral border-admin-coral">
                        {order.products} items
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-admin-success">{order.total}</TableCell>
                    <TableCell>
                      <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipping">Shipping</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentColor(order.payment)}>
                        {order.payment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{order.deliveryPartner}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {order.address.split(',')[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {order.date}
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
                          <DropdownMenuItem onClick={() => viewDetails(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => trackOrder(order)}>
                            <Truck className="mr-2 h-4 w-4" />
                            Track Order
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditingOrder(order);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Update Status
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

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update order information</DialogDescription>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editCustomer">Customer</Label>
                <Input
                  id="editCustomer"
                  value={editingOrder.customer}
                  onChange={(e) => setEditingOrder({...editingOrder, customer: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStore">Store</Label>
                <Input
                  id="editStore"
                  value={editingOrder.store}
                  onChange={(e) => setEditingOrder({...editingOrder, store: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTotal">Total Amount</Label>
                <Input
                  id="editTotal"
                  value={editingOrder.total}
                  onChange={(e) => setEditingOrder({...editingOrder, total: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editDeliveryPartner">Delivery Partner</Label>
                <Input
                  id="editDeliveryPartner"
                  value={editingOrder.deliveryPartner}
                  onChange={(e) => setEditingOrder({...editingOrder, deliveryPartner: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAddress">Delivery Address</Label>
                <Textarea
                  id="editAddress"
                  value={editingOrder.address}
                  onChange={(e) => setEditingOrder({...editingOrder, address: e.target.value})}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleEditOrder} className="flex-1 bg-admin-red hover:bg-admin-red/90">
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