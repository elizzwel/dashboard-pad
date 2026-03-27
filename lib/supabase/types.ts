// lib/supabase/types.ts
// Database type definitions for Dashboard PAD Klaten

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
      master_type_pajak: {
        Row: {
          id: number;
          nama_type: string;
        };
        Insert: {
          id?: number | undefined;
          nama_type: string;
        };
        Update: {
          id?: number | undefined;
          nama_type?: string | undefined;
        };
        Relationships: [];
      };
      master_pajak: {
        Row: {
          id: number;
          nama_pajak: string;
          type_id: number;
        };
        Insert: {
          id?: number | undefined;
          nama_pajak: string;
          type_id: number;
        };
        Update: {
          id?: number | undefined;
          nama_pajak?: string | undefined;
          type_id?: number | undefined;
        };
        Relationships: [
          {
            foreignKeyName: "fk_type_pajak";
            columns: ["type_id"];
            referencedRelation: "master_type_pajak";
            referencedColumns: ["id"];
          }
        ];
      };
      target_pajak: {
        Row: {
          id: number;
          id_pajak: number | null;
          tahun: number;
          target_rp: number;
        };
        Insert: {
          id?: number | undefined;
          id_pajak?: number | null | undefined;
          tahun?: number | undefined;
          target_rp: number;
        };
        Update: {
          id?: number | undefined;
          id_pajak?: number | null | undefined;
          tahun?: number | undefined;
          target_rp?: number | undefined;
        };
        Relationships: [
          {
            foreignKeyName: "target_pajak_id_pajak_fkey";
            columns: ["id_pajak"];
            referencedRelation: "master_pajak";
            referencedColumns: ["id"];
          }
        ];
      };
      realisasi_pajak: {
        Row: {
          id: number;
          id_pajak: number | null;
          tahun: number;
          realisasi_rp: number;
          tanggal_input: string | null;
        };
        Insert: {
          id?: number | undefined;
          id_pajak?: number | null | undefined;
          tahun?: number | undefined;
          realisasi_rp: number;
          tanggal_input?: string | null | undefined;
        };
        Update: {
          id?: number | undefined;
          id_pajak?: number | null | undefined;
          tahun?: number | undefined;
          realisasi_rp?: number | undefined;
          tanggal_input?: string | null | undefined;
        };
        Relationships: [
          {
            foreignKeyName: "realisasi_pajak_id_pajak_fkey";
            columns: ["id_pajak"];
            referencedRelation: "master_pajak";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      v_card_dashboard: {
        Row: {
          total_target: number | null;
          growth_target_persen: number | null;
          total_realisasi: number | null;
          data_per_tanggal: string | null;
          persentase_capaian: number | null;
        };
      };
      v_card_analytical: {
        Row: {
          total_target: number | null;
          growth_target: number | null;
          total_realisasi: number | null;
          growth_realisasi: number | null;
          achievement_percent: number | null;
          variance_nominal: number | null;
          variance_percent: number | null;
          proyeksi: number | null;
          status_label: string | null;
          status_note: string | null;
        };
      };
      v_pie_realisasi_persen: {
        Row: {
          tahun: number | null;
          label: string | null;
          persentase: number | null;
          nilai_nominal: number | null;
        };
      };
      v_realisasi_vs_target_bar_chart: {
        Row: {
          kelompok_pad: string | null;
          tahun: number | null;
          total_target: number | null;
          total_realisasi: number | null;
        };
      };
      v_realisasi_kelompok_5thn: {
        Row: {
          kelompok_pad: string | null;
          tahun: number | null;
          total_realisasi: number | null;
        };
      };
      v_top_3_kontributor_pajak_nominal: {
        Row: {
          nama_pajak: string | null;
          realisasi_rp: number | null;
          target_rp: number | null;
          persentase_realisasi: number | null;
          persentase_sisa_target: number | null;
          tahun: number | null;
        };
      };
      v_top_3_persentase_realisasi: {
        Row: {
          nama_pajak: string | null;
          target_rp: number | null;
          realisasi_rp: number | null;
          persentase_realisasi: number | null;
          persentase_sisa_target: number | null;
          tahun: number | null;
        };
      };
      v_rincian_realisasi_pendapatan: {
        Row: {
          nama_sektor: string | null;
          target: number | null;
          realisasi: number | null;
          persentase: number | null;
          status: string | null;
        };
      };
      v_persentase_realisasi_th_berjalan: {
        Row: {
          nama_pajak: string | null;
          target_rp: number | null;
          realisasi_rp: number | null;
          persentase: string | null;
        };
      };
      v_tren_akumulasi_tahun_berjalan: {
        Row: {
          kelompok_pad: string | null;
          bulan: string | null;
          akumulasi_realisasi: number | null;
        };
      };
      v_variance_by_kelompok: {
        Row: {
          kelompok_pad: string | null;
          variance_nominal: number | null;
        };
      };
      v_top5_performers: {
        Row: {
          nama_pajak: string | null;
          realisasi_rp: number | null;
          target_rp: number | null;
          persentase_realisasi: number | null;
          persentase_sisa_target: number | null;
        };
      };
      v_bottom_5_at_risk_nominal: {
        Row: {
          nama_pajak: string | null;
          realisasi_rp: number | null;
          target_rp: number | null;
          persentase_realisasi: number | null;
        };
      };
      v_head_mata_anggaran_realisasi: {
        Row: {
          kelompok_pad: string | null;
          jumlah_mata_anggaran: number | null;
          total_target: number | null;
          total_realisasi: number | null;
          achievement: number | null;
          variance: number | null;
          kontribusi: number | null;
        };
      };
      v_detail_mata_anggaran_realisasi: {
        Row: {
          kelompok_pad: string | null;
          mata_anggaran: string | null;
          target: number | null;
          realisasi: number | null;
          achievement: number | null;
          variance: number | null;
          kontribusi_per_kelompok: number | null;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: {
      role: Role;
    };
    CompositeTypes: Record<string, never>;
  };
}
