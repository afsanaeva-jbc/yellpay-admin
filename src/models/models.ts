// src/models/models.ts

export interface IPaginatedResponse<T> {
  data: T;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: [
      {
        url: string | null;
        label: string;
        active: boolean;
      },
    ];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  filters: {
    role: null | string;
    search: null | string;
    sortBy: string;
    sortDesc: boolean;
    perPage: string;
  };
}

// MAIN AUTH INTERFACES (consolidated)
export interface Role {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  is_reserved: boolean;
}

export interface User {
  id: number;
  name: string;
  name_furigana: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  active_role: Role;
  roles: Role[];
  permissions: string[];
  schoolName?: string; // Added for compatibility
}

export interface AuthState {
  user: User | null;
  token: string | null;
  message: string | null;
  password_reset_token?: string | null;
  reset_message?: string | null;
  roles: Role[];
  grades: Grade[];
  users: User[];
  isAuthenticated: boolean; // Added for compatibility
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UserData {
  data: {
    id: number;
    name: string;
    name_furigana: string;
    email: string;
    phone: string | null;
    roles: Role[];
    avatar?: string | null;
    active_role: {
      id: number;
      name: string;
      display_name: string;
      is_reserved: boolean;
    };
  };
}

//Register Data
export interface RegisterData {
  name: string;
  name_furigana: string;
  email: string;
  phone: string | null;
  password: string;
  password_confirmation: string;
  error?: string;
  avatar?: File | null;
  roles: [];
}

export interface ViewUserData {
  id: number;
  name: string;
  name_furigana: string;
  email: string;
  phone: string | null;
  roles: Role[];
  avatar?: string | null;
  current_page?: number;
}

export interface SchoolAdminData {
  id: number;
  name: string;
  name_furigana: string;
  email: string;
  phone: string | null;
  roles: Role[];
  avatar?: string | File | null;
  current_page?: number;
}

export interface RoleData {
  id: number;
  name: string;
  display_name: string;
  is_reserved: boolean;
}

export interface RoleListData {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_reserved: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  validation?: object;
  required?: boolean;
}

export interface ForgotPasswordResponse {
  message: string;
  password_reset_token: string;
}

export interface ResetPasswordRequest {
  password_reset_token: string;
  verification_code: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
}

// Student Grade Teacher
export interface Teacher {
  id: number;
  name: string;
  name_furigana: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  active_role?: ActiveRole;
  roles?: Role[];
  permissions?: Record<string, unknown>;
}

export interface Grade {
  id: number;
  name: string;
  description: string;
  classroom: string;
  teacher: Teacher;
  grades?: [];
}

export interface Student {
  id: number;
  name: string;
  name_furigana: string;
  email: string;
  student_id: string;
  grade: Grade;
  grade_id: string | number;
  phone: string;
  guardian_contact: string;
  date_of_birth: string;
}

// Import Log
export interface ImportedBy {
  id: number;
  name: string;
  name_furigana: string;
  email: string;
  phone: string | null;
  avatar: string | null;
}

export interface RowData {
  name: string;
  role: string;
  email: string;
  phone: number | null;
  name_furigana: string;
}

export interface RowError {
  [field: string]: string[];
}

export interface Row {
  row_number: number;
  row: RowData;
  errors: RowError;
}

export interface ImportLogResult {
  batch_id: string;
  type: string;
  imported_by: ImportedBy;
  imported_at: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  rows: Row[];
  data: RowData[];
}

// Student Log
export interface StudentData {
  name: string;
  class: string;
  email: string;
  phone: number | string;
  student_id: string;
  date_of_birth: string | null;
  name_furigana: string;
  guardian_contact: number | string;
}

export interface ImportStudentLogResponse {
  batch_id: string;
  type: string;
  imported_by: ImportedBy;
  imported_at: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  rows: RowError[];
  data: StudentData[];
}

// Class
export interface ActiveRole {
  id: string;
  name: string;
  display_name: string;
  is_reserved: string;
}

export interface SubTeacher {
  id: number;
  name: string;
  name_furigana: string;
  email: string;
  phone: string;
  avatar: string;
  active_role: ActiveRole;
  roles: Role[];
  permissions: Record<string, unknown>;
}

export interface ClassData {
  id: number;
  name: string;
  teacher: Teacher;
  subteachers: SubTeacher[];
  description: string;
  classroom: string;
}

export interface ClassResponse {
  data: ClassData[];
  filters: string;
}

// Club
export interface ClubUser {
  id: number;
  name: string;
  name_furigana: string;
  email: string;
  phone: string;
  avatar: string;
  active_role: ActiveRole;
  roles: Role[];
  permissions: Record<string, unknown>;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  location: string;
  advisor: Teacher;
  subadvisors: SubTeacher[];
  members: ClubUser[];
}

export interface ClubResponse {
  data: Club[];
  filters: string;
}

// Workflow
export interface ApproverRole {
  id: number;
  name: string;
  display_name: string;
  description: string;
  is_reserved: boolean;
}

export interface WorkflowStepV2 {
  id: number;
  name: string;
  icon: string;
  approver_role: ApproverRole;
}

export interface WorkflowV2 {
  id: number;
  name: string;
  description: string;
  minimum_budget: number | null;
  maximum_budget: number | null;
  is_active: boolean;
  is_default: boolean;
  steps_count: number;
  steps: WorkflowStepV2[];
  created_at: string;
  updated_at: string;
  events_count: number;
}

export interface WorkflowStep {
  id: number;
  name: string;
  description: string | null;
  approver_role_id: Role | undefined; 
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  description: string | null;
  date: string;
  location: string | null;
  participants: number;
  budget: string;
  reception_number: string | null;
  note: string | null;
  status: string;
  progress: number;
  workflow: Omit<Workflow, "steps" | "events">; 
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: number;
  name: string;
  description: string | null;
  organizer_type: "administration" | "club" | "grade";
  minimum_budget: string;
  maximum_budget: string;
  steps_count: string;
  events_count: string;
  is_active: boolean;
  steps: WorkflowStep[];
  events: Event[];
  created_at: string;
  updated_at: string;
}