// src/types.ts
export interface Movimiento {
  tipo: "ingreso" | "gasto";
  monto: number;
  descripcion: string;
  fecha: Date;
}
