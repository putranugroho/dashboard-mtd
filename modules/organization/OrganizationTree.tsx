"use client";

import { orgDummy } from "./dummy";
import OrganizationNode from "./OrganizationNode";

export default function OrganizationTree({ onSelect }: any) {
    return (
        <div>
            {orgDummy.map((item) => (
                <OrganizationNode
                    key={item.id}
                    node={item}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}