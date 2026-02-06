import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { getBuyablesForSkill, getAvailableSkills, getDashboardData } from '../services/buyablesService.js';

const router = express.Router();

// Multer config for file uploads (max 5 files, 5MB each)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Buyables API'
  });
});

/**
 * GET /api/skills
 * Get list of available skills
 */
router.get('/skills', (req, res) => {
  const skills = getAvailableSkills();
  res.json({
    skills,
    count: skills.length
  });
});

/**
 * GET /api/buyables/:skill
 * Get buyables data for a specific skill
 */
router.get('/buyables/:skill', async (req, res, next) => {
  try {
    const { skill } = req.params;
    const data = await getBuyablesForSkill(skill);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/dashboard
 * Get top 4 items from each skill for dashboard view
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/contact
 * Send a contact form email
 */
router.post('/contact', upload.array('screenshots', 5), async (req, res) => {
  try {
    const { name, email, subject, body } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !body) {
      return res.status(400).json({ error: 'All fields (name, email, subject, body) are required.' });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: parseInt(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Build attachments from uploaded files
    const attachments = (req.files || []).map((file) => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype,
    }));

    await transporter.sendMail({
      from: `"Buyables Contact Form" <${process.env.SMTP_USER}>`,
      replyTo: `"${name}" <${email}>`,
      to: process.env.CONTACT_EMAIL || 'contact@osrstldr.com',
      subject: `[Buyables] ${subject}`,
      text: `From: ${name} (${email})\n\n${body}`,
      html: `
        <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
        <hr />
        <p>${body.replace(/\n/g, '<br />')}</p>
      `,
      attachments,
    });

    res.json({ message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('[Contact] Email send error:', error.message);
    res.status(500).json({
      error: 'Failed to send your message. Please try again later.',
    });
  }
});

export default router;
