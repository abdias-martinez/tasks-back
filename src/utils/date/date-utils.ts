export const formatDateTime = (date?: Date): string => {
  const locale = 'es-419-u-hc-h12'
  const newDate = date ? new Date(date) : new Date()
  const dateTime = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const formattedDateTime = dateTime.format(newDate)
  return formattedDateTime
}
