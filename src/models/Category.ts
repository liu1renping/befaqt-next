import { InferSchemaType, Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Name must be unique"],
      minlength: [2, "Name must be at least 2 characters long"],
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, strict: "throw" }
);

// Force delete the model from cache in development to ensure schema changes are applied
if (process.env.NODE_ENV === "development") {
  delete models.Category;
}

export const CategoryModel =
  models.Category || model("Category", CategorySchema);

export type CategoryType = InferSchemaType<typeof CategorySchema> & {
  _id: string;
};
