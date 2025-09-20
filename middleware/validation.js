const { Joi, celebrate } = require("celebrate");

const userCreatorValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(100).required().messages({
      "string.empty": 'The "name" field must be filled in.',
      "string.min": 'The minimum length of the "name" field must be 2',
      "string.max": 'The maximum length of the "name" field is 100',
    }),
    userName: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "userName" field must be filled in.',
      "string.min": 'The minimum length of the "name" field must be 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": `The "email" field must be filled in.`,
      "string.email": `The "email" field must be a valid email address.`,
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports = { userCreatorValidator };
