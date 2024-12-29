const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  type: { type: String, enum: ['Expiration', 'Survey','InitialSurvey'], required: true },
  message: { type: String, required: true },
  viewed: { type: Boolean, default: false }, // Default value set to false
  date: { type: Date, required: true },
 // read: { type: Boolean, default: false } // Optional: to track if the notification has been read
});
NotificationSchema.statics.findByCustomerId = function(CustomerId,Type) {
    return this.findOne({ customerId: CustomerId },{type:Type});
};
//NotificationSchema.statics.findByIdAndUpdate = function(Id) {
 // return this.findOne({ _id: Id });
//};
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
