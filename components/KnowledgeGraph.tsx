
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphData, Node, Link } from '../types';

interface KnowledgeGraphProps {
  data: GraphData;
  onNodeClick: (node: Node) => void;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const simulation = d3.forceSimulation<Node>(data.nodes as any)
      .force("link", d3.forceLink<Node, Link>(data.links as any).id((d: any) => d.id).distance(180))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(70));

    const defs = svg.append("defs");
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#6366f1")
      .style("opacity", 0.3);

    const link = g.append("g")
      .selectAll("path")
      .data(data.links)
      .join("path")
      .attr("stroke", "#8b5cf6")
      .attr("stroke-opacity", 0.3)
      .attr("stroke-width", d => Math.sqrt(d.value) + 1.5)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrowhead)");

    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("class", "node-group")
      .style("cursor", "pointer")
      .on("click", (event, d) => onNodeClick(d))
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.on("mouseenter", function() {
      d3.select(this).select(".main-circle")
        .transition().duration(200)
        .attr("r", 20)
        .attr("stroke", "#8b5cf6")
        .attr("stroke-width", 3);
      d3.select(this).select(".node-label")
        .transition().duration(200)
        .style("font-weight", "900")
        .style("fill", "#fff")
        .attr("font-size", "14px");
    }).on("mouseleave", function() {
      d3.select(this).select(".main-circle")
        .transition().duration(200)
        .attr("r", 15)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);
      d3.select(this).select(".node-label")
        .transition().duration(200)
        .style("font-weight", "600")
        .style("fill", "#94a3b8")
        .attr("font-size", "11px");
    });

    node.each(function(d) {
      const el = d3.select(this);
      
      if (d.status === 'in-progress') {
        el.append("circle")
          .attr("r", 24)
          .attr("fill", "none")
          .attr("stroke", "#bef264")
          .attr("stroke-width", 1.5)
          .attr("stroke-dasharray", "4, 2");
      } else if (d.status === 'completed') {
        el.append("circle")
          .attr("r", 22)
          .attr("fill", "none")
          .attr("stroke", "#10b981")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "2, 4");
      }

      el.append("circle")
        .attr("class", "main-circle")
        .attr("r", 15)
        .attr("fill", () => {
          if (d.status === 'completed') return '#10b981';
          if (d.status === 'in-progress') return '#f59e0b';
          return '#0f172a';
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

      if (d.status === 'completed') {
        el.append("path")
          .attr("d", "M-4,0 L-1,3 L4,-4")
          .attr("stroke", "white")
          .attr("stroke-width", 2.5)
          .attr("fill", "none")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round");
      } else if (d.status === 'in-progress') {
        el.append("path")
          .attr("d", "M-2,-3 L3,0 L-2,3 Z")
          .attr("fill", "white");
      } else {
        el.append("circle")
          .attr("r", 3)
          .attr("fill", "#8b5cf6");
      }

      el.append("text")
        .attr("class", "node-label")
        .text(d.label)
        .attr("dy", 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("font-weight", "600")
        .attr("fill", "#94a3b8")
        .attr("text-transform", "uppercase")
        .style("letter-spacing", "0.1em");

      if (d.importance && d.importance > 1.5) {
        el.append("text")
          .text("!")
          .attr("dx", 15)
          .attr("dy", -15)
          .attr("font-size", "14px")
          .attr("font-weight", "900")
          .attr("fill", "#ec4899");
      }
    });

    simulation.on("tick", () => {
      link.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [data, onNodeClick]);

  return (
    <div className="w-full h-full frosted-obsidian rounded-[3rem] shadow-xl border border-white/5 overflow-hidden relative group">
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-500 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
            Process Monitor
        </h4>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Processed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active</span>
          </div>
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default KnowledgeGraph;
