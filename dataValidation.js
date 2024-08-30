const e = require("express");
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
      .matches(/^\(\d{3}\)-\d{2}-\d{3}-\d{3,4}$/)
      .withMessage("Invalid phone number"),
    body("values.oib")
      .notEmpty()
      .withMessage("OIB is required")
      .isLength({ min: 11, max: 11 })
      .withMessage("Invalid OIB"),

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

  // checks if oib is unique
  checkOIB: (data, newData, res) => {
    const unique = data.find((el) => el.oib === newData.oib);

    if (unique !== undefined) {
      console.log("DUPLICATE OIB");
      return res.status(409).json({ message: "Duplicate user OIB." });
    }

    return;
  },
};
