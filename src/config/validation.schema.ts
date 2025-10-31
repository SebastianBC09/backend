import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3001),
  API_PREFIX: Joi.string().default('api/v1'),

  // Database
  MONGODB_URI: Joi.string().required().messages({
    'string.empty': 'MONGODB_URI is required',
    'any.required': 'MONGODB_URI must be provided',
  }),
  MONGODB_URI_TEST: Joi.string().optional(),

  // CORS
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),

  // Swagger
  SWAGGER_ENABLED: Joi.string().valid('true', 'false').default('true'),
}).unknown(true);
