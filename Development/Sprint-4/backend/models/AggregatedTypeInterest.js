import mongoose from 'mongoose';

const aggregatedTypeInterestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  genderInterestMap: {
    type: Map,
    of: Number,
    default: {},
  },
  categoryInterestMap: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true });

const AggregatedTypeInterest = mongoose.model("AggregatedTypeInterest", aggregatedTypeInterestSchema);

export default AggregatedTypeInterest;
