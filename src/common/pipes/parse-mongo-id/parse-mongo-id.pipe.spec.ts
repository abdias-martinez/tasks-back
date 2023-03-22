import { ParseMongoIdPipe } from './parse-mongo-id.pipe'
import { BadRequestException } from '@nestjs/common'

describe('ParseMongoIdPipe', () => {
  it('should return the value if it is a valid Object ID', () => {
    const value = '609aa3835f10ce20d4b69ee2'
    expect(new ParseMongoIdPipe().transform(value)).toBe(value)
  })

  it('should throw a BadRequestException if the value is not a valid Object ID', () => {
    const value = 'invalid-id'
    expect(() => new ParseMongoIdPipe().transform(value)).toThrow(
      BadRequestException,
    )
  })
})
