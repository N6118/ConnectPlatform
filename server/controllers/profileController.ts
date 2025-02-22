import { Request, Response } from 'express';
import pool from '../db/config';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Get user basic info
    const userQuery = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );
    
    // Get achievements
    const achievementsQuery = await pool.query(
      `SELECT title FROM achievements WHERE user_id = $1`,
      [userId]
    );
    
    // Get interests
    const interestsQuery = await pool.query(
      `SELECT name FROM interests WHERE user_id = $1`,
      [userId]
    );
    
    // Get work items
    const workItemsQuery = await pool.query(
      `SELECT * FROM work_items WHERE user_id = $1`,
      [userId]
    );

    const userData = {
      ...userQuery.rows[0],
      achievements: achievementsQuery.rows.map(a => a.title),
      interests: interestsQuery.rows.map(i => i.name),
      workItems: workItemsQuery.rows
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const {
      about,
      socialLinks,
      achievements,
      interests
    } = req.body;

    // Update user basic info
    await pool.query(
      `UPDATE users 
       SET about = $1, github_url = $2, linkedin_url = $3, portfolio_url = $4
       WHERE id = $5`,
      [about, socialLinks.github, socialLinks.linkedin, socialLinks.portfolio, userId]
    );

    // Update achievements
    await pool.query('DELETE FROM achievements WHERE user_id = $1', [userId]);
    for (const achievement of achievements) {
      await pool.query(
        'INSERT INTO achievements (user_id, title) VALUES ($1, $2)',
        [userId, achievement]
      );
    }

    // Update interests
    await pool.query('DELETE FROM interests WHERE user_id = $1', [userId]);
    for (const interest of interests) {
      await pool.query(
        'INSERT INTO interests (user_id, name) VALUES ($1, $2)',
        [userId, interest]
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 