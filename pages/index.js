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
				if (_option.id == currentStep) {
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

	const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);
	const nextStep = () => currentStep < options?.length - 1 && setCurrentStep(currentStep + 1);

	return (
		<main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
			<Steps options={options} currentStep={currentStep} />
			<Options currentOption={currentOption} order={order} setOrder={setOrder} />
			<div>Model</div>
			<div>
				<button onClick={prevStep}>Prev</button>
				<button onClick={nextStep}>Next</button>
			</div>
			<Recipe order={order} />
		</main>
	);
}

export function Steps({ options, currentStep }) {
	return (
		<div>
			<ul>
				{options?.map((_option) => (
					<li className={_option.id == currentStep && "font-bold"} key={_option.id}>
						{_option.name}
					</li>
				))}
			</ul>
		</div>
	);
}

export function Options({ currentOption, order, setOrder }) {
	return (
		<div>
			<div>{currentOption?.name}</div>
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
		</div>
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
		<div>
			<div>Twoje zamówienie</div>
			<hr />
			{order.map((_item) => (
				<li>
					{_item.name}:{_item.choosenOpt.name}
				</li>
			))}
			<hr />
			<div>
				<div>Razem:</div>
				<div>{price}</div>
			</div>
		</div>
	);
}
