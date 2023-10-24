import express from "express";
import dotenv from "dotenv";
import AdminRoutes from "./routes/admin/index.js";
import ProductCategoryRoutes from "./routes/productCategory/index.js";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Servidor Rodando!" });
});

app.use(AdminRoutes);
app.use(ProductCategoryRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

export default app;
