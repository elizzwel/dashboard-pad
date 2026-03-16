// lib/supabase/types.ts
// Shell type definitions — replace with generated output from:
// npx supabase gen types typescript --project-id <project-id> > lib/supabase/types.ts

export type Role = "super_admin" | "admin" | "operator" | "viewer";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          password: string;
          nama: string;
          role: Role;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string | undefined;
          username: string;
          password: string;
          nama: string;
          role?: Role | undefined;
          is_active?: boolean | undefined;
          created_at?: string | undefined;
          updated_at?: string | undefined;
        };
        Update: {
          id?: string | undefined;
          username?: string | undefined;
          password?: string | undefined;
          nama?: string | undefined;
          role?: Role | undefined;
          is_active?: boolean | undefined;
          updated_at?: string | undefined;
        };
        Relationships: [];
      };
      refresh_tokens: {
        Row: {
          id: string;
          user_id: string;
          token_hash: string;
          expires_at: string;
          is_revoked: boolean;
          created_at: string;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string | undefined;
          user_id: string;
          token_hash: string;
          expires_at: string;
          is_revoked?: boolean | undefined;
          created_at?: string | undefined;
          ip_address?: string | null | undefined;
          user_agent?: string | null | undefined;
        };
        Update: {
          id?: string | undefined;
          user_id?: string | undefined;
          token_hash?: string | undefined;
          expires_at?: string | undefined;
          is_revoked?: boolean | undefined;
          ip_address?: string | null | undefined;
          user_agent?: string | null | undefined;
        };
        Relationships: [];
      };
      login_attempts: {
        Row: {
          id: string;
          ip_address: string;
          username: string | null;
          success: boolean;
          attempted_at: string;
        };
        Insert: {
          id?: string | undefined;
          ip_address: string;
          username?: string | null | undefined;
          success?: boolean | undefined;
          attempted_at?: string | undefined;
        };
        Update: {
          id?: string | undefined;
          ip_address?: string | undefined;
          username?: string | null | undefined;
          success?: boolean | undefined;
          attempted_at?: string | undefined;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource: string | null;
          resource_id: string | null;
          detail: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string | undefined;
          user_id?: string | null | undefined;
          action: string;
          resource?: string | null | undefined;
          resource_id?: string | null | undefined;
          detail?: Json | null | undefined;
          ip_address?: string | null | undefined;
          created_at?: string | undefined;
        };
        Update: {
          id?: string | undefined;
          user_id?: string | null | undefined;
          action?: string | undefined;
          resource?: string | null | undefined;
          resource_id?: string | null | undefined;
          detail?: Json | null | undefined;
          ip_address?: string | null | undefined;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      role: Role;
    };
    CompositeTypes: Record<string, never>;
  };
}
