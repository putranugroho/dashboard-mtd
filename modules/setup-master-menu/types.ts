export type MasterMenuItem = {
  id: number;
  modul: string;
  menu: string;
  submenu: string;
  subsubmenu: string;
  urut: number;
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
  is_active: boolean;
  userlogin: string;
};