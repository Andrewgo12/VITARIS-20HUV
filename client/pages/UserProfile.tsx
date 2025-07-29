import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Camera,
  Shield,
  Settings,
  Activity,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Save,
  X,
  Bell,
  Globe,
  Monitor,
  Smartphone,
  LogOut,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  role: string;
  avatar: string;
  lastLogin: string;
  joinDate: string;
  department: string;
  position: string;
}

const UserProfile: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<UserData>({
    id: 'USR001',
    name: 'Dr. María Elena Rodríguez',
    email: 'maria.rodriguez@huv.gov.co',
    phone: '+57 300 123 4567',
    document: '98765432',
    role: 'Médico Especialista',
    avatar: '',
    lastLogin: '2024-01-15 09:30:00',
    joinDate: '2022-03-15',
    department: 'Cardiología',
    position: 'Médico Tratante'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(userData);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [preferences, setPreferences] = useState({
    language: 'es',
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    animations: true,
    compactMode: false
  });

  // Datos de actividad reciente
  const recentActivity = [
    { action: 'Inicio de sesión', date: '2024-01-15 09:30', device: 'Chrome - Windows' },
    { action: 'Vista: Dashboard HUV', date: '2024-01-15 09:35', device: 'Chrome - Windows' },
    { action: 'Descarga: Reporte Pacientes', date: '2024-01-15 10:15', device: 'Chrome - Windows' },
    { action: 'Edición: Perfil', date: '2024-01-14 16:20', device: 'Safari - iPhone' },
  ];

  // Sesiones activas
  const activeSessions = [
    { device: 'Chrome - Windows 11', location: 'Cali, Colombia', lastActive: '2024-01-15 09:30', current: true },
    { device: 'Safari - iPhone 14', location: 'Cali, Colombia', lastActive: '2024-01-14 18:45', current: false },
  ];

  const handleSaveProfile = () => {
    setUserData(editData);
    setIsEditing(false);
    // Aqu�� iría la lógica para guardar en el backend
  };

  const handleCancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Validar contraseñas
    if (passwordData.new !== passwordData.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Aquí iría la lógica para cambiar contraseña
    setPasswordData({ current: '', new: '', confirm: '' });
    alert('Contraseña cambiada exitosamente');
  };

  const handleDeleteAccount = () => {
    // Aquí iría la lógica para eliminar cuenta
    alert('Cuenta eliminada');
    navigate('/');
  };

  const handleUpdatePreferences = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-black hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('nav.back')}
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-black">{t('profile.title')}</h1>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "outline" : "default"}
              className={isEditing ? "text-black" : ""}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  {t('btn.cancel')}
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  {t('profile.edit')}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <User className="w-5 h-5" />
                  {t('profile.personal')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black">{userData.name}</h3>
                    <p className="text-black">{userData.role}</p>
                    <Badge variant="outline" className="mt-1 text-black border-gray-300">
                      ID: {userData.id}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-black">{t('profile.name')}</Label>
                    <Input
                      id="name"
                      value={isEditing ? editData.name : userData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      disabled={!isEditing}
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-black">{t('profile.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={isEditing ? editData.email : userData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      disabled={!isEditing}
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-black">{t('profile.phone')}</Label>
                    <Input
                      id="phone"
                      value={isEditing ? editData.phone : userData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="document" className="text-black">{t('profile.document')}</Label>
                    <Input
                      id="document"
                      value={isEditing ? editData.document : userData.document}
                      onChange={(e) => setEditData({...editData, document: e.target.value})}
                      disabled={!isEditing}
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department" className="text-black">Departamento</Label>
                    <Input
                      id="department"
                      value={isEditing ? editData.department : userData.department}
                      onChange={(e) => setEditData({...editData, department: e.target.value})}
                      disabled={!isEditing}
                      className="text-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position" className="text-black">Cargo</Label>
                    <Input
                      id="position"
                      value={isEditing ? editData.position : userData.position}
                      onChange={(e) => setEditData({...editData, position: e.target.value})}
                      disabled={!isEditing}
                      className="text-black"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveProfile} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      {t('btn.save')}
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" className="flex-1 text-black">
                      {t('btn.cancel')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuraciones de Usuario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Settings className="w-5 h-5" />
                  Preferencias Personales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Notificaciones</Label>
                      <p className="text-sm text-black">Recibir alertas del sistema</p>
                    </div>
                    <Switch
                      checked={preferences.notifications}
                      onCheckedChange={(checked) => handleUpdatePreferences('notifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Correos de actualización</Label>
                      <p className="text-sm text-black">Recibir emails informativos</p>
                    </div>
                    <Switch
                      checked={preferences.emailUpdates}
                      onCheckedChange={(checked) => handleUpdatePreferences('emailUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Modo Oscuro</Label>
                      <p className="text-sm text-black">Tema visual oscuro</p>
                    </div>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => handleUpdatePreferences('darkMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-black">Animaciones</Label>
                      <p className="text-sm text-black">Efectos de transición</p>
                    </div>
                    <Switch
                      checked={preferences.animations}
                      onCheckedChange={(checked) => handleUpdatePreferences('animations', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actividad Reciente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Activity className="w-5 h-5" />
                  {t('activity.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium text-black">{activity.action}</p>
                        <p className="text-sm text-black">{activity.device}</p>
                      </div>
                      <div className="text-sm text-black">{activity.date}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Cambiar Contraseña */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Lock className="w-5 h-5" />
                  {t('password.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword" className="text-black">{t('password.current')}</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      className="text-black pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="newPassword" className="text-black">{t('password.new')}</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      className="text-black pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="text-black">{t('password.confirm')}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="text-black pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button onClick={handleChangePassword} className="w-full">
                  {t('password.change')}
                </Button>
              </CardContent>
            </Card>

            {/* Sesiones Activas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Monitor className="w-5 h-5" />
                  {t('security.sessions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeSessions.map((session, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${session.current ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {session.device.includes('iPhone') ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                          <div>
                            <p className="font-medium text-black text-sm">{session.device}</p>
                            <p className="text-xs text-black">{session.location}</p>
                          </div>
                        </div>
                        {session.current ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-600">Actual</Badge>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <LogOut className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-black mt-2">{session.lastActive}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Eliminar Cuenta */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  {t('account.delete')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black text-sm mb-4">
                  {t('account.deleteWarning')}
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('account.deleteButton')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-black">{t('account.delete')}</AlertDialogTitle>
                      <AlertDialogDescription className="text-black">
                        {t('account.deleteConfirm')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-black">
                        {t('btn.cancel')}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t('btn.confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
