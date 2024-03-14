import { model, models, Schema } from "mongoose";

export interface IRegcode {
  regcode: string;
  active: boolean;
  createdBy: string;
}

const RegcodeSchema = new Schema<IRegcode>(
  {
    regcode: String,
    active: Boolean,
    createdBy: String,
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

const Regcode = models.Regcode || model('Regcode', RegcodeSchema);
export default Regcode;