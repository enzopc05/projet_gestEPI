import db from '../config/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';

export interface UserAuth {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userTypeId: number;
  typeName: string;
  password: string;
}

export async function authenticate(email: string, password: string) {
  let conn;
  try {
    conn = await db.getConnection();
    
    // Récupération de l'utilisateur par email
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT u.*, ut.typeName 
       FROM users u 
       JOIN usertypes ut ON u.userTypeId = ut.id 
       WHERE u.email = ?`,
      [email]
    );
    
    // Vérifier si l'utilisateur existe
    if (rows.length === 0) {
      console.log(`Utilisateur avec email ${email} non trouvé`);
      return null;
    }
    
    const user = rows[0] as UserAuth;
    console.log(`Utilisateur trouvé: ${user.firstName} ${user.lastName}`);
    
    // Pour le développement, si le mot de passe est vide, on accepte n'importe quel mot de passe
    if (!user.password) {
      console.log("Mot de passe non défini dans la base de données, connexion autorisée");
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    // Vérifier le mot de passe
    try {
      // Mot de passe par défaut
      if (password === "password" && 
          user.password === "$2a$10$yHMPCinMVYbfB5IebZsloOvmZ4jLbUCRJFzINk5O7dYFPZZMQqJLa") {
        console.log("Mot de passe par défaut valide");
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        console.log("Mot de passe invalide");
        return null;
      }
      
      console.log("Mot de passe valide");
      // Ne pas renvoyer le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      console.error('Erreur lors de la vérification du mot de passe:', err);
      return null;
    }
  } catch (err) {
    console.error('Erreur lors de l\'authentification:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}