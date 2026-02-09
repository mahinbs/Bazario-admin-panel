import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Database,
  Key,
  Save,
  RefreshCw,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@bazario.com",
    phone: "+1 (555) 123-4567",
    bio: "Platform administrator managing the bazario ecommerce ecosystem.",
    avatar: ""
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    newUserAlerts: false,
    systemUpdates: true,
    marketingEmails: false,
    weeklyReports: true
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
    allowMultipleSessions: false,
    ipWhitelist: "",
    autoLogout: true
  });

  // Platform settings
  const [platform, setPlatform] = useState({
    siteName: "Bazario Ecommerce",
    siteDescription: "Your premier bazario marketplace",
    maintenanceMode: false,
    allowRegistrations: true,
    emailVerification: true,
    autoApproveStores: false,
    defaultCurrency: "USD",
    defaultLanguage: "English",
    timeZone: "America/New_York"
  });

  // API settings
  const [apiSettings, setApiSettings] = useState({
    apiKey: "bfly_sk_1234567890abcdef",
    webhookUrl: "https://api.bazario.com/webhook",
    rateLimitPerMinute: "100",
    enableCors: true,
    logApiCalls: true
  });

  const handleSave = async (section: string) => {
    setLoading(true);
    try {
      // Simulate API call for settings
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Settings Updated",
        description: `${section} settings have been saved successfully.`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${section.toLowerCase()} settings. Please try again.`,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready shortly.",
      duration: 3000,
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import Started",
      description: "Please select a file to import.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your platform settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportData}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-admin-coral" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
              />
            </div>

            <Button
              onClick={() => handleSave("Profile")}
              disabled={loading}
              className="w-full bg-admin-coral hover:bg-admin-coral/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-admin-warning" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Browser notifications</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, pushNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Order Alerts</Label>
                <p className="text-xs text-muted-foreground">New order notifications</p>
              </div>
              <Switch
                checked={notifications.orderAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, orderAlerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Low Stock Alerts</Label>
                <p className="text-xs text-muted-foreground">Inventory warnings</p>
              </div>
              <Switch
                checked={notifications.lowStockAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, lowStockAlerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Weekly Reports</Label>
                <p className="text-xs text-muted-foreground">Performance summaries</p>
              </div>
              <Switch
                checked={notifications.weeklyReports}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, weeklyReports: checked })
                }
              />
            </div>

            <Button
              onClick={() => handleSave("Notifications")}
              disabled={loading}
              className="w-full bg-admin-warning hover:bg-admin-warning/90"
            >
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-admin-success" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Add extra security layer</p>
              </div>
              <Switch
                checked={security.twoFactorAuth}
                onCheckedChange={(checked) =>
                  setSecurity({ ...security, twoFactorAuth: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Login Alerts</Label>
                <p className="text-xs text-muted-foreground">Notify on new logins</p>
              </div>
              <Switch
                checked={security.loginAlerts}
                onCheckedChange={(checked) =>
                  setSecurity({ ...security, loginAlerts: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ipWhitelist">IP Whitelist</Label>
              <Input
                id="ipWhitelist"
                placeholder="192.168.1.1, 10.0.0.1"
                value={security.ipWhitelist}
                onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value })}
              />
            </div>

            <Button
              onClick={() => handleSave("Security")}
              disabled={loading}
              className="w-full bg-admin-success hover:bg-admin-success/90"
            >
              Save Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-admin-red" />
              Platform Settings
            </CardTitle>
            <CardDescription>Configure global platform options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={platform.siteName}
                onChange={(e) => setPlatform({ ...platform, siteName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={platform.siteDescription}
                onChange={(e) => setPlatform({ ...platform, siteDescription: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">Temporarily disable site</p>
              </div>
              <Switch
                checked={platform.maintenanceMode}
                onCheckedChange={(checked) =>
                  setPlatform({ ...platform, maintenanceMode: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Allow New Registrations</Label>
                <p className="text-xs text-muted-foreground">Enable user sign-ups</p>
              </div>
              <Switch
                checked={platform.allowRegistrations}
                onCheckedChange={(checked) =>
                  setPlatform({ ...platform, allowRegistrations: checked })
                }
              />
            </div>

            <Button
              onClick={() => handleSave("Platform")}
              disabled={loading}
              className="w-full bg-admin-coral hover:bg-admin-coral/90"
            >
              Save Platform Settings
            </Button>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="hover:shadow-medium transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-admin-red" />
              API Settings
            </CardTitle>
            <CardDescription>Manage API keys and integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiSettings.apiKey}
                  onChange={(e) => setApiSettings({ ...apiSettings, apiKey: e.target.value })}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                value={apiSettings.webhookUrl}
                onChange={(e) => setApiSettings({ ...apiSettings, webhookUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rateLimit">Rate Limit (per minute)</Label>
              <Input
                id="rateLimit"
                type="number"
                value={apiSettings.rateLimitPerMinute}
                onChange={(e) => setApiSettings({ ...apiSettings, rateLimitPerMinute: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Enable CORS</Label>
                <p className="text-xs text-muted-foreground">Allow cross-origin requests</p>
              </div>
              <Switch
                checked={apiSettings.enableCors}
                onCheckedChange={(checked) =>
                  setApiSettings({ ...apiSettings, enableCors: checked })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={() => handleSave("API")}
                disabled={loading}
                className="flex-1 bg-admin-red hover:bg-admin-red/90"
              >
                Save API Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="hover:shadow-medium transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-admin-success" />
            System Status
          </CardTitle>
          <CardDescription>Current system information and health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Database className="w-8 h-8 mx-auto text-admin-success mb-2" />
              <p className="text-2xl font-bold text-foreground">99.9%</p>
              <p className="text-sm text-muted-foreground">Database Uptime</p>
              <Badge className="bg-admin-success text-white mt-2">Healthy</Badge>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Globe className="w-8 h-8 mx-auto text-admin-coral mb-2" />
              <p className="text-2xl font-bold text-foreground">1.2GB</p>
              <p className="text-sm text-muted-foreground">Storage Used</p>
              <Badge className="bg-admin-coral text-white mt-2">Optimal</Badge>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Key className="w-8 h-8 mx-auto text-admin-warning mb-2" />
              <p className="text-2xl font-bold text-foreground">2,847</p>
              <p className="text-sm text-muted-foreground">API Calls Today</p>
              <Badge className="bg-admin-warning text-white mt-2">Active</Badge>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Shield className="w-8 h-8 mx-auto text-admin-red mb-2" />
              <p className="text-2xl font-bold text-foreground">Secure</p>
              <p className="text-sm text-muted-foreground">Security Status</p>
              <Badge className="bg-admin-red text-white mt-2">Protected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}