export const ROL = {
  ADMIN: 1,
  CLIENTE: 2,
  ENCARGADO: 3,
  CAJERO: 4,
} as const;

export type RolId = typeof ROL[keyof typeof ROL];
