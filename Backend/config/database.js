
const Database = require('better-sqlite3')
const path = require('path')

// Lokasi database SQLite
const dbPath = path.join(
  __dirname,
  '../database/ferry_booking.db'
)

// Membuka koneksi database
const db = new Database(dbPath)

// Mengaktifkan foreign key
db.pragma('foreign_keys = ON')

console.log('SQLite database connected successfully!')

module.exports = db
