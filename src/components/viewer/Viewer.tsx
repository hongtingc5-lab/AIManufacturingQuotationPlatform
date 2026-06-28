'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { parseSTL } from '@/lib/stl-loader';
import { useStore } from '@/store/useStore';
import { parseSTEP, extractSTEPInfo } from '@/lib/step-parser';
import { parseSTEPWithOCCT, createBoundingBoxMesh } from '@/lib/occt-parser';
import { STEPService } from '@/services/step-service';

function STEPModelLoader() {
  const { fileInfo, setViewerReady, setModelGeometry } = useStore();
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!fileInfo) return;

    const fileName = fileInfo.file.name.toLowerCase();

    if (fileName.endsWith('.stl')) {
      loadSTLFile(fileInfo.file);
    } else if (fileName.endsWith('.step') || fileName.endsWith('.stp')) {
      loadSTEPFile(fileInfo.file);
    } else {
      fallbackToBox();
    }
  }, [fileInfo, setViewerReady, setModelGeometry]);

  async function loadSTLFile(file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;

      try {
        const geometry = parseSTL(arrayBuffer);

        if (groupRef.current) {
          groupRef.current.clear();

          const material = new THREE.MeshStandardMaterial({
            color: '#4a90e2',
            metalness: 0.5,
            roughness: 0.3,
          });

          const mesh = new THREE.Mesh(geometry, material);

          const boundingBox = new THREE.Box3().setFromObject(mesh);
          const center = boundingBox.getCenter(new THREE.Vector3());

          mesh.position.sub(center);

          groupRef.current.add(mesh);

          const size = new THREE.Vector3();
          boundingBox.getSize(size);
          const volume = size.x * size.y * size.z;
          const surfaceArea = estimateSurfaceArea(geometry);

          setModelGeometry({
            volume: volume,
            surfaceArea: surfaceArea,
            boundingBox: {
              min: { x: boundingBox.min.x - center.x, y: boundingBox.min.y - center.y, z: boundingBox.min.z - center.z },
              max: { x: boundingBox.max.x - center.x, y: boundingBox.max.y - center.y, z: boundingBox.max.z - center.z },
            },
            faceCount: geometry.attributes.position.count / 3,
            edgeCount: geometry.attributes.position.count,
            vertexCount: geometry.attributes.position.count,
            bodies: [{
              id: 'body-1',
              name: file.name.replace('.stl', '').replace('.STL', ''),
              volume: volume,
              surfaceArea: surfaceArea,
              weight: volume * 0.001 * 1.05,
              material: 'ABS',
              faceCount: geometry.attributes.position.count / 3,
              edgeCount: geometry.attributes.position.count,
              boundingBox: {
                min: { x: boundingBox.min.x, y: boundingBox.min.y, z: boundingBox.min.z },
                max: { x: boundingBox.max.x, y: boundingBox.max.y, z: boundingBox.max.z },
              },
            }],
          });

          setViewerReady(true);
        }
      } catch (error) {
        console.error('STL加载失败:', error);
        fallbackToBox();
      }
    };

    reader.onerror = () => {
      console.error('文件读取失败');
      fallbackToBox();
    };

    reader.readAsArrayBuffer(file);
  }

  async function loadSTEPFile(file: File) {
    console.log('[Viewer] 开始加载STEP文件:', file.name);
    
    try {
      console.log('[Viewer] 尝试使用后端服务分析...');
      const analysisResult = await STEPService.analyzeSTEP(file);
      
      if (!analysisResult.success) {
        throw new Error(analysisResult.error);
      }
      
      const volume = parseFloat(analysisResult.volume);
      const surfaceArea = parseFloat(analysisResult.surfaceArea);
      const weight = parseFloat(analysisResult.weight);
      
      console.log('[Viewer] 尝试使用后端服务转换网格...');
      const convertResult = await STEPService.convertToGLB(file);
      
      if (convertResult.success && convertResult.meshes && convertResult.meshes.length > 0) {
        console.log('[Viewer] 网格数据加载成功，正在渲染...');
        
        if (groupRef.current) {
          groupRef.current.clear();
          
          let minX = Infinity, minY = Infinity, minZ = Infinity;
          let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
          
          for (const meshData of convertResult.meshes) {
            const { position, normal, index, color } = meshData;
            
            if (!position || position.length === 0) continue;
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
            
            if (normal && normal.length > 0) {
              geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3));
            } else {
              geometry.computeVertexNormals();
            }
            
            if (index && index.length > 0) {
              geometry.setIndex(new THREE.Uint32BufferAttribute(index, 1));
            }
            
            const colorHex = color ? (color[0] * 255) << 16 | (color[1] * 255) << 8 | (color[2] * 255) : 0x4a90e2;
            
            const material = new THREE.MeshStandardMaterial({
              color: colorHex,
              metalness: 0.5,
              roughness: 0.3,
              side: THREE.DoubleSide,
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            groupRef.current.add(mesh);
            
            const positions = geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
              minX = Math.min(minX, positions[i]);
              minY = Math.min(minY, positions[i + 1]);
              minZ = Math.min(minZ, positions[i + 2]);
              maxX = Math.max(maxX, positions[i]);
              maxY = Math.max(maxY, positions[i + 1]);
              maxZ = Math.max(maxZ, positions[i + 2]);
            }
          }
          
          const center = new THREE.Vector3(
            (minX + maxX) / 2,
            (minY + maxY) / 2,
            (minZ + maxZ) / 2
          );
          
          groupRef.current.position.sub(center);
          
          const boundingBox = {
            min: { x: minX - center.x, y: minY - center.y, z: minZ - center.z },
            max: { x: maxX - center.x, y: maxY - center.y, z: maxZ - center.z },
          };
          
          const boundingVolume = (maxX - minX) * (maxY - minY) * (maxZ - minZ);
          
          setModelGeometry({
            volume: boundingVolume,
            surfaceArea: surfaceArea,
            boundingBox: boundingBox,
            faceCount: analysisResult.topology.faces,
            edgeCount: analysisResult.topology.edges,
            vertexCount: analysisResult.topology.vertices,
            bodies: [{
              id: 'body-1',
              name: analysisResult.model.name || file.name.replace(/\.(step|stp|STEP|STP)$/, ''),
              volume: volume,
              surfaceArea: surfaceArea,
              weight: weight,
              material: 'ABS',
              faceCount: analysisResult.topology.faces,
              edgeCount: analysisResult.topology.edges,
              boundingBox: {
                min: { x: minX, y: minY, z: minZ },
                max: { x: maxX, y: maxY, z: maxZ },
              },
            }],
          });
          
          setViewerReady(true);
          console.log('[Viewer] STEP模型渲染成功');
        }
      } else {
        console.warn('[Viewer] 网格转换失败，使用分析数据显示包围盒:', convertResult.error);
        fallbackToBoxWithInfo(analysisResult);
      }
    } catch (error) {
      console.warn('[Viewer] 后端服务不可用，回退到包围盒显示:', error);
      fallbackToBox();
    }
  }

  function estimateSurfaceArea(geometry: THREE.BufferGeometry): number {
    const positions = geometry.attributes.position;
    let area = 0;

    for (let i = 0; i < positions.count; i += 3) {
      const v1 = new THREE.Vector3().fromBufferAttribute(positions, i);
      const v2 = new THREE.Vector3().fromBufferAttribute(positions, i + 1);
      const v3 = new THREE.Vector3().fromBufferAttribute(positions, i + 2);

      const cross = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(v2, v1),
        new THREE.Vector3().subVectors(v3, v1)
      );

      area += cross.length() / 2;
    }

    return area;
  }

  function fallbackToBox() {
    if (groupRef.current) {
      groupRef.current.clear();

      const material = new THREE.MeshStandardMaterial({
        color: '#4a90e2',
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.7,
      });

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 60, 20), material);
      groupRef.current.add(mesh);
    }

    setModelGeometry({
      volume: 125000,
      surfaceArea: 15000,
      boundingBox: {
        min: { x: -50, y: -30, z: -10 },
        max: { x: 50, y: 30, z: 10 },
      },
      faceCount: 42,
      edgeCount: 84,
      vertexCount: 28,
      bodies: [{
        id: 'body-1',
        name: fileInfo?.file.name.replace('.step', '').replace('.stp', '').replace('.STEP', '').replace('.STP', '') || '模型',
        volume: 125000,
        surfaceArea: 15000,
        weight: 130,
        material: 'ABS',
        faceCount: 42,
        edgeCount: 84,
        boundingBox: {
          min: { x: -50, y: -30, z: -10 },
          max: { x: 50, y: 30, z: 10 },
        },
      }],
    });

    setViewerReady(true);
  }

  function fallbackToBoxWithInfo(analysis: any) {
    if (groupRef.current) {
      groupRef.current.clear();

      const length = parseFloat(analysis.dimensions?.length) || 100;
      const width = parseFloat(analysis.dimensions?.width) || 60;
      const height = parseFloat(analysis.dimensions?.height) || 20;

      const material = new THREE.MeshStandardMaterial({
        color: '#4a90e2',
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.7,
      });

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(length, width, height), material);
      mesh.position.set(-length / 2, -width / 2, -height / 2);
      groupRef.current.add(mesh);
    }

    setViewerReady(true);
  }

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return <group ref={groupRef} />;
}

function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(150, 100, 150);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return null;
}

export default function Viewer() {
  const { fileInfo } = useStore();

  return (
    <div className="viewer-container w-full h-full rounded-lg overflow-hidden relative">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[150, 100, 150]} fov={50} />
          <CameraController />

          <ambientLight intensity={0.4} />
          <directionalLight
            position={[100, 100, 50]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-100, 100, -100]} intensity={0.5} />

          <Environment preset="city" />

          <Grid
            args={[500, 500]}
            cellSize={10}
            cellThickness={0.5}
            cellColor="#6366f1"
            sectionSize={50}
            sectionThickness={1}
            sectionColor="#9333ea"
            fadeDistance={500}
            fadeStrength={1}
            followCamera={false}
          />

          {fileInfo ? (
            <STEPModelLoader />
          ) : (
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[5, 32, 32]} />
              <meshStandardMaterial color="#6366f1" wireframe />
            </mesh>
          )}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={50}
            maxDistance={500}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>

      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 space-y-2">
        <button className="w-10 h-10 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {!fileInfo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <div className="text-xl font-semibold text-white mb-2">请上传文件</div>
            <div className="text-sm text-gray-400">支持 .step, .stp, .stl 格式</div>
          </div>
        </div>
      )}

      
    </div>
  );
}