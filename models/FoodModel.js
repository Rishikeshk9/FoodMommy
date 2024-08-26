import { Schema, model, models } from 'mongoose';

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const FoodModel = models.food || model('food', foodSchema);

export default FoodModel;
