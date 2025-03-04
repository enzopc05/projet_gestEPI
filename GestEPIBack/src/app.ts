//********** Imports **********//
import express from "express";
import cors from "cors";
import * as middlewares from "./middlewares";
import epiRoutes from "./routes/epi";
import epiTypeRoutes from "./routes/epiType";
import epiStatusRoutes from "./routes/epiStatus";
import userRoutes from "./routes/user";

require("dotenv").config();

//********** Server **********//
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
// Initializing express.
const app = express();
// Enable CORS
app.use(cors(options));
// Middleware to parse json throught requests.
app.use(express.json());

// Routes
app.use('/api/epis', epiRoutes);
app.use('/api/epi-types', epiTypeRoutes);
app.use('/api/epi-status', epiStatusRoutes);
app.use('/api/users', userRoutes);

// Erreur 404 pour les routes non trouvées
app.use(middlewares.notFound);
// Gestionnaire d'erreurs
app.use(middlewares.errorHandler);

export default app;