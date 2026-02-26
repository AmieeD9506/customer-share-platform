module.exports = {
  // 数据库配置
  db: {
    storage: './database.sqlite',
    dialect: 'sqlite',
    logging: console.log
  },
  // JWT配置
  jwt: {
    secret: 'your-secret-key',
    expiresIn: '24h'
  },
  // 服务器配置
  server: {
    port: 3000
  }
};