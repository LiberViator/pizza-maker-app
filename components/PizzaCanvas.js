import { useEffect, useState, useRef } from "react";
import { useThree, Canvas } from "@react-three/fiber";

export default function PizzaCanvas({ currentStep }) {
	return (
		<section className="relative md:col-start-2 md:col-end-2 md:row-start-2 md:row-end-2">
			<Canvas
				style={{ position: "absolute" }}
				camera={{
					position: [3, currentStep, 2],
					fov: 75,
				}}
			>
				<ambientLight />
				<pointLight castShadow position={[10, 10, 10]} />
				<PizzaModel currentStep={currentStep} />
			</Canvas>
		</section>
	);
}

export function PizzaModel({ currentStep }) {
	// const { nodes, materials } = useGLTF("/model-transformed.glb");

	return (
		<>
			<mesh castShadow receiveShadow position={[0, currentStep, 0]} geometry={{}} material={{}}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="orange" />
			</mesh>
			<mesh castShadow receiveShadow position={[0, currentStep + 2, 0]}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="orange" />
			</mesh>
		</>
	);
}
