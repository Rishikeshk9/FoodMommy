'use server';

import GroupModel from '../models/GroupModel';
import UserModel from '../models/UserModel';
import connectDB from '../config/database';
import mongoose from 'mongoose';

export async function getGroupItems() {
  try {
    await connectDB();
    const data = await GroupModel.find().lean();
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    return { errMsg: error.message };
  }
}

export async function getGroupById(groupId) {
  try {
    await connectDB();
    const group = await GroupModel.findById(groupId).lean();
    if (!group) {
      throw new Error('Group not found');
    }
    return JSON.parse(JSON.stringify(group));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function createGroup(groupData) {
  try {
    await connectDB();
    const newGroup = new GroupModel(groupData);
    await newGroup.save();
    return JSON.parse(JSON.stringify(newGroup));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function updateGroupItem(groupId, updatedData) {
  try {
    await connectDB();
    const updatedGroupItem = await GroupModel.findByIdAndUpdate(
      groupId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedGroupItem) {
      throw new Error('Group item not found');
    }
    return JSON.parse(JSON.stringify(updatedGroupItem));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function deleteGroupItem(groupId) {
  try {
    await connectDB();
    const deletedGroupItem = await GroupModel.findByIdAndDelete(groupId);
    if (!deletedGroupItem) {
      throw new Error('Group item not found');
    }
    return JSON.parse(JSON.stringify(deletedGroupItem));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function fetchGroupMembersByGroupId(groupId) {
  try {
    await connectDB();
    const group = await GroupModel.findById(groupId).lean();
    if (!group) {
      throw new Error('Group not found');
    }
    const memberIds = group.members.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const members = await UserModel.find({ _id: { $in: memberIds } }).lean();
    return JSON.parse(JSON.stringify(members));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}

export async function addMemberToGroup(groupId, userId, callerId) {
  try {
    await connectDB();
    const group = await GroupModel.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    if (!group.admins.includes(callerId)) {
      throw new Error('Permission denied. Only admins can add members.');
    }
    const updatedGroup = await GroupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true, runValidators: true }
    ).populate('members', 'name');
    return JSON.parse(JSON.stringify(updatedGroup));
  } catch (error) {
    return { success: false, errMsg: error.message };
  }
}
