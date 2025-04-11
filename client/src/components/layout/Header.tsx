import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Users } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-semibold text-primary">Igreja Online</h1>
              <p className="text-xs text-neutral-dark">Comunidade & Fé</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/estudos" 
              className={`font-medium ${isActive("/estudos") ? "text-primary" : "text-neutral-dark hover:text-primary"} transition`}
            >
              Estudos Bíblicos
            </Link>
            <Link 
              href="/blog" 
              className={`font-medium ${isActive("/blog") ? "text-primary" : "text-neutral-dark hover:text-primary"} transition`}
            >
              Blog
            </Link>
            <Link 
              href="/forum" 
              className={`font-medium ${isActive("/forum") ? "text-primary" : "text-neutral-dark hover:text-primary"} transition`}
            >
              Fórum
            </Link>
            <Link 
              href="/eventos" 
              className={`font-medium ${isActive("/eventos") ? "text-primary" : "text-neutral-dark hover:text-primary"} transition`}
            >
              Eventos
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-neutral-dark focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} mt-4 pb-2`}>
          <Link 
            href="/estudos" 
            className={`block py-2 ${isActive("/estudos") ? "text-primary" : "text-neutral-dark hover:text-primary"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Estudos Bíblicos
          </Link>
          <Link 
            href="/blog" 
            className={`block py-2 ${isActive("/blog") ? "text-primary" : "text-neutral-dark hover:text-primary"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog
          </Link>
          <Link 
            href="/forum" 
            className={`block py-2 ${isActive("/forum") ? "text-primary" : "text-neutral-dark hover:text-primary"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Fórum
          </Link>
          <Link 
            href="/eventos" 
            className={`block py-2 ${isActive("/eventos") ? "text-primary" : "text-neutral-dark hover:text-primary"}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Eventos
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
