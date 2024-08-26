'use server';

import VoteModel from '../models/VoteModel';
import connectDB from '../config/database';

export async function getVoteItems() {
  try {
    await connectDB();
    return JSON.parse(JSON.stringify(await VoteModel.find().lean()));
  } catch (error) {
    return { errMsg: error.message };
  }
}

export async function getVotesByGroup(groupId) {
  try {
    await connectDB();
    const votes = await VoteModel.find({ groupId }).lean();
    if (!votes.length) throw new Error('Votes not found');
    return JSON.parse(JSON.stringify(votes));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function saveVoteItem(voteItem) {
  try {
    await connectDB();
    const { foodItem, meal, userId, groupId } = voteItem;
    if (!foodItem || !meal || !userId || !groupId) {
      throw new Error('Missing required fields');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingVoteItem = await VoteModel.findOne({
      foodItem,
      meal,
      groupId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    if (existingVoteItem) {
      const index = existingVoteItem.positiveVoters.indexOf(userId);
      if (index > -1) {
        existingVoteItem.positiveVoters.splice(index, 1);
      } else {
        existingVoteItem.positiveVoters.push(userId);
      }
      await existingVoteItem.save();
      return { success: true, data: existingVoteItem };
    } else {
      const newVoteItem = new VoteModel(voteItem);
      await newVoteItem.save();
      return { success: true, data: newVoteItem };
    }
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function updateVoteItem(foodId, updatedData) {
  try {
    await connectDB();
    const updatedVoteItem = await VoteModel.findOneAndUpdate(
      { foodItem: foodId },
      updatedData,
      { new: true, runValidators: true }
    );
    if (!updatedVoteItem) throw new Error('Vote item not found');
    return { success: true, data: updatedVoteItem };
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function deleteVoteItem(voteId) {
  try {
    await connectDB();
    const deletedVoteItem = await VoteModel.findByIdAndDelete(voteId);
    if (!deletedVoteItem) throw new Error('Vote item not found');
    return { success: true, data: deletedVoteItem };
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}
