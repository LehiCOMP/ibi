import { Link } from "wouter";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Igreja Batista Independente de Parnaíba</h3>
            <p className="text-neutral-light mb-4 text-sm">
              Pertence às Conveções das Igrejas Batistas Independentes
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/igrejabatista.phb" target="_blank" rel="noopener noreferrer" className="text-white hover:text-secondary transition">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/estudos" className="hover:text-secondary transition">
                  Estudos Bíblicos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-secondary transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-secondary transition">
                  Fórum
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="hover:text-secondary transition">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-secondary transition">
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Horários</h3>
            <ul className="space-y-2 text-sm">
              <li>Domingo 18:00 - Culto De Celebração</li>
              <li>Domingo 08:30 - Escola Bíblica</li>
              <li>Terça 19:30 - Estudo Da Palavra</li>
              <li>Quarta 19:00 - Reunião de Oração</li>
              <li>Quinta 19:30 - Projeto na Congregação da Ilha Grande - PI</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Parnaíba - PI Rua Anhanguera, N° 3330, Bairro Frei Higino
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                batistaindependente.phb@gmail.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Igreja Batista Independente de Parnaíba. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
