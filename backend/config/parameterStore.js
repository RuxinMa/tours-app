/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

const loadConfig = async () => {
  // 1. Load from .env file (if exists)
  dotenv.config();
  console.log('✅ Loaded .env file (if exists)');

  const isEC2 = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const isProduction = process.env.NODE_ENV === 'production';

  // 2. If in production on EC2, load from AWS Systems Manager Parameter Store
  if (isEC2 && isProduction) {
    console.log(
      '🌊 EC2 production environment detected, trying Parameter Store...',
    );

    try {
      const ssm = new AWS.SSM({ region: 'ap-southeast-2' });

      const result = await ssm
        .getParameters({
          Names: [
            '/tours-app/NODE_ENV',
            '/tours-app/JWT_SECRET',
            '/tours-app/JWT_EXPIRES_IN',
            '/tours-app/JWT_COOKIE_EXPIRES_IN',
            '/tours-app/HTTPS_ENABLED',
            '/tours-app/DATABASE',
            '/tours-app/DATABASE_PASSWORD',
            '/tours-app/HTTPS_ENABLED',
          ],
          WithDecryption: true,
        })
        .promise();

      result.Parameters.forEach((param) => {
        const key = param.Name.replace('/tours-app/', '');
        process.env[key] = param.Value;
        console.log(`✅ Loaded from Parameter Store: ${key}`);
      });

      process.env.NODE_ENV = 'production';
    } catch (error) {
      console.warn(
        '⚠️ Parameter Store failed, using existing environment variables',
      );
      console.warn('Error:', error.message);
    }
  } else {
    console.log('ℹ️ Using local environment variables');
  }
  // Validate essential variables
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }

  console.log('🎉 Configuration loaded successfully');
};

module.exports = { loadConfig };
