export function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function formatInputNumber(value?: number | null) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).replace('.', ',');
}

export function parseNumeric(value: string): number | undefined {
  const normalized = value.replace(',', '.').trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}
