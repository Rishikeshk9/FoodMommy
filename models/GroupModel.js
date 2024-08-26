import { Schema, model, models } from 'mongoose';

const groupSchema = new Schema(
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
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

const GroupModal = models.group || model('group', groupSchema);

export default GroupModal;
