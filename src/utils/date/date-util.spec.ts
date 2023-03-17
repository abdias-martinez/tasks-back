import { formatDateTime } from './date-utils'

describe('Format date', () => {
  it('should return the formatted date 03/01/2023 15:40', () => {
    const response = formatDateTime(new Date('2023-01-03T20:40:28.476Z'))
    expect(response).toMatch('03/01/2023 15:40')
  })
})
