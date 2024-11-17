import { addNodeUsingPost, deleteNodeUsingDelete, findNodeUsingGet, updateNodeUsingPut } from '@/services/backend/graphController';

const addNode = async (label: any, properties: any) => {
  try {
    await addNodeUsingPost({ label, properties });
    console.log('Node added');
  } catch (error) {
    console.error(error);
  }
};

const deleteNode = async (label: any, properties: any) => {
  try {
    await deleteNodeUsingDelete({ label, properties });
    console.log('Node deleted');
  } catch (error) {
    console.error(error);
  }
};

const updateNode = async (label: any, oldProperties: any, newProperties: any) => {
  try {
    await updateNodeUsingPut({ label, oldProperties, newProperties });
    console.log('Node updated');
  } catch (error) {
    console.error(error);
  }
};

const findNode = async (label: any, properties: any) => {
  try {
    const response = await findNodeUsingGet({ label, properties });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { addNode, deleteNode, updateNode, findNode };
