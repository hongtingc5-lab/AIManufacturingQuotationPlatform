import * as THREE from 'three';

let occtInstance: any = null;

export async function initOCCT(): Promise<any> {
  if (occtInstance) return occtInstance;
  
  try {
    const { loadThreeMesh } = await import('occt-import-js');
    console.log('[OCCT] occt-import-js loaded successfully');
    occtInstance = { loadThreeMesh };
    return occtInstance;
  } catch (error) {
    console.error('[OCCT] Failed to load occt-import-js:', error);
    throw error;
  }
}

export async function parseSTEPWithOCCT(fileBuffer: ArrayBuffer): Promise<{
  meshes: THREE.Mesh[];
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  info: {
    faces: number;
    edges: number;
    solids: number;
  };
}> {
  const { loadThreeMesh } = await initOCCT();
  
  console.log('[OCCT] Parsing STEP file with OpenCASCADE WASM...');
  
  const meshes = await loadThreeMesh(fileBuffer, {
    readDouble: true,
    verbosity: 0,
  });
  
  console.log('[OCCT] Parsing complete, meshes:', meshes.length);
  
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  let totalFaces = 0;
  
  const threeMeshes: THREE.Mesh[] = [];
  
  for (const meshData of meshes) {
    const { position, normal, color, size, matrix } = meshData;
    
    if (!position || position.length === 0) continue;
    
    const geometry = new THREE.BufferGeometry();
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
    
    if (normal && normal.length > 0) {
      geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
    } else {
      geometry.computeVertexNormals();
    }
    
    const material = new THREE.MeshPhongMaterial({
      color: color ? new THREE.Color(color[0], color[1], color[2]) : 0x88ccff,
      side: THREE.DoubleSide,
      flatShading: false,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    if (size) {
      mesh.scale.set(size[0], size[1], size[2]);
    }
    
    threeMeshes.push(mesh);
    
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;
    if (bbox) {
      minX = Math.min(minX, bbox.min.x);
      minY = Math.min(minY, bbox.min.y);
      minZ = Math.min(minZ, bbox.min.z);
      maxX = Math.max(maxX, bbox.max.x);
      maxY = Math.max(maxY, bbox.max.y);
      maxZ = Math.max(maxZ, bbox.max.z);
    }
    
    totalFaces += position.length / 9;
  }
  
  if (threeMeshes.length === 0) {
    throw new Error('No meshes generated from STEP file');
  }
  
  console.log(`[OCCT] Generated ${threeMeshes.length} meshes, ~${totalFaces} faces`);
  
  return {
    meshes: threeMeshes,
    boundingBox: {
      min: { x: minX, y: minY, z: minZ },
      max: { x: maxX, y: maxY, z: maxZ },
    },
    info: {
      faces: totalFaces,
      edges: totalFaces * 3,
      solids: threeMeshes.length,
    },
  };
}

export function createBoundingBoxMesh(boundingBox: {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
}): THREE.Mesh {
  const { min, max } = boundingBox;
  
  const geometry = new THREE.BoxGeometry(
    max.x - min.x,
    max.y - min.y,
    max.z - min.z
  );
  
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 })
  );
  
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
  }));
  
  mesh.position.set(
    (min.x + max.x) / 2,
    (min.y + max.y) / 2,
    (min.z + max.z) / 2
  );
  
  return mesh;
}