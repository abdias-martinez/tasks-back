import { formatDateTime } from './date-utils'

describe('Format date', () => {
  it('should return the formatted date 04/03/2023 14:40', () => {
    const response = formatDateTime(new Date('2023-03-04T19:40:28.476Z'))
    expect(response).toBe('04/03/2023 14:40')
  })
})
