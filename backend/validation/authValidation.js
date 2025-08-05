import { body, validationResult } from 'express-validator';

// Validation result handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'فشل في التحقق من صحة البيانات',
        details: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      },
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// Registration validation
export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('يرجى إدخال عنوان بريد إلكتروني صحيح')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز خاص واحد على الأقل'),
  
  body('name.first')
    .isLength({ min: 2, max: 50 })
    .withMessage('الاسم الأول يجب أن يكون بين 2 و 50 حرف')
    .matches(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z]+$/)
    .withMessage('الاسم الأول يجب أن يحتوي على أحرف فقط (بدون أرقام أو رموز خاصة)')
    .trim()
    .escape(),
  
  body('name.last')
    .isLength({ min: 2, max: 50 })
    .withMessage('الاسم الأخير يجب أن يكون بين 2 و 50 حرف')
    .matches(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z]+$/)
    .withMessage('الاسم الأخير يجب أن يحتوي على أحرف فقط (بدون أرقام أو رموز خاصة)')
    .trim()
    .escape(),
  
  body('phone')
    .matches(/^(\+20|0)?1[0125][0-9]{8}$/)
    .withMessage('يرجى إدخال رقم هاتف مصري صحيح'),
  
  body('role')
    .isIn(['seeker', 'provider', 'admin'])
    .withMessage('الدور يجب أن يكون "seeker" أو "provider" أو "admin"'),
  
  handleValidationErrors
];

// Login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('يرجى إدخال عنوان بريد إلكتروني صحيح')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('كلمة المرور مطلوبة'),
  
  handleValidationErrors
];

// Check availability validation
export const validateCheckAvailability = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('يرجى إدخال عنوان بريد إلكتروني صحيح')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .custom((value) => {
      if (value && value.trim()) {
        const phoneRegex = /^(\+20|0)?1[0125][0-9]{8}$/;
        if (!phoneRegex.test(value)) {
          throw new Error('يرجى إدخال رقم هاتف مصري صحيح');
        }
      }
      return true;
    }),
  
  body()
    .custom((value) => {
      if (!value.email && !value.phone) {
        throw new Error('يجب توفير البريد الإلكتروني أو رقم الهاتف على الأقل');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Refresh token validation
export const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('رمز التحديث مطلوب'),
  
  handleValidationErrors
];

// Forgot password validation
export const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('يرجى إدخال عنوان بريد إلكتروني صحيح')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Reset password validation
export const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('رمز إعادة التعيين مطلوب'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز خاص واحد على الأقل'),
  
  handleValidationErrors
];

// Change password validation
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('كلمة المرور الحالية مطلوبة'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('كلمة المرور الجديدة يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز خاص واحد على الأقل'),
  
  handleValidationErrors
]; 