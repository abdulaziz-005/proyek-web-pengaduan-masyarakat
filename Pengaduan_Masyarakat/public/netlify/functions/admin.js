// Cek apakah admin sudah terdaftar
const ADMIN_KEY = 'admin_data';
let adminData = JSON.parse(localStorage.getItem(ADMIN_KEY)) || null;