import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    maxLength: 10,
  },
  
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  userType: {
    type: String,
    enum: ['Host&Participant', 'Host'],
    default: 'Host&Participant'
  },
  desc: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  profile: {
    type: String,
    default: null
  },
  document: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: () => Date.now(), // Set default only for new users
    immutable: true, // Prevent updates to this field after creation
  },
  social: [{
    type: {
      type: String,
      enum: ['facebook', 'twitter', 'instagram']
    },
    link: String
  }],
  bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
  events: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Events",
    }
  
  ],

});

export default mongoose.model("User", userSchema);

userSchema.pre("save", function (next) {
  if (!this.isNew) {
    // Retain the original `createdAt` value
    this.createdAt = this.get("createdAt");
  }
  next();
});

