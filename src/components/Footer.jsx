import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white shadow-lg mt-12">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Abg. Wilson Ipiales</h3>
            <p className="text-secondary-600">
              Experto en derecho penal, civil y tránsito con más de 10 años de experiencia.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {['Inicio', 'Servicios', 'Consultas', 'Blog', 'Contacto'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`}
                    className="text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Servicios Legales</h3>
            <ul className="space-y-2 text-secondary-600">
              <li>Derecho Penal</li>
              <li>Derecho Civil</li>
              <li>Derecho de Tránsito</li>
              <li>Derecho Comercial</li>
              <li>Consultoría Legal</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-secondary-900">Contacto</h3>
            <div className="space-y-2">
              <p className="text-secondary-600">
                Juan José Flores 4-73 y Vicente Rocafuerte, Ibarra, Ecuador
              </p>
              <p>
                <a
                  href="tel:+593988835269"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  +593 988835269
                </a>
              </p>
              <p>
                <a
                  href="mailto:alexip2@hotmail.com"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  alexip2@hotmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-200 mt-8 pt-8 text-center text-secondary-600">
          <p>&copy; {currentYear} Abg. Wilson Ipiales. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}