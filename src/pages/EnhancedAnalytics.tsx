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
  Target,
  ArrowUpRight,
  Eye
} from "lucide-react";

const analyticsData = {
  overview: {
    totalRevenue: { value: "$234,567", change: "+15.3%", trend: "up" },
    totalOrders: { value: "1,247", change: "+8.2%", trend: "up" },
    totalCustomers: { value: "2,847", change: "+12.5%", trend: "up" },
    avgOrderValue: { value: "$187.50", change: "-2.1%", trend: "down" }
  },
  revenueData: [
    { month: "Jan", revenue: 180000, orders: 890, growth: 12 },
    { month: "Feb", revenue: 195000, orders: 967, growth: 18 },
    { month: "Mar", revenue: 234567, orders: 1247, growth: 25 }
  ],
  categoryData: [
    { name: "Garden Kits", value: 40, color: "var(--admin-red)", sales: 487 },
    { name: "Habitats", value: 25, color: "var(--admin-coral)", sales: 312 },
    { name: "Educational", value: 20, color: "var(--admin-success)", sales: 234 },
    { name: "Feeders", value: 15, color: "var(--admin-warning)", sales: 189 }
  ],
  topProducts: [
    { name: "Monarch Bazario Garden Kit", sales: 234, revenue: "$21,066", trend: "+12%" },
    { name: "Bazario Habitat Dome", sales: 187, revenue: "$23,281", trend: "+8%" },
    { name: "Premium Nectar Feeder", sales: 298, revenue: "$9,827", trend: "+15%" },
    { name: "Bazario Life Cycle Set", sales: 145, revenue: "$6,664", trend: "+5%" }
  ],
  topStores: [
    { name: "Bazario Wings Co", revenue: "$18,924", orders: 234, growth: "+18%", rating: 4.9 },
    { name: "Garden Paradise", revenue: "$22,341", orders: 298, growth: "+22%", rating: 4.8 },
    { name: "Nature's Beauty", revenue: "$14,567", orders: 187, growth: "+15%", rating: 4.7 },
    { name: "Eco Butterflies", revenue: "$11,234", orders: 156, growth: "+12%", rating: 4.6 }
  ]
};

const getTrendColor = (trend: string) => {
  return trend === "up" ? "text-admin-success" : "text-admin-error";
};

const getTrendIcon = (trend: string) => {
  return trend === "up" ? TrendingUp : TrendingDown;
};

// Enhanced Revenue Chart Component
const RevenueChart = () => (
  <div className="h-80 p-6">
    <div className="h-full relative">
      {/* Chart Area */}
      <div className="absolute inset-0 flex items-end justify-between gap-4 pb-12">
        {analyticsData.revenueData.map((data, index) => {
          const height = (data.revenue / 250000) * 100;
          return (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-3">
              <div className="relative w-full group">
                {/* Bar */}
                <div 
                  className="bg-gradient-to-t from-admin-red to-admin-coral rounded-lg w-full transition-all duration-1000 hover:scale-105 cursor-pointer shadow-lg"
                  style={{ 
                    height: `${Math.max(height, 20)}%`,
                    animationDelay: `${index * 200}ms`
                  }}
                />
                {/* Value Label */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded text-xs font-semibold">
                  ${(data.revenue / 1000).toFixed(0)}K
                </div>
              </div>
              {/* Month Label */}
              <span className="text-sm font-medium text-muted-foreground">{data.month}</span>
              {/* Growth Indicator */}
              <Badge className="bg-admin-success/10 text-admin-success text-xs">
                +{data.growth}%
              </Badge>
            </div>
          );
        })}
      </div>
      
      {/* Y-Axis Labels */}
      <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-muted-foreground">
        <span>$250K</span>
        <span>$200K</span>
        <span>$150K</span>
        <span>$100K</span>
        <span>$50K</span>
        <span>$0</span>
      </div>
    </div>
  </div>
);

// Enhanced Pie Chart Component
const CategoryChart = () => (
  <div className="h-80 p-6">
    <div className="h-full flex items-center justify-center relative">
      {/* Pie Chart */}
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {analyticsData.categoryData.map((category, index) => {
            const startAngle = analyticsData.categoryData
              .slice(0, index)
              .reduce((sum, cat) => sum + (cat.value * 3.6), 0);
            const endAngle = startAngle + (category.value * 3.6);
            
            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = category.value > 50 ? 1 : 0;
            
            return (
              <path
                key={category.name}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={`hsl(${category.color})`}
                stroke="white"
                strokeWidth="1"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
        </svg>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-background rounded-full w-20 h-20 flex items-center justify-center border">
            <div>
              <p className="text-lg font-bold text-foreground">1.2K</p>
              <p className="text-xs text-muted-foreground">Sales</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="absolute right-0 space-y-3">
        {analyticsData.categoryData.map((category) => (
          <div key={category.name} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: `hsl(${category.color})` }}
            />
            <div>
              <p className="text-sm font-medium text-foreground">{category.name}</p>
              <p className="text-xs text-muted-foreground">{category.sales} sales ({category.value}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Customer Growth Line Chart
const CustomerGrowthChart = () => (
  <div className="h-64 p-6">
    <div className="h-full relative bg-gradient-to-br from-admin-success/5 to-admin-coral/5 rounded-lg overflow-hidden">
      <svg className="absolute inset-4 w-full h-full" viewBox="0 0 300 150">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--admin-success))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--admin-success))" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Grid Lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            y1={30 * i}
            x2="300"
            y2={30 * i}
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}
        
        {/* Area Fill */}
        <path
          d="M 50 120 L 100 90 L 150 60 L 200 40 L 250 20 L 250 150 L 50 150 Z"
          fill="url(#areaGradient)"
        />
        
        {/* Main Line */}
        <polyline
          fill="none"
          stroke="hsl(var(--admin-success))"
          strokeWidth="3"
          points="50,120 100,90 150,60 200,40 250,20"
          className="animate-fade-in"
        />
        
        {/* Data Points */}
        {[{x: 50, y: 120}, {x: 100, y: 90}, {x: 150, y: 60}, {x: 200, y: 40}, {x: 250, y: 20}].map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="hsl(var(--admin-success))"
            stroke="white"
            strokeWidth="2"
            className="animate-scale-in hover:r-6 transition-all cursor-pointer"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-2 left-4 right-4 flex justify-between text-xs text-muted-foreground">
        <span>Nov</span>
        <span>Dec</span>
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
      </div>
    </div>
  </div>
);

export default function Analytics() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground">Comprehensive insights into your platform performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 hover:shadow-medium transition-all">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button className="bg-gradient-admin hover:shadow-glow transition-all duration-300 gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(analyticsData.overview).map(([key, data], index) => {
          const IconComponent = key === "totalRevenue" ? DollarSign : 
                              key === "totalOrders" ? ShoppingCart :
                              key === "totalCustomers" ? Users : TrendingUp;
          const TrendIcon = getTrendIcon(data.trend);
          
          return (
            <Card key={key} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-admin-red animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-admin-red/10 rounded-xl">
                    <IconComponent className="w-7 h-7 text-admin-red" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-opacity-10 ${getTrendColor(data.trend)}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{data.change}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h3>
                  <p className="text-3xl font-bold text-foreground">{data.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">from last month</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BarChart3 className="w-6 h-6 text-admin-red" />
                  Revenue Trends
                </CardTitle>
                <CardDescription className="text-base mt-1">Monthly revenue performance over time</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <RevenueChart />
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <PieChart className="w-6 h-6 text-admin-coral" />
                  Sales by Category
                </CardTitle>
                <CardDescription className="text-base mt-1">Product category performance breakdown</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <CategoryChart />
          </CardContent>
        </Card>
      </div>

      {/* Customer Growth Chart */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Users className="w-6 h-6 text-admin-success" />
                Customer Growth Trend
              </CardTitle>
              <CardDescription className="text-base mt-1">Monthly customer acquisition and growth metrics</CardDescription>
            </div>
            <Badge className="bg-admin-success text-white px-3 py-1">
              +12.5% Growth
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <CustomerGrowthChart />
        </CardContent>
      </Card>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Package className="w-6 h-6 text-admin-success" />
                  Top Performing Products
                </CardTitle>
                <CardDescription className="text-base">Best selling products this month</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-transparent rounded-lg hover:from-muted/50 transition-all animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-admin rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-admin-success text-lg">{product.revenue}</p>
                  <Badge className="bg-admin-success/10 text-admin-success">
                    {product.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Stores */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Store className="w-6 h-6 text-admin-coral" />
                  Top Performing Stores
                </CardTitle>
                <CardDescription className="text-base">Highest revenue generating stores</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topStores.map((store, index) => (
              <div key={store.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-transparent rounded-lg hover:from-muted/50 transition-all animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-admin rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{store.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{store.orders} orders</span>
                      <span>•</span>
                      <span>⭐ {store.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-bold text-admin-success text-lg">{store.revenue}</p>
                  <Badge className="bg-admin-coral/10 text-admin-coral">
                    {store.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <Card className="bg-gradient-to-r from-admin-red/5 to-admin-coral/5 border-admin-red/20">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="p-4 bg-admin-red/10 rounded-full inline-flex mb-3">
                <Truck className="w-8 h-8 text-admin-red" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">94.5%</p>
              <p className="text-sm text-muted-foreground">On-Time Delivery</p>
            </div>
            <div>
              <div className="p-4 bg-admin-coral/10 rounded-full inline-flex mb-3">
                <Target className="w-8 h-8 text-admin-coral" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">4.8/5</p>
              <p className="text-sm text-muted-foreground">Customer Rating</p>
            </div>
            <div>
              <div className="p-4 bg-admin-success/10 rounded-full inline-flex mb-3">
                <Activity className="w-8 h-8 text-admin-success" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">2.3h</p>
              <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
            </div>
            <div>
              <div className="p-4 bg-admin-warning/10 rounded-full inline-flex mb-3">
                <DollarSign className="w-8 h-8 text-admin-warning" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">$3.45</p>
              <p className="text-sm text-muted-foreground">Cost per Order</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}