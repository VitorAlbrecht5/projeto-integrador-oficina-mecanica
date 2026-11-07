/* eslint-disable prettier/prettier */
export function normalizarPlaca(valor: unknown): unknown {
    return typeof valor === 'string'
        ? valor.trim().replace(/-/g, '').toUpperCase()
        : valor;
}