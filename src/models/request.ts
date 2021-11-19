import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  name: String,
  date: Date
});

const RequestModel = mongoose.model('Request', RequestSchema);

export { RequestModel };
