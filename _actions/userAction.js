'use server';

import UserModel from '../models/UserModel';
import connectDB from '../config/database';

export async function getUserItems(id) {
  try {
    await connectDB();
    const query = id ? UserModel.findById(id) : UserModel.find();
    const data = await query.lean();
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Error in getUserItems:', error);
    return { errMsg: error.message };
  }
}

export async function updateUserPreferences(
  userId,
  { breakfast, lunch, dinner }
) {
  try {
    console.log('UPDATING USER PREFERENCES', userId, breakfast, lunch, dinner);
    await connectDB();
    const updatedUserItem = await UserModel.findByIdAndUpdate(
      userId,
      { breakfast, lunch, dinner },
      { new: true }
    );
    return JSON.parse(JSON.stringify(updatedUserItem));
  } catch (error) {
    console.error('Error in saveUserPreferences:', error);
    return { success: false, errMsg: error.message };
  }
}

export async function saveUserItem(userItem) {
  try {
    await connectDB();
    const newUserItem = await new UserModel(userItem).save();
    return JSON.parse(JSON.stringify(newUserItem));
  } catch (error) {
    console.error('Error in saveUserItem:', error);
    return { success: false, errMsg: error.message };
  }
}

export async function updateUserItem(userId, updatedData) {
  try {
    await connectDB();
    const updatedUserItem = await UserModel.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true, runValidators: true }
    );
    if (!updatedUserItem) throw new Error('User not found');
    return JSON.parse(JSON.stringify(updatedUserItem));
  } catch (error) {
    console.error('Error in updateUserItem:', error);
    return { success: false, errMsg: error.message };
  }
}

export async function deleteUserItem(userId) {
  try {
    await connectDB();
    const deletedUserItem = await UserModel.findByIdAndDelete(userId);
    if (!deletedUserItem) throw new Error('User not found');
    return JSON.parse(JSON.stringify(deletedUserItem));
  } catch (error) {
    console.error('Error in deleteUserItem:', error);
    return { success: false, errMsg: error.message };
  }
}
