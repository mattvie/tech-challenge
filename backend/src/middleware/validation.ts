import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Validar tanto o body quanto os params e query, se necessário
    const { error } = schema.validate({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      res.status(400).json({ 
        error: 'Validation error',
        message: errorMessage,
        details: error.details 
      });
      return;
    }
    
    next();
  };
};

export const registerSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_-]+$/).required()
      .messages({
        'string.pattern.base': 'Username can only contain letters, numbers, underscores, and dashes.',
      }),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().max(100).optional().allow(''),
    lastName: Joi.string().max(100).optional().allow(''),
  }),
  // Garante que não existam params e queries inesperados
  params: Joi.object(),
  query: Joi.object(),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  params: Joi.object(),
  query: Joi.object(),
});

// Schema para atualização de perfil
export const updateProfileSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().max(100).optional().allow(''),
    lastName: Joi.string().max(100).optional().allow(''),
    avatar: Joi.string().uri().optional().allow(''),
  }).min(1),
  params: Joi.object(),
  query: Joi.object(),
});


// Schema para post
export const createPostSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(1).max(255).required(),
    content: Joi.string().min(1).required(),
    excerpt: Joi.string().max(500).optional().allow(''),
    imageUrl: Joi.string().uri().optional().allow(''),
    tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
  }),
  params: Joi.object(),
  query: Joi.object(),
});

export const updatePostSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().min(1).max(255).optional(),
    content: Joi.string().min(1).optional(),
    excerpt: Joi.string().max(500).optional().allow(''),
    imageUrl: Joi.string().uri().optional().allow(''),
    tags: Joi.array().items(Joi.string().max(50)).max(10).optional(),
  }).min(1),
  params: Joi.object(),
  query: Joi.object(),
});


// Schema de comentário
export const createCommentSchema = Joi.object({
  body: Joi.object({
    content: Joi.string().min(1).max(5000).required(),
    postId: Joi.number().integer().positive().required(),
    parentId: Joi.number().integer().positive().optional(),
  }),
  params: Joi.object(),
  query: Joi.object(),
});

// Schema para atualização de comentário
export const updateCommentSchema = Joi.object({
  body: Joi.object({
    content: Joi.string().min(1).max(5000).required(),
  }),
  params: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
  query: Joi.object(),
});
