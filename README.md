# Polemarch Server Project Setup

This README provides instructions for setting up the server for the Polemarch project, including MySQL database setup, Sequel Ace configuration, and running the server.

## Prerequisites

- macOS (for Sequel Ace)
- Node.js (v14 or later)
- npm or pnpm

## MySQL Setup

1. Install MySQL using Homebrew:

   ```
   brew install mysql
   ```

2. Start MySQL service:

   ```
   brew services start mysql
   ```

3. Secure your MySQL installation:

   ```
   mysql_secure_installation
   ```

   Follow the prompts to set a root password and other security settings.

4. Verify MySQL is running:
   ```
   mysql -u root -p
   ```
   Enter the password you set during the secure installation.

## Sequel Ace Setup

1. Install Sequel Ace:

   - Download from the [official website](https://sequel-ace.com/) or
   - Install via Homebrew Cask:
     ```
     brew install --cask sequel-ace
     ```

2. Launch Sequel Ace

3. Create a new connection with the following details:

   - Name: Polemarch Local
   - Host: 127.0.0.1
   - Username: root
   - Password: [Your MySQL root password]
   - Port: 3306

4. Click "Connect" to establish the connection

5. Create a new database for the project:
   - In the query editor, run:
     ```sql
     CREATE DATABASE polemarch;
     ```

## Project Setup

1. Clone the repository:

   ```
   git clone https://github.com/your-username/polemarch.git
   cd polemarch
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_root_password
   DB_NAME=polemarch
   PORT=3001
   ```

   Replace `your_mysql_root_password` with your actual MySQL root password.

## Running the Server

1. Start the server:

   ```
   pnpm run dev
   ```

   This will start the server on `http://localhost:3001`.

2. To test the API, you can use tools like Postman or curl. For example:
   ```
   curl http://localhost:3001/api/users
   ```

## Troubleshooting

- If you encounter a "Client does not support authentication protocol" error, run the following SQL command in MySQL:

  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_mysql_root_password';
  FLUSH PRIVILEGES;
  ```

- If you're having issues connecting to MySQL, ensure the service is running:
  ```
  brew services list
  ```
  If MySQL is not running, start it with:
  ```
  brew services start mysql
  ```

## Additional Notes

- Remember to never commit your `.env` file or any file containing sensitive information like passwords.
- For production deployment, you'll want to set up a dedicated MySQL user for your application instead of using the root user.
- Always backup your database before making significant changes.

For any other issues or questions, please open an issue in the project repository.
