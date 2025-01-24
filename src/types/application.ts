import { Creator } from "./creator";

export interface Application {
  id: string;
  status: string;
  cover_letter: string;
  creator: Creator;
  opportunity_id: string;
  created_at?: string;
  updated_at?: string;
}