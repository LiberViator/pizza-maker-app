import { useEffect, useState } from "react";

export default function Home() {
	const [options, setOptions] = useState([]);
	const [currentOption, setCurrentOption] = useState({});
	const [order, setOrder] = useState([]);
	const [currentStep, setCurrentStep] = useState(0);

	useEffect(() => {
		fetch("/db/pizzaOptions.json")
			.then((res) => res.json())
			.then((data) => setOptions(data));
	}, []);
	useEffect(() => {
		setCurrentOption(
			options?.filter((_option) => {
				if (_option.id === currentStep) {
					return _option;
				}
			})[0]
		);
	}, [options, currentStep]);
	useEffect(() => {
		const defaultOrder = [];
		options.forEach((_option) => defaultOrder.push({ id: _option.id, name: _option.name, choosenOpt: _option.options[0] }));

		setOrder(defaultOrder);
	}, [options]);

	return (
		<main className="grid grid-rows-[auto,auto,1fr,auto,64px] overflow-hidden bg-amber-900 pt-4 md:grid-cols-[minmax(0px,256px),1fr,minmax(0px,256px)] md:grid-rows-[auto,1fr,auto] md:gap-8 md:px-6 md:py-6 lg:px-20 lg:py-20">
			<Steps options={options} currentStep={currentStep} />
			<Options currentOption={currentOption} order={order} setOrder={setOrder} />
			<Model />
			<Navigation options={options} currentStep={currentStep} setCurrentStep={setCurrentStep} />
			<Recipe order={order} />
		</main>
	);
}

export function Steps({ options, currentStep }) {
	return (
		<section className="flex overflow-x-scroll md:col-start-1 md:row-start-1 md:row-end-4 md:self-center md:justify-self-start">
			<ul className="flex flex-row gap-6 md:flex-col">
				{options?.map((_option) => (
					<li className={_option.id === currentStep ? "text-white" : "text-amber-600"} key={_option.id}>
						{_option.name}
					</li>
				))}
			</ul>
		</section>
	);
}

export function Options({ currentOption, order, setOrder }) {
	return (
		<section className="md:col-start-1 md:col-end-4 md:row-start-1 ">
			<div className="text-center text-amber-600">Choose {currentOption?.name}</div>
			<ul className="flex justify-center gap-6 text-white">
				{currentOption?.options?.map((_option) => (
					<li
						onClick={() =>
							setOrder(order?.map((_item) => (_item.id === currentOption.id ? { ..._item, choosenOpt: _option } : _item)))
						}
						key={_option.id}
					>
						{_option.name}
					</li>
				))}
			</ul>
		</section>
	);
}

export function Model() {
	return <section className="md:col-start-2 md:row-start-2">Model</section>;
}

export function Navigation({ options, currentStep, setCurrentStep }) {
	const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);
	const nextStep = () => currentStep < options?.length - 1 && setCurrentStep(currentStep + 1);

	return (
		<section className="flex w-full justify-center gap-4 justify-self-center md:col-start-2 md:col-end-2 md:row-start-3 md:row-end-3 md:self-end">
			<button onClick={prevStep} className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white">
				Prev
			</button>
			<button
				onClick={nextStep}
				className="flex h-12 max-w-[256px] flex-1 items-center justify-center rounded-3xl bg-white px-8"
			>
				Next
			</button>
		</section>
	);
}

export function Recipe({ order }) {
	const [price, setPrice] = useState();

	useEffect(() => {
		const pricesArray = [];
		order.forEach((_item) => pricesArray.push(_item.choosenOpt.price));
		setPrice(pricesArray.reduce((a, b) => a + b, 0));
	}, [order]);

	return (
		<section className="absolute inset-x-0 bottom-0 flex translate-y-[calc(100%-64px)] flex-col items-center rounded-t-xl  bg-stone-300 px-5 pb-8 pt-3 hover:translate-y-0 md:static md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-4 md:translate-y-0 md:self-end md:bg-transparent md:p-0">
			<span className="mb-4 h-1 w-20 rounded bg-white md:hidden"></span>
			<div className="flex w-full flex-col gap-4">
				<div>Twoje zamówienie</div>
				<hr className="" />
				<ul className="flex flex-col gap-4">
					{order.map((_item) => (
						<li>
							{_item.name}:{_item.choosenOpt.name}
						</li>
					))}
				</ul>
				<hr />
				<div className="flex justify-between">
					<div>Razem:</div>
					<div>{price}</div>
				</div>
			</div>
		</section>
	);
}
