import React, { useState, useEffect } from 'react';
import { addNode, deleteNode, updateNode, findNode } from '@/pages/GraphOperate/Components/apiFunctions';
import './GraphOperate.css'; // 引入自定义的 CSS 文件

const App = () => {
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

  return (
    <div className="app-container">
      <h1>Neo4j CRUD Interface</h1>
      <div className="input-group">
        <label>Label:</label>
        <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
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
      <div className="button-group">
        <button type="button" onClick={handleAddNode}>Add Node</button>
        <button type="button" onClick={handleDeleteNode}>Delete Node</button>
        <button type="button" onClick={handleUpdateNode}>Update Node</button>
        <button type="button" onClick={handleFindNode}>Find Node</button>
      </div>
      {nodeData && (
        <div className="node-data">
          <h2>Found Node:</h2>
          <pre>{JSON.stringify(nodeData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
