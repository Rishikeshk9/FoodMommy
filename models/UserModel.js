import { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    provider: { type: String },
    providerAccountId: { type: String },
    image: {
      type: String,
    },
    breakfast: [
      {
        type: Schema.Types.ObjectId,
        ref: 'food',
      },
    ],
    lunch: [
      {
        type: Schema.Types.ObjectId,
        ref: 'food',
      },
    ],
    userName: {
      type: String,
      required: true,
    },
    dinner: [
      {
        type: Schema.Types.ObjectId,
        ref: 'food',
      },
    ],
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: 'group',
      },
    ],
  },
  { timestamps: true }
);

const UserModal = models.user || model('user', userSchema);

export default UserModal;
