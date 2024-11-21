// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** createNode POST /api/graph/createNode */
export async function createNodeUsingPost(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<string>('/api/graph/createNode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** createRelationship POST /api/graph/createRelationship */
export async function createRelationshipUsingPost(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<string>('/api/graph/createRelationship', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteNode DELETE /api/graph/deleteNode */
export async function deleteNodeUsingDelete(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<string>('/api/graph/deleteNode', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteRelationship DELETE /api/graph/deleteRelationship */
export async function deleteRelationshipUsingDelete(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<string>('/api/graph/deleteRelationship', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** findNode POST /api/graph/findNode */
export async function findNodeUsingPost(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/graph/findNode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** findRelationship POST /api/graph/findRelationship */
export async function findRelationshipUsingPost(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/graph/findRelationship', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateNode PUT /api/graph/updateNode */
export async function updateNodeUsingPut(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<string>('/api/graph/updateNode', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateRelationship PUT /api/graph/updateRelationship */
export async function updateRelationshipUsingPut(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<string>('/api/graph/updateRelationship', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getAllNodesUsingPost POST /api/graph/getAllNodes */
export async function getAllNodesUsingPost(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/graph/getAllNodes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getAllRelationshipsUsingPost POST /api/graph/getAllRelationships */
export async function getAllRelationshipsUsingPost(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/graph/getAllRelationships', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
