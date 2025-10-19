"use client";

import {
	motion,
	useScroll,
	useTransform,
	useSpring,
	useMotionValue,
	useMotionValueEvent,
	MotionValue,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import {
	DollarSign,
	CreditCard,
	Briefcase,
	TrendingUp,
	Fuel,
	Gauge,
	Users,
	Cog,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

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

export type FormData = {
	creditScore: string;
	annualIncome: string;
	downPayment: string;
	carPrice: string;
	employmentStatus: string;
	monthlyBudget: string;
	lifestyle: string;
	jobDescription: string;
};

const Skiper19 = () => {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: ref });

	// Reset scroll position to top on component mount (page refresh)
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<section
			ref={ref}
			className="mx-auto flex h-[600vh] w-screen flex-col items-center overflow-hidden bg-[#729F4F] text-[#1F3A4B]"
		>
			<LinePath scrollYProgress={scrollYProgress} />
		</section>
	);
};

export { Skiper19 };

const LinePath = ({
	scrollYProgress,
}: {
	scrollYProgress: MotionValue<number>;
}) => {
	const pathRef = useRef<SVGPathElement>(null);

	// Motion values for camera
	const camX = useMotionValue<number>(0);
	const camY = useMotionValue<number>(0);
	const rotation = useMotionValue(0); // rotation of the icon

	// State for modal visibility
	const [modal10, setModal10] = useState(false);
	const [modal20, setModal20] = useState(false);
	const [modal40, setModal40] = useState(false);
	const [modal60, setModal60] = useState(false);
	const [modal80, setModal80] = useState(false);
	const [modal100, setModal100] = useState(false);

	// Track which modals have been shown to prevent re-showing
	const [shownModals, setShownModals] = useState({
		modal10: false,
		modal20: false,
		modal40: false,
		modal60: false,
		modal80: false,
		modal100: false,
	});

	// Form data state
	const [formData, setFormData] = useState<FormData>({
		creditScore: "",
		annualIncome: "",
		downPayment: "",
		carPrice: "",
		employmentStatus: "",
		monthlyBudget: "",
	lifestyle: "",
	jobDescription: "",
	});

	// About page text (editable in modal10)
	const [aboutText, setAboutText] = useState<string>(
		`Edit this About text to provide information to users about the journey, tips, or privacy details.`
	);

	// Form handling functions
	const handleFormChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// Per-modal submit handlers
	const handleAboutSave = (e?: React.FormEvent) => {
		e?.preventDefault();
		console.log("About saved:", aboutText);
		setModal10(false);
	};

	const handleModal20Submit = (e?: React.FormEvent) => {
		e?.preventDefault();
		console.log("Modal20 submitted:", {
			creditScore: formData.creditScore,
			annualIncome: formData.annualIncome,
		});
		setModal20(false);
	};

	const handleModal40Submit = (e?: React.FormEvent) => {
		e?.preventDefault();
		console.log("Modal40 submitted:", {
			employmentStatus: formData.employmentStatus,
			jobDescription: formData.jobDescription,
		});
		setModal40(false);
	};

	const handleModal60Submit = (e?: React.FormEvent) => {
		e?.preventDefault();
		console.log("Modal60 submitted:", {
			carPrice: formData.carPrice,
			downPayment: formData.downPayment,
			monthlyBudget: formData.monthlyBudget,
		});
		setModal60(false);
	};

	const handleModal80Submit = (e?: React.FormEvent) => {
		e?.preventDefault();
		console.log("Modal80 submitted:", { lifestyle: formData.lifestyle });
		setModal80(false);
	};

	const isModal20Valid = () => {
		return formData.creditScore !== "" && formData.annualIncome !== "";
	};

	const isModal40Valid = () => {
		return formData.employmentStatus !== "" && formData.jobDescription !== "";
	};

	const isModal60Valid = () => {
		return (
			formData.carPrice !== "" &&
			formData.downPayment !== "" &&
			formData.monthlyBudget !== ""
		);
	};

	const isModal80Valid = () => {
		return formData.lifestyle !== "";
	};

	// Car selection handling
	const handleCarSelect = (car: CarOption) => {
		console.log("Car selected:", car);
		// Update form data with selected car price
		setFormData((prev) => ({ ...prev, carPrice: car.price.toString() }));
		// Close the modal
		setModal100(false);
		// You can add additional logic here like navigating to payment options
	};

	// Car options data
	const getCarOptions = (): CarOption[] => {
		const monthlyBudget = parseFloat(formData.monthlyBudget);

		return [
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
	};

	// Window size
	const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
	useEffect(() => {
		const handleResize = () =>
			setWindowSize({ w: window.innerWidth, h: window.innerHeight });
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Smooth camera movement
	const smoothX = useSpring(camX, { stiffness: 400, damping: 30 });
	const smoothY = useSpring(camY, { stiffness: 400, damping: 30 });

	// Update camera and icon rotation as path progresses
	const lookAhead = -15;
	useMotionValueEvent(scrollYProgress, "change", (v: number) => {
		if (!pathRef.current) return;

		console.log("scroll progress:", v);

		// Check which modals should be shown based on scroll progress
		// Only show each modal once by checking if it has been shown before

		// 10% progress modal (9-11% range) - Form Modal
		if (v >= 0.09 && v <= 0.11 && !shownModals.modal10) {
			setModal10(true);
			setShownModals((prev) => ({ ...prev, modal10: true }));
		}

		// 20% progress modal (19-21% range)
		if (v >= 0.19 && v <= 0.21 && !shownModals.modal20) {
			setModal20(true);
			setShownModals((prev) => ({ ...prev, modal20: true }));
		}

		// 40% progress modal (39-41% range)
		if (v >= 0.39 && v <= 0.41 && !shownModals.modal40) {
			setModal40(true);
			setShownModals((prev) => ({ ...prev, modal40: true }));
		}

		// 60% progress modal (59-61% range)
		if (v >= 0.59 && v <= 0.61 && !shownModals.modal60) {
			setModal60(true);
			setShownModals((prev) => ({ ...prev, modal60: true }));
		}

		// 80% progress modal (79-81% range)
		if (v >= 0.79 && v <= 0.81 && !shownModals.modal80) {
			setModal80(true);
			setShownModals((prev) => ({ ...prev, modal80: true }));
		}

		// 100% progress modal (99-100% range) - Car Selection Modal
		if (v >= 0.99 && v <= 1.0 && !shownModals.modal100) {
			setModal100(true);
			setShownModals((prev) => ({ ...prev, modal100: true }));
		}

		const path = pathRef.current;
		const totalLen = path.getTotalLength();

		// current scroll position along the path
		const currentLen = v * totalLen;

		// point slightly ahead of current position
		const pt = path.getPointAtLength(
			Math.min(currentLen + lookAhead, totalLen)
		);

		// for rotation, still sample a tiny bit further
		const nextPt = path.getPointAtLength(
			Math.min(currentLen + lookAhead + 1, totalLen)
		);

		camX.set(pt.x);
		camY.set(pt.y);

		// Compute angle in degrees
		const angle =
			Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);
		rotation.set(angle);

		carX.set(pt.x - 12.5);
		carY.set(pt.y - 12.5);
	});

	// Camera transforms
	const translateX = useTransform(
		smoothX,
		(x) => (-x + windowSize.w / 2.2) * 35
	);
	const translateY = useTransform(
		smoothY,
		(y) => (-y + windowSize.h / 1.9) * 30
	);

	// Path draw progress
	const pathLength = useTransform(scrollYProgress, [0.01, 1], [0.01, 1]);
	const dashOffset = useTransform(pathLength, (v) => 0.2 - v);

	//const iconX = useTransform(smoothX, (x) => (-x + windowSize.w / 2.2) * 1);
	//const iconY = useTransform(smoothY, (y) => (-y + windowSize.h / 1.9) * 1);

	// Center the car image
	const carX = useMotionValue(0);
	const carY = useMotionValue(0);
	const iconX = useTransform(carX, (x) => x - 20);
	const iconY = useTransform(carY, (y) => y - 20);

	const bgTranslateX = useTransform(
		smoothX,
		(x) => (-x + windowSize.w / 2.2) * 30
	); // slightly slower
	const bgTranslateY = useTransform(
		smoothY,
		(y) => (-y + windowSize.h / 1.9) * 25
	);

	return (
		<>
			{/* 10% Progress Modal - About / Editable */}
			{modal10 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<AlertDialog open={modal10} onOpenChange={setModal10}>
						<AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
							<AlertDialogHeader>
								<AlertDialogTitle>About this Journey</AlertDialogTitle>
								<AlertDialogDescription>
									This page will assist you as you navigate through the financial journey to finding your dream vehicle
								</AlertDialogDescription>
							</AlertDialogHeader>

							<AlertDialogFooter className="flex gap-2">
								<AlertDialogCancel onClick={() => setModal10(false)}>
									Close
								</AlertDialogCancel>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}
			{/* 20% Progress Modal - Credit & Income */}
			{modal20 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<AlertDialog open={modal20} onOpenChange={setModal20}>
						<AlertDialogContent className="max-w-md">
							<AlertDialogHeader>
								<AlertDialogTitle>Tell us about your finances</AlertDialogTitle>
								<AlertDialogDescription>
									Please provide your credit score range and annual income.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<form onSubmit={handleModal20Submit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="creditScore" className="flex items-center gap-2">
										<CreditCard className="w-4 h-4 text-[#d71920]" />
										Credit Score
									</Label>
									<Select
										value={formData.creditScore}
										onValueChange={(value) => handleFormChange("creditScore", value)}
									>
										<SelectTrigger id="creditScore">
											<SelectValue placeholder="Select your credit score range" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="300-579">Poor (300-579)</SelectItem>
											<SelectItem value="580-669">Fair (580-669)</SelectItem>
											<SelectItem value="670-739">Good (670-739)</SelectItem>
											<SelectItem value="740-799">Very Good (740-799)</SelectItem>
											<SelectItem value="800-850">Exceptional (800-850)</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="annualIncome" className="flex items-center gap-2">
										<TrendingUp className="w-4 h-4 text-[#d71920]" />
										Annual Income
									</Label>
									<Input
										id="annualIncome"
										type="number"
										placeholder="75000"
										value={formData.annualIncome}
										onChange={(e) => handleFormChange("annualIncome", e.target.value)}
										className="pl-2"
									/>
								</div>
							</form>

							<AlertDialogFooter className="flex gap-2">
								<AlertDialogCancel onClick={() => setModal20(false)}>
									Skip
								</AlertDialogCancel>
								<AlertDialogAction onClick={handleModal20Submit} disabled={!isModal20Valid()} className="bg-[#d71920] hover:bg-[#a01419]">
									Save
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}

			{/* 40% Progress Modal - Employment */}
			{modal40 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<AlertDialog open={modal40} onOpenChange={setModal40}>
						<AlertDialogContent className="max-w-md">
							<AlertDialogHeader>
								<AlertDialogTitle>Employment Details</AlertDialogTitle>
								<AlertDialogDescription>
									Tell us your employment status and a short job description.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<form onSubmit={handleModal40Submit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="employmentStatus" className="flex items-center gap-2">
										<Briefcase className="w-4 h-4 text-[#d71920]" />
										Employment Status
									</Label>
									<Select value={formData.employmentStatus} onValueChange={(value) => handleFormChange("employmentStatus", value)}>
										<SelectTrigger id="employmentStatus">
											<SelectValue placeholder="Select your employment status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="full-time">Full-Time Employed</SelectItem>
											<SelectItem value="part-time">Part-Time Employed</SelectItem>
											<SelectItem value="self-employed">Self-Employed</SelectItem>
											<SelectItem value="retired">Retired</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="jobDescription">Short Job Description</Label>
									<Input id="jobDescription" placeholder="e.g. Software engineer at X" value={formData.jobDescription} onChange={(e) => handleFormChange("jobDescription", e.target.value)} />
								</div>
							</form>

							<AlertDialogFooter className="flex gap-2">
								<AlertDialogCancel onClick={() => setModal40(false)}>
									Skip
								</AlertDialogCancel>
								<AlertDialogAction onClick={handleModal40Submit} disabled={!isModal40Valid()} className="bg-[#d71920] hover:bg-[#a01419]">
									Save
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}

			{/* 60% Progress Modal - Price & Payments */}
			{modal60 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<AlertDialog open={modal60} onOpenChange={setModal60}>
						<AlertDialogContent className="max-w-md">
							<AlertDialogHeader>
								<AlertDialogTitle>Budget & Price Preferences</AlertDialogTitle>
								<AlertDialogDescription>
									Tell us your preferred car price, available down payment, and preferred monthly payment.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<form onSubmit={handleModal60Submit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="carPrice">Preferred Car Price</Label>
									<Input id="carPrice" type="number" placeholder="35000" value={formData.carPrice} onChange={(e) => handleFormChange("carPrice", e.target.value)} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="downPayment">Available Down Payment</Label>
									<Input id="downPayment" type="number" placeholder="5000" value={formData.downPayment} onChange={(e) => handleFormChange("downPayment", e.target.value)} />
								</div>

								<div className="space-y-2">
									<Label htmlFor="monthlyBudget">Preferred Monthly Payment</Label>
									<Input id="monthlyBudget" type="number" placeholder="500" value={formData.monthlyBudget} onChange={(e) => handleFormChange("monthlyBudget", e.target.value)} />
								</div>
							</form>

							<AlertDialogFooter className="flex gap-2">
								<AlertDialogCancel onClick={() => setModal60(false)}>
									Skip
								</AlertDialogCancel>
								<AlertDialogAction onClick={handleModal60Submit} disabled={!isModal60Valid()} className="bg-[#d71920] hover:bg-[#a01419]">
									Save
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}

			{/* 80% Progress Modal - Lifestyle */}
			{modal80 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<AlertDialog open={modal80} onOpenChange={setModal80}>
						<AlertDialogContent className="max-w-md">
							<AlertDialogHeader>
								<AlertDialogTitle>Lifestyle</AlertDialogTitle>
								<AlertDialogDescription>
									Tell us briefly about your lifestyle so we can better match vehicles.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<form onSubmit={handleModal80Submit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="lifestyle">Short Lifestyle Description</Label>
									<Textarea id="lifestyle" value={formData.lifestyle} onChange={(e) => handleFormChange("lifestyle", e.target.value)} className="min-h-[80px]" />
								</div>
							</form>

							<AlertDialogFooter className="flex gap-2">
								<AlertDialogCancel onClick={() => setModal80(false)}>
									Skip
								</AlertDialogCancel>
								<AlertDialogAction onClick={handleModal80Submit} disabled={!isModal80Valid()} className="bg-[#d71920] hover:bg-[#a01419]">
									Save
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}

			{/* 100% Progress Modal - Car Selection */}
			{modal100 && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-2">
					<AlertDialog open={modal100} onOpenChange={setModal100}>
						<AlertDialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-2xl">
									Your Perfect Toyota Match
								</AlertDialogTitle>
								<AlertDialogDescription>
									Based on your profile, we've selected these vehicles for you.
									Current progress: {Math.round(scrollYProgress.get() * 100)}%
								</AlertDialogDescription>
							</AlertDialogHeader>

							<div className="grid md:grid-cols-3 gap-6 py-4">
								{getCarOptions().map((car) => {
									const estimatedMonthly = (car.price * 0.02).toFixed(0);

									return (
										<Card
											key={car.id}
											className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group"
										>
											{car.badge && (
												<div className="absolute top-4 right-4 z-10">
													<Badge className="bg-[#d71920] text-white px-3 py-1">
														{car.badge}
													</Badge>
												</div>
											)}

											<CardHeader className="p-0">
												<div className="h-32 overflow-hidden bg-gray-100">
													<ImageWithFallback
														src={car.image}
														alt={car.name}
														className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
													/>
												</div>
											</CardHeader>

											<CardContent className="p-4">
												<CardTitle className="text-lg mb-1">
													{car.name}
												</CardTitle>
												<CardDescription className="mb-3">
													{car.model}
												</CardDescription>

												<div className="mb-4">
													<p className="text-sm text-gray-500 mb-1">
														Starting MSRP
													</p>
													<p className="font-bold text-gray-900">
														${car.price.toLocaleString()}
													</p>
													<p className="text-sm text-gray-500 mt-1">
														Est. ${estimatedMonthly}/mo
													</p>
												</div>

												<div className="grid grid-cols-2 gap-2 mb-4 text-xs">
													<div className="flex items-center gap-1">
														<Fuel className="w-3 h-3 text-[#d71920]" />
														<span className="text-gray-700">
															{car.specs.mpg}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<Gauge className="w-3 h-3 text-[#d71920]" />
														<span className="text-gray-700">
															{car.specs.horsepower}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<Users className="w-3 h-3 text-[#d71920]" />
														<span className="text-gray-700">
															{car.specs.seats}
														</span>
													</div>
													<div className="flex items-center gap-1">
														<Cog className="w-3 h-3 text-[#d71920]" />
														<span className="text-gray-700">
															{car.specs.transmission}
														</span>
													</div>
												</div>

												<div className="space-y-1 mb-4">
													<p className="text-xs text-gray-600">Key Features:</p>
													<ul className="space-y-1">
														{car.features.slice(0, 2).map((feature, idx) => (
															<li
																key={idx}
																className="text-xs text-gray-700 flex items-start"
															>
																<span className="text-[#d71920] mr-1">•</span>
																{feature}
															</li>
														))}
													</ul>
												</div>
											</CardContent>

											<CardFooter className="p-4 pt-0">
												<Button
													onClick={() => handleCarSelect(car)}
													className="w-full bg-[#d71920] hover:bg-[#a01419] text-white text-sm"
												>
													Select This Car
												</Button>
											</CardFooter>
										</Card>
									);
								})}
							</div>

							<AlertDialogFooter className="flex gap-2">
								<AlertDialogCancel onClick={() => setModal100(false)}>
									Browse Later
								</AlertDialogCancel>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			)}
			<svg
				width="2400"
				height="2400"
				viewBox="16000 5000 1500 3000"
				fill="none"
				overflow="visible"
				xmlns="http://www.w3.org/2000/svg"
				className="fixed inset-0 h-screen w-screen"
			>
				<motion.g
					style={{
						translateX,
						translateY,
						scale: 33,
					}}
				>
					{/* The path */}
					<motion.path
						ref={pathRef}
						d="M185.493 300.001H429.993C467.993 300.001 471.993 240.501 429.993 240.501H407.722C406.903 240.501 406.086 240.442 405.276 240.325L402.211 239.88C364.512 234.418 363.54 180.357 401.018 173.543C403.002 173.182 405.014 173.001 407.031 173.001H429.993C440.159 171.834 460.493 163.101 460.493 137.501C460.493 111.901 460.493 104.167 460.493 103.501C459.826 94.1675 454.5 77.0008 432.493 77.0008C406.867 77.7125 392.635 77.5001 392.635 63.5003C392.635 49.5005 404.914 46.5005 432.493 46.5005C448.356 46.5005 461.01 35.1057 460.634 23.5C460.634 9.5 451 1.50045 432.493 1.50045H287.493C277.819 1.5003 265.799 3.3076 259.631 16C255.5 24.5 256.733 37.6289 280.993 49.5005L362.566 84.6583C366.154 86.2046 369.403 88.4406 372.128 91.2394C392.856 112.524 373.411 146.359 345.111 137.315C335.552 134.26 326.462 131.119 318.5 128C274.07 110.598 214.993 77.0003 214.993 77.0003C208.826 74.167 193.493 64.575 193.493 48.0003C193.493 28.0003 193.493 1.50045 156.493 1.50045H35.9926C15.0014 -0.999697 -14.8074 24.8003 19.9926 48.0003L198.501 132C234.5 145.5 215.201 198.5 170.001 178.5L44.0014 127C33.0014 122 9.40137 118.1 3.00137 142.5C-4.99863 173 13.0014 211.5 49.0014 210.5C77.8014 209.7 174 210.167 218.5 210.5C230 210.167 253.6 204.7 256 185.5C259 161.5 273 151.5 289 151.5C299.673 151.993 313.803 153.646 322.5 163.5C332.842 178.339 340.127 213.432 303.147 232.317C294.149 236.912 283.87 238 273.766 238C191.245 238 41 238 41 238C-1.5 238 -15.8 300.001 41 300.001H176.5"
						stroke="#363b41"
						strokeWidth="20"
						style={{
							pathLength,
							strokeDashoffset: dashOffset,
						}}
					/>
					{/* The moving and rotating image */}
					{pathRef.current && (
						<motion.image
							href="/camrytopdown.png" // your image here
							x={carX}
							y={carY}
							width={25}
							height={25}
							style={{
								rotate: rotation,
								originX: 0.5, // rotate around center
								originY: 0.5,
							}}
						/>
					)}
				</motion.g>
			</svg>
		</>
	);
};
