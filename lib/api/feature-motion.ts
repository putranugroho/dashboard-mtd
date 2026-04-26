import { postJson } from "./client";

export async function saveFeatureMotion(payload: any) {
  return postJson("/setup_feature_motion", payload);
}