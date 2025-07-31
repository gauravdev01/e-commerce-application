import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
             E-commerce Store
          </Link>
          <nav>
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
            >
              Products
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 
