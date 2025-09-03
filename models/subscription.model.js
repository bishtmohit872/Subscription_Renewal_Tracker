import dayjs from "dayjs";
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "INR", "JPY", "AUD"],
      required: true,
    },
    frequency: {
      type: String,
      enum: ["weekly","monthly", "quarterly", "yearly"],
      required: true,
    },
    category: {
      type: String,
      enum: ["Entertainment", "Food", "Health", "Other"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Start date cannot be in the future",
      },
    },
    renewalDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimize queries by indexing user field
    },
  },
  { timestamps: true }
);

// Auto-calculate renewal date if missing
subscriptionSchema.pre("validate", function (next) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      weekly:7,
      monthly: 30,
      quarterly: 90,
      yearly: 365,
    };
    this.renewalDate = dayjs(this.startDate)
      .add(renewalPeriods[this.frequency], "day")
      .toDate();
  }

  const now = dayjs();
  const renewalDay = dayjs(this.renewalDate);

  this.status = now.isAfter(renewalDay, "day") ? "expired" : "active";

  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;