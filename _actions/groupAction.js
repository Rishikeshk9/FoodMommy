'use server';

import GroupModel from '../models/GroupModel';
import UserModel from '../models/UserModel';
import connectDB from '../config/database';
import mongoose from 'mongoose';

export async function getGroupItems(ids) {
  try {
    await connectDB();
    const data = await GroupModel.find({ _id: { $in: ids } }).lean();
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

export async function joinGroup(groupId, userId) {
  try {
    await connectDB();
    console.log('JOINING GROUP', groupId, userId);

    // Remove '#' from groupId if present
    groupId = groupId.replace('#', '');

    const group = await GroupModel.findOne({ groupCode: groupId });
    const user = await UserModel.findById(userId);
    console.log('USER', user);
    console.log('GROUP', group);
    if (!user) {
      throw new Error('User not found');
    }

    if (!group) {
      throw new Error('Group not found');
    }

    if (group.visiblity === 'private') {
      return { success: false, errMsg: 'Group is private' };
    }

    if (group.members.includes(user._id)) {
      return { success: false, errMsg: 'You are already in this group' };
    }

    if (group.admins.includes(user._id)) {
      return { success: false, errMsg: 'You are already an admin' };
    }

    group.members.push(user._id);
    await group.save();

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { groups: group._id } },
      { new: true }
    );

    return { success: true, msg: 'Joined group successfully' };
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
