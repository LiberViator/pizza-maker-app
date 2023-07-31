import { useEffect, useState, useRef } from "react";
import { useThree, Canvas } from "@react-three/fiber";
import { useGLTF, Bounds, useBounds } from "@react-three/drei";

export default function PizzaCanvas({ currentStep }) {
	return (
		<section className="relative lg:col-start-1 lg:col-end-4 lg:row-start-3 lg:row-end-3">
			<Canvas
				style={{ position: "absolute" }}
				camera={{
					position: [0.4, 0.4, 0.4],
					fov: 75,
				}}
			>
				<ambientLight />
				<pointLight castShadow position={[2, 2, 2]} />
				<PizzaModel currentStep={currentStep} />
			</Canvas>
		</section>
	);
}

export function PizzaModel({ currentStep }) {
	const { nodes, materials } = useGLTF("/pizza.gltf");
	// const bounds = useBounds();
	// useEffect(() => {
	// 	// Calculate scene bounds
	// 	bounds?.refresh().clip().fit();
	// });

	return (
		<Bounds fit clip observe margin={1}>
			<group dispose={null}>
				<mesh castShadow receiveShadow geometry={nodes.group1309335234.geometry} material={materials.mat14} />
				<mesh castShadow receiveShadow geometry={nodes.group13992555.geometry} material={materials.mat19} />
				<mesh castShadow receiveShadow geometry={nodes.group1051877250.geometry} material={materials.mat18} />
				<mesh castShadow receiveShadow geometry={nodes.group60956185.geometry} material={materials.mat21} />
				<mesh castShadow receiveShadow geometry={nodes.group1240131638.geometry} material={materials.mat8} />
				<mesh castShadow receiveShadow geometry={nodes.group1920391555.geometry} material={materials.mat8} />
				<mesh castShadow receiveShadow geometry={nodes.group1299724127.geometry} material={materials.mat8} />
				<mesh castShadow receiveShadow geometry={nodes.group273593077.geometry} material={materials.mat8} />
				<mesh castShadow receiveShadow geometry={nodes.group1908690590.geometry} material={materials.mat8} />
				<mesh castShadow receiveShadow geometry={nodes.group65050131.geometry} material={materials.mat8} />
				<mesh castShadow receiveShadow geometry={nodes.group866913526.geometry} material={materials.mat23} />
				<mesh castShadow receiveShadow geometry={nodes.group1445827536.geometry} material={materials.mat23} />
				<mesh castShadow receiveShadow geometry={nodes.group1974958938.geometry} material={materials.mat23} />
				<mesh castShadow receiveShadow geometry={nodes.group1990690964.geometry} material={materials.mat23} />
				<mesh castShadow receiveShadow geometry={nodes.group922813554.geometry} material={materials.mat23} />
				<mesh castShadow receiveShadow geometry={nodes.group69203596.geometry} material={materials.mat23} />
				<mesh castShadow receiveShadow geometry={nodes.group1376317551.geometry} material={materials.mat8} />
				<mesh castShadow receiveShadow geometry={nodes.group2021932393.geometry} material={materials.mat20} />
				<mesh castShadow receiveShadow geometry={nodes.group594165506.geometry} material={materials.mat20} />
				<mesh castShadow receiveShadow geometry={nodes.group754384981.geometry} material={materials.mat20} />
				<mesh castShadow receiveShadow geometry={nodes.group993462267.geometry} material={materials.mat20} />
				<mesh castShadow receiveShadow geometry={nodes.group1864783614.geometry} material={materials.mat20} />
				<mesh castShadow receiveShadow geometry={nodes.group617698938.geometry} material={materials.mat20} />
				<mesh castShadow receiveShadow geometry={nodes.group1369352001.geometry} material={materials.mat10} />
				<mesh castShadow receiveShadow geometry={nodes.group1642590618.geometry} material={materials.mat10} />
				<mesh castShadow receiveShadow geometry={nodes.group274291298.geometry} material={materials.mat10} />
				<mesh castShadow receiveShadow geometry={nodes.group1800032711.geometry} material={materials.mat10} />
				<mesh castShadow receiveShadow geometry={nodes.group2073463504.geometry} material={materials.mat10} />
				<mesh castShadow receiveShadow geometry={nodes.group565404572.geometry} material={materials.mat10} />
				<mesh castShadow receiveShadow geometry={nodes.group1475154722.geometry} material={materials.mat10} />
			</group>
		</Bounds>
	);
}

useGLTF.preload("/pizza.gltf");
