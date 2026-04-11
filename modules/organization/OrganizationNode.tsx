"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Building2 } from "lucide-react";

export default function OrganizationNode({ node, onSelect }: any) {
    const [open, setOpen] = useState(true);

    return (
        <div className="ml-4">

            <div
                onClick={() => onSelect(node)}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-green-50 cursor-pointer border border-transparent hover:border-green-200"
            >
                {node.children?.length > 0 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(!open);
                        }}
                    >
                        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                )}

                <Building2 size={14} className="text-green-600" />

                <span className="font-medium">{node.name}</span>

                <span className="text-xs text-gray-400">
                    ({node.type})
                </span>
            </div>

            {open &&
                node.children?.map((child: any) => (
                    <OrganizationNode
                        key={child.id}
                        node={child}
                        onSelect={onSelect}
                    />
                ))}
        </div>
    );
}