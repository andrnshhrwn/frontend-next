import type {
  User,
  UserRole,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/services/userService";
import type { Unit } from "@/services/unitService";

export type { User, UserRole, CreateUserPayload, UpdateUserPayload, Unit };

export type UserTab = "user" | "role";

export type RoleFilter = UserRole | "all";

export type Access = "all" | "unit" | "own" | "none";

export type UserSavePayload = CreateUserPayload | UpdateUserPayload;

export interface UserRoleCounts {
  admin_pusat: number;
  admin_cabang: number;
  teknisi: number;
}

export interface PermissionRow {
  fitur: string;
  pusat: Access;
  cabang: Access;
  teknisi: Access;
}
