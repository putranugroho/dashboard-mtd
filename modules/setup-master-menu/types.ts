export type MasterMenuItem = {
  id: number;
  modul: string;
  menu: string;
  submenu: string;
  subsubmenu: string;

  urut: number;
  modul_urut: number;
  menu_urut: number;
  submenu_urut: number;
  subsubmenu_urut: number;

  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
};

export type MasterMenuFormValues = {
  modul: string;
  menu: string;
  submenu: string;
  subsubmenu: string;

  urut: number;
  modul_urut: number;
  menu_urut: number;
  submenu_urut: number;
  subsubmenu_urut: number;

  is_active: boolean;
  userlogin: string;
};

export type MasterMenuModuleOption = {
  modul: string;
  modul_urut: number;
};

export type MasterMenuMenuOption = {
  menu: string;
  menu_urut: number;
};

export type MasterMenuSubmenuOption = {
  submenu: string;
  submenu_urut: number;
};