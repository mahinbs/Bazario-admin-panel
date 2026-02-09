import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  Truck, 
  DollarSign,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target
} from "lucide-react";

const analyticsData = {
  overview: {
    totalRevenue: { value: "$234,567", change: "+15.3%", trend: "up" },
    totalOrders: { value: "1,247", change: "+8.2%", trend: "up" },
    totalCustomers: { value: "2,847", change: "+12.5%", trend: "up" },
    avgOrderValue: { value: "$187.50", change: "-2.1%", trend: "down" }
  },
  monthlyData: [
    { month: "Jan", revenue: 180000, orders: 890, customers: 2340 },
    { month: "Feb", revenue: 195000, orders: 967, customers: 2456 },
    { month: "Mar", revenue: 234567, orders: 1247, customers: 2847 }
  ],
  topProducts: [
    { name: "Monarch Bazario Garden Kit", sales: 234, revenue: "$21,066" },
    { name: "Bazario Habitat Dome", sales: 187, revenue: "$23,281" },
    { name: "Premium Nectar Feeder", sales: 298, revenue: "$9,827" },
    { name: "Bazario Life Cycle Set", sales: 145, revenue: "$6,664" }
  ],
  topStores: [
    { name: "Bazario Wings Co", revenue: "$18,924", orders: 234, growth: "+18%" },
    { name: "Garden Paradise", revenue: "$22,341", orders: 298, growth: "+22%" },
    { name: "Nature's Beauty", revenue: "$14,567", orders: 187, growth: "+15%" },
    { name: "Eco Butterflies", revenue: "$11,234", orders: 156, growth: "+12%" }
  ],
  deliveryMetrics: [
    { metric: "Average Delivery Time", value: "2.3 hours", change: "-15 min", trend: "up" },
    { metric: "On-Time Delivery Rate", value: "94.5%", change: "+2.3%", trend: "up" },
    { metric: "Customer Satisfaction", value: "4.8/5", change: "+0.2", trend: "up" },
    { metric: "Delivery Cost per Order", value: "$3.45", change: "-$0.12", trend: "up" }
  ]
};

const getMetricIcon = (metric: string) => {
  switch (metric.toLowerCase()) {
    case "total revenue": return DollarSign;
    case "total orders": return ShoppingCart;
    case "total customers": return Users;
    case "avg order value": return TrendingUp;
    default: return Activity;
  }
};

const getTrendColor = (trend: string) => {
  return trend === "up" ? "text-admin-success" : "text-admin-error";
};

const getTrendIcon = (trend: string) => {
  return trend === "up" ? TrendingUp : TrendingDown;
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your platform performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(analyticsData.overview).map(([key, data]) => {
          const IconComponent = getMetricIcon(key.replace(/([A-Z])/g, ' $1').trim());
          const TrendIcon = getTrendIcon(data.trend);
          
          return (
            <Card key={key} className="hover:shadow-medium transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-admin-red/10 rounded-lg">
                    <IconComponent className="w-6 h-6 text-admin-red" />
                  </div>
                  <div className={`flex items-center gap-1 ${getTrendColor(data.trend)}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{data.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{data.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-admin-red" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>Monthly revenue performance</CardDescription>
              </div>
              <Badge variant="outline" className="text-admin-success border-admin-success">
                +15.3% vs last month
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-admin-coral mb-2" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
                <p className="text-sm text-muted-foreground">Revenue: $234,567 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart Placeholder */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-admin-coral" />
                  Order Distribution
                </CardTitle>
                <CardDescription>Orders by category and status</CardDescription>
              </div>
              <Badge variant="outline" className="text-admin-success border-admin-success">
                1,247 total orders
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 mx-auto text-admin-red mb-2" />
                <p className="text-muted-foreground">Pie chart visualization would go here</p>
                <p className="text-sm text-muted-foreground">8.2% increase in orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-admin-success" />
              Top Performing Products
            </CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-admin rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-admin-success">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Stores */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-admin-coral" />
              Top Performing Stores
            </CardTitle>
            <CardDescription>Highest revenue generating stores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topStores.map((store, index) => (
                <div key={store.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-admin rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{store.name}</p>
                      <p className="text-sm text-muted-foreground">{store.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold text-admin-success">{store.revenue}</p>
                    <Badge className="bg-admin-success text-white text-xs">
                      {store.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Performance */}
      <Card className="hover:shadow-medium transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-admin-warning" />
            Delivery Performance Metrics
          </CardTitle>
          <CardDescription>Key delivery and logistics indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {analyticsData.deliveryMetrics.map((metric) => {
              const TrendIcon = getTrendIcon(metric.trend);
              return (
                <div key={metric.metric} className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-8 h-8 text-admin-coral" />
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                  <p className="text-sm text-muted-foreground mb-2">{metric.metric}</p>
                  <div className={`flex items-center justify-center gap-1 ${getTrendColor(metric.trend)}`}>
                    <TrendIcon className="w-3 h-3" />
                    <span className="text-xs">{metric.change}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}