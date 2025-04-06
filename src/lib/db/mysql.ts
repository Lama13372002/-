import mysql from 'mysql2/promise';

// Создаем пул соединений
export const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'nail_master',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Функция для выполнения SQL-запросов
export async function executeQuery<T>({
  query,
  values = []
}: {
  query: string;
  values?: any[];
}): Promise<T> {
  try {
    const [result] = await pool.execute(query, values);
    return result as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Ошибка при выполнении запроса к базе данных');
  }
}

// Функция инициализации базы данных
export async function initializeDatabase() {
  try {
    // Создание таблицы для администраторов
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Создание таблицы для услуг
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          duration INT NOT NULL,
          image_url VARCHAR(255),
          category VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `
    });

    // Создание таблицы для работ мастера (галерея)
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS gallery (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image_url VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Создание таблицы для записей клиентов
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS appointments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          client_name VARCHAR(255) NOT NULL,
          client_phone VARCHAR(20) NOT NULL,
          client_email VARCHAR(255),
          service_id INT,
          appointment_date DATE NOT NULL,
          appointment_time TIME NOT NULL,
          status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
        )
      `
    });

    // Создание таблицы для отзывов
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          client_name VARCHAR(255) NOT NULL,
          review_text TEXT NOT NULL,
          rating INT NOT NULL,
          avatar_url VARCHAR(255),
          is_approved BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    });

    // Создание таблицы для информации о мастере
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS master_info (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          bio TEXT,
          avatar_url VARCHAR(255),
          experience VARCHAR(255),
          specialization TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `
    });

    // Создание таблицы для настроек сайта
    await executeQuery({
      query: `
        CREATE TABLE IF NOT EXISTS site_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          setting_name VARCHAR(255) NOT NULL UNIQUE,
          setting_value TEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `
    });

    console.log('Database initialized successfully');

    // Проверяем, есть ли администратор по умолчанию
    const adminCheck = await executeQuery<any[]>({
      query: 'SELECT * FROM admins LIMIT 1'
    });

    if (!adminCheck || (adminCheck as any[]).length === 0) {
      // Создаем администратора по умолчанию (пароль нужно будет сменить)
      await executeQuery({
        query: 'INSERT INTO admins (username, password, email) VALUES (?, ?, ?)',
        values: ['admin', '$2b$10$8PagfNs1c0ZvY5MGmjlPeu9k9Kf1ZPUy9vB2AzW4X6MWNg/xK1l3a', 'admin@example.com'] // пароль: admin123
      });
      console.log('Default admin created');
    }

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
