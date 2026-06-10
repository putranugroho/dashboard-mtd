"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Handle,
  MarkerType,
  Node,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { ChevronRight, GripVertical, LayoutGrid, Plus, RefreshCcw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getAllFlows,
  getAvailablePGs,
  saveFlow,
  AvailablePG,
  FlowByTcode,
  FlowPG,
} from "@/lib/api/flow-transaksi";

// ─── Custom Nodes ──────────────────────────────────────────────────────────

function TcodeNode({ data }: { data: { tcode: string; keterangan: string; count: number; focused?: boolean } }) {
  return (
    <div
      className={`min-w-[210px] rounded-2xl border-2 px-5 py-4 text-white shadow-xl transition-all duration-300 ${
        data.focused
          ? "border-blue-200 bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-300/50 shadow-2xl"
          : "border-blue-400 bg-gradient-to-br from-blue-600 to-blue-800"
      }`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-widest opacity-60">TCode</div>
      <div className="text-[28px] font-extrabold leading-tight">{data.tcode}</div>
      <div className="mt-0.5 text-sm opacity-90">{data.keterangan}</div>
      {data.count > 0 && (
        <div className="mt-2 text-xs opacity-50">{data.count} Payment Gateway</div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-blue-300 !border-blue-200" />
    </div>
  );
}

function PgNode({ data }: { data: { pgNama: string; pgKode: string; priority: number; globalFlatFee: number; isActive: boolean } }) {
  const isPrimary = data.priority === 1;
  const colorClass = isPrimary
    ? "border-green-400 bg-gradient-to-br from-green-50 to-white"
    : data.priority === 2
    ? "border-amber-400 bg-gradient-to-br from-amber-50 to-white"
    : "border-gray-300 bg-white";
  const badgeClass = isPrimary
    ? "bg-green-100 text-green-700"
    : data.priority === 2
    ? "bg-amber-100 text-amber-700"
    : "bg-gray-100 text-gray-600";
  const label = isPrimary ? "PRIMARY" : `BACKUP ${data.priority - 1}`;
  return (
    <div className={`min-w-[170px] rounded-xl border-2 px-4 py-3 shadow-md ${colorClass}`}>
      <Handle type="target" position={Position.Top} className="!bg-blue-300 !border-blue-200" />
      <div className="flex items-center justify-between mb-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}>{label}</span>
        <span className="text-xs font-bold text-gray-400">#{data.priority}</span>
      </div>
      <div className="font-semibold text-sm text-gray-800">{data.pgNama}</div>
      <div className="font-mono text-xs text-gray-400">{data.pgKode}</div>
      {data.globalFlatFee > 0 && (
        <div className="mt-1 text-xs text-amber-600">+ Flat Rp {data.globalFlatFee.toLocaleString("id-ID")}</div>
      )}
      {!data.isActive && <div className="mt-1 text-xs text-red-500 font-medium">NONAKTIF</div>}
    </div>
  );
}

const nodeTypes = { tcodeNode: TcodeNode, pgNode: PgNode };

// ─── Graph builders ────────────────────────────────────────────────────────

const NODE_W = 210;
const NODE_H = 100;

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", ranksep: 110, nodesep: 70 });
  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  return nodes.map((n) => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
  });
}

function makeEdge(tcId: string, pgId: string, priority: number): Edge {
  return {
    id: `e_${tcId}_${pgId}`,
    source: tcId,
    target: pgId,
    animated: priority === 1,
    label: priority === 1 ? "Primary" : `Backup ${priority - 1}`,
    labelStyle: { fontSize: 10, fill: priority === 1 ? "#16a34a" : "#b45309" },
    style: {
      strokeWidth: priority === 1 ? 2.5 : 1.5,
      stroke: priority === 1 ? "#22c55e" : priority === 2 ? "#f59e0b" : "#9ca3af",
      strokeDasharray: priority > 1 ? "5 3" : undefined,
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: priority === 1 ? "#22c55e" : "#9ca3af" },
  };
}

function buildAll(flows: FlowByTcode[]): { nodes: Node[]; edges: Edge[] } {
  const rawNodes: Node[] = [];
  const rawEdges: Edge[] = [];
  flows.forEach((tc) => {
    const tcId = `tc_${tc.tcode_id}`;
    rawNodes.push({
      id: tcId, type: "tcodeNode", position: { x: 0, y: 0 },
      data: { tcode: tc.tcode, keterangan: tc.tcode_keterangan, count: tc.flows.length, focused: false },
      draggable: false,
    });
    tc.flows.forEach((f) => {
      const pgId = `pg_${tc.tcode_id}_${f.pg_id}`;
      rawNodes.push({
        id: pgId, type: "pgNode", position: { x: 0, y: 0 },
        data: { pgNama: f.pg_nama, pgKode: f.pg_kode, priority: f.priority, globalFlatFee: f.global_flat_fee, isActive: f.is_active },
        draggable: false,
      });
      rawEdges.push(makeEdge(tcId, pgId, f.priority));
    });
  });
  return { nodes: applyDagreLayout(rawNodes, rawEdges), edges: rawEdges };
}

function buildForTcode(flows: FlowByTcode[], tcodeId: number): { nodes: Node[]; edges: Edge[] } {
  const tc = flows.find((t) => t.tcode_id === tcodeId);
  if (!tc) return { nodes: [], edges: [] };
  const tcId = `tc_${tc.tcode_id}`;
  const rawNodes: Node[] = [{
    id: tcId, type: "tcodeNode", position: { x: 0, y: 0 },
    data: { tcode: tc.tcode, keterangan: tc.tcode_keterangan, count: tc.flows.length, focused: true },
    draggable: false,
  }];
  const rawEdges: Edge[] = [];
  tc.flows.forEach((f) => {
    const pgId = `pg_${tc.tcode_id}_${f.pg_id}`;
    rawNodes.push({
      id: pgId, type: "pgNode", position: { x: 0, y: 0 },
      data: { pgNama: f.pg_nama, pgKode: f.pg_kode, priority: f.priority, globalFlatFee: f.global_flat_fee, isActive: f.is_active },
      draggable: false,
    });
    rawEdges.push(makeEdge(tcId, pgId, f.priority));
  });
  return { nodes: applyDagreLayout(rawNodes, rawEdges), edges: rawEdges };
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function SetupFlowTransaksiPage() {
  const [allFlows, setAllFlows] = useState<FlowByTcode[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editList, setEditList] = useState<FlowPG[]>([]);
  const [availPGs, setAvailPGs] = useState<AvailablePG[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rfInstanceRef = useRef<any>(null);
  const dragIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);
  const [, forceRender] = useState(0);

  // ── fitView whenever nodes change ─────────────────────────────────────────
  useEffect(() => {
    if (!rfInstanceRef.current || nodes.length === 0) return;
    const t = setTimeout(() => {
      rfInstanceRef.current.fitView({ duration: 650, padding: selectedId !== null ? 0.4 : 0.15 });
    }, 60);
    return () => clearTimeout(t);
  }, [nodes, selectedId]);

  // ── Load ──────────────────────────────────────────────────────────────────
  async function load() {
    try {
      setLoading(true);
      const data = await getAllFlows();
      setAllFlows(data);
      setSelectedId(null);
      setEditList([]);
      setHasChanges(false);
      const { nodes: n, edges: e } = buildAll(data);
      setNodes(n);
      setEdges(e);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  // ── Select TCode ──────────────────────────────────────────────────────────
  function selectTcode(tcodeId: number, overrideData?: FlowByTcode[]) {
    const source = overrideData ?? allFlows;

    if (!overrideData && selectedId === tcodeId) {
      // Toggle off → show all
      setSelectedId(null);
      setEditList([]);
      setHasChanges(false);
      setShowAdd(false);
      const { nodes: n, edges: e } = buildAll(source);
      setNodes(n);
      setEdges(e);
      return;
    }

    const found = source.find((t) => t.tcode_id === tcodeId);
    setSelectedId(tcodeId);
    setEditList(found ? [...found.flows].sort((a, b) => a.priority - b.priority) : []);
    setHasChanges(false);
    setShowAdd(false);
    const { nodes: n, edges: e } = buildForTcode(source, tcodeId);
    setNodes(n);
    setEdges(e);
  }

  // ── Available PGs ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedId) return;
    getAvailablePGs(selectedId).then(setAvailPGs).catch(() => setAvailPGs([]));
  }, [selectedId, editList]);

  // ── DnD ───────────────────────────────────────────────────────────────────
  function onDragStart(e: React.DragEvent, idx: number) {
    dragIdx.current = idx;
    e.dataTransfer.effectAllowed = "move";
  }
  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    dragOverIdx.current = idx;
    forceRender((n) => n + 1);
  }
  function onDrop(toIdx: number) {
    const from = dragIdx.current;
    if (from === null || from === toIdx) { dragIdx.current = null; dragOverIdx.current = null; return; }
    const next = [...editList];
    const [moved] = next.splice(from, 1);
    next.splice(toIdx, 0, moved);
    setEditList(next.map((f, i) => ({ ...f, priority: i + 1 })));
    setHasChanges(true);
    dragIdx.current = null;
    dragOverIdx.current = null;
    forceRender((n) => n + 1);
  }

  function handleRemove(pgId: number) {
    setEditList(editList.filter((f) => f.pg_id !== pgId).map((f, i) => ({ ...f, priority: i + 1 })));
    setHasChanges(true);
  }

  function handleAddPG(pg: AvailablePG) {
    setEditList([...editList, {
      id: 0, pg_id: pg.id, pg_kode: pg.kode, pg_nama: pg.nama,
      global_flat_fee: pg.global_flat_fee, priority: editList.length + 1, is_active: true,
    }]);
    setHasChanges(true);
    setShowAdd(false);
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!selectedId) return;
    try {
      setSaving(true);
      await saveFlow(selectedId, editList.map((f) => ({ pg_id: f.pg_id, priority: f.priority })));
      toast.success("Flow transaksi berhasil disimpan");
      const data = await getAllFlows();
      setAllFlows(data);
      const found = data.find((t) => t.tcode_id === selectedId);
      setEditList(found ? [...found.flows].sort((a, b) => a.priority - b.priority) : []);
      const { nodes: n, edges: e } = buildForTcode(data, selectedId);
      setNodes(n);
      setEdges(e);
      setHasChanges(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  const selectedTcode = useMemo(() => allFlows.find((t) => t.tcode_id === selectedId), [allFlows, selectedId]);

  const priorityLabel = (p: number) => (p === 1 ? "PRIMARY" : `BACKUP ${p - 1}`);
  const priorityColor = (p: number) =>
    p === 1 ? "bg-green-100 text-green-700 border-green-200" :
    p === 2 ? "bg-amber-100 text-amber-700 border-amber-200" :
    "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* HEADER */}
      <div className="shrink-0 rounded-2xl border bg-white p-5 shadow-sm mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Setup Flow Transaksi</h1>
            <p className="text-sm text-gray-500 mt-1">
              Atur urutan Payment Gateway per TCode. Drag &amp; drop untuk mengubah prioritas.
              PG pertama = Primary, selanjutnya = Backup berurutan.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {selectedId !== null && (
              <Button variant="outline" onClick={() => selectTcode(selectedId)} className="h-9">
                <LayoutGrid className="mr-2 size-4" /> Lihat Semua
              </Button>
            )}
            <Button variant="outline" onClick={() => void load()} disabled={loading} className="h-9">
              <RefreshCcw className="mr-2 size-4" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-4 min-h-0">
        {/* ─── LEFT ─────────────────────────────────────────────────────── */}
        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto">
          {/* TCode list */}
          <div className="rounded-2xl border bg-white shadow-sm p-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-2 mb-2">Pilih TCode</p>
            <div className="space-y-1">
              {allFlows.map((tc) => (
                <button
                  key={tc.tcode_id}
                  onClick={() => selectTcode(tc.tcode_id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all text-sm ${
                    selectedId === tc.tcode_id
                      ? "bg-blue-50 border border-blue-200 text-blue-700 shadow-sm"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div>
                    <span className="font-bold font-mono">{tc.tcode}</span>
                    <span className="ml-2 text-gray-500 text-xs">{tc.tcode_keterangan}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {tc.flows.length > 0 ? (
                      <span className="rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5">
                        {tc.flows.length} PG
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 text-gray-400 text-[10px] px-2 py-0.5">kosong</span>
                    )}
                    <ChevronRight className={`size-3.5 transition-transform ${selectedId === tc.tcode_id ? "rotate-90 text-blue-500" : "text-gray-400"}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Edit Panel */}
          {selectedTcode ? (
            <div className="rounded-2xl border bg-white shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{selectedTcode.tcode_keterangan}</div>
                  <div className="font-mono text-xs text-gray-400">{selectedTcode.tcode}</div>
                </div>
                {hasChanges && (
                  <Button size="sm" onClick={() => void handleSave()} disabled={saving}
                    className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700">
                    <Save className="mr-1 size-3" />
                    {saving ? "..." : "Simpan"}
                  </Button>
                )}
              </div>

              <div className="space-y-1.5">
                {editList.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-200 py-6 text-center text-xs text-gray-400">
                    Belum ada PG. Tambah PG di bawah.
                  </div>
                ) : (
                  editList.map((f, idx) => (
                    <div
                      key={f.pg_id}
                      draggable
                      onDragStart={(e) => onDragStart(e, idx)}
                      onDragOver={(e) => onDragOver(e, idx)}
                      onDrop={() => onDrop(idx)}
                      onDragLeave={() => { dragOverIdx.current = null; forceRender((n) => n + 1); }}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 bg-white transition-all cursor-grab active:cursor-grabbing ${
                        dragOverIdx.current === idx ? "border-blue-400 shadow-md scale-[1.01]" : "border-gray-200"
                      } ${
                        f.priority === 1 ? "border-l-4 border-l-green-400" :
                        f.priority === 2 ? "border-l-4 border-l-amber-400" :
                        "border-l-4 border-l-gray-300"
                      }`}
                    >
                      <GripVertical className="size-4 text-gray-300 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className={`rounded-full border px-1.5 py-0 text-[9px] font-bold uppercase ${priorityColor(f.priority)}`}>
                          {priorityLabel(f.priority)}
                        </span>
                        <div className="font-medium text-xs text-gray-800 mt-0.5 truncate">{f.pg_nama}</div>
                        <div className="font-mono text-[10px] text-gray-400">{f.pg_kode}</div>
                      </div>
                      <button onClick={() => handleRemove(f.pg_id)}
                        className="shrink-0 rounded-lg p-1 text-red-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {!showAdd ? (
                <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}
                  disabled={availPGs.length === 0} className="w-full h-8 text-xs border-dashed">
                  <Plus className="mr-1 size-3.5" />
                  {availPGs.length === 0 ? "Semua PG sudah ditambahkan" : `Tambah PG (${availPGs.length} tersedia)`}
                </Button>
              ) : (
                <div className="rounded-xl border bg-gray-50 p-2 space-y-1">
                  <p className="text-[10px] text-gray-400 font-medium">Pilih PG (sudah ada fee setup):</p>
                  {availPGs.map((pg) => (
                    <button key={pg.id} onClick={() => handleAddPG(pg)}
                      className="w-full rounded-lg border bg-white px-3 py-2 text-left text-xs hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <div className="font-semibold text-gray-800">{pg.nama}</div>
                      <div className="font-mono text-[10px] text-gray-400">{pg.kode}</div>
                    </button>
                  ))}
                  <button onClick={() => setShowAdd(false)}
                    className="w-full text-center text-[10px] text-gray-400 py-1 hover:text-gray-600">Batal</button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-xs text-gray-400">
              Klik TCode di atas untuk fokus dan edit flow-nya
            </div>
          )}
        </div>

        {/* ─── RIGHT: ReactFlow Canvas ──────────────────────────────────── */}
        <div className="flex-1 rounded-2xl border bg-white shadow-sm overflow-hidden relative">
          {loading ? (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">Memuat flow...</div>
          ) : (
            <>
              {/* Focused badge */}
              {selectedId !== null && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/90 backdrop-blur-sm px-3 py-1.5 shadow-sm">
                  <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-semibold text-blue-700">
                    {allFlows.find((t) => t.tcode_id === selectedId)?.tcode}
                    {" · "}
                    {allFlows.find((t) => t.tcode_id === selectedId)?.tcode_keterangan}
                  </span>
                </div>
              )}

              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onInit={(instance) => { rfInstanceRef.current = instance; }}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.2}
                maxZoom={2.5}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="#e5e7eb" gap={20} size={1} />
                <Controls className="!shadow-sm !border !border-gray-200 !rounded-xl" />
              </ReactFlow>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
