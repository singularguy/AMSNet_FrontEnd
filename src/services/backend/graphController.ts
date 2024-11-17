// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addNode POST /api/graph/addNode */
export async function addNodeUsingPost(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<string>('/api/graph/addNode', {
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

/** findNode GET /api/graph/findNode */
export async function findNodeUsingGet(
  body: Record<string, any>,
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/graph/findNode', {
    method: 'GET',
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
