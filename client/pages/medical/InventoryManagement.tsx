import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/components/ui/notification-system';
import { inventoryApi } from '@/services/api';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  Calendar,
  MapPin,
  DollarSign,
  ShoppingCart,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface InventoryItem {
  id: string;
  category: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  cost: number;
  supplier: string;
  lastRestocked?: Date;
  expiryDate?: Date;
  location: string;
  status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
}

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryApi.getAll();
      
      if (response.success) {
        const itemsWithStatus = response.data.inventory.map((item: InventoryItem) => ({
          ...item,
          status: getItemStatus(item)
        }));
        setInventory(itemsWithStatus);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo cargar el inventario',
        priority: 'high'
      });
    } finally {
      setLoading(false);
    }
  };

  const getItemStatus = (item: InventoryItem): 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired' => {
    if (item.expiryDate && new Date(item.expiryDate) < new Date()) {
      return 'expired';
    }
    if (item.currentStock === 0) {
      return 'out_of_stock';
    }
    if (item.currentStock <= item.minStock) {
      return 'low_stock';
    }
    return 'in_stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="w-4 h-4" />;
      case 'low_stock': return <AlertTriangle className="w-4 h-4" />;
      case 'out_of_stock': return <XCircle className="w-4 h-4" />;
      case 'expired': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredInventory = inventory
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .sort((a, b) => {
      const aValue = a[sortBy as keyof InventoryItem];
      const bValue = b[sortBy as keyof InventoryItem];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))];

  const inventoryStats = {
    totalItems: inventory.length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0),
    lowStockItems: inventory.filter(item => item.status === 'low_stock').length,
    outOfStockItems: inventory.filter(item => item.status === 'out_of_stock').length,
    expiredItems: inventory.filter(item => item.status === 'expired').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando inventario...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">Administra suministros médicos y equipos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{inventoryStats.totalItems}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold">
                  ${inventoryStats.totalValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Bajo</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inventoryStats.lowStockItems}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agotados</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventoryStats.outOfStockItems}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidos</p>
                <p className="text-2xl font-bold text-gray-600">
                  {inventoryStats.expiredItems}
                </p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, categoría o proveedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
              <option value="currentStock-asc">Stock Menor</option>
              <option value="currentStock-desc">Stock Mayor</option>
              <option value="cost-asc">Precio Menor</option>
              <option value="cost-desc">Precio Mayor</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Items de Inventario ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Item</th>
                  <th className="text-left p-3">Categoría</th>
                  <th className="text-left p-3">Stock</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Ubicación</th>
                  <th className="text-left p-3">Proveedor</th>
                  <th className="text-left p-3">Valor</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.unit}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{item.category}</Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{item.currentStock}</p>
                        <Progress 
                          value={(item.currentStock / item.maxStock) * 100} 
                          className="w-16 h-2 mt-1"
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(item.status!)}>
                        {getStatusIcon(item.status!)}
                        <span className="ml-1">
                          {item.status === 'in_stock' && 'En Stock'}
                          {item.status === 'low_stock' && 'Stock Bajo'}
                          {item.status === 'out_of_stock' && 'Agotado'}
                          {item.status === 'expired' && 'Vencido'}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {item.location}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 text-gray-400 mr-1" />
                        {item.supplier}
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">
                        ${(item.currentStock * item.cost).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.cost}/unidad
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
