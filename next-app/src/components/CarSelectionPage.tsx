import React from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Fuel, Gauge, Users, Cog } from "lucide-react";

export type CarOption = {
	id: string;
	name: string;
	model: string;
	price: number;
	image: string;
	badge?: string;
	specs: {
		mpg: string;
		horsepower: string;
		seats: string;
		transmission: string;
	};
	features: string[];
};

type CarSelectionPageProps = {
	onSelectCar: (car: CarOption) => void;
	formData: {
		monthlyBudget: string;
		creditScore: string;
	};
	selectedCar?: CarOption | null;
	explanation?: string | null;
};

export default function CarSelectionPage({
	onSelectCar,
	formData,
	selectedCar,
	explanation,
}: CarSelectionPageProps) {
	const monthlyBudget = parseFloat(formData.monthlyBudget);

	// refs for auto-scroll
	const containerRef = React.useRef<HTMLDivElement | null>(null);
	const cardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

	React.useEffect(() => {
		if (selectedCar && containerRef.current && cardRefs.current[selectedCar.id]) {
			const el = cardRefs.current[selectedCar.id];
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	}, [selectedCar]);

	const cars: CarOption[] = [
		{
			id: "corolla",
			name: "Toyota Corolla",
			model: "2024 LE",
			price: 27500,
			image:
				"https://images.unsplash.com/photo-1619682817481-e994891cd1f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBjb3JvbGxhfGVufDF8fHx8MTc2MDgyMzAzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			badge: monthlyBudget < 400 ? "Best Value" : undefined,
			specs: {
				mpg: "32/41 MPG",
				horsepower: "169 HP",
				seats: "5 Seats",
				transmission: "CVT",
			},
			features: [
				"Toyota Safety Sense 3.0",
				"Apple CarPlay & Android Auto",
				"LED Headlights",
				"Adaptive Cruise Control",
			],
		},
		{
			id: "camry",
			name: "Toyota Camry",
			model: "2024 SE",
			price: 32500,
			image:
				"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBjYW1yeXxlbnwxfHx8fDE3NjA3OTUzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			badge: "Recommended",
			specs: {
				mpg: "28/39 MPG",
				horsepower: "203 HP",
				seats: "5 Seats",
				transmission: "8-Speed Auto",
			},
			features: [
				"Premium Audio System",
				"Dual-Zone Climate Control",
				"Sport-Tuned Suspension",
				"Power Driver Seat",
			],
		},
		{
			id: "rav4",
			name: "Toyota RAV4",
			model: "2024 XLE",
			price: 37500,
			image:
				"https://images.unsplash.com/photo-1617469767053-d3b523a0b982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjByYXY0fGVufDF8fHx8MTc2MDgyMzAzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
			badge: monthlyBudget > 600 ? "Premium Choice" : undefined,
			specs: {
				mpg: "27/35 MPG",
				horsepower: "203 HP",
				seats: "5 Seats",
				transmission: "8-Speed Auto",
			},
			features: [
				"All-Wheel Drive",
				"Power Liftgate",
				"Panoramic Sunroof",
				"Heated Front Seats",
			],
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-6">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="mb-3 text-gray-900">Your Perfect Toyota Match</h1>
					<p className="text-[#aaaaaa]">
						Based on your profile, we've selected these vehicles for you
					</p>
				</div>

				<div ref={containerRef} className="grid md:grid-cols-3 gap-8">
					{cars.map((car) => {
						const estimatedMonthly = (car.price * 0.02).toFixed(0); // Rough estimate
						const isSelected = selectedCar?.id === car.id;

						return (
							<div
								key={car.id}
								ref={(el) => { cardRefs.current[car.id] = el; }}
								className={`relative ${isSelected ? 'ring-4 ring-[#d71920]/40' : ''}`}
							>
								<Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group">
								{car.badge && (
									<div className="absolute top-4 right-4 z-10">
										<Badge className="bg-[#d71920] text-white px-3 py-1">
											{car.badge}
										</Badge>
									</div>
								)}

								{isSelected && (
									<div className="absolute top-4 left-4 z-10">
										<Badge className="bg-amber-500 text-white px-3 py-1">
											Recommended for you
										</Badge>
									</div>
								)}

								<CardHeader className="p-0">
									<div className="h-48 overflow-hidden bg-gray-100">
										<ImageWithFallback
											src={car.image}
											alt={car.name}
											className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
										/>
									</div>
								</CardHeader>

								<CardContent className="p-6">
									<CardTitle className="mb-1">{car.name}</CardTitle>
									<CardDescription className="mb-4">
										{car.model}
									</CardDescription>

									<div className="mb-6">
										<p className="text-sm text-[#aaaaaa] mb-1">Starting MSRP</p>
										<p className="text-gray-900">
											${car.price.toLocaleString()}
										</p>
										<p className="text-sm text-[#aaaaaa] mt-1">
											Est. ${estimatedMonthly}/mo
										</p>
									</div>

									<div className="grid grid-cols-2 gap-3 mb-6">
										<div className="flex items-center gap-2 text-sm">
											<Fuel className="w-4 h-4 text-[#d71920]" />
											<span className="text-gray-700">{car.specs.mpg}</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<Gauge className="w-4 h-4 text-[#d71920]" />
											<span className="text-gray-700">
												{car.specs.horsepower}
											</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<Users className="w-4 h-4 text-[#d71920]" />
											<span className="text-gray-700">{car.specs.seats}</span>
										</div>
										<div className="flex items-center gap-2 text-sm">
											<Cog className="w-4 h-4 text-[#d71920]" />
											<span className="text-gray-700">
												{car.specs.transmission}
											</span>
										</div>
									</div>

									<div className="space-y-2 mb-6">
										<p className="text-sm text-gray-600">Key Features:</p>
										<ul className="space-y-1">
											{car.features.slice(0, 3).map((feature, idx) => (
												<li
													key={idx}
													className="text-sm text-gray-700 flex items-start"
												>
													<span className="text-[#d71920] mr-2">•</span>
													{feature}
												</li>
											))}
										</ul>
									</div>
								</CardContent>

										<CardFooter className="p-6 pt-0">
									<Button
										onClick={() => onSelectCar(car)}
										className="w-full bg-black hover:bg-gray-900 text-white"
									>
										View Payment Options
									</Button>
								</CardFooter>
									</Card>
							</div>
						);
					})}
				</div>

				{explanation && (
					<div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded">
						<h3 className="font-semibold">Recommendation</h3>
						<p className="text-sm text-gray-700 mt-2">{explanation}</p>
					</div>
				)}

				<div className="text-center mt-12">
					<p className="text-sm text-[#aaaaaa]">
						All prices are MSRP and may vary by location. Actual payments depend
						on your financing terms.
					</p>
				</div>
			</div>
		</div>
	);
}
