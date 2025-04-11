import { Link } from "wouter";
import { MapPin, Mail, Instagram, ChevronRight, Heart } from "lucide-react";
import logoImage from '../../assets/logo.jpeg';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-primary-dark to-blue-950 text-white py-12 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-pattern opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden mr-4">
              <img 
                src={logoImage} 
                alt="Logo da Igreja Batista Independente de Parnaíba" 
                className="w-12 h-12 object-contain" 
              />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold">Igreja Batista Independente</h2>
              <p className="text-sm text-blue-200">Parnaíba - Piauí</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <a 
              href="https://www.instagram.com/igrejabatista.phb" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={20} className="text-white" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-t border-b border-white/10">
          <div className="slide-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-heading text-lg font-semibold mb-4 text-white">Sobre Nós</h3>
            <p className="text-white mb-4 text-sm">
              Nossa missão é levar o evangelho de Cristo, fortalecer os laços de comunhão e ajudar cada pessoa a crescer na fé.
            </p>
            <Link href="/" className="inline-flex items-center text-secondary hover:text-yellow-300 transition-colors">
              <span>Saiba mais</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-heading text-lg font-semibold mb-4 text-white">Navegação</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/estudos" className="inline-flex items-center hover:text-secondary transition-colors group">
                  <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                  <span>Estudos Bíblicos</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="inline-flex items-center hover:text-secondary transition-colors group">
                  <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/forum" className="inline-flex items-center hover:text-secondary transition-colors group">
                  <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                  <span>Fórum</span>
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="inline-flex items-center hover:text-secondary transition-colors group">
                  <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                  <span>Eventos</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="slide-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-heading text-lg font-semibold mb-4 text-white">Horários</h3>
            <ul className="space-y-3 text-sm text-white">
              <li className="flex items-start">
                <span className="font-semibold min-w-[100px]">Domingo 18:00</span>
                <span>Culto de Celebração</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold min-w-[100px]">Domingo 08:30</span>
                <span>Escola Bíblica</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold min-w-[100px]">Terça 19:30</span>
                <span>Estudo da Palavra</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold min-w-[100px]">Quarta 19:00</span>
                <span>Reunião de Oração</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold min-w-[100px]">Quinta 19:30</span>
                <span>Projeto Congregação</span>
              </li>
            </ul>
          </div>

          <div className="slide-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-heading text-lg font-semibold mb-4 text-white">Contato</h3>
            <ul className="space-y-3 text-sm text-white">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-secondary" />
                <span>Parnaíba - PI<br />Rua Anhanguera, N° 3330<br />Bairro Frei Higino</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-secondary" />
                <a href="mailto:batistaindependente.phb@gmail.com" className="hover:text-secondary transition-colors">
                  batistaindependente.phb@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Instagram className="h-4 w-4 mr-2 text-secondary" />
                <a href="https://www.instagram.com/igrejabatista.phb" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  @igrejabatista.phb
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-sm text-center text-white">
          <p className="flex items-center justify-center">
            &copy; {new Date().getFullYear()} Igreja Batista Independente de Parnaíba. Desenvolvido com <Heart className="h-3 w-3 mx-1 text-red-400" /> para a glória de Deus.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;