export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          city: string
          created_at: string
          created_by: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          national_id: string
          phone: string
          postal_code: string
          region: string
          street: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          created_by?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          national_id: string
          phone: string
          postal_code: string
          region: string
          street: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          created_by?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          national_id?: string
          phone?: string
          postal_code?: string
          region?: string
          street?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          dossier_id: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          name: string
          type: Database["public"]["Enums"]["document_type"]
          uploaded_at: string
          uploaded_by: string
          version: number
        }
        Insert: {
          dossier_id: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name: string
          type: Database["public"]["Enums"]["document_type"]
          uploaded_at?: string
          uploaded_by: string
          version?: number
        }
        Update: {
          dossier_id?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          name?: string
          type?: Database["public"]["Enums"]["document_type"]
          uploaded_at?: string
          uploaded_by?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      dossiers: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string
          customer_id: string
          id: string
          installation_date: string | null
          meter_number: string | null
          notes: string | null
          quotation_amount: number | null
          reference: string
          status: Database["public"]["Enums"]["dossier_status"]
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at: string
          works_required: boolean
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by: string
          customer_id: string
          id?: string
          installation_date?: string | null
          meter_number?: string | null
          notes?: string | null
          quotation_amount?: number | null
          reference: string
          status?: Database["public"]["Enums"]["dossier_status"]
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          works_required?: boolean
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string
          customer_id?: string
          id?: string
          installation_date?: string | null
          meter_number?: string | null
          notes?: string | null
          quotation_amount?: number | null
          reference?: string
          status?: Database["public"]["Enums"]["dossier_status"]
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          updated_at?: string
          works_required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "dossiers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      status_history: {
        Row: {
          comment: string | null
          created_at: string
          dossier_id: string
          id: string
          previous_status: Database["public"]["Enums"]["dossier_status"] | null
          status: Database["public"]["Enums"]["dossier_status"]
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          dossier_id: string
          id?: string
          previous_status?: Database["public"]["Enums"]["dossier_status"] | null
          status: Database["public"]["Enums"]["dossier_status"]
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          dossier_id?: string
          id?: string
          previous_status?: Database["public"]["Enums"]["dossier_status"] | null
          status?: Database["public"]["Enums"]["dossier_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_history_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "dossiers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "commercial" | "technical" | "supervisor"
      document_type:
        | "national_id"
        | "contract"
        | "quotation"
        | "installation_report"
        | "other"
      dossier_status:
        | "DRAFT"
        | "DOSSIER_COMPLETE"
        | "TECHNICAL_REVIEW"
        | "WORKS_REQUIRED"
        | "WORKS_VALIDATED"
        | "CONTRACT_SENT"
        | "CONTRACT_SIGNED"
        | "METER_SCHEDULED"
        | "METER_INSTALLED"
        | "INSTALLATION_REPORT_RECEIVED"
        | "CUSTOMER_VALIDATED"
        | "SUBSCRIPTION_ACTIVE"
        | "REJECTED"
        | "CANCELLED"
      subscription_type: "water" | "electricity" | "both"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "commercial", "technical", "supervisor"],
      document_type: [
        "national_id",
        "contract",
        "quotation",
        "installation_report",
        "other",
      ],
      dossier_status: [
        "DRAFT",
        "DOSSIER_COMPLETE",
        "TECHNICAL_REVIEW",
        "WORKS_REQUIRED",
        "WORKS_VALIDATED",
        "CONTRACT_SENT",
        "CONTRACT_SIGNED",
        "METER_SCHEDULED",
        "METER_INSTALLED",
        "INSTALLATION_REPORT_RECEIVED",
        "CUSTOMER_VALIDATED",
        "SUBSCRIPTION_ACTIVE",
        "REJECTED",
        "CANCELLED",
      ],
      subscription_type: ["water", "electricity", "both"],
    },
  },
} as const
