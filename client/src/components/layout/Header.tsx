import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronRight, User, LogOut } from "lucide-react";
import logoImage from '../../assets/logo.jpeg';
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { user, logoutMutation } = useAuth();

  // Adiciona efeito de scroll para a navegação
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-white shadow-md'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden logo-rotate-3d">
              <img 
                src={logoImage} 
                alt="Logo da Igreja Batista Independente de Parnaíba" 
                className="w-14 h-14 object-contain" 
              />
            </div>
            <div className="slide-in-up">
              <h1 className="text-lg font-heading font-bold text-primary bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
                Igreja Batista Independente de Parnaíba
              </h1>
              <p className="text-xs text-neutral-dark flex items-center">
                <ChevronRight className="h-3 w-3 text-primary mr-1" />
                <span>Igreja unida é uma igreja que avança</span>
              </p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/estudos" 
              className={`font-medium relative px-2 py-1 ${
                isActive("/estudos") 
                  ? "text-primary font-semibold" 
                  : "text-neutral-dark hover:text-primary"
              } transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${
                isActive("/estudos") ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`}
            >
              Estudos Bíblicos
            </Link>
            <Link 
              href="/blog" 
              className={`font-medium relative px-2 py-1 ${
                isActive("/blog") 
                  ? "text-primary font-semibold" 
                  : "text-neutral-dark hover:text-primary"
              } transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${
                isActive("/blog") ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`}
            >
              Blog
            </Link>
            <Link 
              href="/forum" 
              className={`font-medium relative px-2 py-1 ${
                isActive("/forum") 
                  ? "text-primary font-semibold" 
                  : "text-neutral-dark hover:text-primary"
              } transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${
                isActive("/forum") ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`}
            >
              Fórum
            </Link>
            <Link 
              href="/eventos" 
              className={`font-medium relative px-2 py-1 ${
                isActive("/eventos") 
                  ? "text-primary font-semibold" 
                  : "text-neutral-dark hover:text-primary"
              } transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 ${
                isActive("/eventos") ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`}
            >
              Eventos
            </Link>
          </nav>
          
          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-9 w-9 p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar || ""} alt={user.displayName} />
                      <AvatarFallback className="bg-primary text-white">
                        {user.displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.username}</p>
                    </div>
                  </div>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:text-red-600 font-medium"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/auth">
                  <User className="mr-2 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user ? (
              <Button
                variant="ghost"
                className="relative rounded-full h-9 w-9 p-0 mr-2"
                onClick={() => {
                  logoutMutation.mutate();
                }}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar || ""} alt={user.displayName} />
                  <AvatarFallback className="bg-primary text-white">
                    {user.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="mr-1"
                asChild
              >
                <Link href="/auth">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
            
            <button 
              onClick={toggleMobileMenu}
              className="text-primary focus:outline-none transition-all duration-300"
              aria-label="Menu principal"
            >
              <div className="w-8 h-6 flex flex-col justify-between">
                <span className={`bg-primary h-0.5 w-full block transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`bg-primary h-0.5 w-full block transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-primary h-0.5 w-full block transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
          } mt-2 pb-2`}
        >
          <div className="py-3 space-y-2 border-t border-gray-100">
            <Link 
              href="/estudos" 
              className={`block py-2 px-4 ${
                isActive("/estudos") 
                  ? "text-primary font-medium bg-blue-50 border-l-4 border-primary" 
                  : "text-neutral-dark hover:text-primary hover:bg-blue-50 hover:pl-5"
              } transition-all duration-300`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Estudos Bíblicos
            </Link>
            <Link 
              href="/blog" 
              className={`block py-2 px-4 ${
                isActive("/blog") 
                  ? "text-primary font-medium bg-blue-50 border-l-4 border-primary" 
                  : "text-neutral-dark hover:text-primary hover:bg-blue-50 hover:pl-5"
              } transition-all duration-300`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/forum" 
              className={`block py-2 px-4 ${
                isActive("/forum") 
                  ? "text-primary font-medium bg-blue-50 border-l-4 border-primary" 
                  : "text-neutral-dark hover:text-primary hover:bg-blue-50 hover:pl-5"
              } transition-all duration-300`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Fórum
            </Link>
            <Link 
              href="/eventos" 
              className={`block py-2 px-4 ${
                isActive("/eventos") 
                  ? "text-primary font-medium bg-blue-50 border-l-4 border-primary" 
                  : "text-neutral-dark hover:text-primary hover:bg-blue-50 hover:pl-5"
              } transition-all duration-300`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Eventos
            </Link>
            
            {!user && (
              <Link 
                href="/auth" 
                className={`block py-2 px-4 ${
                  isActive("/auth") 
                    ? "text-primary font-medium bg-blue-50 border-l-4 border-primary" 
                    : "text-neutral-dark hover:text-primary hover:bg-blue-50 hover:pl-5"
                } transition-all duration-300 flex items-center`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Entrar / Cadastrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
