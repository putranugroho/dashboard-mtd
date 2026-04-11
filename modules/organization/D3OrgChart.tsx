// "use client";

// import { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import { orgD3 } from "./dummy";

// export default function D3OrgChart() {
//     const ref = useRef<HTMLDivElement>(null);

//     type OrgNode = {
//         name: string;
//         type: string;
//         children?: OrgNode[];
//     };

//     useEffect(() => {
//         if (!ref.current) return;

//         ref.current.innerHTML = "";

//         const width = 800;
//         const dx = 100;
//         const dy = 200;

//         const tree = d3.tree<OrgNode>().nodeSize([dx, dy]);

//         const root = d3.hierarchy<OrgNode>(orgD3);

//         tree(root);

//         const svg = d3
//             .select(ref.current)
//             .append("svg")
//             .attr("viewBox", [-dy / 2, -dx, width, dx * 6])
//             .style("font", "12px sans-serif");

//         // 🔥 LINK (GARIS)
//         svg
//             .append("g")
//             .selectAll("path")
//             .data(root.links())
//             .join("path")
//             .attr("fill", "none")
//             .attr("stroke", "#9ca3af")
//             .attr("stroke-width", 1.5)
//             .attr(
//                 "d",
//                 d3
//                     .linkVertical<any, any>()
//                     .x((d) => d.x)
//                     .y((d) => d.y)
//             )

//         // 🔥 NODE
//         const node = svg
//             .append("g")
//             .selectAll("g")
//             .data(root.descendants())
//             .join("g")
//             .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

//         // CARD
//         node
//             .append("rect")
//             .attr("x", -70)
//             .attr("y", -25)
//             .attr("width", 140)
//             .attr("height", 50)
//             .attr("rx", 10)
//             .attr("fill", "white")
//             .attr("stroke", "#e5e7eb")
//             .attr("stroke-width", 1.5);

//         // TEXT NAME
//         node
//             .append("text")
//             .attr("dy", "-0.2em")
//             .attr("text-anchor", "middle")
//             .attr("font-weight", "600")
//             .text((d: any) => d.data.name);

//         // TEXT TYPE
//         node
//             .append("text")
//             .attr("dy", "1.2em")
//             .attr("text-anchor", "middle")
//             .attr("fill", "#9ca3af")
//             .text((d: any) => d.data.type);

//     }, []);

//     return <div ref={ref} className="w-full h-full overflow-auto" />;
// }