import type { Product } from '../../../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Polera Oversize',
    description: 'Polera cómoda y amplia para el día a día',
    price: 25.99,
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'T-Shirts',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: ['Blanco', 'Negro', 'Beige']
  },
  {
    id: '2',
    name: 'Jeans Classic',
    description: 'Jeans de corte clásico y resistente',
    price: 45.00,
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'Pants',
    availableSizes: ['30', '32', '34', '36'],
    availableColors: ['Azul', 'Celeste', 'Negro']
  },
  {
    id: '3',
    name: 'Vestido Casual',
    description: 'Vestido ligero ideal para el verano',
    price: 35.50,
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'Dresses',
    availableSizes: ['XS', 'S', 'M'],
    availableColors: ['Rojo', 'Verde', 'Amarillo']
  },
  {
    id: '4',
    name: 'Chaqueta Denim',
    description: 'Chaqueta de mezclilla atemporal',
    price: 55.00,
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'Jackets',
    availableSizes: ['S', 'M', 'L'],
    availableColors: ['Azul Claro', 'Azul Oscuro']
  },
  {
    id: '5',
    name: 'Camisa Formal',
    description: 'Camisa de algodón para ocasiones formales',
    price: 39.99,
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'Shirts',
    availableSizes: ['M', 'L', 'XL'],
    availableColors: ['Blanco', 'Celeste']
  },
  {
    id: '6',
    name: 'Pantalón Cargo',
    description: 'Pantalón estilo cargo con múltiples bolsillos',
    price: 49.99,
    imageUrl: 'https://via.placeholder.com/300x400',
    category: 'Pants',
    availableSizes: ['32', '34', '36'],
    availableColors: ['Verde Oliva', 'Khaki', 'Negro']
  }
];
