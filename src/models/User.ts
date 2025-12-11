import { USER_ROLE, USER_STATUS } from "@/lib/constants";
import { InferSchemaType, Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    fname: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    lname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already in use"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      minlength: [10, "Phone must be at least 10 characters long"],
    },
    avatar: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: USER_STATUS,
      default: USER_STATUS.ACTIVE,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: USER_ROLE,
      default: USER_ROLE.USER,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true, strict: "throw" }
);

export const UserModel = models.User || model("User", UserSchema);

export type UserType = InferSchemaType<typeof UserSchema>;
