import bcrypt from "bcryptjs";
import mongoose, { Model, Schema } from "mongoose";
import { UserDocument } from "../../../shared/types/gameTypes";
import validator from "validator";

const userSchema: Schema<UserDocument> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a user name"],
    },
    score: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    songs: {
      type: [
        [
          {
            content: { type: String, required: true },
            playerId: { type: String, required: true },
          },
        ],
      ],
      default: [],
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
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  const res = await bcrypt.compare(candidatePassword, userPassword);
  console.log("res: ", res);
  return res;
};

const UserModel: Model<UserDocument> = mongoose.model("User", userSchema);

export default UserModel;
