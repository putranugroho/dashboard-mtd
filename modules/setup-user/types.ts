import type {
  DashboardUser,
  DashboardUserFormValues,
} from "@/lib/api/dashboard-user";

export type { DashboardUser, DashboardUserFormValues };

export type SetupUserViewMode = "list" | "create" | "edit" | "access";

export type SetupUserFormState = DashboardUserFormValues & {
  id?: number;
};

export type AccessGroup = {
  key: string;
  menu: string;
  submenu: string;
  menuCode: string;
  items: DashboardUserAccessItem[];
};

export type DashboardUserAccessItem = {
  id?: number;
  facility_id?: number;
  modul: string;
  menu: string;
  submenu: string;
  subsubmenu?: string;
  menu_code: string;
  action_code: string;
  permission_code: string;
  route_path?: string;
  is_menu?: boolean;
  is_active?: boolean;
  flag?: boolean | string;
};