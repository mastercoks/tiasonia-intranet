export const getTypeColor = (type: string | undefined): string => {
  switch (type?.toLowerCase()) {
    case 'ativo':
      return '#379936'
    case 'inativo':
      return '#e74c3c'
    default:
      return '#34495e'
  }
}
