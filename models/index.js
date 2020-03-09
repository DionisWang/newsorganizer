import mongoose from 'mongoose';
import User from './user';
import Message from './message';
import News from './news';
import Timeline from './timeline'

const connectDb = () => {
  return mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false,
  });
};

const models = { User, Message, News, Timeline };

export { connectDb };
export default models;