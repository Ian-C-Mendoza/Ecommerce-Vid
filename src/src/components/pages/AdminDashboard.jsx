import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { 
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
  ExternalLink,
  Star
} from 'lucide-react';
import { mockOrders, services, revenueData, customerData } from '../../data/mockData';

export function AdminDashboard({ activeTab = 'overview', onTabChange }) {
  const [orders, setOrders] = useState(mockOrders);
  const [servicesList, setServicesList] = useState(services);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    price: 0,
    duration: '',
    category: 'basic',
    features: ['']
  });

  // Portfolio management state
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoUrl: '',
    category: 'Corporate',
    client: ''
  });

  // Testimonials management state
  const [testimonialItems, setTestimonialItems] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    company: '',
    content: '',
    rating: 5,
    avatar: ''
  });

  // Load portfolio items from localStorage on component mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('adminPortfolioItems');
    if (savedPortfolio) {
      setPortfolioItems(JSON.parse(savedPortfolio));
    }
  }, []);

  // Load testimonials from localStorage on component mount
  useEffect(() => {
    const savedTestimonials = localStorage.getItem('adminTestimonials');
    if (savedTestimonials) {
      setTestimonialItems(JSON.parse(savedTestimonials));
    }
  }, []);

  // Save portfolio items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminPortfolioItems', JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  // Save testimonials to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminTestimonials', JSON.stringify(testimonialItems));
  }, [testimonialItems]);

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
  ].filter(item => item.value > 0);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAllOrders = (checked) => {
    setSelectedOrders(checked ? filteredOrders.map(order => order.id) : []);
  };

  const handleBulkStatusUpdate = (newStatus) => {
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

  const updateServiceFeature = (index, value) => {
    setNewService(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) => i === index ? value : feature) || []
    }));
  };

  const removeServiceFeature = (index) => {
    setNewService(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const saveNewService = () => {
    if (newService.title && newService.description && newService.price) {
      const service = {
        id: Date.now().toString(),
        title: newService.title,
        description: newService.description,
        price: newService.price,
        duration: newService.duration || '3-5 days',
        category: newService.category,
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
      const video = {
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

  const deleteVideo = (videoId) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== videoId));
    toast.success('Video removed from portfolio');
  };

  // Testimonials management functions
  const saveNewTestimonial = () => {
    if (newTestimonial.name && newTestimonial.company && newTestimonial.content) {
      const testimonial = {
        id: Date.now().toString(),
        name: newTestimonial.name,
        company: newTestimonial.company,
        content: newTestimonial.content,
        rating: newTestimonial.rating || 5,
        avatar: newTestimonial.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=150'
      };
      
      setTestimonialItems(prev => [testimonial, ...prev]);
      setNewTestimonial({
        name: '',
        company: '',
        content: '',
        rating: 5,
        avatar: ''
      });
      toast.success('Testimonial added successfully!');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const deleteTestimonial = (testimonialId) => {
    setTestimonialItems(prev => prev.filter(item => item.id !== testimonialId));
    toast.success('Testimonial removed successfully');
  };

  const getStatusIcon = (status) => {
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

  const getStatusColor = (status) => {
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
    <div className="p-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{monthlyGrowth}% from last month
            </p>
            <Progress value={75} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressOrders + pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrders} pending, {inProgressOrders} in progress
            </p>
            <Progress value={((inProgressOrders + pendingOrders) / orders.length) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerData.length}</div>
            <p className="text-xs text-muted-foreground">
              {customerData.filter(c => c.status === 'active').length} active customers
            </p>
            <Progress value={(customerData.filter(c => c.status === 'active').length / customerData.length) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedOrders / orders.length) * 100)}% completion rate
            </p>
            <Progress value={(completedOrders / orders.length) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="mb-8">
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20 glass">
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

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {revenueData && revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No revenue data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData && chartData.length > 0 ? (
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
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No order data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center space-x-3 p-3 border rounded-lg glass">
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
      )}

      {activeTab === 'orders' && (
        <Card className="glass">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Orders Management</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="btn-hover-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="btn-hover-secondary">
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
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
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
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'customers' && (
        <Card className="glass">
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'services' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Existing Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {servicesList.map((service) => (
                <div key={service.id} className="p-4 border rounded-lg space-y-2 glass">
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

          <Card className="glass">
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
                  value={newService.title}
                  onChange={(e) => setNewService(prev => ({...prev, title: e.target.value}))}
                  placeholder="e.g., Premium Edit"
                />
              </div>

              <div>
                <Label htmlFor="service-description">Description</Label>
                <Textarea
                  id="service-description"
                  value={newService.description}
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
                    value={newService.price}
                    onChange={(e) => setNewService(prev => ({...prev, price: parseInt(e.target.value) || 0}))}
                  />
                </div>
                <div>
                  <Label htmlFor="service-duration">Duration</Label>
                  <Input
                    id="service-duration"
                    value={newService.duration}
                    onChange={(e) => setNewService(prev => ({...prev, duration: e.target.value}))}
                    placeholder="e.g., 3-5 days"
                  />
                </div>
              </div>

              <Button onClick={saveNewService} className="w-full btn-hover-primary bg-gradient-primary">
                Add Service
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="glass">
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
                      <div key={video.id} className="p-4 border rounded-lg space-y-3 glass">
                        <div className="flex items-start space-x-4">
                          <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <ImageWithFallback
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium truncate">{video.title}</h4>
                                <p className="text-sm text-muted-foreground">{video.client}</p>
                                <Badge variant="outline" className="mt-1">{video.category}</Badge>
                              </div>
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass">
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
                    value={newVideo.title}
                    onChange={(e) => setNewVideo(prev => ({...prev, title: e.target.value}))}
                    placeholder="e.g., Corporate Brand Launch"
                  />
                </div>

                <div>
                  <Label htmlFor="video-description">Description *</Label>
                  <Textarea
                    id="video-description"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo(prev => ({...prev, description: e.target.value}))}
                    placeholder="Describe the video project..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="video-client">Client Name *</Label>
                  <Input
                    id="video-client"
                    value={newVideo.client}
                    onChange={(e) => setNewVideo(prev => ({...prev, client: e.target.value}))}
                    placeholder="e.g., TechFlow Inc."
                  />
                </div>

                <div>
                  <Label htmlFor="video-thumbnail">Thumbnail URL *</Label>
                  <Input
                    id="video-thumbnail"
                    value={newVideo.thumbnail}
                    onChange={(e) => setNewVideo(prev => ({...prev, thumbnail: e.target.value}))}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="video-url">Video URL *</Label>
                  <Input
                    id="video-url"
                    value={newVideo.videoUrl}
                    onChange={(e) => setNewVideo(prev => ({...prev, videoUrl: e.target.value}))}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>

                <Button 
                  onClick={saveNewVideo} 
                  className="w-full btn-hover-primary bg-gradient-primary"
                  disabled={!newVideo.title || !newVideo.description || !newVideo.thumbnail || !newVideo.videoUrl || !newVideo.client}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add to Portfolio
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Client Testimonials</span>
                  <Badge variant="secondary">{testimonialItems.length} testimonials</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testimonialItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No testimonials yet</p>
                    <p className="text-sm text-muted-foreground">Add your first testimonial to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {testimonialItems.map((testimonial) => (
                      <div key={testimonial.id} className="p-4 border rounded-lg space-y-3 glass">
                        <div className="flex items-start space-x-4">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <ImageWithFallback
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{testimonial.name}</h4>
                                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                                <div className="flex items-center mt-1">
                                  {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive"
                                onClick={() => deleteTestimonial(testimonial.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              "{testimonial.content}"
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add New Testimonial</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="testimonial-name">Client Name *</Label>
                  <Input
                    id="testimonial-name"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial(prev => ({...prev, name: e.target.value}))}
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>

                <div>
                  <Label htmlFor="testimonial-company">Company *</Label>
                  <Input
                    id="testimonial-company"
                    value={newTestimonial.company}
                    onChange={(e) => setNewTestimonial(prev => ({...prev, company: e.target.value}))}
                    placeholder="e.g., TechFlow Inc."
                  />
                </div>

                <div>
                  <Label htmlFor="testimonial-content">Testimonial Content *</Label>
                  <Textarea
                    id="testimonial-content"
                    value={newTestimonial.content}
                    onChange={(e) => setNewTestimonial(prev => ({...prev, content: e.target.value}))}
                    placeholder="Write the client's testimonial here..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="testimonial-rating">Rating</Label>
                  <Select
                    value={newTestimonial.rating?.toString() || '5'}
                    onValueChange={(value) => setNewTestimonial(prev => ({...prev, rating: parseInt(value)}))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars - Excellent</SelectItem>
                      <SelectItem value="4">4 Stars - Very Good</SelectItem>
                      <SelectItem value="3">3 Stars - Good</SelectItem>
                      <SelectItem value="2">2 Stars - Fair</SelectItem>
                      <SelectItem value="1">1 Star - Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={saveNewTestimonial} 
                  className="w-full btn-hover-primary bg-gradient-primary"
                  disabled={!newTestimonial.name || !newTestimonial.company || !newTestimonial.content}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Conversion Rate</span>
                <span className="font-bold">12.5%</span>
              </div>
              <Progress value={12.5} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span>Customer Satisfaction</span>
                <span className="font-bold">98%</span>
              </div>
              <Progress value={98} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span>Repeat Customers</span>
                <span className="font-bold">65%</span>
              </div>
              <Progress value={65} className="h-2" />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}