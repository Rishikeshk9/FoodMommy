'use server';

import FoodModel from '../models/FoodModel';
import connectDB from '../config/database';
import mongoose from 'mongoose';

export async function getFoodItems(id) {
  try {
    console.log('Fetching food items with ID:', id);
    await connectDB();

    if (id) {
      const uniqueIds = [...new Set(id.flat())].map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      return await FoodModel.find({ _id: { $in: uniqueIds } }).lean();
    }

    return JSON.parse(JSON.stringify(await FoodModel.find().lean()));
  } catch (error) {
    return { errMsg: error.message };
  }
}

export async function saveFoodItem(foodItem) {
  try {
    await connectDB();
    const newFoodItem = await new FoodModel(foodItem).save();
    return JSON.parse(JSON.stringify(newFoodItem));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function updateFoodItem(foodId, updatedData) {
  try {
    await connectDB();
    const updatedFoodItem = await FoodModel.findByIdAndUpdate(
      foodId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedFoodItem) {
      throw new Error('Food item not found');
    }

    return JSON.parse(JSON.stringify(updatedFoodItem));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function deleteFoodItem(foodId) {
  try {
    await connectDB();
    const deletedFoodItem = await FoodModel.findByIdAndDelete(foodId);

    if (!deletedFoodItem) {
      throw new Error('Food item not found');
    }

    return JSON.parse(JSON.stringify(deletedFoodItem));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}
