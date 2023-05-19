import { useEffect, useState } from "react";
import { Montserrat } from "next/font/google";

import PizzaCanvas from "@/components/PizzaCanvas";

const font = Montserrat({ subsets: ["latin"] });

export default function Home() {
	const [components, setComponent] = useState([]);
	const [choosenOptions, setChoosenOptions] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		fetch("/db/pizzaOptions.json")
			.then((res) => res.json())
			.then((data) => setComponent(data));
	}, []);
	useEffect(() => {
		const newOptions = components.map((_component) => ({
			componentId: _component.id,
			componentName: _component.name,
			choosenOpt: _component.options[0],
		}));
		setChoosenOptions(newOptions);
	}, [components]);

	const currentComponent = components.find((_component) => _component.id === currentStep) || {};
	const currentComponentChoosenOptions =
		choosenOptions.find((choosenOption) => choosenOption.componentId === currentComponent.id) || {};

	return (
		<main
			className={`grid grid-rows-[auto,auto,1fr,auto,64px] gap-8 overflow-hidden bg-amber-900 pt-4 md:grid-cols-[minmax(160px,min(16%,256px)),1fr,minmax(160px,min(16%,256px))] md:grid-rows-[auto,1fr,auto] md:px-6 md:py-6 lg:px-20 lg:py-20 ${font.className}`}
		>
			<Steps components={components} currentStep={currentStep} setCurrentStep={setCurrentStep} />
			<Options
				currentComponent={currentComponent}
				choosenOptions={choosenOptions}
				setChoosenOptions={setChoosenOptions}
				currentComponentChoosenOptions={currentComponentChoosenOptions}
			/>
			<PizzaCanvas currentStep={currentStep} />
			<Navigation components={components} currentStep={currentStep} setCurrentStep={setCurrentStep} />
			<Recipe choosenOptions={choosenOptions} />
		</main>
	);
}

export function Steps({ components, currentStep, setCurrentStep }) {
	const chooseStep = (stepId) => {
		setCurrentStep(stepId);
	};

	return (
		<section className="flex overflow-x-hidden md:col-start-1 md:row-start-1 md:row-end-4 md:self-center md:justify-self-start">
			<ul className="flex flex-row gap-6 md:flex-col">
				{components.map((_component) => (
					<li
						className={_component.id === currentStep ? "text-xl/6 text-white" : "text-base/6 text-amber-600"}
						key={_component.id}
					>
						<a href="#" onClick={() => chooseStep(_component.id)}>
							<span className="uppercase">{_component.name}</span>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}

export function Options({ currentComponent, choosenOptions, setChoosenOptions, currentComponentChoosenOptions }) {
	const updateChoosenOptions = (currentComponentOption) => {
		const updatedOptions = choosenOptions.map((_choosenOption) =>
			_choosenOption.componentId === currentComponent.id
				? { ..._choosenOption, choosenOpt: currentComponentOption }
				: _choosenOption
		);
		setChoosenOptions(updatedOptions);
	};

	return (
		<section className="md:col-start-1 md:col-end-4 md:row-start-1">
			<div className="mb-2 text-center text-amber-600">
				Choose <span className="capitalize">{currentComponent.name}</span>
			</div>
			<div className="relative">
				<ul className="flex justify-center gap-6 text-white">
					{currentComponent.options?.map((_currentComponentOption) => (
						<li key={_currentComponentOption.id}>
							<a href="#" onClick={() => updateChoosenOptions(_currentComponentOption)}>
								<span
									className={`text-center text-xl uppercase ${
										currentComponentChoosenOptions.choosenOpt?.id === _currentComponentOption.id
											? "text-white"
											: "text-amber-600"
									}`}
								>
									{_currentComponentOption.name}
								</span>
							</a>
						</li>
					))}
				</ul>
				<span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-amber-900 via-amber-900/0 to-amber-900 "></span>
			</div>
		</section>
	);
}

export function Navigation({ components, currentStep, setCurrentStep }) {
	const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);
	const nextStep = () => currentStep < components.length - 1 && setCurrentStep(currentStep + 1);

	return (
		<section className="flex w-full justify-center gap-4 justify-self-center md:col-start-2 md:col-end-2 md:row-start-3 md:row-end-3 md:self-end">
			<button onClick={prevStep} className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white shadow-xl">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="h-6 w-6"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>
			<button
				onClick={nextStep}
				className="relative flex h-12 max-w-[256px] flex-1 items-center justify-center rounded-3xl bg-white px-8 shadow-xl"
			>
				Next
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="absolute  right-3 h-6 w-6"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</section>
	);
}

export function Recipe({ choosenOptions }) {
	const [total, setTotal] = useState();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const pricesArray = choosenOptions.map((choosenOption) => choosenOption.choosenOpt?.price || 0);
		const totalPrice = pricesArray.reduce((a, b) => a + b, 0);
		setTotal(totalPrice);
	}, [choosenOptions]);
	useEffect(() => {});

	return (
		<section
			className={`${
				isOpen && "translate-y-0"
			} absolute inset-x-0 bottom-0 flex translate-y-[calc(100%-64px)] cursor-pointer flex-col items-center rounded-t-xl bg-stone-300 px-5 pb-8 pt-3  md:static md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-4 md:translate-y-0 md:self-end md:bg-transparent md:p-0`}
			onClick={() => setIsOpen(!isOpen)}
		>
			<span className="mb-4 h-1 w-20 rounded bg-white md:hidden"></span>
			<div className="flex w-full flex-col gap-4 text-amber-950 md:text-white">
				<div className="">Your order</div>
				<hr className="" />
				<ul className="flex flex-col gap-4">
					{choosenOptions.map((_choosenOption) => (
						<li key={_choosenOption.componentId}>
							<span className="flex gap-3 capitalize">
								<span className="text-amber-600">{_choosenOption.componentName}:</span>{" "}
								<span className="w-full">{_choosenOption.choosenOpt?.name}</span>
								<span className="text-right text-amber-600">{_choosenOption.choosenOpt?.price}</span>
							</span>
						</li>
					))}
				</ul>
				<hr />
				<div className="flex justify-between">
					<span>Total</span>
					<span className="text-right">{total}</span>
				</div>
			</div>
		</section>
	);
}
