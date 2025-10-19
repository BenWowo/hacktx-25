"use client";
import { useState } from "react";
import HomePage from "@/components/HomePage";
import FormPage from "@/components/FormPage";
import LoadingScreen from "@/components/LoadingScreen";
import CarSelectionPage, {
	type CarOption,
} from "@/components/CarSelectionPage";
import ResultsPage from "@/components/ResultsPage";
import PaymentAnalysisPage from "@/components/PaymentAnalysisPage";

export type FormData = {
	creditScore: string;
	annualIncome: string;
	downPayment: string;
	carPrice: string;
	employmentStatus: string;
	monthlyBudget: string;
};

export type RecommendationType = "finance" | "lease" | "purchase";

export default function Page() {
	const [currentStep, setCurrentStep] = useState<
		| "home"
		| "form"
		| "loading"
		| "carSelection"
		| "loadingPayment"
		| "results"
		| "analysis"
	>("home");
	const [formData, setFormData] = useState<FormData>({
		creditScore: "",
		annualIncome: "",
		downPayment: "",
		carPrice: "",
		employmentStatus: "",
		monthlyBudget: "",
	});
	const [selectedCar, setSelectedCar] = useState<CarOption | null>(null);
	const [selectedPaymentOption, setSelectedPaymentOption] =
		useState<RecommendationType | null>(null);
	const [recommendation, setRecommendation] =
		useState<RecommendationType>("finance");

	const handleGetStarted = () => {
		setCurrentStep("form");
	};

	const handleFormSubmit = (data: FormData) => {
		setFormData(data);
		setCurrentStep("loading");

		// Simulate loading time before showing car selection
		setTimeout(() => {
			setCurrentStep("carSelection");
		}, 2000);
	};

	const handleCarSelect = (car: CarOption) => {
		setSelectedCar(car);
		setCurrentStep("loadingPayment");

		// Calculate recommendation based on form data and selected car
		const creditScore = parseInt(formData.creditScore);
		const downPayment = parseFloat(formData.downPayment);
		const carPrice = car.price;
		const downPaymentPercent = (downPayment / carPrice) * 100;

		let recommendedOption: RecommendationType = "finance";

		if (creditScore >= 750 && downPaymentPercent >= 30) {
			recommendedOption = "purchase";
		} else if (creditScore < 650 || downPaymentPercent < 10) {
			recommendedOption = "lease";
		} else {
			recommendedOption = "finance";
		}

		// Update formData with selected car price
		setFormData((prev) => ({ ...prev, carPrice: car.price.toString() }));

		// Simulate loading time
		setTimeout(() => {
			setRecommendation(recommendedOption);
			setCurrentStep("results");
		}, 2000);
	};

	const handlePaymentOptionSelect = (option: RecommendationType) => {
		setSelectedPaymentOption(option);
		setCurrentStep("analysis");
	};

	const handleBackToResults = () => {
		setCurrentStep("results");
	};

	const handleBackToHome = () => {
		setCurrentStep("home");
		setFormData({
			creditScore: "",
			annualIncome: "",
			downPayment: "",
			carPrice: "",
			employmentStatus: "",
			monthlyBudget: "",
		});
		setSelectedCar(null);
		setSelectedPaymentOption(null);
	};

	return (
		<div className="min-h-screen bg-white">
			{currentStep === "home" && <HomePage onGetStarted={handleGetStarted} />}
			{currentStep === "form" && (
				<FormPage onSubmit={handleFormSubmit} onBack={handleBackToHome} />
			)}
			{currentStep === "loading" && <LoadingScreen />}
			{currentStep === "carSelection" && (
				<CarSelectionPage onSelectCar={handleCarSelect} formData={formData} />
			)}
			{currentStep === "loadingPayment" && <LoadingScreen />}
			{currentStep === "results" && (
				<ResultsPage
					formData={formData}
					selectedCar={selectedCar}
					recommendation={recommendation}
					onSelectOption={handlePaymentOptionSelect}
					onStartOver={handleBackToHome}
				/>
			)}
			{currentStep === "analysis" && (
				<PaymentAnalysisPage
					formData={formData}
					selectedCar={selectedCar}
					selectedOption={selectedPaymentOption || recommendation}
					onBack={handleBackToResults}
					onStartOver={handleBackToHome}
				/>
			)}
		</div>
	);
}
