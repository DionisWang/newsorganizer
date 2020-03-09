import mongoose from 'mongoose';
const newsSchema = new mongoose.Schema({
  articleID: {
    type: String,
    unique: true,
  },
  source: String,
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: Date,
  content: String,
});
/*
newsSchema.statics.findByLogin = async function (login) {
    let user = await this.findOne({
      username: login,
    });
    if (!user) {
      user = await this.findOne({ email: login });
    }
    return user;
};
*/

const News = mongoose.model('News', newsSchema);
export default News;