import { formatDateTime } from './date-utils'

describe('Format date', () => {
  const locale = 'es-419-u-hc-h12'
  const newTime = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  it('should return string', () => {
    const response = formatDateTime()
    expect(typeof response).toBe('string')
  })

  it('should return in format DD/MM/YYYY HH:MM', () => {
    const EXPECTED_FORMAT =
      /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})\s([ap]\.?\s?m\.?)$/
    const response = formatDateTime()

    expect(response).toMatch(EXPECTED_FORMAT)
  })

  it('should return the current date by default', () => {
    const response = formatDateTime()
    expect(response).toBe(newTime.format(new Date()))
  })

  it('should return the formatted date 03/01/2023 07:40 p. m.', () => {
    const response = formatDateTime(new Date('2023-01-03T00:40:28.476Z'))
    expect(response).toBe(newTime.format(new Date('2023-01-03T00:40:28.476Z')))
  })
})
