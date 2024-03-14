import { model, models, Schema } from "mongoose";

export interface IUser {
  username: string;
  hashedPassword: string;
  trust: number;
  regcodes: Array<string>;
  invitedBy: string;
}

const UserSchema = new Schema<IUser>(
  {
    username: String,
    hashedPassword: String,
    trust: Number,
    regcodes: [String],
    invitedBy: String,
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  },
);

const User = models.User || model("User", UserSchema);
export default User;