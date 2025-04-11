import { Link } from "wouter";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Igreja Online</h3>
            <p className="text-neutral-light mb-4 text-sm">
              Um espaço digital para fortalecer sua fé e conectar-se com nossa comunidade.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-secondary transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary transition">
                <Youtube size={20} />
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
              <li>Culto de Domingo: 9h e 18h</li>
              <li>Estudo Bíblico: Quarta, 19h30</li>
              <li>Culto de Jovens: Sábado, 19h</li>
              <li>Escola Dominical: Domingo, 10h30</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Rua da Igreja, 123 - Centro
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                (11) 5555-5555
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                contato@igrejaaonline.com.br
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-primary text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Igreja Online. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
