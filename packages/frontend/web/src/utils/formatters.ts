import moment, { duration } from 'moment'

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const mouth = (date.getMonth() + 1).toString().padStart(2, '0') // +1 pois no getMonth Janeiro começa com zero.
  const year = date.getFullYear()
  return `${day}/${mouth}/${year}`
}

export const formatTime = (data: Date): string => {
  const hours = data.getHours().toString().padStart(2, '0')
  const minutes = data.getMinutes().toString().padStart(2, '0')
  const seconds = data.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export const formatCPF = (cpf: string): string =>
  cpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    (regex, arg1, arg2, arg3, arg4) =>
      arg1 + '.' + arg2 + '.' + arg3 + '-' + arg4
  )

export const formatCNPJ = (cnpj: string): string =>
  cnpj.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    (regex, arg1, arg2, arg3, arg4, arg5) =>
      arg1 + '.' + arg2 + '.' + arg3 + '/' + arg4 + '-' + arg5
  )

export const diffDays = (date: Date): string => {
  const diff = moment(new Date()).diff(moment(date))
  const minutes = Math.floor(duration(diff).asMinutes())
  const hours = Math.floor(duration(diff).asHours())
  const days = Math.floor(duration(diff).asDays())
  const months = Math.floor(duration(diff).asMonths())
  const years = Math.floor(duration(diff).asYears())

  if (years > 1) {
    return `${years} anos atrás`
  } else if (years === 1) {
    return 'Um ano atrás'
  } else if (months > 1) {
    return `${months} meses atrás`
  } else if (months === 1) {
    return 'Um mês atrás'
  } else if (days > 1) {
    return `${days} dias atrás`
  } else if (days === 1) {
    return 'Um dia atrás'
  } else if (hours > 1) {
    return `${hours} horas atrás`
  } else if (hours === 1) {
    return 'Uma hora atrás'
  } else if (minutes > 1) {
    return `${minutes} minutos atrás`
  } else if (minutes === 1) {
    return 'Um minuto atrás'
  } else {
    return 'Alguns segundos atrás'
  }
}

export const humanFileSize = (bytes: number, si = false, dp = 0): string => {
  const thresh = si ? 1000 : 1024

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  )

  return (dp === 0 ? Math.ceil(bytes) : bytes.toFixed(dp)) + ' ' + units[u]
}
