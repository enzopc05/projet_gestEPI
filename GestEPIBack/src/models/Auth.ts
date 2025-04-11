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
    
    // Requête pour récupérer l'utilisateur avec son mot de passe et son type
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT u.*, ut.typeName 
       FROM users u 
       JOIN usertypes ut ON u.userTypeId = ut.id 
       WHERE u.email = ?`,
      [email]
    );
    
    // Vérifier si l'utilisateur existe
    if (rows.length === 0) {
      return null;
    }
    
    const user = rows[0] as UserAuth;
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  } catch (err) {
    console.error('Erreur lors de l\'authentification:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// Fonction pour créer un mot de passe haché
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}