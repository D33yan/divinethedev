"use client";

import { useEffect, useRef } from "react";

interface SkillNode {
  name: string;
  category: string;
  color: string;
  desc: string;
  // Orbit parameters
  radius: number;
  speed: number;
  angle: number; // Current orbital angle
  inclination: number; // Orbital tilt relative to equator (X-Z plane tilt)
  // Projected 3D and 2D coordinates (calculated dynamically)
  x3d: number;
  y3d: number;
  z3d: number;
  x2d: number;
  y2d: number;
  size: number;
  visible: boolean;
}

const SKILLS_DATA = [
  { name: "Next.js", category: "Frontend", color: "#64ffda", desc: "React Framework for Web Apps", radius: 260, inclination: 0.2 },
  { name: "TypeScript", category: "Language", color: "#00b0ff", desc: "Type-Safe JavaScript Scaling", radius: 235, inclination: -0.3 },
  { name: "Python", category: "AI & ML", color: "#d500f9", desc: "Data Science, ML & AI Integration", radius: 250, inclination: 0.4 },
  { name: "n8n", category: "Automation", color: "#ffab00", desc: "Advanced Workflow Orchestration", radius: 280, inclination: -0.1 },
  { name: "React Native", category: "Mobile App", color: "#00e676", desc: "Cross-Platform Mobile Apps", radius: 245, inclination: 0.5 },
  { name: "Node.js", category: "Backend", color: "#00e5ff", desc: "Scalable Event-Driven APIs", radius: 220, inclination: -0.5 },
  { name: "Laravel", category: "Backend", color: "#ff5252", desc: "Robust PHP MVC Engineering", radius: 225, inclination: 0.3 },
  { name: "Figma", category: "UI/UX Design", color: "#e040fb", desc: "Interface & Vector Layout Design", radius: 270, inclination: -0.4 },
];

export function FuturisticGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Use a mutable ref for animation variables to avoid triggering component re-renders
  const stateRef = useRef({
    // Rotation states
    yaw: 0.0, // rotation around Y axis
    pitch: 0.0, // rotation around X axis
    yawSpeed: 0.003, // constant auto rotation Y speed
    pitchSpeed: 0.001, // constant auto rotation X speed
    
    // Parallax mouse offsets
    targetYawOffset: 0.0,
    targetPitchOffset: 0.0,
    yawOffset: 0.0,
    pitchOffset: 0.0,

    // Interactive Drag
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    dragSpeedX: 0,
    dragSpeedY: 0,
    
    // Parameters (scaled for background)
    fov: 500,
    globeRadius: 180,
    
    // Nodes state
    nodes: [] as SkillNode[],
    
    // Stars cloud (cosmic background particles)
    stars: [] as { x: number; y: number; z: number; size: number }[],
    
    // Hovered node tracker
    hoveredNodeName: null as string | null,
    
    // Core glow pulse
    pulseTime: 0,
  });

  useEffect(() => {
    // 1. Skills setup (larger radii for background element)
    stateRef.current.nodes = SKILLS_DATA.map((skill, index) => {
      const startAngle = (index / SKILLS_DATA.length) * Math.PI * 2;
      return {
        ...skill,
        angle: startAngle,
        speed: 0.006 + (index % 3) * 0.002, // gentle background orbital speed
        x3d: 0, y3d: 0, z3d: 0, x2d: 0, y2d: 0, size: 0, visible: true
      };
    });

    // 2. Stars cloud (cosmic ambient background particles)
    const starsCount = 65;
    const tempStars = [];
    for (let i = 0; i < starsCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const dist = stateRef.current.globeRadius + 50 + Math.random() * 160;
      
      tempStars.push({
        x: dist * Math.sin(phi) * Math.cos(theta),
        y: dist * Math.sin(phi) * Math.sin(theta),
        z: dist * Math.cos(phi),
        size: Math.random() * 1.5 + 0.5
      });
    }
    stateRef.current.stars = tempStars;

    // 3. Canvas setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;

    // Responsive scaling
    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      devicePixelRatio = window.devicePixelRatio || 1;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight || 550;
      
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(devicePixelRatio, devicePixelRatio);
      
      // Adapt size depending on viewport
      if (width < 600) {
        stateRef.current.globeRadius = 110;
        stateRef.current.fov = 350;
        stateRef.current.nodes.forEach(n => n.radius = SKILLS_DATA.find(sd => sd.name === n.name)!.radius * 0.6);
      } else {
        stateRef.current.globeRadius = 160;
        stateRef.current.fov = 500;
        stateRef.current.nodes.forEach(n => n.radius = SKILLS_DATA.find(sd => sd.name === n.name)!.radius);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 4. Mouse movement parallax and drag tracking
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const state = stateRef.current;
      const tooltip = tooltipRef.current;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (state.isDragging) {
        const deltaX = e.clientX - state.lastMouseX;
        const deltaY = e.clientY - state.lastMouseY;
        
        state.dragSpeedX = deltaX * 0.005;
        state.dragSpeedY = deltaY * 0.005;
        
        state.yaw += state.dragSpeedX;
        state.pitch += state.dragSpeedY;
        
        state.lastMouseX = e.clientX;
        state.lastMouseY = e.clientY;
        
        // Hide tooltip while dragging
        if (tooltip) {
          tooltip.style.opacity = "0";
          tooltip.style.pointerEvents = "none";
        }
        return;
      }

      // Parallax mapping relative to screen center
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      
      state.targetYawOffset = dx * 0.35;
      state.targetPitchOffset = -dy * 0.35;

      // Handle hover checking inside canvas bounding box
      if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        let foundNode: SkillNode | null = null;
        
        // Prioritize foreground nodes (z <= 0)
        const sortedNodes = [...state.nodes].sort((a, b) => a.z3d - b.z3d);
        for (const node of sortedNodes) {
          if (!node.visible) continue;
          
          const dist = Math.hypot(mouseX - node.x2d, mouseY - node.y2d);
          if (dist < 22) {
            foundNode = node;
            break;
          }
        }

        if (foundNode) {
          state.hoveredNodeName = foundNode.name;
          
          if (tooltip) {
            tooltip.style.transform = `translate(${foundNode.x2d}px, ${foundNode.y2d - 85}px) translateX(-50%)`;
            tooltip.style.opacity = "1";
            tooltip.style.pointerEvents = "auto";
            
            const titleEl = tooltip.querySelector(".tech-title");
            const catEl = tooltip.querySelector(".tech-category");
            const descEl = tooltip.querySelector(".tech-desc");
            const indEl = tooltip.querySelector(".tech-indicator") as HTMLDivElement;
            
            if (titleEl) titleEl.textContent = foundNode.name;
            if (titleEl) (titleEl as HTMLElement).style.color = foundNode.color;
            if (catEl) catEl.textContent = foundNode.category;
            if (descEl) descEl.textContent = foundNode.desc;
            if (indEl) {
              indEl.style.backgroundColor = foundNode.color;
              indEl.style.boxShadow = `0 0 10px ${foundNode.color}`;
            }
          }
        } else {
          state.hoveredNodeName = null;
          if (tooltip) {
            tooltip.style.opacity = "0";
            tooltip.style.pointerEvents = "none";
          }
        }
      } else {
        state.hoveredNodeName = null;
        if (tooltip) {
          tooltip.style.opacity = "0";
          tooltip.style.pointerEvents = "none";
        }
      }
    };

    const handleCanvasMouseDown = (e: MouseEvent) => {
      const state = stateRef.current;
      state.isDragging = true;
      state.lastMouseX = e.clientX;
      state.lastMouseY = e.clientY;
      state.dragSpeedX = 0;
      state.dragSpeedY = 0;
    };

    const handleWindowMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    canvas.addEventListener("mousedown", handleCanvasMouseDown);
    window.addEventListener("mouseup", handleWindowMouseUp);

    // 5. Main continuous animation loop
    const animate = () => {
      const state = stateRef.current;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Inertia drag decay
      if (!state.isDragging) {
        state.yaw += state.dragSpeedX;
        state.pitch += state.dragSpeedY;
        state.dragSpeedX *= 0.95;
        state.dragSpeedY *= 0.95;
        
        // Return to standard auto-rotation
        state.yaw += state.yawSpeed;
        state.pitch += state.pitchSpeed;
      }

      // Smooth interpolation for parallax tilts
      state.yawOffset += (state.targetYawOffset - state.yawOffset) * 0.06;
      state.pitchOffset += (state.targetPitchOffset - state.pitchOffset) * 0.06;

      // Combine base rotation with cursor tilt
      const finalYaw = state.yaw + state.yawOffset;
      const finalPitch = state.pitch + state.pitchOffset;

      state.pulseTime += 0.02;

      const cosYaw = Math.cos(finalYaw);
      const sinYaw = Math.sin(finalYaw);
      const cosPitch = Math.cos(finalPitch);
      const sinPitch = Math.sin(finalPitch);

      // Virtual 3D Light Source vector (positioned at top-right-front)
      // Light points down, left, and back: normalize(0.5, 0.8, -1.0)
      const lx = 0.36;
      const ly = 0.58;
      const lz = -0.73;

      // 3D rotation projection helper
      const rotate3D = (x: number, y: number, z: number) => {
        // Pitch (X-rotation)
        const y1 = y * cosPitch - z * sinPitch;
        const z1 = y * sinPitch + z * cosPitch;
        // Yaw (Y-rotation)
        const x2 = x * cosYaw + z1 * sinYaw;
        const z2 = -x * sinYaw + z1 * cosYaw;
        return { x: x2, y: y1, z: z2 };
      };

      // 3D to 2D screen projection helper
      const project = (coords: { x: number; y: number; z: number }) => {
        const scale = state.fov / (state.fov + coords.z);
        return {
          x: cx + coords.x * scale,
          y: cy + coords.y * scale,
          scale: scale
        };
      };

      // Update and compute 3D & 2D positions of all skills
      state.nodes.forEach((node) => {
        const isSelfHovered = state.hoveredNodeName === node.name;
        if (!isSelfHovered) {
          node.angle += node.speed;
        }

        let nx = node.radius * Math.cos(node.angle);
        let ny = 0;
        let nz = node.radius * Math.sin(node.angle);

        // Apply orbital inclination to create separate orbiting rings
        const cosInc = Math.cos(node.inclination);
        const sinInc = Math.sin(node.inclination);
        const rx = nx * cosInc - ny * sinInc;
        const ry = nx * sinInc + ny * cosInc;
        
        const rotated = rotate3D(rx, ry, nz);
        node.x3d = rotated.x;
        node.y3d = rotated.y;
        node.z3d = rotated.z;

        const proj = project(rotated);
        node.x2d = proj.x;
        node.y2d = proj.y;
        node.size = 5.5 * proj.scale;
        node.visible = rotated.z > -state.fov;
      });

      // -------------------------------------------------------------
      // RENDERING LAYERS (For convincing 3D Occlusion)
      // -------------------------------------------------------------
      
      // Layer 1: Background cosmic stars (z > 0)
      ctx.fillStyle = "rgba(100, 255, 218, 0.25)";
      state.stars.forEach((star) => {
        const rot = rotate3D(star.x, star.y, star.z);
        if (rot.z > 0) {
          const proj = project(rot);
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, star.size * proj.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Layer 2: Constellation dynamic connection links in 3D
      drawConstellationLinks(ctx, state.nodes);

      // Layer 3: Orbit paths drawing (faint background guide paths)
      drawOrbitPaths(ctx, state.nodes, rotate3D, project);

      // Layer 4: Orbiting skills in background (z3d > 0)
      state.nodes.forEach((node) => {
        if (node.visible && node.z3d > 0) {
          drawSkillNode(ctx, node, false);
        }
      });

      // Layer 5: Back of the planet wireframe (shaded dynamically based on virtual light source)
      drawShadedGlobeGrid(ctx, state.globeRadius, rotate3D, project, lx, ly, lz, true);

      // Layer 6: Solid Shaded Planet Body Sphere (creates absolute 3D depth and occludes the back!)
      const pulseRadius = state.globeRadius * (0.97 + Math.sin(state.pulseTime) * 0.015);
      
      // Radial metallic shadow/specular map
      const highlightX = cx + pulseRadius * 0.25;
      const highlightY = cy - pulseRadius * 0.25;
      const sphereGradient = ctx.createRadialGradient(
        highlightX, highlightY, pulseRadius * 0.05, 
        cx, cy, pulseRadius
      );
      sphereGradient.addColorStop(0, "rgba(20, 35, 70, 0.96)"); // Specular highlight
      sphereGradient.addColorStop(0.3, "rgba(10, 16, 35, 0.98)"); // Core color
      sphereGradient.addColorStop(0.7, "rgba(6, 8, 20, 1)"); // Core base shadow
      sphereGradient.addColorStop(1, "rgba(3, 4, 8, 1)"); // Planet edge boundary shadow
      
      ctx.fillStyle = sphereGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Outer atmosphere neon glow ring
      const atmosphereGlow = ctx.createRadialGradient(cx, cy, pulseRadius - 8, cx, cy, pulseRadius + 30);
      atmosphereGlow.addColorStop(0, "rgba(100, 255, 218, 0.08)");
      atmosphereGlow.addColorStop(0.3, "rgba(100, 255, 218, 0.03)");
      atmosphereGlow.addColorStop(1, "rgba(100, 255, 218, 0)");
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius + 35, 0, Math.PI * 2);
      ctx.fill();

      // Layer 7: Front of the planet wireframe (highly shaded, wraps around the solid sphere!)
      drawShadedGlobeGrid(ctx, state.globeRadius, rotate3D, project, lx, ly, lz, false);

      // Layer 8: Foreground stars (z <= 0)
      ctx.fillStyle = "rgba(100, 255, 218, 0.5)";
      state.stars.forEach((star) => {
        const rot = rotate3D(star.x, star.y, star.z);
        if (rot.z <= 0) {
          const proj = project(rot);
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, star.size * proj.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Layer 9: Orbiting skills in foreground (z3d <= 0)
      state.nodes.forEach((node) => {
        if (node.visible && node.z3d <= 0) {
          const isSelfHovered = state.hoveredNodeName === node.name;
          drawSkillNode(ctx, node, isSelfHovered);

          // Draw neon signal wire if hovered
          if (isSelfHovered) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = node.color;
            ctx.strokeStyle = `${node.color}44`;
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 3]);
            
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(node.x2d, node.y2d);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Running data signal particle
            const signalPos = (state.pulseTime * 5) % 1;
            const sx = cx + (node.x2d - cx) * signalPos;
            const sy = cy + (node.y2d - cy) * signalPos;
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      canvas.removeEventListener("mousedown", handleCanvasMouseDown);
      window.removeEventListener("mouseup", handleWindowMouseUp);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Helper to draw constellation links between skill nodes close to each other in 3D
  const drawConstellationLinks = (ctx: CanvasRenderingContext2D, nodes: SkillNode[]) => {
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(100, 255, 218, 0.05)";
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        
        // Calculate 3D distance between nodes
        const dist3d = Math.hypot(n1.x3d - n2.x3d, n1.y3d - n2.y3d, n1.z3d - n2.z3d);
        
        // Connect nodes if they are within a range (e.g. 190 pixels in 3D space)
        if (dist3d < 190) {
          // Scale line opacity with distance
          const opacity = (1 - dist3d / 190) * 0.09;
          ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
          
          ctx.beginPath();
          ctx.moveTo(n1.x2d, n1.y2d);
          ctx.lineTo(n2.x2d, n2.y2d);
          ctx.stroke();
        }
      }
    }
  };

  // Helper to draw orbit guide ellipses
  const drawOrbitPaths = (
    ctx: CanvasRenderingContext2D,
    nodes: SkillNode[],
    rotate3D: (x: number, y: number, z: number) => { x: number; y: number; z: number },
    project: (coords: { x: number; y: number; z: number }) => { x: number; y: number; scale: number }
  ) => {
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(100, 255, 218, 0.015)";
    ctx.setLineDash([3, 15]);
    
    nodes.forEach((node) => {
      ctx.beginPath();
      const segments = 45;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        let nx = node.radius * Math.cos(theta);
        let ny = 0;
        let nz = node.radius * Math.sin(theta);
        
        const cosInc = Math.cos(node.inclination);
        const sinInc = Math.sin(node.inclination);
        const rx = nx * cosInc - ny * sinInc;
        const ry = nx * sinInc + ny * cosInc;
        
        const rot = rotate3D(rx, ry, nz);
        const proj = project(rot);
        
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);
  };

  // ADVANCED 3D SHADING GRID LINES (Calculates surface normals and diffuse specular dot lighting!)
  const drawShadedGlobeGrid = (
    ctx: CanvasRenderingContext2D,
    radius: number,
    rotate3D: (x: number, y: number, z: number) => { x: number; y: number; z: number },
    project: (coords: { x: number; y: number; z: number }) => { x: number; y: number; scale: number },
    lx: number, ly: number, lz: number, // Light source vector
    drawBehind: boolean
  ) => {
    // 1. Draw Latitudes (horizontal rings)
    const latCount = 6;
    for (let i = 1; i < latCount; i++) {
      const phi = (i / latCount) * Math.PI - Math.PI / 2;
      const ringRadius = radius * Math.cos(phi);
      const ringY = radius * Math.sin(phi);
      
      const segments = 48;
      
      for (let j = 0; j < segments; j++) {
        const theta1 = (j / segments) * Math.PI * 2;
        const theta2 = ((j + 1) / segments) * Math.PI * 2;
        
        // Point 1
        const rx1 = ringRadius * Math.sin(theta1);
        const rz1 = ringRadius * Math.cos(theta1);
        const rot1 = rotate3D(rx1, ringY, rz1);
        
        // Point 2
        const rx2 = ringRadius * Math.sin(theta2);
        const rz2 = ringRadius * Math.cos(theta2);
        const rot2 = rotate3D(rx2, ringY, rz2);
        
        const isBehind1 = rot1.z > 0;
        const isBehind2 = rot2.z > 0;
        
        // Render segment only if it matches current depth layer (behind or in front)
        if (isBehind1 === drawBehind && isBehind2 === drawBehind) {
          const proj1 = project(rot1);
          const proj2 = project(rot2);
          
          // Calculate midpoint surface normal on sphere
          const midX = (rx1 + rx2) / 2;
          const midY = ringY;
          const midZ = (rz1 + rz2) / 2;
          const normalX = midX / radius;
          const normalY = midY / radius;
          const normalZ = midZ / radius;
          
          // Apply 3D rotation to normal to align with current sphere rotation
          const rotNormal = rotate3D(normalX, normalY, normalZ);
          
          // Dot product: normal * light vector representing local diffuse shading intensity
          const dot = rotNormal.x * lx + rotNormal.y * ly + rotNormal.z * lz;
          const intensity = Math.max(0.08, (dot + 1) / 2); // Scales from 0.08 (shadowed) to 1.0 (illuminated)
          
          // Set dynamic style depending on light intensity and depth layer
          const baseAlpha = drawBehind ? 0.06 : 0.28;
          ctx.strokeStyle = `rgba(100, 255, 218, ${baseAlpha * intensity})`;
          ctx.lineWidth = (drawBehind ? 0.4 : 0.8) * intensity;
          
          ctx.beginPath();
          ctx.moveTo(proj1.x, proj1.y);
          ctx.lineTo(proj2.x, proj2.y);
          ctx.stroke();
        }
      }
    }

    // 2. Draw Longitudes (vertical rings)
    const longCount = 8;
    for (let i = 0; i < longCount; i++) {
      const theta = (i / longCount) * Math.PI * 2;
      const segments = 48;
      
      for (let j = 0; j < segments; j++) {
        const phi1 = (j / segments) * Math.PI - Math.PI / 2;
        const phi2 = ((j + 1) / segments) * Math.PI - Math.PI / 2;
        
        // Point 1
        const rx1 = radius * Math.cos(phi1) * Math.sin(theta);
        const ry1 = radius * Math.sin(phi1);
        const rz1 = radius * Math.cos(phi1) * Math.cos(theta);
        const rot1 = rotate3D(rx1, ry1, rz1);
        
        // Point 2
        const rx2 = radius * Math.cos(phi2) * Math.sin(theta);
        const ry2 = radius * Math.sin(phi2);
        const rz2 = radius * Math.cos(phi2) * Math.cos(theta);
        const rot2 = rotate3D(rx2, ry2, rz2);
        
        const isBehind1 = rot1.z > 0;
        const isBehind2 = rot2.z > 0;
        
        if (isBehind1 === drawBehind && isBehind2 === drawBehind) {
          const proj1 = project(rot1);
          const proj2 = project(rot2);
          
          // Calculate midpoint surface normal
          const midX = (rx1 + rx2) / 2;
          const midY = (ry1 + ry2) / 2;
          const midZ = (rz1 + rz2) / 2;
          const normalX = midX / radius;
          const normalY = midY / radius;
          const normalZ = midZ / radius;
          
          const rotNormal = rotate3D(normalX, normalY, normalZ);
          
          const dot = rotNormal.x * lx + rotNormal.y * ly + rotNormal.z * lz;
          const intensity = Math.max(0.08, (dot + 1) / 2);
          
          const baseAlpha = drawBehind ? 0.06 : 0.28;
          ctx.strokeStyle = `rgba(100, 255, 218, ${baseAlpha * intensity})`;
          ctx.lineWidth = (drawBehind ? 0.4 : 0.8) * intensity;
          
          ctx.beginPath();
          ctx.moveTo(proj1.x, proj1.y);
          ctx.lineTo(proj2.x, proj2.y);
          ctx.stroke();
        }
      }
    }
  };

  // Render skill node details inside canvas
  const drawSkillNode = (ctx: CanvasRenderingContext2D, node: SkillNode, isHovered: boolean) => {
    const scale = node.size / 5.5;
    const isBehind = node.z3d > 0;
    
    ctx.shadowBlur = isHovered ? 12 : (isBehind ? 0 : 3);
    ctx.shadowColor = node.color;
    
    // Draw orbit rings
    ctx.strokeStyle = isHovered ? node.color : (isBehind ? `${node.color}15` : `${node.color}45`);
    ctx.lineWidth = isHovered ? 1.5 : 0.8;
    ctx.beginPath();
    ctx.arc(node.x2d, node.y2d, 7 * scale + (isHovered ? 3 : 0), 0, Math.PI * 2);
    ctx.stroke();

    // Active scanning pointer
    if (isHovered) {
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(node.x2d, node.y2d, 10 * scale, stateRef.current.pulseTime * 2.5, stateRef.current.pulseTime * 2.5 + Math.PI * 0.35);
      ctx.stroke();
    }

    // Node core
    ctx.fillStyle = isBehind ? `${node.color}44` : node.color;
    ctx.beginPath();
    ctx.arc(node.x2d, node.y2d, (isHovered ? 3.5 : 2.5) * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Node text tag
    ctx.font = `600 ${isHovered ? 10.5 : 9}px var(--font-mono, monospace)`;
    ctx.textAlign = "center";
    
    const textWidth = ctx.measureText(node.name).width;
    ctx.fillStyle = isBehind ? "rgba(10, 15, 30, 0.3)" : "rgba(10, 15, 30, 0.65)";
    ctx.fillRect(node.x2d - textWidth/2 - 3, node.y2d - 16 - 6, textWidth + 6, 12);
    
    ctx.fillStyle = isHovered ? node.color : (isBehind ? "#8892b066" : "#ccd6f6b5");
    ctx.fillText(node.name, node.x2d, node.y2d - 13);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative h-full w-full select-none"
    >
      {/* Dynamic background dashboard coordinates */}
      <div className="absolute top-8 left-8 hidden font-mono text-[9px] tracking-widest text-[#64ffda]/25 uppercase lg:block">
        SYS_GRID // SHADED_3D_CORE // COORD_NET
      </div>
      
      {/* Outer ambient decorative orbits */}
      <div className="absolute top-1/2 left-1/2 h-[750px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#64ffda]/3 pointer-events-none animate-[spin_120s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#64ffda]/5 pointer-events-none animate-[spin_80s_linear_infinite_reverse]" />

      {/* Main Background Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-auto h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Direct DOM updated holographic tooltip to secure 60fps glitchless performance */}
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          opacity: "0",
          pointerEvents: "none",
          transition: "opacity 0.15s ease-out, transform 0.08s ease-out",
        }}
        className="z-20 w-52 rounded border border-[#64ffda]/30 bg-[#0a0f1e]/90 p-3 shadow-[0_0_20px_rgba(100,255,218,0.15)] backdrop-blur-md"
      >
        {/* HUD Corner Caps */}
        <div className="absolute -top-px -left-px h-1.5 w-1.5 border-t border-l border-[#64ffda]" />
        <div className="absolute -top-px -right-px h-1.5 w-1.5 border-t border-r border-[#64ffda]" />
        <div className="absolute -bottom-px -left-px h-1.5 w-1.5 border-b border-l border-[#64ffda]" />
        <div className="absolute -bottom-px -right-px h-1.5 w-1.5 border-b border-r border-[#64ffda]" />

        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <span className="font-mono text-[9px] tracking-wider text-[#8892b0] uppercase">
            ORBIT CHECK
          </span>
          <div className="tech-indicator h-1.5 w-1.5 rounded-full" />
        </div>
        
        <h4 className="tech-title mt-1.5 font-sans text-xs font-bold tracking-tight text-[#64ffda]">
          -
        </h4>
        
        <p className="tech-category mt-0.5 font-mono text-[8px] text-[#ccd6f6] uppercase tracking-wider">
          -
        </p>
        
        <p className="tech-desc mt-1.5 border-t border-dashed border-white/5 pt-1.5 font-sans text-[10px] leading-relaxed text-[#8892b0]">
          -
        </p>
      </div>
    </div>
  );
}
