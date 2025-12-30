import { InferSchemaType, Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
  },
  { timestamps: true, strict: "throw" }
);

export const CategoryModel =
  models.Category || model("Category", CategorySchema);

export type CategoryType = InferSchemaType<typeof CategorySchema> & {
  _id: string;
};
