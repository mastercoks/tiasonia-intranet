import { hash, compare } from 'bcryptjs'

import IHashProvider from '../models/IHashProvider'

class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    if (!payload) return null
    return hash(payload, 8)
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    if (!payload || !hashed) return false
    return compare(payload, hashed)
  }
}

export default BCryptHashProvider
