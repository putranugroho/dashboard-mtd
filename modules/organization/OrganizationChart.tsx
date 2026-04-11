"use client";

import dagre from "dagre";
import ReactFlow, {
    Background,
    Controls,
} from "reactflow";
import "reactflow/dist/style.css";

import { orgDummy } from "./dummy";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 70;

const getLayoutedElements = (nodes: any[], edges: any[]) => {
    dagreGraph.setGraph({
        rankdir: "TB",
        nodesep: 80,
        ranksep: 120,
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
            width: nodeWidth,
            height: nodeHeight,
        });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
        const pos = dagreGraph.node(node.id);

        return {
            ...node,
            position: {
                x: pos.x - nodeWidth / 2,
                y: pos.y - nodeHeight / 2,
            },
        };
    });
};

export default function OrganizationChart({ onSelect }: any) {

    const nodes: any[] = [];
    const edges: any[] = [];

    const traverse = (node: any, parent: any = null) => {
        nodes.push({
            id: String(node.id),
            data: node,
        });

        if (parent) {
            edges.push({
                id: `${parent.id}-${node.id}`,
                source: String(parent.id),
                target: String(node.id),
                type: "smoothstep", // 🔥 biar rapi
            });
        }

        node.children?.forEach((child: any) =>
            traverse(child, node)
        );
    };

    orgDummy.forEach((root) => traverse(root));

    // 🔥 APPLY DAGRE
    const layoutedNodes = getLayoutedElements(nodes, edges);

    return (
        <ReactFlow
            nodes={layoutedNodes.map((n) => ({
                ...n,
                type: "default",
                data: {
                    ...n.data,
                    label: (
                        <div
                            onClick={() => onSelect(n.data)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-green-500 transition text-center"
                        >
                            <div className="font-semibold text-sm">
                                {n.data.name}
                            </div>
                            <div className="text-xs text-gray-400">
                                {n.data.type}
                            </div>
                        </div>
                    ),
                },
            }))}
            edges={edges}
            fitView
        >
            <Background gap={20} size={1} color="#e5e7eb" />
            <Controls />
        </ReactFlow>
    );
}