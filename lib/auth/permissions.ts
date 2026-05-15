export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",

  SETUP_TCODE_VIEW: "setup_tcode.view",
  SETUP_TCODE_SAVE: "setup_tcode.save",

  SETUP_JURNAL_VIEW: "setup_jurnal.view",
  SETUP_JURNAL_SAVE: "setup_jurnal.save",
  SETUP_JURNAL_DELETE: "setup_jurnal.delete",

  DATA_BPR_VIEW: "data_bpr.view",
  DATA_BPR_SAVE: "data_bpr.save",
  DATA_BPR_RELASI: "data_bpr.relasi",

  SETUP_MERCHANT_VIEW: "setup_merchant.view",
  SETUP_MERCHANT_SAVE: "setup_merchant.save",
  SETUP_MERCHANT_DELETE: "setup_merchant.delete",

  SETUP_JOURNAL_ACCOUNTING_VIEW: "setup_journal_accounting.view",
  SETUP_JOURNAL_ACCOUNTING_SAVE: "setup_journal_accounting.save",
  SETUP_JOURNAL_ACCOUNTING_DELETE: "setup_journal_accounting.delete",

  SETUP_RELASI_REKONSILIASI_VIEW: "setup_relasi_rekonsiliasi.view",
  SETUP_RELASI_REKONSILIASI_SAVE: "setup_relasi_rekonsiliasi.save",
  SETUP_RELASI_REKONSILIASI_DELETE: "setup_relasi_rekonsiliasi.delete",
  SETUP_RELASI_REKONSILIASI_RELASI: "setup_relasi_rekonsiliasi.relasi",

  SETUP_USER_VIEW: "setup_user.view",
  SETUP_USER_SAVE: "setup_user.save",
  SETUP_USER_DELETE: "setup_user.delete",
  SETUP_USER_RESET_PASSWORD: "setup_user.reset_password",
  SETUP_USER_UNLOCK: "setup_user.unlock",
  SETUP_USER_MANAGE_ACCESS: "setup_user.manage_access",

  SETUP_BANNER_VIEW: "setup_banner.view",
  SETUP_BANNER_SAVE: "setup_banner.save",
  SETUP_BANNER_DELETE: "setup_banner.delete",
  SETUP_BANNER_PREVIEW: "setup_banner.preview",
  SETUP_BANNER_ACTIVATE: "setup_banner.activate",

  SETUP_MASTER_MENU_VIEW: "setup_master_menu.view",
  SETUP_MASTER_MENU_SAVE: "setup_master_menu.save",
  SETUP_MASTER_MENU_DELETE: "setup_master_menu.delete",

  SETUP_FEE_VIEW: "setup_fee.view",
  SETUP_FEE_SAVE: "setup_fee.save",
  SETUP_FEE_DELETE: "setup_fee.delete",

  SALDO_REKENING_MTD_VIEW: "saldo_rekening_mtd.view",
  SALDO_REKENING_MTD_SEARCH: "saldo_rekening_mtd.search",
  SALDO_REKENING_MTD_DETAIL: "saldo_rekening_mtd.detail",
  SALDO_REKENING_MTD_EXPORT: "saldo_rekening_mtd.export",
  SALDO_REKENING_MTD_REFRESH_BPR: "saldo_rekening_mtd.refresh_bpr",
  SALDO_REKENING_MTD_REFRESH_ALL: "saldo_rekening_mtd.refresh_all",

  REKONSILIASI_SALDO_BPR_VIEW: "rekonsiliasi_saldo_bpr.view",
  REKONSILIASI_SALDO_BPR_SEARCH: "rekonsiliasi_saldo_bpr.search",
  REKONSILIASI_SALDO_BPR_DETAIL: "rekonsiliasi_saldo_bpr.detail",
  REKONSILIASI_SALDO_BPR_EXPORT: "rekonsiliasi_saldo_bpr.export",

  REKONSILIASI_SALDO_MTN_VIEW: "rekonsiliasi_saldo_mtn.view",
  REKONSILIASI_SALDO_MTN_SEARCH: "rekonsiliasi_saldo_mtn.search",
  REKONSILIASI_SALDO_MTN_DETAIL: "rekonsiliasi_saldo_mtn.detail",
  REKONSILIASI_SALDO_MTN_EXPORT: "rekonsiliasi_saldo_mtn.export",

  MONITORING_GATEWAY_BPR_VIEW: "monitoring_gateway_bpr.view",
  MONITORING_GATEWAY_BPR_CHECK: "monitoring_gateway_bpr.check",
  MONITORING_GATEWAY_BPR_DETAIL: "monitoring_gateway_bpr.detail",

  MONITORING_USER_ACCOUNT_VIEW: "monitoring_user_account.view",
  MONITORING_USER_ACCOUNT_SEARCH: "monitoring_user_account.search",
  MONITORING_USER_ACCOUNT_EXPORT: "monitoring_user_account.export",

  MONITORING_AKUN_IBPR_VIEW: "monitoring_akun_ibpr.view",
  MONITORING_AKUN_IBPR_SEARCH: "monitoring_akun_ibpr.search",
  MONITORING_AKUN_IBPR_EXPORT: "monitoring_akun_ibpr.export",

  SIGNIN_SIGNOFF_VIEW: "signin_signoff.view",
  SIGNIN_SIGNOFF_SIGN: "signin_signoff.sign",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export function hasPermission(
  permissions: string[] = [],
  permission?: string,
  isSuperAdmin = false
) {
  if (!permission) return true;
  if (isSuperAdmin) return true;
  return permissions.includes(permission);
}
