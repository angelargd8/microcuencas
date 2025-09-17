const appConfig = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000'],

  //Rate limiting
  rateLimiting: {
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX) || 3,
    message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de una hora.'
  },

  security: {
    helmetEnabled: true,
    corsEnabled: true,
  }
};



export default appConfig;