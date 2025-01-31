export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}