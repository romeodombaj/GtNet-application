const { body, validationResult } = require("express-validator");

module.exports = {
  validateUser: [
    body("values.name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 25 })
      .withMessage("Name can't be more than 25 characters"),
    body("values.surname")
      .notEmpty()
      .withMessage("Surname is required")
      .isLength({ max: 25 })
      .withMessage("Surname can't be more than 25 characters"),
    body("values.email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("values.phone")
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^(\+?\d{1,3})?\d{7,14}$/)
      .withMessage("Invalid phone number"),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (req.method === "PUT") {
          let errArray = errors.array();
          errArray = errArray.filter((el) => el.value !== undefined);

          if (errArray.length !== 0) {
            console.log("VALIDATION DIDN'T PASS");
            console.log({ errors: errArray });
            return res.status(400).json({ errors: errArray });
          }
        } else {
          console.log("VALIDATION DIDN'T PASS");
          console.log({ errors: errors.array() });
          return res.status(400).json({ errors: errors.array() });
        }
      }
      next();
    },
  ],
};
