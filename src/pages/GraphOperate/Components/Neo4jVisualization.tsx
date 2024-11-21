import React, { useEffect, useState, useRef } from 'react';
import { CanvasRenderingContext2D } from 'canvas';

// 可视化组件
const Neo4jVisualization: React.FC<{
  nodes: { name: string; properties: { [key: string]: any } }[];
  relationships: { name: string; properties: { startNodeName: string; endNodeName: string; [key: string]: any }; }[];
}> = ({ nodes, relationships }) => {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const nodePositions = useRef<{ [key: string]: { x: number; y: number } }>({});

  useEffect(() => {
    if (canvasRef) {
      const ctx = canvasRef.getContext('2d') as CanvasRenderingContext2D;
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

        // 绘制节点
        nodes.forEach(({ name, properties }, index) => {
          const x = 100 + index * 200;
          const y = 100;
          nodePositions.current[name] = { x, y };
          let shape = "circle";
          if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI);
            ctx.fillStyle = 'lightblue';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
          } else if (shape ==='rect') {
            ctx.beginPath();
            ctx.rect(x - 40, y - 15, 80, 30);
            ctx.fillStyle = 'lightblue';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
          }
          ctx.font = '14px Arial';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline ='middle';
          ctx.fillText(name, x, y);
          drawNodeProperties(ctx, x, y, properties);
        });

        // 绘制关系
        drawLinks(ctx, relationships);
      }
    }
  }, [canvasRef, nodes, relationships]);

  // 绘制节点描述
  const drawNodeProperties = (ctx: CanvasRenderingContext2D, x: number, y: number, properties: { [key: string]: any }) => {
    let propertyText = '';
    for (let key in properties) {
      if (properties[key]) {
        propertyText += `${key}: ${properties[key]}\n`;
      }
    }
    // if (propertyText) {
    //   ctx.font = '12px Arial';
    //   ctx.fillStyle = 'black';
    //   ctx.textAlign = 'center';
    //   ctx.textBaseline ='top';
    //   ctx.fillText(propertyText, x, y + 40);
    // }
  };

  const drawLinks = (ctx: CanvasRenderingContext2D, links: { name: string; properties: { startNodeName: string; endNodeName: string; [key: string]: any }; }[]) => {
    ctx.strokeStyle ='red';
    ctx.lineWidth = 2;
    links.forEach(({ name, properties }) => {
      const sourceNode = nodePositions.current[properties.startNodeName];
      const targetNode = nodePositions.current[properties.endNodeName];
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline ='middle';
        ctx.fillText(name, midX, midY);
      }
    });
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef?.getContext('2d') as CanvasRenderingContext2D;
    if (ctx) {
      const rect = canvasRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let node in nodePositions.current) {
        const { x: nodeX, y: nodeY } = nodePositions.current[node];
        const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
        if (distance <= 30) {
          setDraggingNode(node);
          setOffsetX(x - nodeX);
          setOffsetY(y - nodeY);
          break;
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingNode && canvasRef) {
      const rect = canvasRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      nodePositions.current[draggingNode].x = x - offsetX;
      nodePositions.current[draggingNode].y = y - offsetY;
      drawCanvas();
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const drawCanvas = () => {
    const ctx = canvasRef?.getContext('2d') as CanvasRenderingContext2D;
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

      // 重新绘制节点
      nodes.forEach(({ name, properties }, index) => {
        const { x, y } = nodePositions.current[name];
        let shape = "circle";
        if (shape === 'circle') {
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, 2 * Math.PI);
          ctx.fillStyle = 'lightblue';
          ctx.fill();
          ctx.strokeStyle = 'black';
          ctx.stroke();
        } else if (shape ==='rect') {
          ctx.beginPath();
          ctx.rect(x - 40, y - 15, 80, 30);
          ctx.fillStyle = 'lightblue';
          ctx.fill();
          ctx.strokeStyle = 'black';
          ctx.stroke();
        }
        ctx.font = '14px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline ='middle';
        ctx.fillText(name, x, y);
        drawNodeProperties(ctx, x, y, properties);
      });

      // 重新绘制关系
      drawLinks(ctx, relationships);
    }
  };

  return (
    <canvas
      ref={setCanvasRef}
      width={1600}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: '1px solid black' }}
    />
  );
};

export default Neo4jVisualization;
