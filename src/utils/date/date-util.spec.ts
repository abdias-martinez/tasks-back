import { formatDateTime } from './date-utils'

describe('Format date', () => {
  it('should return string', () => {
    const response = formatDateTime()
    expect(typeof response).toBe('string')
  })

  it('should return in format DD/MM/YYYY HH:MM', () => {
    const EXPECTED_FORMAT = /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/
    const response = formatDateTime()

    expect(response).toMatch(EXPECTED_FORMAT)
  })
})
