
/* eslint-disable @typescript-eslint/no-explicit-any */

// GET
export interface SingleDocResponse<T> {
  status: string;
  data: {
    doc: T;
  };
}

export interface MultiDocsResponse<T> {
  status: string;
  results?: number;
  data: {
    docs: T[];
  };
}

// CREATE
export interface CreateResponse<T> {
  status: string;
  data: {
    data: T;
  };
}

export interface ErrorResponse {
  status: 'fail' | 'error';
  message: string;
  error?: any;
}

/**
 * Transform single document response (GET operations)
 * Handles: { status, data: { doc: T } }
 */
export const transformSingle = <T>(response: SingleDocResponse<T>): T => {
  return response.data.doc;
};

/**
 * Transform multiple documents response (GET operations)
 * Handles: { status, results, data: { docs: T[] } }
 */
export const transformMultiple = <T>(response: MultiDocsResponse<T>): T[] => {
  return response.data.docs;
};

/**
 * Transform create operation response (POST operations)
 * Handles: { status, data: { data: T } }
 */
export const transformCreate = <T>(response: CreateResponse<T>): T => {
  return response.data.data;
};

/**
 * Field mapper for backend _id to frontend id consistency
 */
interface HasId {
  id?: string;
  _id?: string;
  [key: string]: any;
}

export function mapDocumentFields<T extends HasId>(doc: T): T & { id: string } {
  const result = { ...doc } as any;
  
  // Map _id to id
  if ('_id' in doc && doc._id) {
    result.id = doc._id;
    delete result._id;
  } else if (!result.id) {
    // Generate a random id if neither exists
    result.id = Math.random().toString(36).substr(2, 9);
  }

  // Map nested objects
  Object.keys(result).forEach(key => {
    const value = result[key];
    
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        // Map array of objects
        result[key] = value.map(item => {
          if (item && typeof item === 'object' && ('_id' in item || 'id' in item)) {
            return mapDocumentFields(item);
          }
          return item;
        });
      } else if ('_id' in value || 'id' in value) {
        // Map nested objects
        result[key] = mapDocumentFields(value);
      }
    }
  });
  
  return result as T & { id: string };
}

/**
 * Complete transformation pipeline for single document (GET)
 */
export const transformSingleWithMapping = <T extends Record<string, any>>(
  response: SingleDocResponse<T>
): T => {
  const doc = transformSingle(response);
  return mapDocumentFields(doc);
};

/**
 * Complete transformation pipeline for multiple documents (GET)
 */
export const transformMultipleWithMapping = <T extends Record<string, any>>(
  response: MultiDocsResponse<T>
): T[] => {
  const docs = transformMultiple(response);
  return docs.map(doc => mapDocumentFields(doc));
};

/**
 * Complete transformation pipeline for create operations (POST)
 */
export const transformCreateWithMapping = <T extends Record<string, any>>(
  response: CreateResponse<T>
): T => {
  const doc = transformCreate(response);
  return mapDocumentFields(doc);
};

// Legacy exports for backward compatibility
export {
  transformSingle as transformSingleDoc,
  transformMultiple as transformMultipleDocs,
  transformCreate as transformCreateDoc
};