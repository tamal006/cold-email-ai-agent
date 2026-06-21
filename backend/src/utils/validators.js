import { body } from "express-validator";
export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];
export const loginValidation = [
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required")
];
export const generateEmailValidation = [
  body("recipientEmail").trim().notEmpty().withMessage("Recipient email is required").isEmail().withMessage("Please provide a valid recipient email"),
  body("purpose").trim().notEmpty().withMessage("Purpose is required"),
  body("tone").optional().isIn(["professional", "friendly", "startup", "formal"]).withMessage("Tone must be one of: professional, friendly, startup, formal")
];
export const sendEmailValidation = [
  body("emailId").notEmpty().withMessage("Email ID is required").isMongoId().withMessage("Invalid email ID")
];
