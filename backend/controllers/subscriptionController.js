const Razorpay = require("razorpay");
const crypto = require("crypto");
const Subscription = require("../models/Subscription");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Price and days server la dhaan, frontend la irundhu edukka koodadhu
const PLANS = {
  monthly: { amount: 99, days: 30 },
  yearly: { amount: 799, days: 365 },
};

// POST /api/subscription/create-order
exports.createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: "Invalid plan" });

    const order = await razorpay.orders.create({
      amount: PLANS[plan].amount * 100, // paise
      currency: "INR",
      receipt: `sub_${Date.now()}`,
    });

    await Subscription.create({
      user: req.user.id,
      plan,
      amount: PLANS[plan].amount,
      razorpayOrderId: order.id,
      status: "pending",
    });

    res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ message: "Could not create order" });
  }
};

// POST /api/subscription/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Plan DB la irundhu edukrom (body la irundhu illa), so tamper panna mudiyadhu
    const sub = await Subscription.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user.id,
    });
    if (!sub) return res.status(404).json({ message: "Order not found" });
    if (sub.status === "active") {
      return res.json({ message: "Already activated", expiryDate: sub.expiryDate });
    }

    // Already active subscription irundha, avlo expiry la irundhu extend pannum
    const current = await Subscription.findOne({
      user: req.user.id,
      status: "active",
      expiryDate: { $gt: new Date() },
    }).sort({ expiryDate: -1 });

    const start = current ? current.expiryDate : new Date();
    const expiry = new Date(start.getTime() + PLANS[sub.plan].days * 24 * 60 * 60 * 1000);

    sub.razorpayPaymentId = razorpay_payment_id;
    sub.status = "active";
    sub.startDate = start;
    sub.expiryDate = expiry;
    await sub.save();

    res.json({ message: "Premium activated", plan: sub.plan, expiryDate: expiry });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ message: "Verification error" });
  }
};

// GET /api/subscription/status
exports.getStatus = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      user: req.user.id,
      status: "active",
      expiryDate: { $gt: new Date() },
    }).sort({ expiryDate: -1 });

    res.json({
      isPremium: !!sub,
      plan: sub ? sub.plan : null,
      expiry: sub ? sub.expiryDate : null,
    });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch status" });
  }
};

// GET /api/subscription/history
exports.getHistory = async (req, res) => {
  try {
    const subs = await Subscription.find({ user: req.user.id, status: "active" }).sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch history" });
  }
};