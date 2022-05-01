const getTypeColor = (type: string | undefined): string => {
  switch (type?.toLowerCase()) {
    case 'concluído':
      return '#379936'
    case 'rascunho':
    case 'esperando':
      return '#92929d'
    case 'diretor':
    case 'catraca':
      return '#1abc9c'
    case 'funcionario':
    case 'entrada':
    case 'autor':
      return '#3498db'
    case 'visitante':
    case 'leitor':
    case 'encerrado':
      return '#9b59b6'
    case 'motorista':
    case 'pendente':
    case 'porta':
      return '#f1c40f'
    case 'recusado':
    case 'terceirizado':
    case 'saida':
      return '#e74c3c'
    default:
      return '#34495e'
  }
}

export default getTypeColor
