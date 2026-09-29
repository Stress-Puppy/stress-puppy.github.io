"use strict";

// Synthetic example data: this demonstrates projected-window connectivity,
// not temporal reachability or the paper's index implementation.
const vertices = [
  {id:"A",x:93,y:215},{id:"B",x:170,y:101},{id:"C",x:294,y:164},
  {id:"D",x:200,y:304},{id:"E",x:387,y:76},{id:"F",x:434,y:222},
  {id:"G",x:348,y:333},{id:"H",x:528,y:128},{id:"I",x:515,y:319}
];
const events = [
  {u:"A",v:"B",t:4},{u:"A",v:"D",t:2},{u:"B",v:"C",t:5},
  {u:"B",v:"E",t:1},{u:"C",v:"D",t:6},{u:"C",v:"E",t:3},
  {u:"C",v:"F",t:5},{u:"D",v:"G",t:8},{u:"E",v:"H",t:7},
  {u:"F",v:"H",t:9},{u:"F",v:"G",t:4},{u:"F",v:"I",t:8},
  {u:"G",v:"I",t:7},{u:"E",v:"F",t:2}
];
const svgNS = "http://www.w3.org/2000/svg";
let selectedVertex = "C";
let playback = null;
const slider = document.querySelector("#time-window");
const playButton = document.querySelector("#play-timeline");

function svgElement(tag, attrs) {
  const element = document.createElementNS(svgNS,tag);
  for (const [name,value] of Object.entries(attrs)) element.setAttribute(name,value);
  return element;
}
const vertexById = new Map(vertices.map(vertex=>[vertex.id,vertex]));
const edgeElements = events.map(event=>{
  const source = vertexById.get(event.u), target = vertexById.get(event.v);
  const line = svgElement("line",{x1:source.x,y1:source.y,x2:target.x,y2:target.y,class:"edge"});
  const label = svgElement("text",{x:(source.x+target.x)/2+7,y:(source.y+target.y)/2-7,class:"edge-time"});
  label.textContent=event.t;
  document.querySelector("#graph-edges").append(line,label);
  return {line,label,event};
});
const nodeElements = vertices.map(vertex=>{
  const group=svgElement("g",{transform:`translate(${vertex.x} ${vertex.y})`,class:"node",role:"button",tabindex:"0","aria-label":`Select vertex ${vertex.id}`,"aria-pressed":"false"});
  const hit=svgElement("circle",{r:40,fill:"transparent","aria-hidden":"true"});
  const halo=svgElement("circle",{r:28,class:"halo"});
  const ring=svgElement("circle",{r:20,class:"ring"});
  const label=svgElement("text",{x:0,y:0}); label.textContent=vertex.id;
  group.append(hit,halo,ring,label);
  const select=()=>{selectedVertex=vertex.id;renderGraph();};
  group.addEventListener("click",select);
  group.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();select();}});
  document.querySelector("#graph-nodes").append(group);
  return {group,vertex};
});
function getComponent(start,activeEdges) {
  const connected=new Set([start]); const queue=[start];
  for(let index=0;index<queue.length;index++) {
    const current=queue[index];
    for(const edge of activeEdges) {
      const neighbor=edge.u===current?edge.v:edge.v===current?edge.u:null;
      if(neighbor&&!connected.has(neighbor)){connected.add(neighbor);queue.push(neighbor);}
    }
  }
  return connected;
}
function renderGraph() {
  const end=Number(slider.value),start=end-2;
  const activeEdges=events.filter(edge=>edge.t>=start&&edge.t<=end);
  const component=getComponent(selectedVertex,activeEdges);
  document.querySelector("#window-label").textContent=`[${start}, ${end}]`;
  slider.setAttribute("aria-valuetext",`Time window ${start} to ${end}, inclusive`);
  document.querySelector("#node-summary").textContent=`Vertex ${selectedVertex} · ${component.size} ${component.size===1?"vertex":"vertices"} in component`;
  for(const {line,label,event} of edgeElements){const active=activeEdges.includes(event);line.classList.toggle("active",active);line.classList.toggle("component",active&&component.has(event.u));label.classList.toggle("active",active);label.style.opacity=active?"1":"0";}
  for(const {group,vertex} of nodeElements){group.classList.toggle("selected",vertex.id===selectedVertex);group.classList.toggle("in-component",component.has(vertex.id));group.setAttribute("aria-pressed",String(vertex.id===selectedVertex));}
}
function stopPlayback(){if(playback!==null)clearInterval(playback);playback=null;playButton.setAttribute("aria-label","Play timeline");playButton.setAttribute("aria-pressed","false");playButton.firstElementChild.textContent="▷";}
slider.addEventListener("input",()=>{stopPlayback();renderGraph();});
playButton.addEventListener("click",()=>{if(playback!==null){stopPlayback();return;}playButton.setAttribute("aria-label","Pause timeline");playButton.setAttribute("aria-pressed","true");playButton.firstElementChild.textContent="Ⅱ";playback=setInterval(()=>{slider.value=Number(slider.value)>=9?3:Number(slider.value)+1;renderGraph();},1600);});
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopPlayback();});
renderGraph();

const citationDialog=document.querySelector("#citation-dialog");
document.querySelector("#citation-open").addEventListener("click",()=>citationDialog.showModal());
document.querySelector("#citation-close").addEventListener("click",()=>citationDialog.close());
citationDialog.addEventListener("click",event=>{if(event.target===citationDialog){const rect=citationDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)citationDialog.close();}});
document.querySelector("#copy-citation").addEventListener("click",async()=>{
  try {await navigator.clipboard.writeText(document.querySelector("#bibtex").textContent);document.querySelector("#copy-status").textContent="BibTeX copied to clipboard.";}
  catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(document.querySelector("#bibtex"));selection.removeAllRanges();selection.addRange(range);document.querySelector("#copy-status").textContent="Citation selected. Press Ctrl+C or ⌘C to copy.";}
});
citationDialog.addEventListener("close",()=>{document.querySelector("#copy-status").textContent="";document.querySelector("#citation-open").focus();});
document.querySelector("#year").textContent=new Date().getFullYear();
