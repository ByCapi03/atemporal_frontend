import { ROL } from '../types/roles';
import type { RolId } from '../types/roles';

export interface NavItem {
  name: string;
  path: string;
  allowedRoles: RolId[];
  icon?: string;
}

export const DASHBOARD_NAVIGATION: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    allowedRoles: [ROL.ADMIN, ROL.ENCARGADO, ROL.CAJERO],
  },
  {
    name: 'Productos',
    path: '/dashboard/products',
    allowedRoles: [ROL.ADMIN, ROL.ENCARGADO, ROL.CAJERO],
  },
  {
    name: 'Punto de Venta',
    path: '/dashboard/pos',
    allowedRoles: [ROL.CAJERO],
  },
  {
    name: 'Inventario',
    path: '/dashboard/inventory',
    allowedRoles: [ROL.ADMIN, ROL.ENCARGADO],
  },
  {
    name: 'Reservas',
    path: '/dashboard/reservations',
    allowedRoles: [ROL.ADMIN, ROL.ENCARGADO],
  },
  {
    name: 'Ventas',
    path: '/dashboard/sales',
    allowedRoles: [ROL.ADMIN, ROL.ENCARGADO, ROL.CAJERO],
  },
  {
    name: 'Sucursales',
    path: '/dashboard/branches',
    allowedRoles: [ROL.ADMIN],
  },
  {
    name: 'Usuarios',
    path: '/dashboard/users',
    allowedRoles: [ROL.ADMIN],
  },
  {
    name: 'Reportes',
    path: '/dashboard/reports',
    allowedRoles: [ROL.ADMIN, ROL.ENCARGADO],
  },
  {
    name: 'Proveedores',
    path: '/dashboard/suppliers',
    allowedRoles: [ROL.ADMIN],
  }
];
