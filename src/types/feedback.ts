// src/types/feedback.ts
import type { Models } from 'appwrite';

export type FeedbackType = 'bug' | 'suggestion' | 'usability';
export type FeedbackStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export interface FeedbackSubmission {
  type: FeedbackType;
  message: string;
  url: string;
  screenshot?: File | null;
}

export interface FeedbackRecord extends Models.Document {
  type: FeedbackType;
  message: string;
  url: string;
  screenshot?: string | null; // URL to uploaded screenshot
  status: FeedbackStatus;
  createdAt: string;
  updatedAt?: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
}
