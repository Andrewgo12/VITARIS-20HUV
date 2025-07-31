import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/components/ui/notification-system';
import { billingApi } from '@/services/api';
import {
  DollarSign,
  CreditCard,
  FileText,
  Calendar,
  User,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Receipt,
  Banknote,
  Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BillItem {
  description: string;
  amount: number;
  quantity?: number;
  unitPrice?: number;
}

interface Insurance {
  provider: string;
  coverage: number;
  coveredAmount: number;
  patientResponsibility: number;
}

interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  admissionId?: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  createdDate: Date;
  items: BillItem[];
  insurance?: Insurance;
  paymentMethod?: string;
  notes?: string;
}

const BillingManagement: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showBillDetail, setShowBillDetail] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await billingApi.getAll();
      
      if (response.success) {
        setBills(response.data.bills);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No se pudo cargar la facturación',
        priority: 'high'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'partial': return <CreditCard className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <Trash2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredBills = bills
    .filter(bill => 
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(bill => statusFilter === 'all' || bill.status === statusFilter);

  const billingStats = {
    totalBills: bills.length,
    totalRevenue: bills.reduce((sum, bill) => sum + bill.totalAmount, 0),
    totalPaid: bills.reduce((sum, bill) => sum + bill.paidAmount, 0),
    totalPending: bills.reduce((sum, bill) => sum + bill.pendingAmount, 0),
    paidBills: bills.filter(bill => bill.status === 'paid').length,
    pendingBills: bills.filter(bill => bill.status === 'pending').length,
    overdueBills: bills.filter(bill => bill.status === 'overdue').length,
  };

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setShowBillDetail(true);
  };

  const handlePayment = async (billId: string, amount: number) => {
    try {
      // Simulate payment processing
      addNotification({
        type: 'success',
        title: 'Pago Procesado',
        message: `Pago de $${amount.toLocaleString()} procesado exitosamente`,
        priority: 'medium'
      });
      
      // Refresh bills
      await fetchBills();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error en Pago',
        message: 'No se pudo procesar el pago',
        priority: 'high'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando facturación...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Facturación</h1>
          <p className="text-gray-600">Administra facturas y pagos del hospital</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600">
                  ${billingStats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagado</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${billingStats.totalPaid.toLocaleString()}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendiente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${billingStats.totalPending.toLocaleString()}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Facturas Vencidas</p>
                <p className="text-2xl font-bold text-red-600">
                  {billingStats.overdueBills}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por paciente o número de factura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="partial">Pago Parcial</option>
              <option value="paid">Pagado</option>
              <option value="overdue">Vencido</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facturas ({filteredBills.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Factura</th>
                  <th className="text-left p-3">Paciente</th>
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Pagado</th>
                  <th className="text-left p-3">Pendiente</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Vencimiento</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill, index) => (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <div className="flex items-center">
                        <Receipt className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium">{bill.id}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        {bill.patientName}
                      </div>
                    </td>
                    <td className="p-3">
                      {new Date(bill.createdDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="font-medium">
                        ${bill.totalAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-green-600 font-medium">
                        ${bill.paidAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-red-600 font-medium">
                        ${bill.pendingAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(bill.status)}>
                        {getStatusIcon(bill.status)}
                        <span className="ml-1">
                          {bill.status === 'paid' && 'Pagado'}
                          {bill.status === 'pending' && 'Pendiente'}
                          {bill.status === 'partial' && 'Parcial'}
                          {bill.status === 'overdue' && 'Vencido'}
                          {bill.status === 'cancelled' && 'Cancelado'}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewBill(bill)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {bill.status !== 'paid' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePayment(bill.id, bill.pendingAmount)}
                          >
                            <CreditCard className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Send className="w-4 h-4" />
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

      {/* Bill Detail Modal */}
      {showBillDetail && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Detalle de Factura</h2>
              <Button 
                variant="ghost" 
                onClick={() => setShowBillDetail(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Número de Factura</p>
                  <p className="font-medium">{selectedBill.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paciente</p>
                  <p className="font-medium">{selectedBill.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Emisión</p>
                  <p className="font-medium">
                    {new Date(selectedBill.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
                  <p className="font-medium">
                    {new Date(selectedBill.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Items de Facturación</h3>
                <div className="border rounded-lg">
                  {selectedBill.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-3 border-b last:border-b-0">
                      <span>{item.description}</span>
                      <span className="font-medium">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedBill.insurance && (
                <div>
                  <h3 className="font-medium mb-2">Información del Seguro</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p><strong>Proveedor:</strong> {selectedBill.insurance.provider}</p>
                    <p><strong>Cobertura:</strong> {selectedBill.insurance.coverage}%</p>
                    <p><strong>Monto Cubierto:</strong> ${selectedBill.insurance.coveredAmount.toLocaleString()}</p>
                    <p><strong>Responsabilidad del Paciente:</strong> ${selectedBill.insurance.patientResponsibility.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${selectedBill.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Pagado:</span>
                  <span>${selectedBill.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Pendiente:</span>
                  <span>${selectedBill.pendingAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Procesar Pago
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
                <Button variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar por Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingManagement;
