const { body, validationResult } = require("express-validator");

exports.validateContact = [
  body("firstName").isAlpha().withMessage("First name must be alphabetic."),
  body("lastName").isAlpha().withMessage("Last name must be alphabetic."),
  body("email").isEmail().withMessage("Invalid email format."),
  body("phone").isMobilePhone().withMessage("Invalid phone number."),
  body("username")
    .notEmpty()
    .withMessage("Username is required.")
    .isAlphanumeric()
    .withMessage("Username must contain only letters and numbers."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("role")
    .isIn(["Admin", "User"])
    .withMessage("Role must be either 'Admin' or 'User'"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("Checking");
    next();
  },
];
