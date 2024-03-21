// Import các thư viện cần thiết
import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

// Load cấu hình từ file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Khởi tạo Stripe với khóa bí mật
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Cấu hình CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN, // Sử dụng biến môi trường để chỉ định origin được phép
  optionsSuccessStatus: 200, // Một số trình duyệt cũ chọn sử dụng status 200
};

// Nếu ALLOWED_ORIGIN không được đặt, thì không sử dụng CORS
if (process.env.ALLOWED_ORIGIN) {
  app.use(cors(corsOptions));
} else {
  console.log("CORS is not enabled because ALLOWED_ORIGIN is not set.");
}

app.use(bodyParser.json());

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;
  console.log(typeof amount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      //   amount: parseInt(amount, 10) * 100,
      amount: amount * 100,
      currency: "usd",
      // Thêm các option khác nếu cần
    });
    console.log(paymentIntent.client_secret);
    // Gửi clientSecret về cho client
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
