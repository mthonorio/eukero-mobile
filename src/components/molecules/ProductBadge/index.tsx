import { Badge } from '../../atoms/Badge';

export function ProductBadge({ status }: { status: string }) {
  switch (status) {
    case 'registered':
      return <Badge variant='info'>Registrado</Badge>;
    case 'available':
      return <Badge variant='success'>Disponível</Badge>;
    case 'sold':
      return <Badge variant='default'>Vendido</Badge>;
    case 'deleted':
      return <Badge variant='destructive'>Excluído</Badge>;
    case 'unavailable':
      return <Badge variant='error'>Indisponível</Badge>;
    default:
      return <Badge variant='outline'>Desconhecido</Badge>;
  }
}
