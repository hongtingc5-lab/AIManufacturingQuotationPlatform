import * as THREE from 'three';

export function parseSTL(arrayBuffer: ArrayBuffer): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  const view = new DataView(arrayBuffer);
  const isBinary = view.getUint8(0) !== 115;

  if (isBinary) {
    return parseBinarySTL(view, geometry);
  } else {
    return parseASCIISTL(arrayBuffer, geometry);
  }
}

function parseBinarySTL(view: DataView, geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const headerLength = 80;
  const trianglesCount = view.getUint32(headerLength, true);
  
  const vertices: number[] = [];
  const normals: number[] = [];
  
  let offset = headerLength + 4;
  
  for (let i = 0; i < trianglesCount; i++) {
    const nx = view.getFloat32(offset, true);
    const ny = view.getFloat32(offset + 4, true);
    const nz = view.getFloat32(offset + 8, true);
    
    for (let j = 0; j < 3; j++) {
      const x = view.getFloat32(offset + 12 + j * 12, true);
      const y = view.getFloat32(offset + 16 + j * 12, true);
      const z = view.getFloat32(offset + 20 + j * 12, true);
      
      vertices.push(x, y, z);
      normals.push(nx, ny, nz);
    }
    
    offset += 50;
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  
  return geometry;
}

function parseASCIISTL(arrayBuffer: ArrayBuffer, geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const textDecoder = new TextDecoder('utf-8');
  const content = textDecoder.decode(arrayBuffer);
  
  const vertices: number[] = [];
  const vertexRegex = /vertex\s+([\d.+-]+)\s+([\d.+-]+)\s+([\d.+-]+)/g;
  
  let match;
  while ((match = vertexRegex.exec(content)) !== null) {
    vertices.push(
      parseFloat(match[1]),
      parseFloat(match[2]),
      parseFloat(match[3])
    );
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  
  return geometry;
}