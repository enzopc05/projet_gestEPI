//********** Imports **********//
import express from "express";
import cors from "cors";
import * as middlewares from "./middlewares";
import epiRoutes from "./routes/epi";
import epiTypeRoutes from "./routes/epiType";
import epiStatusRoutes from "./routes/epiStatus";
import userRoutes from "./routes/user";
import epiCheckRoutes from "./routes/epiCheck";
import dashboardRoutes from "./routes/dashboard";
import authRoutes from "./routes/auth"; // Importation des routes d'authentification
import { authenticate } from "./middlewares/auth"; // Importation du middleware d'authentification

require("dotenv").config();

//********** Server **********//
const allowedOrigins = [
  "http://localhost:3000", 
  "http://127.0.0.1:3000",
  "http://192.168.56.1:3000"
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
// Initializing express.
const app = express();
// Enable CORS
app.use(cors(options));
// Middleware to parse json throught requests.
app.use(express.json());

// Routes publiques
app.use('/api/auth', authRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API GestEPI. Utilisez /api/epis, /api/epi-types, etc.' });
});

// Routes protégées par authentification
app.use('/api/epis', authenticate, epiRoutes);
app.use('/api/epi-types', authenticate, epiTypeRoutes);
app.use('/api/epi-status', authenticate, epiStatusRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/epi-checks', authenticate, epiCheckRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);

// Erreur 404 pour les routes non trouvées
app.use(middlewares.notFound);
// Gestionnaire d'erreurs
app.use(middlewares.errorHandler);

export default app;