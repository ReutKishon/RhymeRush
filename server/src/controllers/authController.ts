import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserDocument } from "../../../shared/types/gameTypes";
import userModel from "../models/userModel";

import catchAsync from "../utils/catchAsync";
import { ObjectId } from "mongoose";

const signToken = (id: ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (
  user: UserDocument,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);
  const cookieExpirationTime = parseInt(
    process.env.JWT_COOKIE_EXPIRES_IN as string,
    10
  );

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpirationTime * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  // user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser: UserDocument = await userModel.create(req.body);
    createSendToken(newUser, 201, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    //1) Check if email and password exist

    if (!email || !password) {
      return;
      // next(new AppError("please provide email and password!", 400));
    }

    console.log(email, password);

    //2) Check if user exists and password is correct
    const user: UserDocument = await userModel
      .findOne({ email })
      .select("+password");
    console.log(user);
    if (!user || !(await user.correctPassword(password, user.password))) {
      // return next(new AppError("Incorrect email or password", 401));
      return;
    }
    //3) If valid, generate a token and send it back to the client
    createSendToken(user, 200, res);
  }
);
