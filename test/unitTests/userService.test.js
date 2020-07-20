const UserService = require('../../services/userService');
const userServiceInstance = new UserService();

describe("user Serivce Tests", () => {

  test("Should create a user and return a jwt token", async () => {

    const userInput = {
      name: 'Test',
      lastName: 'Tester',
      regional_center: 'region Test',
      email: 'lineth@gmail.com',
      password: 'testing123'
    };
    const registerToken = await userServiceInstance.SignUp(userInput);

    expect(registerToken.token).toBeDefined();
    expect(registerToken.token).toBeDefined();
  });

  test("If the email and password are equal to a user it should return a jwt token", async () => {
    const loginToken = await userServiceInstance.login('gilberto@gmail.com', 'testing123');

    expect(loginToken).toBeDefined();
    expect(loginToken.token).toBeDefined();
  });
});