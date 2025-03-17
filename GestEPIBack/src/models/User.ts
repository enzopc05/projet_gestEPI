import db from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userTypeId: number;
}

export async function getAllUsers() {
  let conn;
  try {
    conn = await db.getConnection();
    const [rows] = await conn.query<RowDataPacket[]>("SELECT u.*, ut.typeName FROM users u JOIN usertypes ut ON u.userTypeId = ut.id");
    return rows;
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function getUserById(id: number) {
  let conn;
  try {
    conn = await db.getConnection();
    const [rows] = await conn.query<RowDataPacket[]>("SELECT u.*, ut.typeName FROM users u JOIN usertypes ut ON u.userTypeId = ut.id WHERE u.id = ?", [id]);
    return rows[0];
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function createUser(user: User) {
  let conn;
  try {
    conn = await db.getConnection();
    const [result] = await conn.query<ResultSetHeader>(
      "INSERT INTO users (firstName, lastName, email, phone, userTypeId) VALUES (?, ?, ?, ?, ?)",
      [user.firstName, user.lastName, user.email, user.phone, user.userTypeId]
    );
    return { id: result.insertId, ...user };
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function updateUser(id: number, user: User) {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query<ResultSetHeader>(
      "UPDATE users SET firstName = ?, lastName = ?, email = ?, phone = ?, userTypeId = ? WHERE id = ?",
      [user.firstName, user.lastName, user.email, user.phone, user.userTypeId, id]
    );
    return { id, ...user };
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

export async function deleteUser(id: number) {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.query<ResultSetHeader>("DELETE FROM users WHERE id = ?", [id]);
    return { id };
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}