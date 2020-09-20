const UserService = require('../../services/userService');
const userServiceInstance = new UserService();
const models = require('../../models');

afterEach(() => models.sequelize.close());

describe("user Serivce Tests", () => {

  test("Should create a user and return a jwt token", async () => {

    const userInput = {
      name: 'Test',
      lastName: 'Tester',
      regional_center: 'region Test',
      email: 'gilberto.davis02@gmail.com',
      password: 'testing123',
      isAdmin: false
    };
    const registerToken = await userServiceInstance.SignUp(userInput);

    expect(registerToken.token).toBeDefined();
    expect(registerToken.token).toBeDefined();
  });

  test("If the email and password are equal to a user it should return a jwt token", async () => {
    const loginToken = await userServiceInstance.login('gilberto.davis02@gmail.com', 'testing123');

    expect(loginToken).toBeDefined();
    expect(loginToken.token).toBeDefined();
  });
});

describe("User Service error handling tests", () => {
  test("Should throw an error in case the email is already in use", async () => {
    const userInput = {
      name: 'Test',
      lastName: 'Tester',
      regional_center: 'region Test',
      email: 'gilberto.davis02@gmail.com',
      password: 'testing123',
      isAdmin: false
    };

    await expect(() => userServiceInstance.SignUp(userInput)).rejects.toThrow();
  });

  test("Should throw an error if the email is not found", async () => {
    await expect(() => userServiceInstance.login("jose.mendoza@utp.ac.pa", "12345678")).rejects.toThrow();
  });

  test("Should throw an error if the password doesnt match", async () => {
    await expect(() => userServiceInstance.login("gilberto.davis02@gmail.com", "testing1234")).rejects.toThrow();
  });
});