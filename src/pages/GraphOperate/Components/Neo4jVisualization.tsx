import React, { useEffect, useState, useRef } from 'react';

import {
  CircuitNode,
  ParsedNode,
  Link,
  ParsedLink
} from '../Constants/dataTypes'


// 可视化组件
const Neo4jVisualization: React.FC<{ circuitData: { nodes: CircuitNode[]; links: Link[] } }> = ({ circuitData }) => {
  console.log('----------------------------' + circuitData.nodes);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);

  // 存储节点的初始位置信息
  const nodePositions = useRef<{ [key: string]: { x: number; y: number } }>({});

  useEffect(() => {
    if (canvasRef) {
      const ctx = canvasRef.getContext('2d');
      if (ctx) {
        // 清空画布
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

        // 绘制每个节点
        circuitData.nodes.forEach(({ node,shape, properties }, index) => {
          const x = 100 + index * 200;
          const y = 100;

          // 存储节点的初始位置
          nodePositions.current[node] = { x, y };

          // 绘制节点形状
          if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI);
            ctx.fillStyle = 'lightblue';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
          } else if (shape ==='rect') {
            ctx.beginPath();
            ctx.rect(x - 40, y - 15, 80, 30); // 以节点位置为中心绘制长80、高30的长方形
            ctx.fillStyle = 'lightblue';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
          }

          // 绘制节点中内容
          ctx.font = '14px Arial';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline ='middle';
          ctx.fillText(properties.name, x, y);

          // 绘制节点属性
          drawNodeProperties(ctx, x, y, properties);
        });

        // 绘制每条链路
        drawLinks(ctx, circuitData.links);
      }
    }
  }, [canvasRef, circuitData.nodes, circuitData.links]);

  const drawNodeProperties = (ctx: CanvasRenderingContext2D, x: number, y: number, properties: { [key: string]: string }) => {
    let propertyText = '';
    for (let key in properties) {
      if (properties[key]) {
        propertyText += `${key}: ${properties[key]}\n`;
      }
    }
    // 绘制节点下方的内容 将properties合起来
    if (propertyText) {
      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline ='top';
      ctx.fillText(propertyText, x, y + 40);
    }
  };

  const drawLinks = (ctx: CanvasRenderingContext2D, links: Link[]) => {
    ctx.strokeStyle ='red';
    ctx.lineWidth = 2;

    links.forEach(({ source, target, label, properties }) => {
      const sourceNode = nodePositions.current[source];
      const targetNode = nodePositions.current[target];

      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();

        // 在链路中间绘制关系标签
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2;
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline ='middle';
        ctx.fillText(label, midX, midY);

        // 绘制链路描述（可选，可根据实际需求展示或隐藏）
        const descX = midX;
        const descY = midY + 20;
        ctx.font = '10px Arial';
        ctx.fillStyle = 'gray';
        ctx.textAlign = 'center';
        ctx.textBaseline ='middle';
        ctx.fillText(properties.description, descX, descY);
      }
    });
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef?.getContext('2d');
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
    const ctx = canvasRef?.getContext('2d');
    if (ctx) {
      // 清空画布
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

      // 绘制每个节点
      circuitData.nodes.forEach(({ node,shape, properties }, index) => {
        const { x, y } = nodePositions.current[node];

        // 绘制节点形状
        if (shape === 'circle') {
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, 2 * Math.PI);
          ctx.fillStyle = 'lightblue';
          ctx.fill();
          ctx.strokeStyle = 'black';
          ctx.stroke();
        } else if (shape ==='rect') {
          ctx.beginPath();
          ctx.rect(x - 40, y - 15, 80, 30); // 以节点位置为中心绘制长80、高30的长方形
          ctx.fillStyle = 'lightblue';
          ctx.fill();
          ctx.strokeStyle = 'black';
          ctx.stroke();
        }

        // 绘制节点名称
        ctx.font = '14px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline ='middle';
        ctx.fillText(properties.name, x, y);

        // 绘制节点属性
        drawNodeProperties(ctx, x, y, properties);
      });

      // 绘制每条链路
      drawLinks(ctx, circuitData.links);
    }
  };

  return (
      <canvas
          ref={setCanvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ border: '1px solid black' }}
      />
  );
};

export default Neo4jVisualization;
