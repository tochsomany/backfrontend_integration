const { checkSchema } = require("express-validator");
const User = require("../../models/user");


const bookSchema = checkSchema({
  title: {
    isAlphanumeric: true,
  }
})

const loginSchema = checkSchema({
  email: {
    isEmail: true,
    // Check if email already registered
  },
  password: {
    isLength: {
      options: {
        min: 5,
      },
      // errorMessage: "Password must be strong",
    },
  },
});

const signupSchema = checkSchema({
  name: {
    isAlpha: {
      locale: "en-us",
      errorMessage: "Name must contain only alphabetic characters",
    },
  },
  email: {
    isEmail: true,
    // Check if email already registered
    custom: {
      options: async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error(`User with email: ${value} already existed`);
        }
      },
    },
  },
  age: {
    isNumeric: {
      errorMessage: "Age must be a numeric value",
    },
    isInt: {
      options: { min: 18, max: 100 },
      errorMessage: "Age must be between 18 and 100",
    },
  },
  password: {
    isLength: {
      options: {
        min: 5,
      },
      errorMessage: "Password must be strong",
    },
    // isStrongPassword: true,
    // errorMessage: "Password must be strong",
  },
  confirmPassword: {
    custom: {
      options: async (value, { req }) => {
        if (value != req.body.password) {
          throw new Error("password mismatched");
        }
      },
    },
  },
  username: {
    isAlphanumeric: {
      errorMessage: "Username must contain only letters and numbers",
    },
  },
  facbookUrl: {
    optional: true,
    isURL: {
      errorMessage: "Invalid URL",
    },
  },
});

const updateUserSchema = checkSchema({
  name: {
    optional: true,
    isAlpha: {
      locale: "en-us",
      errorMessage: "Name must contain only alphabetic characters",
    },
  },
  // must be email
  email: {
    isEmail: true,
    // Check if email already registered
    custom: {
      options: async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error(`User with email: ${value} already existed`);
        }
      },
    },
  },
  age: {
    optional: true,
    isNumeric: {
      errorMessage: "Age must be a numeric value",
    },
    isInt: {
      options: { min: 18, max: 100 },
      errorMessage: "Age must be between 18 and 100",
    },
  },
  facbookUrl: {
    optional: true,
    isURL: {
      errorMessage: "Invalid URL",
    },
  },
});

module.exports = { loginSchema, signupSchema,bookSchema };
