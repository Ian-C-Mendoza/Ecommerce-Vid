import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  Download,
  Filter,
  Bell,
  AlertCircle,
  Search,
  MoreHorizontal,
  Play,
  Video,
  ExternalLink
} from 'lucide-react';
import { mockOrders, services, revenueData, customerData } from '../data/mockData';
import { Service, Order, PortfolioItem } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [servicesList, setServicesList] = useState<Service[]>(services);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState('30');
  const [newService, setNewService] = useState<Partial<Service>>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    category: 'basic',
    features: ['']
  });

  // Portfolio management state
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [newVideo, setNewVideo] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    category: 'Corporate',
    client: ''
  });

  // Load portfolio items from localStorage on component mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('adminPortfolioItems');
    if (savedPortfolio) {
      setPortfolioItems(JSON.parse(savedPortfolio));
    }
  }, []);

  // Save portfolio items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminPortfolioItems', JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const inProgressOrders = orders.filter(order => order.status === 'in-progress').length;
  const monthlyGrowth = 12.5;
  const avgOrderValue = totalRevenue / orders.length;

  const statusColors = {
    'completed': '#22c55e',
    'in-progress': '#3b82f6',
    'pending': '#eab308',
    'cancelled': '#ef4444'
  };

  const chartData = [
    { name: 'Completed', value: completedOrders, color: statusColors.completed },
    { name: 'In Progress', value: inProgressOrders, color: statusColors['in-progress'] },
    { name: 'Pending', value: pendingOrders, color: statusColors.pending },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: statusColors.cancelled }
  ];

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAllOrders = (checked: boolean) => {
    setSelectedOrders(checked ? filteredOrders.map(order => order.id) : []);
  };

  const handleBulkStatusUpdate = (newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      selectedOrders.includes(order.id) ? { ...order, status: newStatus } : order
    ));
    setSelectedOrders([]);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const addFeatureToNewService = () => {
    setNewService(prev => ({
      ...prev,
      features: [...(prev.features || []), '']
    }));
  };

  const updateServiceFeature = (index: number, value: string) => {
    setNewService(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) => i === index ? value : feature) || []
    }));
  };

  const removeServiceFeature = (index: number) => {
    setNewService(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const saveNewService = () => {
    if (newService.title && newService.description && newService.price) {
      const service: Service = {
        id: Date.now().toString(),
        title: newService.title,
        description: newService.description,
        price: newService.price,
        duration: newService.duration || '3-5 days',
        category: newService.category as 'basic' | 'standard' | 'premium',
        features: newService.features?.filter(f => f.trim() !== '') || []
      };
      
      setServicesList(prev => [...prev, service]);
      setNewService({
        title: '',
        description: '',
        price: 0,
        duration: '',
        category: 'basic',
        features: ['']
      });
      toast.success('Service added successfully!');
    }
  };

  // Portfolio management functions
  const saveNewVideo = () => {
    if (newVideo.title && newVideo.description && newVideo.thumbnail && newVideo.videoUrl && newVideo.client) {
      const video: PortfolioItem = {
        id: Date.now().toString(),
        title: newVideo.title,
        description: newVideo.description,
        thumbnail: newVideo.thumbnail,
        videoUrl: newVideo.videoUrl,
        category: newVideo.category || 'Corporate',
        client: newVideo.client
      };
      
      setPortfolioItems(prev => [video, ...prev]);
      setNewVideo({
        title: '',
        description: '',
        thumbnail: '',
        videoUrl: '',
        category: 'Corporate',
        client: ''
      });
      toast.success('Video added to portfolio successfully!');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const deleteVideo = (videoId: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== videoId));
    toast.success('Video removed from portfolio');
  };

  const duplicateVideo = (video: PortfolioItem) => {
    const duplicatedVideo: PortfolioItem = {
      ...video,
      id: Date.now().toString(),
      title: `${video.title} (Copy)`
    };
    setPortfolioItems(prev => [duplicatedVideo, ...prev]);
    toast.success('Video duplicated successfully!');
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
    }
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl mb-2">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Manage your video editing services and track orders
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{monthlyGrowth}% from last month
              </p>
              <Progress value={75} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Active Orders</CardTitle>
              <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{inProgressOrders + pendingOrders}</div>
              <p className="text-xs text-green-600 dark:text-green-400">
                {pendingOrders} pending, {inProgressOrders} in progress
              </p>
              <Progress value={((inProgressOrders + pendingOrders) / orders.length) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{customerData.length}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                {customerData.filter(c => c.status === 'active').length} active customers
              </p>
              <Progress value={(customerData.filter(c => c.status === 'active').length / customerData.length) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">${Math.round(avgOrderValue)}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {Math.round((completedOrders / orders.length) * 100)}% completion rate
              </p>
              <Progress value={(completedOrders / orders.length) * 100} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Notifications */}
        <div className="mb-8">
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {pendingOrders} orders pending review
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    Review and update order statuses to keep customers informed
                  </p>
                </div>
                <Button size="sm" variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                  <Bell className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      {getStatusIcon(order.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.id} - ${order.total}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Orders Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedOrders.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">{selectedOrders.length} orders selected</span>
                    <div className="flex space-x-2">
                      <Select onValueChange={(value) => handleBulkStatusUpdate(value as Order['status'])}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Mark as Pending</SelectItem>
                          <SelectItem value="in-progress">Mark as In Progress</SelectItem>
                          <SelectItem value="completed">Mark as Completed</SelectItem>
                          <SelectItem value="cancelled">Mark as Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrders([])}>
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                          onCheckedChange={handleSelectAllOrders}
                        />
                      </TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => handleSelectOrder(order.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.services.map((item, index) => (
                            <div key={index} className="text-sm">
                              {item.service.title} (x{item.quantity})
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>${order.total}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(order.status)}
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{order.deliveryDate.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.totalOrders}</TableCell>
                        <TableCell>${customer.totalSpent}</TableCell>
                        <TableCell>{customer.lastOrder.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Existing Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {servicesList.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{service.title}</h3>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">${service.price}</Badge>
                        <span className="text-sm text-muted-foreground">{service.duration}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add New Service</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="service-title">Service Title</Label>
                    <Input
                      id="service-title"
                      value={newService.title || ''}
                      onChange={(e) => setNewService(prev => ({...prev, title: e.target.value}))}
                      placeholder="e.g., Premium Edit"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service-description">Description</Label>
                    <Textarea
                      id="service-description"
                      value={newService.description || ''}
                      onChange={(e) => setNewService(prev => ({...prev, description: e.target.value}))}
                      placeholder="Describe the service..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service-price">Price ($)</Label>
                      <Input
                        id="service-price"
                        type="number"
                        value={newService.price || ''}
                        onChange={(e) => setNewService(prev => ({...prev, price: parseInt(e.target.value) || 0}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="service-duration">Duration</Label>
                      <Input
                        id="service-duration"
                        value={newService.duration || ''}
                        onChange={(e) => setNewService(prev => ({...prev, duration: e.target.value}))}
                        placeholder="e.g., 3-5 days"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service-category">Category</Label>
                    <Select
                      value={newService.category || 'basic'}
                      onValueChange={(value) => setNewService(prev => ({...prev, category: value as 'basic' | 'standard' | 'premium'}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Features</Label>
                      <Button variant="ghost" size="sm" onClick={addFeatureToNewService}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Feature
                      </Button>
                    </div>
                    {newService.features?.map((feature, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateServiceFeature(index, e.target.value)}
                          placeholder="Feature description"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeServiceFeature(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button onClick={saveNewService} className="w-full">
                    Add Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Portfolio Videos</span>
                    <Badge variant="secondary">{portfolioItems.length} videos</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolioItems.length === 0 ? (
                    <div className="text-center py-8">
                      <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No portfolio videos yet</p>
                      <p className="text-sm text-muted-foreground">Add your first video to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {portfolioItems.map((video) => (
                        <div key={video.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-start space-x-4">
                            <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <ImageWithFallback
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium truncate">{video.title}</h4>
                                  <p className="text-sm text-muted-foreground">{video.client}</p>
                                  <Badge variant="outline" className="mt-1">{video.category}</Badge>
                                </div>
                                <div className="flex space-x-1 ml-2">
                                  <Button variant="ghost" size="sm" onClick={() => duplicateVideo(video)}>
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-destructive"
                                    onClick={() => deleteVideo(video.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {video.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="w-5 h-5" />
                    <span>Add New Portfolio Video</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="video-title">Video Title *</Label>
                    <Input
                      id="video-title"
                      value={newVideo.title || ''}
                      onChange={(e) => setNewVideo(prev => ({...prev, title: e.target.value}))}
                      placeholder="e.g., Corporate Brand Launch"
                    />
                  </div>

                  <div>
                    <Label htmlFor="video-description">Description *</Label>
                    <Textarea
                      id="video-description"
                      value={newVideo.description || ''}
                      onChange={(e) => setNewVideo(prev => ({...prev, description: e.target.value}))}
                      placeholder="Describe the video project..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="video-client">Client Name *</Label>
                    <Input
                      id="video-client"
                      value={newVideo.client || ''}
                      onChange={(e) => setNewVideo(prev => ({...prev, client: e.target.value}))}
                      placeholder="e.g., TechFlow Inc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="video-category">Category</Label>
                    <Select
                      value={newVideo.category || 'Corporate'}
                      onValueChange={(value) => setNewVideo(prev => ({...prev, category: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="video-thumbnail">Thumbnail URL *</Label>
                    <Input
                      id="video-thumbnail"
                      value={newVideo.thumbnail || ''}
                      onChange={(e) => setNewVideo(prev => ({...prev, thumbnail: e.target.value}))}
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                    {newVideo.thumbnail && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                        <div className="w-32 h-20 rounded-lg overflow-hidden bg-muted">
                          <ImageWithFallback
                            src={newVideo.thumbnail}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="video-url">Video URL *</Label>
                    <Input
                      id="video-url"
                      value={newVideo.videoUrl || ''}
                      onChange={(e) => setNewVideo(prev => ({...prev, videoUrl: e.target.value}))}
                      placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports direct video URLs, YouTube, Vimeo, or other video platforms
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      onClick={saveNewVideo} 
                      className="w-full bg-gradient-primary btn-hover-primary"
                      disabled={!newVideo.title || !newVideo.description || !newVideo.thumbnail || !newVideo.videoUrl || !newVideo.client}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add to Portfolio
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      * Required fields
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {portfolioItems.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Portfolio Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Videos</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{portfolioItems.length}</p>
                          </div>
                          <Video className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700 dark:text-green-300">Categories</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                              {new Set(portfolioItems.map(item => item.category)).size}
                            </p>
                          </div>
                          <Filter className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Clients</p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                              {new Set(portfolioItems.map(item => item.client)).size}
                            </p>
                          </div>
                          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="btn-hover-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Export Portfolio Data
                    </Button>
                    <Button variant="outline" className="btn-hover-secondary">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Public Portfolio
                    </Button>
                    <Button variant="outline" className="btn-hover-accent">
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Upload Videos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Custom Range
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}`, 'Revenue']} />
                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {servicesList.map((service) => {
                        const serviceRevenue = orders
                          .flatMap(order => order.services)
                          .filter(item => item.service.id === service.id)
                          .reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
                        
                        const percentage = totalRevenue > 0 ? (serviceRevenue / totalRevenue) * 100 : 0;
                        
                        return (
                          <div key={service.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{service.title}</span>
                              <span className="text-sm text-muted-foreground">${serviceRevenue}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{percentage.toFixed(1)}% of total revenue</span>
                              <span>{orders.flatMap(o => o.services).filter(s => s.service.id === service.id).length} orders</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Completion Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">2.3</div>
                          <div className="text-sm text-muted-foreground">Avg Days to Complete</div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">95%</div>
                          <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Basic Package</span>
                          <span>1.8 days avg</span>
                        </div>
                        <Progress value={75} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Standard Package</span>
                          <span>3.2 days avg</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Premium Package</span>
                          <span>6.1 days avg</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-500 mb-2">4.8</div>
                        <div className="text-muted-foreground">Average Rating</div>
                        <div className="flex justify-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-4 h-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <span className="text-sm w-2">{rating}</span>
                            <div className="text-sm">★</div>
                            <Progress value={rating === 5 ? 75 : rating === 4 ? 20 : 5} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground w-10">
                              {rating === 5 ? '75%' : rating === 4 ? '20%' : '5%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}