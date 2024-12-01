import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserDocument, UserData } from "../../../shared/types/gameTypes";
import userModel from "../models/userModel";

import catchAsync from "../utils/catchAsync";
import { ObjectId } from "mongoose";
import { AppError } from "../../../shared/utils/appError";

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

  const userData: UserData = {
    username: user.username,
    email: user.email,
    _id: user._id.toString(),
    score: user.score,
  };
  res.status(statusCode).json({
    status: "success",
    token,
    data: { userData },
  });
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await userModel.create(req.body);
    createSendToken(newUser, 201, res);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    console.log(email, password);

    //2) Check if user exists and password is correct
    const user: UserDocument = await userModel
      .findOne({ email })
      .select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    //3) If valid, generate a token and send it back to the client
    createSendToken(user, 200, res);
  }
);

export const getUserHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user: UserDocument = await getUserInfo(id);
    // console.log(user);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  }
);

export const getUserInfo = async (userId: string) => {
  const user: UserDocument = await userModel.findOne({ _id: userId });
  if (!user) {
    throw new AppError("No user found", 401);
  }
  return user;
};
