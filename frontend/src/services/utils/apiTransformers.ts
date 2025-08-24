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
export const mapDocumentFields = <T extends Record<string, any>>(doc: T): T => {
  if (!doc) return doc;
  
  // Create a new object to avoid mutation
  const mapped = { ...doc };
  
  // If there's _id but no id, or _id is different from id, prefer _id
  if (doc._id && !doc.id) {
    mapped.id = doc._id;
  }
  
  // Handle nested objects (like user in reviews)
  Object.keys(mapped).forEach(key => {
    const value = mapped[key];
    
    // Handle nested objects
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      mapped[key] = mapDocumentFields(value);
    }
    
    // Handle arrays of objects
    if (Array.isArray(value)) {
      mapped[key] = value.map(item => 
        typeof item === 'object' && item !== null ? mapDocumentFields(item) : item
      );
    }
  });
  
  return mapped;
};

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