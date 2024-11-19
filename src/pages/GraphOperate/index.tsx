/*
 * @Author: singularguy 2635495642@qq.com
 * @Date: 2024-11-17 15:09:19
 * @LastEditors: singularguy 2635495642@qq.com
 * @LastEditTime: 2024-11-19 05:27:54
 * @FilePath: /AMSNet/src/pages/GraphOperate/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { addNode, deleteNode, updateNode, findNode } from '@/pages/GraphOperate/Components/apiFunctions';
import './Styles/customStyles.css';
import { Layout, Space, Input, Button, Typography, Card } from 'antd';
const { Title } = Typography;

// 导入可视化组件和数据文件
import Neo4jVisualization from './Components/Neo4jVisualization';

const mockData = {
  "nodes": [
    {
      "node": "Node1",
      "shape": "circle",
      "properties": {
        "name": "Amplifier 1",
        "load": "50 Ohm",
        "low": "0.1 V",
        "input": "1 V",
        "output": "10 V",
        "class": "Amplifier",
        "evaluates": "Gain Calculation",
        "sets": "Output Voltage",
        "DM_Gain": "20",
        "CMRR": "80 dB",
        "PSRR": "60 dB",
        "CM_gain": "0.01"
      }
    },
    {
      "node": "Node2",
      "shape": "circle",
      "properties": {
        "name": "Resistor 1",
        "load": "100 Ohm",
        "low": "0 V",
        "input": "10 V",
        "output": "0 V",
        "class": "Amplifier",
        "evaluates": "Voltage Drop",
        "sets": "Current",
        "DM_Gain": "0",
        "CMRR": "N/A",
        "PSRR": "N/A",
        "CM_gain": "0"
      }
    },
    {
      "node": "Node3",
      "shape": "circle",
      "properties": {
        "name": "Capacitor 1",
        "load": "0.1 F",
        "low": "0 V",
        "input": "5 V",
        "output": "5 V",
        "class": "Capacitor",
        "evaluates": "Charge Storage",
        "sets": "Voltage",
        "DM_Gain": "1",
        "CMRR": "N/A",
        "PSRR": "N/A",
        "CM_gain": "0"
      }
    }
  ],
  "links": [
    {
      "source": "Node1",
      "target": "Node2",
      "label": "Connects",
      "properties": {
        "description": "Amplifier output is connected to resistor input"
      }
    },
    {
      "source": "Node2",
      "target": "Node3",
      "label": "Connects",
      "properties": {
        "description": "Resistor output is connected to capacitor input"
      }
    }
  ]
}

const GraphOperate = () => {
  const [label, setLabel] = useState('DefaultLabel');
  const [properties, setProperties] = useState({ key: 'value' });
  const [oldProperties, setOldProperties] = useState({ oldKey: 'oldValue' });
  const [newProperties, setNewProperties] = useState({ newKey: 'newValue' });
  const [nodeData, setNodeData] = useState(null);

  useEffect(() => {
    const defaultLabel = 'DefaultLabel';
    const defaultProperties = { key: 'value' };
    findNode(defaultLabel, defaultProperties).then(response => {
      setNodeData(response);
    });
  }, []);

  const handleAddNode = async () => {
    await addNode(label, properties);
  };

  const handleDeleteNode = async () => {
    await deleteNode(label, properties);
  };

  const handleUpdateNode = async () => {
    await updateNode(label, oldProperties, newProperties);
  };

  const handleFindNode = async () => {
    const response = await findNode(label, properties);
    setNodeData(response);
  };

  // 将原始数据处理后
  const parseData = (circuitData: { nodes: CircuitNode[]; links: Link[] }) => {
    const newNodes: CircuitNode[] = [...circuitData.nodes];
    const newLinks: Link[] = [...circuitData.links];
    const nodeMap: { [key: string]: CircuitNode } = {};

    // 构建节点映射
    circuitData.nodes.forEach((node) => {
      nodeMap[node.node] = node;
    });

    // 查找具有相同class的节点对并添加新节点和连接
    for (let i = 0; i < circuitData.nodes.length; i++) {
      for (let j = i + 1; j < circuitData.nodes.length; j++) {
        const node1 = circuitData.nodes[i];
        const node2 = circuitData.nodes[j];
        if (node1.properties.class === node2.properties.class) {
          const newNode: CircuitNode = {
            node: `Node${newNodes.length + 1}`,
            shape: 'rect',
            properties: {
              name: `properties.class`,
            }
          };
          newNodes.push(newNode);

          const link1: Link = {
            source: node1.node,
            target: newNode.node,
            label: node1.properties.class,
            properties: {
              description: ''
            }
          };
          newLinks.push(link1);

          const link2: Link = {
            source: node2.node,
            target: newNode.node,
            label: node2.properties.class,
            properties: {
              description: ''
            }
          };
          newLinks.push(link2);
        }
      }
    }
    console.log(newNodes);
    console.log(newLinks);

    return { nodes: newNodes, links: newLinks };
  };

  return (
    <Layout>
      <Layout.Content>
        <div className="GraphOperate-container">
          <Title level={1}>Neo4j CRUD Interface</Title>
          <Space direction="vertical" size={16}>
            <div className="input-group">
              <label>Label:</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Properties (JSON):</label>
              <textarea value={JSON.stringify(properties)} onChange={(e) => setProperties(JSON.parse(e.target.value))} />
            </div>
            <div className="input-group">
              <label>Old Properties (JSON):</label>
              <textarea value={JSON.stringify(oldProperties)} onChange={(e) => setOldProperties(JSON.parse(e.target.value))} />
            </div>
            <div className="input-group">
              <label>New Properties (JSON):</label>
              <textarea value={JSON.stringify(newProperties)} onChange={(e) => setNewProperties(JSON.parse(e.target.value))} />
            </div>
            <Space>
              <Button type="primary" onClick={handleAddNode}>Add Node</Button>
              <Button danger onClick={handleDeleteNode}>Delete Node</Button>
              <Button type="link" onClick={handleUpdateNode}>Update Node</Button>
              <Button type="link" onClick={handleFindNode}>Find Node</Button>
            </Space>
          </Space>
          {nodeData && (
            <Card title="Found Node">
              <pre>{JSON.stringify(nodeData, null, 2)}</pre>
            </Card>
          )}
          {/* 展示可视化组件 */}
          <div>
            <h1>Circuit Visualization</h1>
            {/*<Neo4jVisualization circuitData={mockData} />*/}
            <Neo4jVisualization circuitData={parseData(mockData)} />
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default GraphOperate;
