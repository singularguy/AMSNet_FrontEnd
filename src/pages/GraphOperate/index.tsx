import React, { useEffect, useState } from 'react';
import {
  createNode, deleteNode, updateNode, findNode,
  getAllNodes,
  createRelationship, deleteRelationship, updateRelationship, findRelationship,
  getAllRelationships
} from '@/pages/GraphOperate/Components/apiFunctions';
import './Styles/customStyles.css';
import { Button, Card, Input, Layout, Space, Typography } from 'antd';
// 导入可视化组件和数据文件
import Neo4jVisualization from './Components/Neo4jVisualization';

const { Title } = Typography;
const { Content } = Layout;

// 定义node的接口
interface Node {
  name: string;
  properties: { [key: string]: any };
}

// 定义relationship的接口
interface Relationship {
  name: string;
  properties: { [key: string]: any };
}

const GraphOperate = () => {
  // 节点相关状态
  const [name, setName] = useState('');
  const [nodePropertiesKeys, setNodePropertiesKeys] = useState<string[]>([]);
  const [nodePropertiesValues, setNodePropertiesValues] = useState<string[]>([]);
  const [nodeResult, setNodeResult] = useState<Node | null>(null);
  const [allNodes, setAllNodes] = useState<Node[]>([]);

  // 关系相关状态
  const [relationshipName, setRelationshipName] = useState('');
  const [relationshipPropertiesKeys, setRelationshipPropertiesKeys] = useState<string[]>([]);
  const [relationshipPropertiesValues, setRelationshipPropertiesValues] = useState<string[]>([]);
  const [relationshipResult, setRelationshipResult] = useState<Relationship | null>(null);
  const [allRelationships, setAllRelationships] = useState<Relationship[]>([]);

  // 处理节点属性键值对添加
  const handleAddNodeProperty = () => {
    setNodePropertiesKeys([...nodePropertiesKeys, '']);
    setNodePropertiesValues([...nodePropertiesValues, '']);
  };

  // 处理节点属性键值对更新
  const handleUpdateNodeProperty = (index: number, key: string, value: string) => {
    const newKeys = [...nodePropertiesKeys];
    newKeys[index] = key;
    setNodePropertiesKeys(newKeys);

    const newValues = [...nodePropertiesValues];
    newValues[index] = value;
    setNodePropertiesValues(newValues);
  };

  // 处理关系属性键值对添加
  const handleAddRelationshipProperty = () => {
    setRelationshipPropertiesKeys([...relationshipPropertiesKeys, '']);
    setRelationshipPropertiesValues([...relationshipPropertiesValues, '']);
  };

  // 处理关系属性键值对更新
  const handleUpdateRelationshipProperty = (index: number, key: string, value: string) => {
    const newKeys = [...relationshipPropertiesKeys];
    newKeys[index] = key;
    setRelationshipPropertiesKeys(newKeys);

    const newValues = [...relationshipPropertiesValues];
    newValues[index] = value;
    setRelationshipPropertiesValues(newValues);
  };

  // 创建节点
  const handleCreateNode = async () => {
    try {
      const propertiesObj: { [key: string]: any } = {};
      nodePropertiesKeys.forEach((key, index) => {
        propertiesObj[key] = nodePropertiesValues[index];
      });
      const newNode: Node = { name, properties: propertiesObj };
      await createNode(newNode.name, newNode.properties);
      setNodeResult(newNode);
    } catch (error) {
      setNodeResult({ name: '', properties: {} } as Node);
      setNodeResult(`节点创建失败: ${error.message}`);
    }
  };

  // 删除节点
  const handleDeleteNode = async () => {
    try {
      await deleteNode(name);
      setNodeResult({ name: '', properties: {} } as Node);
      setNodeResult('节点删除成功');
    } catch (error) {
      setNodeResult({ name: '', properties: {} } as Node);
      setNodeResult(`节点删除失败: ${error.message}`);
    }
  };

  // 更新节点
  const handleUpdateNode = async () => {
    try {
      const newPropertiesObj: { [key: string]: any } = {};
      nodePropertiesKeys.forEach((key, index) => {
        newPropertiesObj[key] = nodePropertiesValues[index];
      });
      const updatedNode: Node = { name, properties: newPropertiesObj };
      await updateNode(updatedNode.name, updatedNode.properties);
      setNodeResult(updatedNode);
    } catch (error) {
      setNodeResult({ name: '', properties: {} } as Node);
      setNodeResult(`节点更新失败: ${error.message}`);
    }
  };

  // 查找节点
  const handleFindNode = async () => {
    try {
      const result: Node = await findNode(name);
      setNodeResult(result);
    } catch (error) {
      setNodeResult({ name: '', properties: {} } as Node);
      setNodeResult(`节点查找失败: ${error.message}`);
    }
  };

  // 获取所有节点
  const handleGetAllNodes = async () => {
    try {
      const result: Node[] = await getAllNodes(false);
      setAllNodes(result);
    } catch (error) {
      setNodeResult({ name: '', properties: {} } as Node);
      setNodeResult(`获取所有节点失败: ${error.message}`);
    }
  };

  // 创建关系
  const handleCreateRelationship = async () => {
    try {
      const propertiesObj: { [key: string]: any } = {};
      relationshipPropertiesKeys.forEach((key, index) => {
        propertiesObj[key] = relationshipPropertiesValues[index];
      });
      const newRelationship: Relationship = { name: relationshipName, properties: propertiesObj };
      await createRelationship(newRelationship.name, newRelationship.properties);
      setRelationshipResult(newRelationship);
    } catch (error) {
      setRelationshipResult({ name: '', properties: {} } as Relationship);
      setRelationshipResult(`关系创建失败: ${error.message}`);
    }
  };

  // 删除关系
  const handleDeleteRelationship = async () => {
    try {
      await deleteRelationship(relationshipName);
      setRelationshipResult({ name: '', properties: {} } as Relationship);
      setRelationshipResult('关系删除成功');
    } catch (error) {
      setRelationshipResult({ name: '', properties: {} } as Relationship);
      setRelationshipResult(`关系删除失败: ${error.message}`);
    }
  };

  // 更新关系
  const handleUpdateRelationship = async () => {
    try {
      const propertiesObj: { [key: string]: any } = {};
      relationshipPropertiesKeys.forEach((key, index) => {
        propertiesObj[key] = relationshipPropertiesValues[index];
      });
      const updatedRelationship: Relationship = { name: relationshipName, properties: propertiesObj };
      await updateRelationship(updatedRelationship.name, updatedRelationship.properties);
      setRelationshipResult(updatedRelationship);
    } catch (error) {
      setRelationshipResult({ name: '', properties: {} } as Relationship);
      setRelationshipResult(`关系更新失败: ${error.message}`);
    }
  };

  // 查找关系
  const handleFindRelationship = async () => {
    try {
      const result: Relationship = await findRelationship(relationshipName);
      setRelationshipResult(result);
    } catch (error) {
      setRelationshipResult({ name: '', properties: {} } as Relationship);
      setRelationshipResult(`关系查找失败: ${error.message}`);
    }
  };

  // 获取所有关系
  const handleGetAllRelationships = async () => {
    try {
      const result: Relationship[] = await getAllRelationships(false);
      setAllRelationships(result);
    } catch (error) {
      setRelationshipResult({ name: '', properties: {} } as Relationship);
      setRelationshipResult(`获取所有关系失败: ${error.message}`);
    }
  };

  return (
    <Layout>
      <Content>
        <Title level={2}>节点CRUD操作</Title>
        <Card>
          <Space direction="vertical">
            <Input
              placeholder="节点名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div>
              {nodePropertiesKeys.map((key, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
                  <Input
                    placeholder="Key"
                    value={key}
                    onChange={(e) => handleUpdateNodeProperty(index, e.target.value, nodePropertiesValues[index])}
                  />
                  <Input
                    placeholder="Value"
                    value={nodePropertiesValues[index]}
                    onChange={(e) => handleUpdateNodeProperty(index, nodePropertiesKeys[index], e.target.value)}
                  />
                </div>
              ))}
              <Button type="link" onClick={handleAddNodeProperty}>添加节点属性</Button>
            </div>
            <Button type="primary" onClick={handleCreateNode}>创建节点</Button>
            <Button type="danger" onClick={handleDeleteNode}>删除节点</Button>
            <Button type="link" onClick={handleUpdateNode}>更新节点</Button>
            <Button type="link" onClick={handleFindNode}>查找节点</Button>
            <Button type="link" onClick={handleGetAllNodes}>获取所有节点</Button>
          </Space>
          {/*<Typography.Text>{nodeResult && nodeResult.name? `节点名称: ${nodeResult.name}, 属性: `${JSON.stringify(nodeResult.properties)}` : nodeResult}</Typography.Text>*/}
          {/*<Typography.Text>{allNodes.map((node) => `节点名称: ${node.name}, 属性: ${JSON.stringify(node.properties)}`)}</Typography.Text>*/}
        </Card>

        <Title level={2}>关系CRUD操作</Title>
        <Card>
          <Space direction="vertical">
            <Input
              placeholder="关系名称"
              value={relationshipName}
              onChange={(e) => setRelationshipName(e.target.value)}
            />
            <div>
              {relationshipPropertiesKeys.map((key, index) => (
                <div key={index} style={{ display: 'flex', marginBottom: '5px' }}>
                  <Input
                    placeholder="Key"
                    value={key}
                    onChange={(e) => handleUpdateRelationshipProperty(index, e.target.value, relationshipPropertiesValues[index])}
                  />
                  <Input
                    placeholder="Value"
                    value={relationshipPropertiesValues[index]}
                    onChange={(e) => handleUpdateRelationshipProperty(index, relationshipPropertiesKeys[index], e.target.value)}
                  />
                </div>
              ))}
              <Button type="link" onClick={handleAddRelationshipProperty}>添加关系属性</Button>
            </div>
            <Button type="primary" onClick={handleCreateRelationship}>创建关系</Button>
            <Button type="danger" onClick={handleDeleteRelationship}>删除关系</Button>
            <Button type="link" onClick={handleUpdateRelationship}>更新关系</Button>
            <Button type="link" onClick={handleFindRelationship}>查找关系</Button>
            <Button type="link" onClick={handleGetAllRelationships}>获取所有关系</Button>
          </Space>
          {/*<Typography.Text>{relationshipResult && relationshipResult.name? `关系名称: ${relationshipResult.name}, 属性: ${JSON.stringify(relationshipResult.properties)}` : relationshipResult}</Typography.Text>*/}
          {/*<Typography.Text>{allRelationships.map((relationship) => `关系名称: ${relationship.name}, 属性: ${JSON.stringify(relationship.properties)}`)}</Typography.Text>*/}

        </Card>
        <div>
          <Neo4jVisualization nodes={allNodes} relationships={allRelationships} />
        </div>
      </Content>
    </Layout>
  );
};

export default GraphOperate;
