const { body, validationResult } = require("express-validator");

module.exports = {
  validateUser: [
    body("values.name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 25 })
      .withMessage("Name cannot be more than 25 characters"),
    body("values.surname")
      .notEmpty()
      .withMessage("Surname is required")
      .isLength({ max: 25 })
      .withMessage("Surname cannot be more than 25 characters"),
    body("values.email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("values.phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^[0-9]\d{9,14}$/)
      .withMessage("Invalid phone number"),
    // Middleware to handle validation errors
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("VALIDATION DIDN'T PASS");
        console.log({ errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ],
};
