import { Schema, model, models } from 'mongoose';

const voteSchema = new Schema(
  {
    positiveVoters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    negativeVoters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    meal: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner'],
    },
    foodItem: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'food',
    },
    groupId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'group',
    },
  },
  { timestamps: true }
);

const VoteModel = models.vote || model('vote', voteSchema);

export default VoteModel;
