import { Schema, model, models } from 'mongoose';

const voteSchema = new Schema(
  {
    voters: [
      {
        type: String,
      },
    ],

    meal: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner'],
    },
    foodItem: {
      required: true,
      type: String,
    },
    groupId: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

const VoteModel = models.vote || model('vote', voteSchema);

export default VoteModel;
