"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
	const router = useRouter();
	const searchParams = useSearchParams();
	const [currentStep, setCurrentStep] = useState<
		| "home"
		| "form"
		| "loading"
		| "carSelection"
		| "loadingPayment"
		| "results"
		| "analysis"
	>("home");

	// On mount, if ?view=carSelection is present, start at carSelection
	useEffect(() => {
		const view = searchParams?.get("view");
		if (view === "carSelection") {
			setCurrentStep("carSelection");
		}
	}, [searchParams]);
	const [formData, setFormData] = useState<FormData>({
		creditScore: "",
		annualIncome: "",
		downPayment: "",
		carPrice: "",
		employmentStatus: "",
		monthlyBudget: "",
	});
	const [selectedCar, setSelectedCar] = useState<CarOption | null>(null);
	const [selectedExplanation, setSelectedExplanation] = useState<string | null>(null);
	const [selectedPaymentOption, setSelectedPaymentOption] =
		useState<RecommendationType | null>(null);
	const [recommendation, setRecommendation] =
		useState<RecommendationType>("finance");
	const [paymentAdvice, setPaymentAdvice] = useState<string | null>(null);

	const handleGetStarted = () => {
		router.push("/track");
	};

	const handleFormSubmit = (data: FormData) => {
		setFormData(data);
		setCurrentStep("loading");

		// Call API to pick best car
		(async () => {
			try {
				const res = await fetch('/api/choose-car', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});
				const json = await res.json();
				if (json?.car) setSelectedCar(json.car as CarOption);
				if (json?.explanation) setSelectedExplanation(json.explanation as string);
			} catch (err) {
				console.error('choose-car API failed', err);
			} finally {
				// small delay to show loading
				setTimeout(() => setCurrentStep('carSelection'), 800);
			}
		})();
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
		// fetch advice from API
		(async () => {
			try {
				const res = await fetch('/api/payment-advice', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ formData, selectedCar, selectedOption: option }),
				});
				const json = await res.json();
				if (json?.advice) setPaymentAdvice(json.advice as string);
			} catch (err) {
				console.error('payment-advice API failed', err);
			} finally {
				setCurrentStep('analysis');
			}
		})();
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
			<AnimatePresence mode="wait">
				{currentStep === "home" && (
					<motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
						<HomePage onGetStarted={handleGetStarted} />
					</motion.div>
				)}

				{currentStep === "form" && (
					<motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
						<FormPage onSubmit={handleFormSubmit} onBack={handleBackToHome} />
					</motion.div>
				)}

				{currentStep === "loading" && (
					<motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<LoadingScreen />
					</motion.div>
				)}

				{currentStep === "carSelection" && (
					<motion.div key="carSelection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
						<CarSelectionPage onSelectCar={handleCarSelect} formData={formData} />
					</motion.div>
				)}

				{currentStep === "loadingPayment" && (
					<motion.div key="loadingPayment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<LoadingScreen />
					</motion.div>
				)}

				{currentStep === "results" && (
					<motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
						<ResultsPage
							formData={formData}
							selectedCar={selectedCar}
							recommendation={recommendation}
							onSelectOption={handlePaymentOptionSelect}
							onStartOver={handleBackToHome}
						/>
					</motion.div>
				)}

				{currentStep === "analysis" && (
					<motion.div key="analysis" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
						<PaymentAnalysisPage
							formData={formData}
							selectedCar={selectedCar}
							selectedOption={selectedPaymentOption || recommendation}
							onBack={handleBackToResults}
							onStartOver={handleBackToHome}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
