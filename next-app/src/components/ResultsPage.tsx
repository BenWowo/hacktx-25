import React from "react";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
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

// Helper: derive an APR from a credit score (simple heuristic)
function deriveAprFromCreditScore(score: string | number | undefined) {
    const s = Number(score || 680);
    if (s >= 760) return 3.5;
    if (s >= 700) return 4.9;
    if (s >= 640) return 6.9;
    if (s >= 580) return 10.5;
    return 15.0;
}

// Local finance monthly calculation (standard amortization)
function calculateLocalFinanceMonthly(value: number, down: number, aprPercent: number, months: number) {
    const loan = Math.max(0, value - down);
    const monthlyRate = (aprPercent / 100) / 12;
    if (monthlyRate === 0) return loan / months;
    const payment = loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
}

// Local lease monthly approximation using Toyota-like assumptions
function calculateLocalLeaseMonthly(msrp: number, aprPercent: number, termMonths: number, down: number) {
    const residualPercent = 60; // assumed
    const capCostDiscount = 0.05;
    const acquisitionFee = 650;
    const taxRate = 0.0625;

    const capCost = msrp * (1 - capCostDiscount) + acquisitionFee;
    const adjustedCap = capCost - down;
    const residualValue = msrp * (residualPercent / 100);
    const moneyFactor = aprPercent / 2400;

    const depreciation = (adjustedCap - residualValue) / termMonths;
    const financeCharge = (adjustedCap + residualValue) * moneyFactor;
    const base = depreciation + financeCharge;
    return base * (1 + taxRate);
}

export default function ResultsPage({
    formData,
    selectedCar,
    recommendation,
    onSelectOption,
    onStartOver,
}: ResultsPageProps) {
    const carPrice = Number(selectedCar?.price ?? Number(formData.carPrice) ?? 0);
    const downPayment = Number(formData.downPayment) || 0;
    const monthlyBudget = Number(formData.monthlyBudget) || 0;

    const fallbackApr = deriveAprFromCreditScore(formData.creditScore);
    const fallbackFinanceMonthly = calculateLocalFinanceMonthly(carPrice, downPayment, fallbackApr, 60);
    const fallbackLeaseMonthly = calculateLocalLeaseMonthly(carPrice, fallbackApr, 36, downPayment);

    const [financeApiPayment, setFinanceApiPayment] = React.useState<number | null>(null);
    const [leaseApiPayment, setLeaseApiPayment] = React.useState<number | null>(null);
    const [loadingFinance, setLoadingFinance] = React.useState(false);
    const [loadingLease, setLoadingLease] = React.useState(false);
    const [financeError, setFinanceError] = React.useState<string | null>(null);
    const [leaseError, setLeaseError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!selectedCar) return;

        const abort = new AbortController();

        (async () => {
            setLoadingFinance(true);
            setFinanceError(null);
            try {
                const params = new URLSearchParams({
                    vehicle_value: String(selectedCar.price ?? carPrice ?? 0),
                    apr: String(fallbackApr),
                    months: String(60),
                    downpayment: String(downPayment ?? 0),
                });
                const res = await fetch(`http://localhost:8000/calculatefinance/?${params.toString()}`, { signal: abort.signal });
                if (!res.ok) throw new Error(`Finance API ${res.status}`);
                const body = await res.json();
                const numeric = typeof body === "number" ? body : Number(body);
                setFinanceApiPayment(Number(numeric));
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                setFinanceError(err?.message ?? String(err));
                setFinanceApiPayment(null);
            } finally {
                setLoadingFinance(false);
            }
        })();

        (async () => {
            setLoadingLease(true);
            setLeaseError(null);
            try {
                const params = new URLSearchParams({
                    msrp: String(selectedCar.price ?? carPrice ?? 0),
                    apr: String(fallbackApr),
                    term_months: String(36),
                    downpayment: String(downPayment ?? 0),
                });
                const res = await fetch(`http://localhost:8000/calculatelease/?${params.toString()}`, { signal: abort.signal });
                if (!res.ok) throw new Error(`Lease API ${res.status}`);
                const body = await res.json();
                const numeric = typeof body === "number" ? body : Number(body);
                setLeaseApiPayment(Number(numeric));
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                setLeaseError(err?.message ?? String(err));
                setLeaseApiPayment(null);
            } finally {
                setLoadingLease(false);
            }
        })();

        return () => abort.abort();
    }, [selectedCar, formData]);

    // total cost fallbacks: finance total = (monthly * months) + upfront; lease total = (monthly * months) + upfront; purchase total = carPrice
    const financeTotalFallback = (financeApiPayment ?? fallbackFinanceMonthly) * 60 + downPayment;
    const leaseTotalFallback = (leaseApiPayment ?? fallbackLeaseMonthly) * 36 + Math.max(0, downPayment * 0.1);
    const purchaseTotal = carPrice;

    const options = [
        {
            type: "lease" as RecommendationType,
            title: "Lease",
            description: "Drive a new Toyota every few years",
            icon: Calendar,
            monthlyPayment: leaseApiPayment ?? fallbackLeaseMonthly,
            upfrontCost: Math.max(0, downPayment * 0.1),
            totalCost: leaseTotalFallback,
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
            monthlyPayment: financeApiPayment ?? fallbackFinanceMonthly,
            upfrontCost: downPayment,
            totalCost: financeTotalFallback,
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
            totalCost: purchaseTotal,
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
    const recommendedIndex = options.findIndex((opt) => opt.type === recommendation);
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
						<p className="text-sm text-[#aaaaaa]">MSRP: ${selectedCar.price.toLocaleString()}</p>
					</div>
				)}

				<div className="text-center mb-12">
					<h1 className="mb-3 text-gray-900">Your Payment Options</h1>
					<p className="text-gray-600">Choose the best way to finance your {selectedCar ? selectedCar.name : "Toyota"}</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6 mb-8">
					{reorderedOptions.map((option) => {
						const isRecommended = option.type === recommendation;
						const Icon = option.icon;
						return (
							<Card key={option.type} className={`relative ${isRecommended ? "ring-2 ring-[#d71920] shadow-xl scale-105 z-10" : "shadow-md"} transition-all`}>
								{isRecommended && (
									<div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
										<Badge className="bg-[#d71920] text-white px-4 py-1">Recommended</Badge>
									</div>
								)}

								<CardHeader>
									<div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center mb-4`}>
										<Icon className="w-6 h-6 text-white" />
									</div>
									<CardTitle>{option.title}</CardTitle>
									<CardDescription>{option.description}</CardDescription>
								</CardHeader>

								<CardContent className="space-y-4">
									<div className="border-t border-b py-4 space-y-2">
                                        {option.monthlyPayment > 0 ? (
                                            <div>
                                                <p className="text-gray-600 text-sm">Estimated Monthly Payment</p>
                                                <p className="text-gray-900">${option.monthlyPayment.toFixed(0)}/mo</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-gray-600 text-sm">Monthly Payment</p>
                                                <p className="text-gray-900">$0/mo</p>
                                            </div>
                                        )}

                                        {/* Total cost row */}
                                        <div className="mt-2">
                                            <p className="text-gray-600 text-sm">Estimated Total Cost</p>
                                            <p className="text-gray-900">${Number(option.totalCost ?? 0).toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                                        </div>

										<div>
											<p className="text-gray-600 text-sm">Upfront Cost</p>
											<p className="text-gray-900">${option.upfrontCost.toFixed(0)}</p>
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
									<Button onClick={() => onSelectOption(option.type)} variant={isRecommended ? "default" : "outline"} className={`w-full ${isRecommended ? "bg-[#d71920] hover:bg-[#a01419] text-white" : ""}`}>
										Choose {option.title}
									</Button>
								</CardFooter>
							</Card>
						);
					})}
				</div>

				<div className="text-center mb-4">
					{loadingFinance || loadingLease ? (
						<p className="text-sm text-gray-600">Fetching updated estimates...</p>
					) : null}
					{financeError && <p className="text-sm text-red-600">Finance API: {financeError}</p>}
					{leaseError && <p className="text-sm text-red-600">Lease API: {leaseError}</p>}
				</div>

				<div className="text-center">
					<Button variant="ghost" onClick={onStartOver} className="text-gray-600 hover:text-gray-900">
						<Home className="w-4 h-4 mr-2" />
						Start Over
					</Button>
				</div>
			</div>
		</div>
	);
}
