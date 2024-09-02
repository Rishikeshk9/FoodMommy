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

export async function getVotesByGroup(groupId, date) {
  try {
    await connectDB();
    let dateObj;
    if (date) {
      dateObj = new Date(date);
    } else {
      dateObj = new Date();
    }
    dateObj.setHours(0, 0, 0, 0); // Set time to start of day

    const nextDay = new Date(dateObj);
    nextDay.setDate(dateObj.getDate() + 1);
    const votes = await VoteModel.find({
      groupId,
      votingForDate: { $gte: dateObj, $lt: nextDay },
    }).lean();
    if (!votes.length) throw new Error('Votes not found');
    return JSON.parse(JSON.stringify(votes));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function saveVoteItem(voteItem, votingForDate) {
  try {
    await connectDB();
    const { foodItem, meal, voter, groupId, _id } = voteItem;
    if (!foodItem || !meal || !voter || !groupId || !votingForDate) {
      throw new Error('Missing required fields');
    }

    // Find the existing vote item
    const existingVoteItem = await VoteModel.findById(_id);

    if (existingVoteItem) {
      const hasVoted = existingVoteItem.voters.includes(voter);

      // Toggle the user's vote
      if (hasVoted) {
        console.log('USER HAS VOTED', existingVoteItem.voters);
        const updateVoters = existingVoteItem.voters.filter(
          (id) => id !== voter
        );
        if (updateVoters.length === 0) {
          // If no voters left, delete the vote object
          await VoteModel.findByIdAndDelete(existingVoteItem._id);
          console.log('VOTE ITEM DELETED');
          return { deleted: true };
        } else {
          existingVoteItem.voters = updateVoters;
          console.log('UPDATED VOTERS', updateVoters);
        }
      } else {
        console.log('USER HAS NOT VOTED');
        existingVoteItem.voters.push(voter);
      }
      const updatedVoteItem = await existingVoteItem.save();

      console.log('UPDATED VOTE ITEM', updatedVoteItem);
      return JSON.parse(JSON.stringify(updatedVoteItem));
    } else {
      // Create a new vote item
      voteItem.voters = [voter];
      voteItem.votingForDate = votingForDate;
      const savedVoteItem = await new VoteModel(voteItem).save();
      console.log('SAVED VOTE ITEM', savedVoteItem);
      return JSON.parse(JSON.stringify(savedVoteItem));
    }
  } catch (error) {
    console.error('Error in saveVoteItem:', error);
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
