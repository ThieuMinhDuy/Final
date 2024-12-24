const { connectDB } = require('../config/database');
const seedDatabase = require('./index');

const runSeeders = async () => {
  try {
    await connectDB();
    console.log('Kết nối database thành công');
    
    await seedDatabase();
    console.log('Seeding dữ liệu thành công');
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi seeding:', error);
    process.exit(1);
  }
};

runSeeders(); 