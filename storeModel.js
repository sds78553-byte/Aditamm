import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      required: true,
      enum: ["retail", "service", "digital", "dropshipping", "custom"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    theme: {
      type: String,
      default: "classic",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    primaryColor: {
      type: String,
      default: "#000000",
    },
    secondaryColor: {
      type: String,
      default: "#ffffff",
    },
    features: {
      type: [String],
      default: [],
    },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
    },
    domain: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // 🔥 Advanced Additions Start Here 🔥

    aiPreferences: {
      layoutType: { type: String, default: "default" }, // smart layout
      autoSeoEnabled: { type: Boolean, default: true },
      personalizedRecommendations: { type: Boolean, default: true },
    },

    integrations: {
      chatbot: { type: String, default: "none" }, // tawk.to / crisp etc.
      emailProvider: { type: String, default: "none" }, // Mailchimp etc.
      whatsappSupportNumber: { type: String, default: "" },
    },

    automationSettings: {
      abandonedCartEmail: { type: Boolean, default: true },
      abandonedCartSMS: { type: Boolean, default: false },
    },

    inventoryManagement: {
      trackInventory: { type: Boolean, default: true },
      lowStockThreshold: { type: Number, default: 5 },
    },

    analytics: {
      visitors: { type: Number, default: 0 },
      orders: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      bounceRate: { type: Number, default: 0 },
      topPages: { type: [String], default: [] },
    },

    // 🔚 End of Advanced Section

  },
  { timestamps: true }
);

export default mongoose.model("Store", storeSchema);
