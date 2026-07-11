import { body, query } from 'express-validator';

export const createVehicleValidation = [
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be a valid year'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('imageUrl').optional().trim(),
];

export const updateVehicleValidation = [
  body('make').optional().trim().notEmpty().withMessage('Make cannot be empty'),
  body('model').optional().trim().notEmpty().withMessage('Model cannot be empty'),
  body('category')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be a valid year'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('description').optional().trim().isLength({ max: 1000 }),
  body('imageUrl').optional().trim(),
];

export const searchVehicleValidation = [
  query('make').optional().trim(),
  query('model').optional().trim(),
  query('category').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
];

export const restockValidation = [
  body('amount')
    .isInt({ min: 1 })
    .withMessage('Restock amount must be a positive integer'),
];
