export const formatCNPJ = (cnpj: string): string =>
  cnpj.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    (regex, arg1, arg2, arg3, arg4, arg5) =>
      arg1 + '.' + arg2 + '.' + arg3 + '/' + arg4 + '-' + arg5
  )
