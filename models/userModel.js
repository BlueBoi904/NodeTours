const mongoose = require("mongoose");

// const slugify = require("slugify");

const bcrypt = require("bcryptjs");

const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tel us your name."]
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email."]
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password "],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works CREATE and SAVE.
      validator: function(el) {
        return el === this.password; // abc === abc => true
      },
      message: "Passwords do not match"
    }
  }
});
//Encryption will happen between getting the data and saving it to the database with the pre('save')
//Hashed and salted passwords with bCrypt
userSchema.pre("save", async function(next) {
  // Only run this function if password was actually modified.
  if (!this.isModified("password")) return next();
  // Has the password
  this.password = await bcrypt.hash(this.password, 12);
  // Delete confirm password field so it will not be persisted in the database.
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
