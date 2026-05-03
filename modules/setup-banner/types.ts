export type BannerScopeType = "GLOBAL" | "BPR";

export type BannerType = "IMAGE" | "VIDEO" | "TEXT" | "SPLASH";

export type BannerItem = {
  id: number;
  scope_type: BannerScopeType;
  bpr_id: string;
  banner_type: BannerType;
  title: string;
  description: string;
  image_file: string;
  image_url: string;
  video_file: string;
  video_url: string;
  text_content: string;
  urutan: number;
  is_active: boolean;
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
};

export type BannerFormValues = {
  scope_type: BannerScopeType;
  bpr_id: string;
  banner_type: BannerType;
  title: string;
  description: string;
  image_file: string;
  video_file: string;
  text_content: string;
  urutan: number;
  is_active: boolean;
};