declare module 'occt-import-js' {
  interface LoadThreeMeshOptions {
    readDouble?: boolean;
    verbosity?: number;
    linearDeflection?: number;
    angularDeflection?: number;
  }

  interface MeshData {
    position: number[];
    normal?: number[];
    color?: number[];
    size?: number[];
    matrix?: number[];
  }

  export function loadThreeMesh(arrayBuffer: ArrayBuffer, options?: LoadThreeMeshOptions): Promise<MeshData[]>;
  export function loadIfcMesh(arrayBuffer: ArrayBuffer, options?: LoadThreeMeshOptions): Promise<MeshData[]>;
}