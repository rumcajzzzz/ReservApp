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
      bookings: {
        Row: {
          booking_date: string;
          booking_time: string;
          created_at: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          id: string;
          provider_id: string;
          service_id: string;
          status: string;
        };
        Insert: {
          booking_date: string;
          booking_time: string;
          created_at?: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string;
          id?: string;
          provider_id: string;
          service_id: string;
          status?: string;
        };
        Update: {
          booking_date?: string;
          booking_time?: string;
          created_at?: string;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string;
          id?: string;
          provider_id?: string;
          service_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "providers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      providers: {
        Row: {
          address: string | null;
          created_at: string;
          description: string | null;
          email: string;
          id: string;
          logo_url: string | null;
          name: string;
          phone: string | null;
          slug: string;
          user_id: string;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          description?: string | null;
          email: string;
          id?: string;
          logo_url?: string | null;
          name: string;
          phone?: string | null;
          slug: string;
          user_id: string;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          description?: string | null;
          email?: string;
          id?: string;
          logo_url?: string | null;
          name?: string;
          phone?: string | null;
          slug?: string;
          user_id?: string;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "providers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          created_at: string;
          description: string | null;
          duration: number;
          id: string;
          name: string;
          price: number;
          provider_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          duration: number;
          id?: string;
          name: string;
          price: number;
          provider_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          duration?: number;
          id?: string;
          name?: string;
          price?: number;
          provider_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey";
            columns: ["provider_id"];
            isOneToOne: false;
            referencedRelation: "providers";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
