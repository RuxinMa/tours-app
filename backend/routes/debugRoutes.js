const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

const router = express.Router();

// 1. 检查服务器环境和配置
router.get('/server', (req, res) => {
  res.json({
    status: 'success',
    data: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      jwtSecretSet: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET
        ? process.env.JWT_SECRET.length
        : 0,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN,
      jwtCookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
      httpsEnabled: process.env.HTTPS_ENABLED,
      timestamp: new Date().toISOString(),
    },
  });
});

// 2. 检查请求头和 cookies
router.get('/request', (req, res) => {
  res.json({
    status: 'success',
    data: {
      url: req.originalUrl,
      method: req.method,
      headers: req.headers,
      cookies: req.cookies,
      protocol: req.protocol,
      secure: req.secure,
      host: req.get('host'),
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    },
  });
});

// 3. 测试受保护的路由（会触发 protect 中间件）
router.get('/protected', authController.protect, (req, res) => {
  res.json({
    status: 'success',
    message: 'Protected route accessed successfully',
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      timestamp: new Date().toISOString(),
    },
  });
});

// 4. 检查认证状态（不需要登录）
router.get('/auth-status', (req, res) => {
  let token = null;
  let tokenSource = 'none';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    tokenSource = 'authorization-header';
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    tokenSource = 'cookie';
  }

  res.json({
    status: 'success',
    data: {
      hasToken: !!token,
      tokenSource,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null,
      cookieJwt: req.cookies.jwt,
      isLoggedOutToken: req.cookies.jwt === 'loggedout',
      allCookies: req.cookies,
      authHeader: req.headers.authorization,
      timestamp: new Date().toISOString(),
    },
  });
});

// 5. 模拟登录（测试 cookie 设置）
router.post('/test-login', async (req, res) => {
  try {
    // 创建一个测试 token
    const testToken = jwt.sign({ id: 'test-user-id' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1小时
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    };

    res.cookie('jwt', testToken, cookieOptions);

    res.json({
      status: 'success',
      message: 'Test cookie set',
      data: {
        token: testToken,
        cookieOptions,
        expires: cookieOptions.expires.toISOString(),
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
