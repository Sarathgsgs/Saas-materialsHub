export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      semesters: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: string
            columns: string[]
            isOneToOne: boolean
            referencedRelation: string
            referencedColumns: string[]
          }
        ]
      }
      subjects: {
        Row: {
          id: string
          semester_id: number
          name: string
          code: string
          credits: number
          created_at: string
        }
        Insert: {
          id?: string
          semester_id: number
          name: string
          code: string
          credits: number
          created_at?: string
        }
        Update: {
          id?: string
          semester_id?: number
          name?: string
          code?: string
          credits?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: string
            columns: string[]
            isOneToOne: boolean
            referencedRelation: string
            referencedColumns: string[]
          }
        ]
      }
      units: {
        Row: {
          id: string
          subject_id: string
          name: string
          unit_number: number
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          name: string
          unit_number: number
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          name?: string
          unit_number?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: string
            columns: string[]
            isOneToOne: boolean
            referencedRelation: string
            referencedColumns: string[]
          }
        ]
      }
      files: {
        Row: {
          id: string
          unit_id: string
          subject_id: string
          name: string
          original_name: string
          size: number
          file_type: string
          path: string
          uploaded_by: string
          upload_date: string
          views: number
          downloads: number
          download_url?: string | null
          cloudinary_public_id?: string | null
        }
        Insert: {
          id?: string
          unit_id: string
          subject_id: string
          name: string
          original_name: string
          size: number
          file_type: string
          path: string
          uploaded_by: string
          upload_date?: string
          views?: number
          downloads?: number
          download_url?: string | null
          cloudinary_public_id?: string | null
        }
        Update: {
          id?: string
          unit_id?: string
          subject_id?: string
          name?: string
          original_name?: string
          size?: number
          file_type?: string
          path?: string
          uploaded_by?: string
          upload_date?: string
          views?: number
          downloads?: number
          download_url?: string | null
          cloudinary_public_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: string
            columns: string[]
            isOneToOne: boolean
            referencedRelation: string
            referencedColumns: string[]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'student' | 'teacher' | 'admin'
          department: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'student' | 'teacher' | 'admin'
          department?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'student' | 'teacher' | 'admin'
          department?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: string
            columns: string[]
            isOneToOne: boolean
            referencedRelation: string
            referencedColumns: string[]
          }
        ]
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          file_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: string
            columns: string[]
            isOneToOne: boolean
            referencedRelation: string
            referencedColumns: string[]
          }
        ]
      }
      downloads_log: {
        Row: {
          id: string
          user_id: string | null
          file_id: string
          downloaded_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          file_id: string
          downloaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          file_id?: string
          downloaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: string
            columns: string[]
            isOneToOne: boolean
            referencedRelation: string
            referencedColumns: string[]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
