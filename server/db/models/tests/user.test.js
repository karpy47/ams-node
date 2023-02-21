// const { app } = require('../../../app')
const { User } = require('../')

describe('Test the User model', () => {
  const userInfo = {
    email: 'test@test.com',
    password: 'test',
    groupId: 1
  }

  it('should hash password at save', async () => {
    const user = await User.create(userInfo)
    expect(user.password).not.toBe(userInfo.password)
    expect(user.password).toContain('$')
    expect(user.password).toHaveLength(60)
  })
})
