import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command';
import {
  Search,
  User,
  Calendar,
  FileText,
  Heart,
  Activity,
  Pill,
  Stethoscope,
  Building,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  History,
  Star,
  Bookmark,
  Filter,
  X,
} from 'lucide-react';

// Tipos de resultados de búsqueda
export type SearchResultType = 
  | 'patient' 
  | 'appointment' 
  | 'medical_record' 
  | 'medication' 
  | 'doctor' 
  | 'department' 
  | 'room' 
  | 'procedure' 
  | 'report'
  | 'page';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  metadata?: Record<string, any>;
  relevance: number;
  category: string;
}

// Datos mock para búsqueda
const mockSearchData: SearchResult[] = [
  // Pacientes
  {
    id: 'patient_001',
    type: 'patient',
    title: 'Juan Carlos Pérez González',
    subtitle: 'CC: 12345678',
    description: 'Paciente masculino, 45 años, Cardiología',
    url: '/patient/1',
    metadata: { age: 45, department: 'Cardiología', status: 'Activo' },
    relevance: 0.95,
    category: 'Pacientes'
  },
  {
    id: 'patient_002',
    type: 'patient',
    title: 'María Elena Rodríguez',
    subtitle: 'CC: 87654321',
    description: 'Paciente femenino, 67 años, Medicina Interna',
    url: '/patient/2',
    metadata: { age: 67, department: 'Medicina Interna', status: 'Hospitalizada' },
    relevance: 0.90,
    category: 'Pacientes'
  },
  // Citas
  {
    id: 'appointment_001',
    type: 'appointment',
    title: 'Consulta Cardiología - Dr. Martínez',
    subtitle: 'Hoy 14:30',
    description: 'Juan Carlos Pérez - Control post-operatorio',
    url: '/medical/appointments',
    metadata: { doctor: 'Dr. Martínez', time: '14:30', status: 'Programada' },
    relevance: 0.85,
    category: 'Citas'
  },
  // Medicamentos
  {
    id: 'medication_001',
    type: 'medication',
    title: 'Atorvastatina 20mg',
    subtitle: 'Stock: 150 unidades',
    description: 'Medicamento para control de colesterol',
    url: '/medical/pharmacy',
    metadata: { stock: 150, category: 'Cardiovascular' },
    relevance: 0.80,
    category: 'Medicamentos'
  },
  // Doctores
  {
    id: 'doctor_001',
    type: 'doctor',
    title: 'Dr. Carlos Martínez',
    subtitle: 'Cardiólogo',
    description: 'Especialista en cardiología intervencionista',
    url: '/medical/team-communication',
    metadata: { specialty: 'Cardiología', status: 'Disponible' },
    relevance: 0.88,
    category: 'Personal Médico'
  },
  // Páginas del sistema
  {
    id: 'page_001',
    type: 'page',
    title: 'Gestión de Admisiones',
    subtitle: 'Sistema médico',
    description: 'Administrar ingresos y egresos hospitalarios',
    url: '/medical/admissions',
    metadata: { module: 'Admisiones' },
    relevance: 0.75,
    category: 'Páginas'
  },
  {
    id: 'page_002',
    type: 'page',
    title: 'Monitoreo UCI',
    subtitle: 'Sistema médico',
    description: 'Monitoreo de pacientes en cuidados intensivos',
    url: '/medical/icu-monitoring',
    metadata: { module: 'UCI' },
    relevance: 0.75,
    category: 'Páginas'
  },
];

// Hook para búsqueda global
export const useGlobalSearch = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<SearchResult[]>([]);

  const search = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase().trim();
    
    return mockSearchData
      .filter(item => {
        const searchableText = [
          item.title,
          item.subtitle,
          item.description,
          item.category,
          ...Object.values(item.metadata || {})
        ].join(' ').toLowerCase();
        
        return searchableText.includes(normalizedQuery);
      })
      .map(item => ({
        ...item,
        relevance: calculateRelevance(item, normalizedQuery)
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 20);
  };

  const calculateRelevance = (item: SearchResult, query: string): number => {
    let score = 0;
    
    // Coincidencia exacta en título
    if (item.title.toLowerCase().includes(query)) {
      score += 0.5;
    }
    
    // Coincidencia en subtítulo
    if (item.subtitle?.toLowerCase().includes(query)) {
      score += 0.3;
    }
    
    // Coincidencia en descripción
    if (item.description?.toLowerCase().includes(query)) {
      score += 0.2;
    }
    
    return Math.min(score + item.relevance, 1);
  };

  const addToHistory = (query: string) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      return [query, ...filtered].slice(0, 10);
    });
  };

  const addToFavorites = (result: SearchResult) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === result.id);
      if (exists) return prev;
      return [result, ...prev].slice(0, 20);
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  return {
    search,
    searchHistory,
    favorites,
    addToHistory,
    addToFavorites,
    removeFromFavorites,
  };
};

// Componente principal de búsqueda global
export const GlobalSearch: React.FC<{ 
  trigger?: React.ReactNode;
  placeholder?: string;
}> = ({ 
  trigger,
  placeholder = "Buscar pacientes, citas, medicamentos..." 
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();
  const { search, searchHistory, favorites, addToHistory, addToFavorites } = useGlobalSearch();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = search(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    if (result.url) {
      navigate(result.url);
    }
    addToHistory(query);
    setOpen(false);
    setQuery('');
  };

  const getResultIcon = (type: SearchResultType) => {
    switch (type) {
      case 'patient':
        return <User className="w-4 h-4" />;
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      case 'medical_record':
        return <FileText className="w-4 h-4" />;
      case 'medication':
        return <Pill className="w-4 h-4" />;
      case 'doctor':
        return <Stethoscope className="w-4 h-4" />;
      case 'department':
        return <Building className="w-4 h-4" />;
      case 'procedure':
        return <Activity className="w-4 h-4" />;
      case 'page':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const categories = ['all', ...Array.from(new Set(results.map(r => r.category)))];
  const filteredResults = selectedCategory === 'all' 
    ? results 
    : results.filter(r => r.category === selectedCategory);

  return (
    <>
      {trigger ? (
        <div onClick={() => setOpen(true)}>
          {trigger}
        </div>
      ) : (
        <Button
          variant="outline"
          className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
          onClick={() => setOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          {placeholder}
          <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder={placeholder}
            value={query}
            onValueChange={setQuery}
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <CommandList>
          {!query && searchHistory.length > 0 && (
            <CommandGroup heading="Búsquedas recientes">
              {searchHistory.slice(0, 5).map((item, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => setQuery(item)}
                >
                  <History className="mr-2 h-4 w-4" />
                  {item}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!query && favorites.length > 0 && (
            <CommandGroup heading="Favoritos">
              {favorites.slice(0, 5).map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                >
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    {item.subtitle && (
                      <span className="text-sm text-muted-foreground">{item.subtitle}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {query && results.length === 0 && (
            <CommandEmpty>No se encontraron resultados para "{query}"</CommandEmpty>
          )}

          {query && results.length > 0 && (
            <>
              {/* Filtros por categoría */}
              <div className="flex gap-1 p-2 border-b">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'Todos' : category}
                    {category !== 'all' && (
                      <Badge variant="secondary" className="ml-1">
                        {results.filter(r => r.category === category).length}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>

              {/* Resultados agrupados por categoría */}
              {Array.from(new Set(filteredResults.map(r => r.category))).map((category) => (
                <CommandGroup key={category} heading={category}>
                  {filteredResults
                    .filter(result => result.category === category)
                    .slice(0, 5)
                    .map((result) => (
                      <CommandItem
                        key={result.id}
                        onSelect={() => handleSelect(result)}
                      >
                        <div className="flex items-center w-full">
                          {getResultIcon(result.type)}
                          <div className="ml-2 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{result.title}</span>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToFavorites(result);
                                  }}
                                >
                                  <Bookmark className="h-3 w-3" />
                                </Button>
                                <ArrowRight className="h-3 w-3 opacity-50" />
                              </div>
                            </div>
                            {result.subtitle && (
                              <div className="text-sm text-muted-foreground">
                                {result.subtitle}
                              </div>
                            )}
                            {result.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {result.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
