import { USER_ROLE, USER_STATUS } from "@/lib/constants";
import { Schema, model, models } from "mongoose";

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
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: USER_ROLE,
      default: USER_ROLE.USER,
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: USER_STATUS,
      default: USER_STATUS.ACTIVE,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
      trim: true,
      minlength: [10, "Phone must be at least 10 characters long"],
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

const User = models.User || model("User", UserSchema);

export default User;
