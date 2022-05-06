import { Error } from "mongoose";
import ApiResponse from "../models/api_response";

export const validationError = (error: any, message?: string) => {
  if ((error as Error.ValidationError).name === "ValidationError") {
    let errors: any = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return new ApiResponse({
      error: true,
      message: message ?? "Gagal",
      errors,
    });
  }

  console.log(error);

  return new ApiResponse({
    error: true,
    message: "Terjadi masalah diserver",
  });
};
