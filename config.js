var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/hoster';

module.exports = connectionString;
