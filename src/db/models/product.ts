import { Schema, Types, model } from 'mongoose';

export interface Product {
  user: Types.ObjectId;
  name: String;
  description: String;
  image: String;
  category: String;
  price: Number;
  created_at: Date;
  updated_at: Date;
}

const productSchema = new Schema<Product>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    default: '/images/default.webp'
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
},
  {
    timestamps: true,
  }
)

const ProductModel = model<Product>('Product', productSchema);

export default ProductModel;