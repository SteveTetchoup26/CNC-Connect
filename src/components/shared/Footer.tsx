import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg w-12 h-12 flex items-center justify-center">
                <span className="text-xl md:text-2xl font-bold text-white">CC</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              CNC - Connect
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-secondary-hover transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary-hover transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary-hover transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary-hover transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Notre Système */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Notre Système</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-secondary-hover transition-colors">
                  À propos de CNC - Connect
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-secondary-hover transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-secondary-hover transition-colors">
                  Guide d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-secondary-hover transition-colors">
                  Support technique
                </a>
              </li>
            </ul>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-secondary-hover transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-secondary-hover transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-secondary-hover transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-secondary-hover transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Besoin d'aide?</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary-hover shrink-0 mt-0.5" />
                <span className="text-sm">Douala, Cameroun</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-secondary-hover shrink-0 mt-0.5" />
                <span className="text-sm">+237 697 93 29 76</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-secondary-hover shrink-0 mt-0.5" />
                <span className="text-sm">contact@cncconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <p className="text-sm text-center md:text-left">
              © {new Date().getFullYear()} CNC - Connect. Tous droits réservés.
            </p>
            {/* <p className="text-sm text-center md:text-right">
              Développé avec ❤️ pour l'éducation
            </p> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;