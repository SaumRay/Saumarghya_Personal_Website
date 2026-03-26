import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { Contact } from "../models/Contact";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact
export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ success: false, message: "Name, email and message are required" });
      return;
    }

    // Save to MongoDB
    const contact = await Contact.create({ name, email, message });

    // Send email notification
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New message from ${name} via your portfolio`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #111827;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #6366f1; padding-left: 16px; color: #374151;">${message}</blockquote>
          <hr style="margin-top: 24px;" />
          <p style="font-size: 12px; color: #9ca3af;">Submitted via your portfolio website</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      data: { id: contact._id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send message. Please try again.", error });
  }
};

// GET /api/contact  (admin only)
export const getMessages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages, total: messages.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// PATCH /api/contact/:id/read  (admin only)
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!message) {
      res.status(404).json({ success: false, message: "Message not found" });
      return;
    }
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
