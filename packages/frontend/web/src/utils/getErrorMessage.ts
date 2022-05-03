export const getErrorMessage = (error: string): string => {
  let message: string
  switch (error) {
    case 'user_not_found':
      message = 'Usuário não encontrado.'
      break
    case 'conflict_execution_not_found':
      message = 'Execução de conflito não encontrada.'
      break
    case 'conflict_execution_not_running':
      message = 'Execução de conflito não está sendo executada.'
      break
    case 'incorrect_combination':
      message = 'Combinação incorreta de login/senha.'
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
    case 'role_exists':
      message = 'A função já existe.'
      break
    case 'role_not_found':
      message = 'Função não encontrada.'
      break
    case 'user_inactive':
      message = 'Usuário inativo.'
      break
    case 'login_exists':
      message = 'Login já cadastrado.'
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
    case 'token_unauthorized':
      message = 'Token JWT não autorizado.'
      break
    default:
      message = 'Erro desconhecido, favor entrar em contato com o adminstrador.'
      break
  }
  return message
}
