/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 🔧 Unified API Response Transformers
 * Handles the different response formats from backend factory controllers
 */

// Generic API response interfaces
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

export interface ErrorResponse {
  status: 'fail' | 'error';
  message: string;
  error?: any;
}

/**
 * Transform single document response
 * Handles: { status, data: { doc: T } }
 */
export const transformSingleDoc = <T>(response: SingleDocResponse<T>): T => {
  return response.data.doc;
};

/**
 * Transform multiple documents response  
 * Handles: { status, results, data: { docs: T[] } }
 */
export const transformMultipleDocs = <T>(response: MultiDocsResponse<T>): T[] => {
  return response.data.docs;
};

/**
 * Field mapper for backend _id to frontend id consistency
 * Handles the _id -> id transformation that you do in your services
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
    // Generate a random id
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
 * Complete transformation pipeline for single document
 * Combines response extraction + field mapping
 */
export const transformSingle = <T extends Record<string, any>>(
  response: SingleDocResponse<T>
): T => {
  const doc = transformSingleDoc(response);
  return mapDocumentFields(doc);
};

/**
 * Complete transformation pipeline for multiple documents
 * Combines response extraction + field mapping for arrays
 */
export const transformMultiple = <T extends Record<string, any>>(
  response: MultiDocsResponse<T>
): T[] => {
  const docs = transformMultipleDocs(response);
  return docs.map(doc => mapDocumentFields(doc));
};

/**
 * Smart transformer that detects response type automatically
 * Use this when you're not sure if the response contains single or multiple docs
 */
export const transformResponse = <T extends Record<string, any>>(
  response: SingleDocResponse<T> | MultiDocsResponse<T>
): T | T[] => {
  // Check if it's a multiple docs response
  if ('data' in response && 'docs' in response.data) {
    return transformMultiple(response as MultiDocsResponse<T>);
  }
  
  // Check if it's a single doc response
  if ('data' in response && 'doc' in response.data) {
    return transformSingle(response as SingleDocResponse<T>);
  }
  
  // Fallback - return as is
  console.warn('⚠️ Unknown response format, returning as-is:', response);
  return response as any;
};