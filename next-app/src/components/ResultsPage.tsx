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
import { Check, Home, DollarSign, Calendar, TrendingUp } from "lucide-react";
import type { FormData, RecommendationType } from "@/app/home/page";
import type { CarOption } from "./CarSelectionPage";

type ResultsPageProps = {
	formData: FormData;
	selectedCar: CarOption | null;
	recommendation: RecommendationType;
	onSelectOption: (option: RecommendationType) => void;
	onStartOver: () => void;
};

export default function ResultsPage({
	formData,
	selectedCar,
	recommendation,
	onSelectOption,
	onStartOver,
}: ResultsPageProps) {
	const carPrice = parseFloat(formData.carPrice);
	const downPayment = parseFloat(formData.downPayment);
	const monthlyBudget = parseFloat(formData.monthlyBudget);

	// Calculate estimates for each option
	const financeAmount = carPrice - downPayment;
	const financeMonthly = (financeAmount * 0.06) / 12 + financeAmount / 60; // 60 months, 6% APR
	const leaseMonthly = carPrice * 0.012; // Approximate lease calculation
	const purchaseMonthly = monthlyBudget; // User's budget for reference

	const options = [
		{
			type: "lease" as RecommendationType,
			title: "Lease",
			description: "Drive a new Toyota every few years",
			icon: Calendar,
			monthlyPayment: leaseMonthly,
			upfrontCost: downPayment * 0.1, // Lower upfront for lease
			term: "36 months",
			benefits: [
				"Lower monthly payments",
				"New car every 2-3 years",
				"Warranty coverage",
				"No trade-in hassle",
			],
			color: "from-[#bbbbbb] to-[#aaaaaa]",
		},
		{
			type: "finance" as RecommendationType,
			title: "Finance",
			description: "Own your Toyota with manageable payments",
			icon: TrendingUp,
			monthlyPayment: financeMonthly,
			upfrontCost: downPayment,
			term: "60 months",
			benefits: [
				"Build equity in your vehicle",
				"No mileage restrictions",
				"Customize as you like",
				"Asset you can sell",
			],
			color: "from-[#d71920] to-[#a01419]",
		},
		{
			type: "purchase" as RecommendationType,
			title: "Cash Purchase",
			description: "Own your Toyota outright from day one",
			icon: DollarSign,
			monthlyPayment: 0,
			upfrontCost: carPrice,
			term: "Immediate",
			benefits: [
				"No interest payments",
				"Full ownership immediately",
				"No monthly obligations",
				"Maximum negotiating power",
			],
			color: "from-black to-gray-800",
		},
	];

	// Reorder so recommended is in the middle
	const reorderedOptions = [...options];
	const recommendedIndex = options.findIndex(
		(opt) => opt.type === recommendation
	);
	if (recommendedIndex !== -1) {
		const [recommendedOption] = reorderedOptions.splice(recommendedIndex, 1);
		reorderedOptions.splice(1, 0, recommendedOption);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
			<div className="max-w-6xl mx-auto">
				{selectedCar && (
					<div className="text-center mb-8">
						<Badge className="bg-[#d71920] text-white px-4 py-2 mb-3">
							{selectedCar.name} - {selectedCar.model}
						</Badge>
						<p className="text-sm text-[#aaaaaa]">
							MSRP: ${selectedCar.price.toLocaleString()}
						</p>
					</div>
				)}

				<div className="text-center mb-12">
					<h1 className="mb-3 text-gray-900">Your Payment Options</h1>
					<p className="text-gray-600">
						Choose the best way to finance your{" "}
						{selectedCar ? selectedCar.name : "Toyota"}
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-8">
					{reorderedOptions.map((option, index) => {
						const isRecommended = option.type === recommendation;
						const Icon = option.icon;

						return (
							<Card
								key={option.type}
								className={`relative ${
									isRecommended
										? "ring-2 ring-[#d71920] shadow-xl scale-105 z-10"
										: "shadow-md"
								} transition-all`}
							>
								{isRecommended && (
									<div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
										<Badge className="bg-[#d71920] text-white px-4 py-1">
											Recommended
										</Badge>
									</div>
								)}

								<CardHeader>
									<div
										className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center mb-4`}
									>
										<Icon className="w-6 h-6 text-white" />
									</div>
									<CardTitle>{option.title}</CardTitle>
									<CardDescription>{option.description}</CardDescription>
								</CardHeader>

								<CardContent className="space-y-4">
									<div className="border-t border-b py-4 space-y-2">
										{option.monthlyPayment > 0 ? (
											<div>
												<p className="text-gray-600 text-sm">
													Estimated Monthly Payment
												</p>
												<p className="text-gray-900">
													${option.monthlyPayment.toFixed(0)}/mo
												</p>
											</div>
										) : (
											<div>
												<p className="text-gray-600 text-sm">Monthly Payment</p>
												<p className="text-gray-900">$0/mo</p>
											</div>
										)}
										<div>
											<p className="text-gray-600 text-sm">Upfront Cost</p>
											<p className="text-gray-900">
												${option.upfrontCost.toFixed(0)}
											</p>
										</div>
										<div>
											<p className="text-gray-600 text-sm">Term</p>
											<p className="text-gray-900">{option.term}</p>
										</div>
									</div>

									<div className="space-y-2">
										{option.benefits.map((benefit, idx) => (
											<div key={idx} className="flex items-start gap-2">
												<Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
												<p className="text-sm text-gray-700">{benefit}</p>
											</div>
										))}
									</div>
								</CardContent>

								<CardFooter>
									<Button
										onClick={() => onSelectOption(option.type)}
										variant={isRecommended ? "default" : "outline"}
										className={`w-full ${
											isRecommended
												? "bg-[#d71920] hover:bg-[#a01419] text-white"
												: ""
										}`}
									>
										Choose {option.title}
									</Button>
								</CardFooter>
							</Card>
						);
					})}
				</div>

				<div className="text-center">
					<Button
						variant="ghost"
						onClick={onStartOver}
						className="text-gray-600 hover:text-gray-900"
					>
						<Home className="w-4 h-4 mr-2" />
						Start Over
					</Button>
				</div>
			</div>
		</div>
	);
}
