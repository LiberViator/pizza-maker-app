import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [options, setOptions] = useState({});
	return (
		<main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
			<div>
				<ul>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>
			<div>
				<div></div>
				<div></div>
			</div>
			<div>Model</div>
			<div>
				<button></button>
				<button></button>
			</div>
			<div>
				<div>Twoje zamówienie</div>

				<hr />
				<ul></ul>
				<hr />
				<div>
					<div>Razem:</div>
					<div>40PLN</div>
				</div>
			</div>
		</main>
	);
}
