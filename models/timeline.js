import mongoose from 'mongoose';
const timelineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'News'
  }],
  pins:{
    type: Array,
    of: Map,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Timeline = mongoose.model('Timeline', timelineSchema);
export default Timeline;