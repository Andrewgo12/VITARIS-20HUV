import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Barcode,
  Truck,
  ClipboardList,
  Calendar as CalendarIcon,
  MapPin,
  Thermometer,
  Shield,
  Clock,
  CheckCircle,
  Building,
  DollarSign,
} from "lucide-react";

interface InventoryManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "transfer" | "adjust" | "order";
}

const medications = [
  {
    id: "MED001",
    name: "Atorvastatina 40mg",
    genericName: "Atorvastatina cálcica",
    category: "Hipolipemiante",
    currentStock: 150,
    minStock: 50,
    maxStock: 500,
    unit: "Tabletas",
    cost: 2500,
    expirationDate: "2024-08-15",
    location: "Farmacia Central - Estante A3",
    supplier: "Laboratorios ABC",
    batch: "ABC123456",
    status: "Disponible",
  },
  {
    id: "MED002",
    name: "Amoxicilina 500mg",
    genericName: "Amoxicilina trihidrato",
    category: "Antibiótico",
    currentStock: 25,
    minStock: 30,
    maxStock: 200,
    unit: "Cápsulas",
    cost: 800,
    expirationDate: "2024-06-30",
    location: "Farmacia Central - Estante B1",
    supplier: "Farma XYZ",
    batch: "XYZ789012",
    status: "Stock bajo",
  },
];

const locations = [
  "Farmacia Central",
  "Farmacia UCI",
  "Farmacia Urgencias",
  "Farmacia Quirófano",
  "Almacén General",
  "Refrigerador 1",
  "Refrigerador 2",
  "Narcóticos (Seguridad)",
];

const suppliers = [
  "Laboratorios ABC",
  "Farma XYZ",
  "Medicamentos del Valle",
  "Distribuidora Nacional",
  "Farmacéutica Internacional",
];

const categories = [
  "Antibióticos",
  "Analgésicos",
  "Cardiovasculares",
  "Neurológicos",
  "Endocrinos",
  "Respiratorios",
  "Gastrointestinales",
  "Dermatológicos",
  "Oncológicos",
  "Narcóticos",
];

export default function InventoryManagementModal({
  open,
  onOpenChange,
  mode = "add",
}: InventoryManagementModalProps) {
  const [activeTab, setActiveTab] = useState(mode);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedication, setSelectedMedication] = useState("");

  const [inventoryData, setInventoryData] = useState({
    medication: "",
    quantity: "",
    unit: "",
    cost: "",
    supplier: "",
    batch: "",
    expirationDate: new Date(),
    location: "",
    category: "",
    notes: "",
    requiresRefrigeration: false,
    isControlled: false,
    minimumStock: "",
    maximumStock: "",
  });

  const [transferData, setTransferData] = useState({
    medication: "",
    fromLocation: "",
    toLocation: "",
    quantity: "",
    reason: "",
    requestedBy: "",
    authorizedBy: "",
    urgent: false,
  });

  const [adjustmentData, setAdjustmentData] = useState({
    medication: "",
    currentStock: 0,
    adjustedStock: "",
    adjustmentType: "increase",
    reason: "",
    approvedBy: "",
    notes: "",
  });

  const [orderData, setOrderData] = useState({
    medication: "",
    supplier: "",
    quantity: "",
    unitCost: "",
    totalCost: "",
    expectedDelivery: new Date(),
    priority: "normal",
    autoReorder: false,
    notes: "",
  });

  const handleInputChange = (field: string, value: any, dataType: string) => {
    switch (dataType) {
      case "inventory":
        setInventoryData((prev) => ({ ...prev, [field]: value }));
        break;
      case "transfer":
        setTransferData((prev) => ({ ...prev, [field]: value }));
        break;
      case "adjustment":
        setAdjustmentData((prev) => ({ ...prev, [field]: value }));
        break;
      case "order":
        setOrderData((prev) => ({ ...prev, [field]: value }));
        break;
    }
  };

  const calculateTotalCost = () => {
    const quantity = parseFloat(orderData.quantity) || 0;
    const unitCost = parseFloat(orderData.unitCost) || 0;
    const total = quantity * unitCost;
    setOrderData((prev) => ({ ...prev, totalCost: total.toString() }));
  };

  const handleSubmit = () => {
    switch (activeTab) {
      case "add":
        console.log("Adding inventory:", inventoryData);
        break;
      case "transfer":
        console.log("Transfer request:", transferData);
        break;
      case "adjust":
        console.log("Stock adjustment:", adjustmentData);
        break;
      case "order":
        console.log("Purchase order:", orderData);
        break;
    }
    onOpenChange(false);
  };

  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStockStatus = (current: number, min: number) => {
    if (current <= min)
      return { status: "Stock bajo", color: "bg-red-100 text-red-700" };
    if (current <= min * 1.5)
      return { status: "Reorden", color: "bg-yellow-100 text-yellow-700" };
    return { status: "Disponible", color: "bg-green-100 text-green-700" };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-700 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Gestión de Inventario Farmacéutico
          </DialogTitle>
          <DialogDescription>
            Administrar inventario, transferencias, ajustes y órdenes de compra
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "add" | "transfer" | "order" | "adjust")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Agregar Stock
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Transferir
            </TabsTrigger>
            <TabsTrigger value="adjust" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Ajustar
            </TabsTrigger>
            <TabsTrigger value="order" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Ordenar
            </TabsTrigger>
          </TabsList>

          {/* Tab de Agregar Stock */}
          <TabsContent value="add" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Información del Medicamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nombre del Medicamento *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar o ingresar nuevo medicamento"
                        value={inventoryData.medication}
                        onChange={(e) =>
                          handleInputChange(
                            "medication",
                            e.target.value,
                            "inventory",
                          )
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cantidad *</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={inventoryData.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            "quantity",
                            e.target.value,
                            "inventory",
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unidad *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("unit", value, "inventory")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tabletas">Tabletas</SelectItem>
                          <SelectItem value="capsulas">Cápsulas</SelectItem>
                          <SelectItem value="ampollas">Ampollas</SelectItem>
                          <SelectItem value="viales">Viales</SelectItem>
                          <SelectItem value="ml">Mililitros</SelectItem>
                          <SelectItem value="mg">Miligramos</SelectItem>
                          <SelectItem value="unidades">Unidades</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Costo unitario</Label>
                      <Input
                        type="number"
                        placeholder="2500"
                        value={inventoryData.cost}
                        onChange={(e) =>
                          handleInputChange("cost", e.target.value, "inventory")
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Categoría *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("category", value, "inventory")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Proveedor *</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("supplier", value, "inventory")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Número de lote *</Label>
                      <div className="relative">
                        <Barcode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="ABC123456"
                          value={inventoryData.batch}
                          onChange={(e) =>
                            handleInputChange(
                              "batch",
                              e.target.value,
                              "inventory",
                            )
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Ubicación *</Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("location", value, "inventory")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar ubicación" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Configuración Adicional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fecha de vencimiento *</Label>
                    <Calendar
                      mode="single"
                      selected={inventoryData.expirationDate}
                      onSelect={(date) =>
                        date &&
                        handleInputChange("expirationDate", date, "inventory")
                      }
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stock mínimo</Label>
                      <Input
                        type="number"
                        placeholder="50"
                        value={inventoryData.minimumStock}
                        onChange={(e) =>
                          handleInputChange(
                            "minimumStock",
                            e.target.value,
                            "inventory",
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock máximo</Label>
                      <Input
                        type="number"
                        placeholder="500"
                        value={inventoryData.maximumStock}
                        onChange={(e) =>
                          handleInputChange(
                            "maximumStock",
                            e.target.value,
                            "inventory",
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4" />
                        <Label>Requiere refrigeración</Label>
                      </div>
                      <Switch
                        checked={inventoryData.requiresRefrigeration}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            "requiresRefrigeration",
                            checked,
                            "inventory",
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <Label>Medicamento controlado</Label>
                      </div>
                      <Switch
                        checked={inventoryData.isControlled}
                        onCheckedChange={(checked) =>
                          handleInputChange(
                            "isControlled",
                            checked,
                            "inventory",
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notas adicionales</Label>
                    <Textarea
                      placeholder="Observaciones, condiciones especiales de almacenamiento..."
                      rows={3}
                      value={inventoryData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value, "inventory")
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab de Transferir */}
          <TabsContent value="transfer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Solicitud de Transferencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Medicamento a transferir *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar medicamento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {searchTerm && (
                    <div className="max-h-40 overflow-y-auto border rounded-lg">
                      {filteredMedications.map((med) => (
                        <div
                          key={med.id}
                          className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            setTransferData((prev) => ({
                              ...prev,
                              medication: med.name,
                              fromLocation: med.location,
                            }));
                            setSearchTerm("");
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{med.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {med.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {med.currentStock} {med.unit}
                              </p>
                              <Badge
                                className={
                                  getStockStatus(med.currentStock, med.minStock)
                                    .color
                                }
                              >
                                {
                                  getStockStatus(med.currentStock, med.minStock)
                                    .status
                                }
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Desde ubicación *</Label>
                    <Select
                      value={transferData.fromLocation}
                      onValueChange={(value) =>
                        handleInputChange("fromLocation", value, "transfer")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ubicación origen" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Hacia ubicación *</Label>
                    <Select
                      value={transferData.toLocation}
                      onValueChange={(value) =>
                        handleInputChange("toLocation", value, "transfer")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Ubicación destino" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cantidad a transferir *</Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={transferData.quantity}
                      onChange={(e) =>
                        handleInputChange(
                          "quantity",
                          e.target.value,
                          "transfer",
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Solicitado por *</Label>
                    <Input
                      placeholder="Nombre del solicitante"
                      value={transferData.requestedBy}
                      onChange={(e) =>
                        handleInputChange(
                          "requestedBy",
                          e.target.value,
                          "transfer",
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Motivo de la transferencia *</Label>
                  <Textarea
                    placeholder="Especificar el motivo de la transferencia..."
                    rows={3}
                    value={transferData.reason}
                    onChange={(e) =>
                      handleInputChange("reason", e.target.value, "transfer")
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <Label>Transferencia urgente</Label>
                  </div>
                  <Switch
                    checked={transferData.urgent}
                    onCheckedChange={(checked) =>
                      handleInputChange("urgent", checked, "transfer")
                    }
                  />
                </div>

                {transferData.urgent && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Las transferencias urgentes requieren autorización
                      inmediata del supervisor de farmacia.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Ajustar */}
          <TabsContent value="adjust" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Ajuste de Inventario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Seleccionar medicamento *</Label>
                  <Select
                    onValueChange={(value) => {
                      const med = medications.find((m) => m.id === value);
                      if (med) {
                        setAdjustmentData((prev) => ({
                          ...prev,
                          medication: med.name,
                          currentStock: med.currentStock,
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {medications.map((med) => (
                        <SelectItem key={med.id} value={med.id}>
                          <div className="flex justify-between items-center w-full">
                            <span>{med.name}</span>
                            <span className="ml-4 text-muted-foreground">
                              Stock: {med.currentStock}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {adjustmentData.medication && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Stock actual</Label>
                      <Input
                        value={adjustmentData.currentStock}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de ajuste</Label>
                      <Select
                        value={adjustmentData.adjustmentType}
                        onValueChange={(value) =>
                          handleInputChange(
                            "adjustmentType",
                            value,
                            "adjustment",
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increase">
                            <div className="flex items-center gap-2">
                              <Plus className="w-4 h-4 text-green-600" />
                              Incrementar
                            </div>
                          </SelectItem>
                          <SelectItem value="decrease">
                            <div className="flex items-center gap-2">
                              <Minus className="w-4 h-4 text-red-600" />
                              Decrementar
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Nuevo stock *</Label>
                      <Input
                        type="number"
                        placeholder="Cantidad final"
                        value={adjustmentData.adjustedStock}
                        onChange={(e) =>
                          handleInputChange(
                            "adjustedStock",
                            e.target.value,
                            "adjustment",
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Motivo del ajuste *</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("reason", value, "adjustment")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expired">
                        Medicamento vencido
                      </SelectItem>
                      <SelectItem value="damaged">
                        Medicamento dañado
                      </SelectItem>
                      <SelectItem value="lost">Pérdida</SelectItem>
                      <SelectItem value="theft">Robo</SelectItem>
                      <SelectItem value="count-error">
                        Error de conteo
                      </SelectItem>
                      <SelectItem value="system-error">
                        Error de sistema
                      </SelectItem>
                      <SelectItem value="donation">Donación</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Autorizado por *</Label>
                  <Input
                    placeholder="Nombre del supervisor que autoriza"
                    value={adjustmentData.approvedBy}
                    onChange={(e) =>
                      handleInputChange(
                        "approvedBy",
                        e.target.value,
                        "adjustment",
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Observaciones</Label>
                  <Textarea
                    placeholder="Detalles adicionales sobre el ajuste..."
                    rows={3}
                    value={adjustmentData.notes}
                    onChange={(e) =>
                      handleInputChange("notes", e.target.value, "adjustment")
                    }
                  />
                </div>

                {adjustmentData.adjustedStock &&
                  adjustmentData.currentStock > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Resumen del Ajuste</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Stock actual:</strong>{" "}
                          {adjustmentData.currentStock}
                        </div>
                        <div>
                          <strong>Stock ajustado:</strong>{" "}
                          {adjustmentData.adjustedStock}
                        </div>
                        <div>
                          <strong>Diferencia:</strong>
                          <span
                            className={
                              parseInt(adjustmentData.adjustedStock) >
                              adjustmentData.currentStock
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {parseInt(adjustmentData.adjustedStock) -
                              adjustmentData.currentStock >
                            0
                              ? "+"
                              : ""}
                            {parseInt(adjustmentData.adjustedStock) -
                              adjustmentData.currentStock}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Ordenar */}
          <TabsContent value="order" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Orden de Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Medicamento *</Label>
                    <Input
                      placeholder="Nombre del medicamento"
                      value={orderData.medication}
                      onChange={(e) =>
                        handleInputChange("medication", e.target.value, "order")
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Proveedor *</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("supplier", value, "order")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Cantidad *</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={orderData.quantity}
                      onChange={(e) => {
                        handleInputChange("quantity", e.target.value, "order");
                        calculateTotalCost();
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Costo unitario *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="2500"
                        value={orderData.unitCost}
                        onChange={(e) => {
                          handleInputChange(
                            "unitCost",
                            e.target.value,
                            "order",
                          );
                          calculateTotalCost();
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Costo total</Label>
                    <Input
                      value={orderData.totalCost}
                      disabled
                      className="bg-gray-100 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha esperada de entrega</Label>
                    <Calendar
                      mode="single"
                      selected={orderData.expectedDelivery}
                      onSelect={(date) =>
                        date &&
                        handleInputChange("expectedDelivery", date, "order")
                      }
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Prioridad</Label>
                      <Select
                        value={orderData.priority}
                        onValueChange={(value) =>
                          handleInputChange("priority", value, "order")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Reorden automático</Label>
                      <Switch
                        checked={orderData.autoReorder}
                        onCheckedChange={(checked) =>
                          handleInputChange("autoReorder", checked, "order")
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notas de la orden</Label>
                  <Textarea
                    placeholder="Especificaciones especiales, condiciones de entrega..."
                    rows={3}
                    value={orderData.notes}
                    onChange={(e) =>
                      handleInputChange("notes", e.target.value, "order")
                    }
                  />
                </div>

                {orderData.totalCost && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Resumen de la Orden</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <strong>Medicamento:</strong> {orderData.medication}
                      </div>
                      <div>
                        <strong>Cantidad:</strong> {orderData.quantity}
                      </div>
                      <div>
                        <strong>Proveedor:</strong> {orderData.supplier}
                      </div>
                      <div>
                        <strong>Total:</strong> $
                        {parseFloat(orderData.totalCost).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {activeTab === "add" && "Agregar al Inventario"}
              {activeTab === "transfer" && "Solicitar Transferencia"}
              {activeTab === "adjust" && "Aplicar Ajuste"}
              {activeTab === "order" && "Generar Orden"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
