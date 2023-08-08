import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Montserrat } from "next/font/google";

import PizzaCanvas from "@/components/PizzaCanvas";

const font = Montserrat({ subsets: ["latin"] });

export default function Home() {
	const [components, setComponent] = useState([]);
	const [choosenOptions, setChoosenOptions] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);
	const [total, setTotal] = useState(0);
	const [windowSize, setWindowSize] = useState({ innerWidth: 0, innerHeight: 0 });

	// Updating window size
	useLayoutEffect(() => {
		function updateWindowSize() {
			setWindowSize({ innerWidth: window.innerWidth, innerHeight: window.innerHeight });
		}
		window.addEventListener("resize", updateWindowSize);
	}, []);
	// Fetching data
	useEffect(() => {
		fetch("/db/pizzaOptions.json")
			.then((res) => res.json())
			.then((data) => setComponent(data));
	}, []);
	// Updating choosing options
	useEffect(() => {
		const newOptions = components.map((_component) => ({
			componentId: _component.id,
			componentName: _component.name,
			choosenOpt: _component.options[0],
		}));
		setChoosenOptions(newOptions);
	}, [components]);
	// Calculating total
	useEffect(() => {
		const pricesArray = choosenOptions.map((choosenOption) => choosenOption.choosenOpt?.price || 0);
		const totalPrice = pricesArray.reduce((a, b) => a + b, 0);
		setTotal(totalPrice);
	}, [choosenOptions]);

	const currentComponent = components.find((_component) => _component.id === currentStep) || {};
	const currentComponentChoosenOptions =
		choosenOptions.find((choosenOption) => choosenOption.componentId === currentComponent.id) || {};

	return (
		<main
			className={`grid grid-rows-[auto,auto,1fr,auto,64px] gap-8 overflow-hidden bg-amber-900 pt-4 lg:grid-cols-[minmax(160px,min(24%,320px)),1fr,minmax(160px,min(24%,320px))] lg:grid-rows-[auto,auto,1fr,auto] lg:px-6 lg:pt-6 xl:px-20 xl:pt-16 ${font.className}`}
		>
			<Steps components={components} currentStep={currentStep} setCurrentStep={setCurrentStep} windowSize={windowSize} />
			<Options
				currentComponent={currentComponent}
				choosenOptions={choosenOptions}
				setChoosenOptions={setChoosenOptions}
				currentComponentChoosenOptions={currentComponentChoosenOptions}
				windowSize={windowSize}
			/>
			<PizzaCanvas currentStep={currentStep} />
			<Navigation
				components={components}
				choosenOptions={choosenOptions}
				currentStep={currentStep}
				setCurrentStep={setCurrentStep}
				total={total}
			/>
			<Recipe choosenOptions={choosenOptions} total={total} />
		</main>
	);
}

export function Steps({ components, currentStep, setCurrentStep, windowSize }) {
	const [activeStepPos, setActiveStepPos] = useState(0);
	const stepContainer = useRef(null);

	const chooseStep = (stepId) => {
		setCurrentStep(stepId);
	};

	useEffect(() => {
		const activeStep = document.querySelector(".active_step");
		const stepCenter = activeStep?.offsetLeft + activeStep?.offsetWidth / 2;
		const calcPos = stepContainer.current.offsetWidth / 2 - stepCenter;
		setActiveStepPos(calcPos);
	}, [components, currentStep, windowSize]);

	return (
		<section className="overflow-x-hidden lg:col-start-1 lg:col-end-4 lg:row-start-1">
			<div ref={stepContainer} className="relative">
				<ul
					style={{
						transform: `translateX(${activeStepPos}px)`,
					}}
					className="flex w-fit items-center gap-6 transition-[transform,color] duration-200 lg:gap-8"
				>
					{components.map((_component) => (
						<li
							className={
								_component.id === currentStep ? "active_step text-xl text-white" : "text-base font-light text-amber-600"
							}
							key={_component.id}
						>
							<button onClick={() => chooseStep(_component.id)}>
								<span className="uppercase">{_component.name}</span>
							</button>
						</li>
					))}
				</ul>
				<span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-amber-900 via-amber-900/0 to-amber-900"></span>
			</div>
		</section>
	);
}

export function Options({ currentComponent, choosenOptions, setChoosenOptions, currentComponentChoosenOptions, windowSize }) {
	const [activeOptionPos, setActiveOptionPos] = useState(0);
	const optContainer = useRef(null);

	const updateChoosenOptions = (currentComponentOption) => {
		const updatedOptions = choosenOptions.map((_choosenOption) =>
			_choosenOption.componentId === currentComponent.id
				? { ..._choosenOption, choosenOpt: currentComponentOption }
				: _choosenOption
		);
		setChoosenOptions(updatedOptions);
	};

	useEffect(() => {
		const activeOpt = document.querySelector(".active_option");
		const calcPos = optContainer.current.offsetWidth / 2 - (activeOpt?.offsetLeft + activeOpt?.offsetWidth / 2);
		setActiveOptionPos(calcPos);
	}, [currentComponent, choosenOptions, windowSize]);

	return (
		<section className="overflow-x-hidden lg:col-start-1 lg:col-end-4 lg:row-start-2">
			<div className="mb-2 text-center text-amber-600">Choose options</div>
			<div ref={optContainer} className="relative">
				<ul
					style={{
						transform: `translateX(${activeOptionPos}px)`,
					}}
					className="flex w-fit items-center gap-6 transition-[transform,color] duration-200 lg:gap-8"
				>
					{currentComponent.options?.map((_currentComponentOption) => (
						<li
							key={_currentComponentOption.id}
							className={
								currentComponentChoosenOptions.choosenOpt?.id === _currentComponentOption.id
									? "active_option text-xl text-white"
									: "font-light text-amber-600"
							}
						>
							<button onClick={() => updateChoosenOptions(_currentComponentOption)}>
								<span className="uppercase">{_currentComponentOption.name}</span>
							</button>
						</li>
					))}
				</ul>
				<span className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-amber-900 via-amber-900/0 to-amber-900"></span>
			</div>
		</section>
	);
}

export function Navigation({ components, choosenOptions, currentStep, setCurrentStep, total }) {
	const message = `Your order:\n${choosenOptions.map(
		(_choosenOption) => `\n${_choosenOption.componentName}: ${_choosenOption.choosenOpt?.name}`
	)}\n\nTotal: ${total}`;

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};
	const nextStep = () => {
		if (currentStep < components.length - 1) {
			setCurrentStep(currentStep + 1);
		} else if ((currentStep = components.length - 1)) {
			alert(message);
		}
	};

	return (
		<section className="paddings flex w-full justify-center gap-4 justify-self-center lg:col-start-2 lg:col-end-2 lg:row-start-4 lg:row-end-4 lg:mb-6 lg:self-end xl:mb-16">
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
				{currentStep < components.length - 1 ? "Next" : "Finish"}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="absolute right-3 h-6 w-6"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</section>
	);
}

export function Recipe({ choosenOptions, total }) {
	const [isLocked, setIsLocked] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleOpen = (state) => !isLocked && setIsOpen(state);

	return (
		<>
			<section
				className={`${
					isOpen ? "translate-y-0 duration-300" : "translate-y-[calc(100%-64px)] duration-200"
				} absolute inset-x-0 bottom-0 z-10 flex max-h-[calc(100vh-32px)] flex-col items-center px-2 transition-transform lg:static lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-5 lg:self-end lg:px-0`}
				onClick={() => !isOpen && handleOpen(!isOpen)}
				onMouseEnter={() => handleOpen(true)}
				onMouseLeave={() => handleOpen(false)}
			>
				<span className="h-2 w-full max-w-sm bg-recipe-pattern bg-repeat-x"></span>
				<div className="pointer-events-auto relative flex w-full max-w-sm flex-col items-center bg-white px-5 pb-8 pt-6">
					<div className="flex h-auto w-full flex-col gap-4 overflow-y-auto text-amber-950 lg:overflow-y-auto lg:text-black">
						<div className="flex justify-between">
							<span>Your order</span>
							<span className={`${isOpen ? "opacity-0" : ""} text-right transition-opacity`}>{total}</span>
						</div>
						<hr className="border-gray-200" />
						<ul className="flex flex-col gap-4">
							{choosenOptions.map((_choosenOption) => (
								<li className="flex w-full gap-3 overflow-x-hidden capitalize" key={_choosenOption.componentId}>
									<span className="text-amber-600">{_choosenOption.componentName}:</span>
									<span className="flex-grow">{_choosenOption.choosenOpt?.name}</span>
									<span className="text-right text-amber-600">{_choosenOption.choosenOpt?.price}</span>
								</li>
							))}
						</ul>
						<hr className="border-gray-200" />
						<div className="flex justify-between">
							<span>Total</span>
							<span className="text-right">{total}</span>
						</div>
					</div>
				</div>
			</section>
			<aside className={`${!isOpen ? "hidden" : ""} absolute inset-0`} onClick={() => isOpen && handleOpen(!isOpen)}></aside>
		</>
	);
}
