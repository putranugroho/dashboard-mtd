import type {
  DashboardUser,
  DashboardUserAccessItem,
  SetupUserFormState,
} from "./types";
import { emptyUserForm } from "./constants";

export function toBool(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

export function normalizeUserToForm(user: DashboardUser): SetupUserFormState {
  return {
    id: user.id,
    username: user.username,
    password: "",
    full_name: user.full_name,
    email: user.email || "",
    phone: user.phone || "",
    role_name: user.role_name || "",
    is_super_admin: Boolean(user.is_super_admin),
    is_active: user.is_active !== false,
  };
}

export function createEmptyUserForm(): SetupUserFormState {
  return { ...emptyUserForm };
}

export function groupAccessItems(access: DashboardUserAccessItem[]) {
  const groups = new Map<string, DashboardUserAccessItem[]>();

  for (const item of access) {
    const key = `${item.menu}::${item.submenu}::${item.menu_code}`;
    const current = groups.get(key) ?? [];
    current.push(item);
    groups.set(key, current);
  }

  return Array.from(groups.entries()).map(([key, items]) => {
    const [menu, submenu, menuCode] = key.split("::");

    return {
      key,
      menu,
      submenu,
      menuCode,
      items: items.sort((a, b) => a.action_code.localeCompare(b.action_code)),
    };
  });
}

export function isUserLocked(user: DashboardUser) {
  return toBool(user.is_locked);
}

export function isUserActive(user: DashboardUser) {
  return user.is_active !== false;
}