// 从指定路径的服务模块中导入与图数据库操作相关的函数
// 这些函数用于对节点和关系进行创建、删除、查找、更新以及获取全部等操作
import {
  createNodeUsingPost,
  createRelationshipUsingPost,
  deleteNodeUsingDelete,
  deleteRelationshipUsingDelete,
  findNodeUsingPost,
  findRelationshipUsingPost,
  getAllNodesUsingPost,
  getAllRelationshipsUsingPost,
  updateNodeUsingPut,
  updateRelationshipUsingPut
} from '@/services/backend/graphController';

// 创建节点的异步函数
// @param {any} name 要创建的节点的名称
// @param {any} properties 要创建的节点的属性，类型为任意类型，可根据实际需求传入合适的数据结构
const createNode = async (name: any, properties: any) => {
  try {
    // 调用从后端服务导入的创建节点函数，传入节点名称和属性
    await createNodeUsingPost({ name, properties });
    // 如果节点创建成功，在控制台打印相应信息
    console.log('Node created');
  } catch (error) {
    // 如果创建节点过程中出现错误，在控制台打印错误信息以便调试
    console.error(error);
  }
};

// 删除节点的异步函数
// @param {any} name 要删除的节点的名称
const deleteNode = async (name: any) => {
  try {
    // 调用从后端服务导入的删除节点函数，传入节点名称
    await deleteNodeUsingDelete({ name });
    // 如果节点删除成功，在控制台打印相应信息
    console.log('Node deleted');
  } catch (error) {
    // 如果删除节点过程中出现错误，在控制台打印错误信息以便调试
    console.error(error);
  }
};

// 更新节点的异步函数
// @param {any} name 要更新的节点的名称
// @param {any} newProperties 要更新到节点的新属性，类型为任意类型，可根据实际需求传入合适的数据结构
const updateNode = async (name: any, newProperties: any) => {
  try {
    // 调用从后端服务导入的更新节点函数，传入节点名称和新属性
    await updateNodeUsingPut({ name, newProperties });
    // 如果节点更新成功，在控制台打印相应信息
    console.log('Node updated');
  } catch (error) {
    // 如果更新节点过程中出现错误，在控制台打印错误信息以便调试
    console.error(error);
  }
};

// 查找指定节点的异步函数
// @param {any} name 要查找的节点的名称
const findNode = async (name: any) => {
  try {
    // 调用从后端服务导入的查找节点函数，传入节点名称
    const response = await findNodeUsingPost({ name });
    // 如果查找成功，返回从后端获取到的节点相关数据
    return response;
  } catch (error) {
    // 如果查找节点过程中出现错误，在控制台打印错误信息以便调试
    console.error(error);
    // 如果出现错误，返回null，表示未找到节点或查找操作失败
    return null;
  }
};

// 获取所有节点的异步函数
// @param {any} isIncludeProperties 一个可选参数，用于指定是否包含节点的属性信息
// 如果未传入该参数，默认值为false，表示不包含节点属性信息
async function getAllNodes(isIncludeProperties: any) {
  // 根据传入的isIncludeProperties参数确定最终是否包含节点属性信息
  // 如果isIncludeProperties为null或undefined，则将isIncludePropertiesF设置为false
  const isIncludePropertiesF = isIncludeProperties?? false;
  try {
    // 调用从后端服务导入的获取所有节点函数，传入是否包含属性信息的参数
    const response = await getAllNodesUsingPost(isIncludePropertiesF);
    // 返回从后端获取到的所有节点的数据
    return response;
  } catch (error) {
    // 如果获取所有节点的过程中出现错误，在控制台打印详细的错误信息
    console.error('获取全部节点失败1：', error);
    // 根据具体需求，这里选择抛出错误，以便在调用该函数的上层代码中进行相应处理
    throw error;
  }
}

// 创建关系的异步函数
// @param {any} name 要创建的关系的名称
// @param {any} properties 要创建的关系的属性，类型为任意类型，可根据实际需求传入合适的数据结构
const createRelationship = async (name: any, properties: any) => {
  try {
    // 调用从后端服务导入的创建关系函数，传入关系名称和属性
    await createRelationshipUsingPost({ name, properties });
    // 如果关系创建成功，在控制台打印相应信息
    console.log('Relationship created');
  } catch (error) {
    // 如果创建关系过程中出现错误，在控制台打印错误信息以便调试
    console.error(error);
  }
};

// 删除关系的异步函数
// @param {任意类型} name 要删除的关系的名称
const deleteRelationship = async (name: any) => {
  try {
    // 调用从后端服务导入的删除关系函数，传入关系名称
    await deleteRelationshipUsingDelete({name});
    // 如果关系删除成功，在控制台打印相应信息
    console.log('Relationship deleted');
  } catch (error) {
    // 如果删除关系过程中出现错误，在控制台打印错误信息以便调试
    console.error(error);
  }
};

// 更新关系的异步函数
// @param {any} name 要更新的关系的名称
// @param {any} properties 要更新到关系的属性，类型为任意类型，可根据实际需求传入合适的数据结构
const updateRelationship = async (name: any, properties: any) => {
  try {
    // 调用从后端服务导入的更新关系函数，传入关系名称和属性
    await updateRelationshipUsingPut({ name, properties });
    // 如果关系更新成功，在控制台打印相应信息
    console.log('Relationship updated');
  } catch (error) {
    // 如果更新关系过程中出现错误，在控制台打印错误信息以便调试
    console.error(error);
  }
};

// 查找指定关系的异步函数
// @param {any} name 要查找的关系的名称
const findRelationship = async (name: any ) => {
  try {
    // 调用从后端服务导入的查找关系函数，传入关系名称
    const response = await findRelationshipUsingPost({ name });
    // 如果查找成功，返回从后端获取到的关系相关数据
    return response;
  } catch (error) {
    // 如果查找关系过程中出现错误，在控制台打印错误信息以便调试
    console.error(error);
    // 如果出现错误，返回null，表示未找到关系或查找操作失败
    return null;
  }
};

// 获取所有关系的异步函数
// @param {any} isIncludeProperties 一个可选参数，用于指定是否包含关系的属性信息
// 如果未传入该参数，默认值为false，表示不包含关系属性信息
const getAllRelationships = async (isIncludeProperties : any) => {
  // 根据传入的isIncludeProperties参数确定最终是否包含关系属性信息
  // 如果isIncludeProperties为null或undefined，则将isIncludePropertiesF设置为false
  const isIncludePropertiesF = isIncludeProperties?? false;
  try {
    // 调用从后端服务导入的获取所有关系函数，传入是否包含属性信息的参数
    const response = await getAllRelationshipsUsingPost(isIncludePropertiesF);
    // 返回从后端获取到的所有关系的数据
    return response;
  } catch (error) {
    // 如果获取所有关系的过程中出现错误，在控制台打印详细的错误信息
    console.error("获取全部关系失败1：", error);
    // 如果出现错误，返回null，表示未找到关系或获取操作失败
    return null;
  }
}

// 导出创建关系、删除关系、更新关系、查找关系相关的函数，以便在其他模块中使用
export { createRelationship, deleteRelationship, updateRelationship, findRelationship };

// 导出创建节点、删除节点、更新节点、查找节点相关的函数，以便在其他模块中使用
export { createNode, deleteNode, updateNode, findNode };

// 导出获取所有节点、获取所有关系相关的函数，以便在其他模块中使用
export { getAllNodes, getAllRelationships };
