export const orgDummy = [
    {
        id: 1,
        name: "PT SUSAN GROUP",
        type: "holding",
        children: [
            {
                id: 2,
                name: "PT Kebun Sawit",
                type: "company",
                children: [
                    {
                        id: 3,
                        name: "Divisi Produksi",
                        type: "division",
                        children: [
                            {
                                id: 4,
                                name: "Unit Panen A",
                                type: "unit",
                            },
                            {
                                id: 5,
                                name: "Unit Panen B",
                                type: "unit",
                            },
                        ],
                    },
                    {
                        id: 6,
                        name: "Divisi Maintenance",
                        type: "division",
                        children: [
                            {
                                id: 7,
                                name: "Unit Workshop",
                                type: "unit",
                            },
                        ],
                    },
                ],
            },
            {
                id: 8,
                name: "PT Pabrik Sawit",
                type: "company",
                children: [
                    {
                        id: 9,
                        name: "Divisi Produksi Pabrik",
                        type: "division",
                    },
                ],
            },
        ],
    },
];