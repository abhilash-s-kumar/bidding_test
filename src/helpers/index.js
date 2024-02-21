const Joi = require('joi');

module.exports = {
  validateSchema: (object, schema) => {
    const { error } = Joi.object(schema).validate(object);
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
    }
  },
};