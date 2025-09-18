import { sequelize } from '../config/database';

// Setup test database
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Clean up after tests
afterAll(async () => {
  await sequelize.close();
});