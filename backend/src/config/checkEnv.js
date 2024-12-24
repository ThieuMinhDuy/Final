const checkEnv = () => {
  const requiredEnvs = [
    'PORT',
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
    'JWT_SECRET'
  ];

  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

  if (missingEnvs.length > 0) {
    console.error('Missing required environment variables:', missingEnvs);
    process.exit(1);
  }

  console.log('All required environment variables are loaded');
};

module.exports = checkEnv; 