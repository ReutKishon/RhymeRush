const bcrypt = require("bcryptjs");
import mongoose, { Model, Schema } from "mongoose";
import { UserDocument } from "../types/gameTypes";
const validator = require("validator");

const userSchema: Schema<UserDocument> = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Please provide a user name"],
    },
    score: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      require: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      require: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val: string) {
          // @ts-ignore
          return val === this.password;
        },
        message: "Passwords do not match!",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // @ts-ignore
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  // console.log(candidatePassword, userPassword);
  return await bcrypt.compare(candidatePassword, userPassword);
};

const UserModel: Model<UserDocument> = mongoose.model("User", userSchema);

export default UserModel;
