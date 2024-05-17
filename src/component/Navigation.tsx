import { Link } from 'react-router-dom';
import '/src/css/Navigation.css'

function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link to="/">All Products</Link></li>
        <li><Link to="/addproduct">Add Product</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;