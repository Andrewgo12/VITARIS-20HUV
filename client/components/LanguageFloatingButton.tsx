import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, Globe } from 'lucide-react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

const LanguageFloatingButton: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg bg-red-500 hover:bg-red-600 text-white",
              "transition-all duration-300 hover:scale-110",
              "border-2 border-white"
            )}
            aria-label={t('language.change')}
          >
            <div className="flex flex-col items-center">
              <Globe className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">
                {currentLanguage?.flag}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          side="top" 
          align="end" 
          className="w-48 mb-2 bg-white border border-gray-300 shadow-xl"
        >
          <div className="p-2">
            <div className="text-sm font-semibold text-black mb-2 px-2">
              {t('language.title')}
            </div>
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded cursor-pointer",
                  "hover:bg-gray-100 transition-colors",
                  language === lang.code && "bg-red-50 border border-red-200"
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-medium text-black">{lang.name}</div>
                  <div className="text-xs text-gray-600">
                    {lang.code.toUpperCase()}
                  </div>
                </div>
                {language === lang.code && (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageFloatingButton;
