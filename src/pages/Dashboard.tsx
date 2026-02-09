import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  Truck, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Eye,
  ArrowUpRight
} from "lucide-react";

const stats = [
  {
    title: "Total Customers",
    value: "2,847",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    color: "text-admin-red"
  },
  {
    title: "Active Stores",
    value: "156",
    change: "+5.2%",
    trend: "up" as const,
    icon: Store,
    color: "text-admin-coral"
  },
  {
    title: "Total Products",
    value: "8,932",
    change: "+18.7%",
    trend: "up" as const,
    icon: Package,
    color: "text-admin-success"
  },
  {
    title: "Orders Today",
    value: "89",
    change: "-2.4%",
    trend: "down" as const,
    icon: ShoppingCart,
    color: "text-admin-warning"
  },
  {
    title: "Delivery Partners",
    value: "67",
    change: "+8.1%",
    trend: "up" as const,
    icon: Truck,
    color: "text-admin-red"
  },
  {
    title: "Revenue Today",
    value: "$12,847",
    change: "+15.3%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-admin-success"
  }
];

const recentOrders = [
  { id: "ORD-001", customer: "Sarah Johnson", store: "Bazario Wings Co", amount: "$89.99", status: "delivered" },
  { id: "ORD-002", customer: "Mike Chen", store: "Nature's Beauty", amount: "$156.50", status: "shipping" },
  { id: "ORD-003", customer: "Emma Davis", store: "Garden Paradise", amount: "$73.25", status: "processing" },
  { id: "ORD-004", customer: "James Wilson", store: "Eco Butterflies", amount: "$201.00", status: "confirmed" },
];

const topStores = [
  { name: "Bazario Wings Co", revenue: "$8,947", orders: 156, rating: 4.9 },
  { name: "Nature's Beauty", revenue: "$7,523", orders: 134, rating: 4.8 },
  { name: "Garden Paradise", revenue: "$6,891", orders: 98, rating: 4.7 },
  { name: "Eco Butterflies", revenue: "$5,672", orders: 87, rating: 4.8 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-admin-success text-white";
    case "shipping": return "bg-admin-red text-white";
    case "processing": return "bg-admin-warning text-white";
    case "confirmed": return "bg-admin-coral text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform today.</p>
        </div>
        <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300">
          <Eye className="w-4 h-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-medium transition-all duration-300 border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center text-sm mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-admin-success mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-admin-error mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-admin-success" : "text-admin-error"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Recent Orders</CardTitle>
              <CardDescription>Latest orders from your platform</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.store}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-foreground">{order.amount}</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Stores */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Top Performing Stores</CardTitle>
              <CardDescription>Highest revenue generating stores</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStores.map((store, index) => (
                <div key={store.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-admin rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{store.name}</p>
                      <p className="text-xs text-muted-foreground">{store.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-foreground">{store.revenue}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>⭐ {store.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}