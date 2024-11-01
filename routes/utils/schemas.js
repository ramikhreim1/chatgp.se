const Joi = require('joi');

const resetPasswordSchema = Joi.object({
    email: Joi.string().required("email is required").email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required("password is required")
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'), "password should be strong"),
    newPassword: Joi.string().required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'), "password should be strong"),

})
const createUserSchema = Joi.object({
    fname: Joi.string()
        .trim()
        .required()
        .label('First Name')
        .messages({
            'string.empty': 'First Name is required',
            'any.required': 'First Name is required',
        }),
    lname: Joi.string()
        .trim()
        .required()
        .label('Last Name')
        .messages({
            'string.empty': 'Last Name is required',
            'any.required': 'Last Name is required',
        }),
    email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2 })
        .required()
        .label('Email')
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .label('Password')
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required',
        }),
    referral: Joi.string()
        .trim()
        .allow(null, '')
        .label('Referral')
        .messages({
            'any.only': 'Referral must be null or an empty string',
        }),
});

const loginUserSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2 })
        .required()
        .label('Email')
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .min(6)
        .required()
        .label('Password')
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required',
        }),
});

const conversationApiSchema = Joi.object({
    message: Joi.string().required().label('Message')
        .messages({
            'string.empty': 'Please provide a message',
            'any.required': 'Please provide a message',
        }),
    id: Joi.string().label('id').allow(null).required().messages({
        'string.empty': 'id is required field',
        'any.required': 'id is required field',
    }),
    // n: Joi.number().required(),
    model: Joi.string().required().valid('gpt-3.5-turbo', 'gpt-4'),
    plugin: Joi.string().allow(null),
    plugins: Joi.array().items(Joi.string()),
    realtime: Joi.boolean().allow(null),
    autoThink:Joi.boolean().allow(null),
});


module.exports = { resetPasswordSchema, createUserSchema, loginUserSchema, conversationApiSchema }