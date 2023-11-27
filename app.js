// import { static as static_ } from "express";
import express from "express";
import dotenv from "dotenv";
import AdminRoutes from "./routes/admin/index.js";
import ProductCategoryRoutes from "./routes/product_category/index.js";
import MeasureTypeRoutes from "./routes/measure_type/index.js";
import ProductRoutes from "./routes/product/index.js";
import UserRoutes from "./routes/user/index.js";
import OrderRoutes from "./routes/order/index.js";
import UserAddressRoutes from "./routes/user_address/index.js";
import PaymentTypeRoutes from "./routes/payment_type/index.js";
import UserPaymentRoutes from "./routes/user_payment/index.js";
import CreditCardRoutes from "./routes/credit_card/index.js";
import OrderStatusRoutes from "./routes/order_status/index.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use("/images/", static_("./images"));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Servidor Rodando!" });
});

app.use(AdminRoutes);
app.use(ProductCategoryRoutes);
app.use(MeasureTypeRoutes);
app.use(ProductRoutes);
app.use(UserRoutes);
app.use(OrderRoutes);
app.use(UserAddressRoutes);
app.use(PaymentTypeRoutes);
app.use(UserPaymentRoutes);
app.use(CreditCardRoutes);
app.use(OrderStatusRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

export default app;
