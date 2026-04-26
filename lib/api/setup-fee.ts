import { postJson } from "./client";



export type TransferOut = {
    id?: number;
    bpr_id: string;
    biaya_transfer: number;
    fee_mtd: number;
    fee_bpr: number;
    markup_bpr: number;
};

export type FeatureMotion = {
    is_inquiry_allowed: boolean;
    is_transaction_allowed: boolean;
};

export type PPOB = {
    id?: number;
    bpr_id: string;
    fee_mtd: number;
    fee_bpr: number;
    markup_bpr: number;
};

export type MTN = {
    id?: number;
    fee_ppob: number;
    fee_transfer_out: number;
    fee_qris: number;
    fee_transfer_in: number;
};

export type SetupFeeData = {
    transfer_out: TransferOut[] | null;
    ppob: PPOB[] | null;
    mtn: MTN[] | null;
    feature_motion?: FeatureMotion;
};

type ApiResponse<T> = {
    code: string;
    status?: string;
    message?: string;
    data: T;
};



export async function getSetupFee(bpr_id: string) {
    const res = await postJson<ApiResponse<SetupFeeData>>(
        "/setup_fee_inquiry",
        {
            type: "all",
            bpr_id,
        }
    );


    return {
        transfer_out: res.data?.transfer_out ?? [],
        ppob: res.data?.ppob ?? [],
        mtn: res.data?.mtn ?? [],
        feature_motion: res.data?.feature_motion,
    };
}



export async function saveSetupFee(payload: {
    bpr_id: string;
    transfer_out: TransferOut[];
    ppob: PPOB[];
    mtn: MTN[];
    userlogin?: string;
}) {
    return postJson<ApiResponse<null>>("/setup_fee", {
        action: "insert",
        userlogin: payload.userlogin || "admin",
        data_transfer_out: payload.transfer_out,
        data_ppob: payload.ppob,
        data_mtn: payload.mtn,
    });
}



export async function deleteSetupFee(
    bpr_id: string,
    userlogin: string = "admin"
) {
    return postJson<ApiResponse<null>>("/setup_fee", {
        action: "delete",
        userlogin,
        data_transfer_out: [{ bpr_id }],
        data_ppob: [{ bpr_id }],
        data_mtn: [],
    });
}


export function getDefaultSetupFee(bpr_id: string) {
    return {
        transfer_out: [
            {
                bpr_id,
                biaya_transfer: 0,
                fee_mtd: 0,
                fee_bpr: 0,
                markup_bpr: 0,
            },
        ],
        ppob: [
            {
                bpr_id,
                fee_mtd: 0,
                fee_bpr: 0,
            },
        ],
        mtn: [
            {
                fee_ppob: 0,
                fee_transfer_out: 0,
                fee_qris: 0,
                fee_transfer_in: 0,
            },
        ],
    };
}