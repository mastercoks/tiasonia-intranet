const getErrorMessage = (error: string): string => {
  let message: string
  switch (error) {
    case 'user_not_found':
      message = 'Usuário não encontrado.'
      break
    case 'card_in_use':
      message = 'O cartão já está em uso.'
      break
    case 'card_not_found':
      message = 'Cartão não encontrado.'
      break
    case 'card_returned':
      message = 'O cartão já foi devolvido.'
      break
    case 'company_exists':
      message = 'Empresa já existe.'
      break
    case 'company_not_found':
      message = 'Empresa não encontrada.'
      break
    case 'conflict_execution_not_found':
      message = 'Execução de conflito não encontrada.'
      break
    case 'contact_not_found':
      message = 'Contato não encontrado.'
      break
    case 'incorrect_combination':
      message = 'Combinação incorreta de login/senha.'
      break
    case 'contact_confirmed':
      message = 'Contato já está confirmado.'
      break
    case 'contact_exists':
      message = 'Contato já existe.'
      break
    case 'cost_center_not_found':
      message = 'Centro de custo não encontrado.'
      break
    case 'permission_exists':
      message = 'A permissão já existe.'
      break
    case 'permission_not_found':
      message = 'Permissão não encontrada.'
      break
    case 'unknown_event':
      message = 'Evento desconhecido.'
      break
    case 'address_not_reader':
      message = 'O endereço remoto não é um leitor.'
      break
    case 'reader_type_not_found':
      message = 'Tipo de leitor não encontrado.'
      break
    case 'ip_in_use':
      message = 'O endereço IP já está em uso.'
      break
    case 'reader_not_found':
      message = 'Leitor não encontrado.'
      break
    case 'card_not_valid':
      message = 'Cartão não é válido.'
      break
    case 'role_exists':
      message = 'A função já existe.'
      break
    case 'role_not_found':
      message = 'Função não encontrada.'
      break
    case 'signature_exists':
      message = 'Assinatura já existe.'
      break
    case 'signature_not_found':
      message = 'Assinatura não encontrada.'
      break
    case 'user_inactive':
      message = 'Usuário inativo.'
      break
    case 'cpf_exists':
      message = 'Cpf já existe.'
      break
    case 'token_missing':
      message = 'Token JWT ausente.'
      break
    case 'token_expired':
      message = 'Token JWT expirado.'
      break
    case 'token_invalid':
      message = 'Token JWT inválido.'
      break
    case 'envelope_not_found':
      message = 'Envelope não encontrado.'
      break
    case 'envelope_not_pending':
      message = 'Envelope não está pendente.'
      break
    case 'recipient_not_found':
      message = 'Destinatário não encontrado.'
      break
    default:
      message = 'Erro desconhecido, favor entrar em contato com o adminstrador.'
      break
  }
  return message
}

export default getErrorMessage
