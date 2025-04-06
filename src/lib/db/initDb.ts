import { initializeDatabase } from './mysql';

export async function initialize() {
  try {
    await initializeDatabase();
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}
