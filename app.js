import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AdminRoute from "./routes/admin/index.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Servidor Rodando!" });
});

app.use(AdminRoute);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

export default app;
