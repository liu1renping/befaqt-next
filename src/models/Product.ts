import { InferSchemaType, Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than 0"],
    },
    imageUrl: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  },
  { timestamps: true, strict: "throw" }
);

// Force delete the model from cache in development to ensure schema changes are applied
if (process.env.NODE_ENV === "development") {
  delete models.Product;
}

export const ProductModel = models.Product || model("Product", ProductSchema);

export type ProductType = InferSchemaType<typeof ProductSchema> & {
  _id: string;
};
