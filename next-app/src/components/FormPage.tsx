import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import {
	ArrowLeft,
	DollarSign,
	CreditCard,
	Briefcase,
	TrendingUp,
} from "lucide-react";
import type { FormData } from "@/app/page";

type FormPageProps = {
	onSubmit: (data: FormData) => void;
	onBack: () => void;
};

export default function FormPage({ onSubmit, onBack }: FormPageProps) {
	const [formData, setFormData] = useState<FormData>({
		creditScore: "",
		annualIncome: "",
		downPayment: "",
		carPrice: "",
		employmentStatus: "",
		monthlyBudget: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const handleChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const isFormValid = () => {
		return Object.values(formData).every((value) => value !== "");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
			<div className="max-w-2xl mx-auto">
				<Button
					variant="ghost"
					onClick={onBack}
					className="mb-8 text-gray-600 hover:text-gray-900"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Home
				</Button>

				<div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
					<div className="text-center mb-8">
						<h1 className="mb-3 text-gray-900">Your Financial Profile</h1>
						<p className="text-gray-600">
							Help us understand your situation to provide the best
							recommendations
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Credit Score */}
						<div className="space-y-2">
							<Label htmlFor="creditScore" className="flex items-center gap-2">
								<CreditCard className="w-4 h-4 text-[#d71920]" />
								Credit Score
							</Label>
							<Select
								value={formData.creditScore}
								onValueChange={(value) => handleChange("creditScore", value)}
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

						{/* Annual Income */}
						<div className="space-y-2">
							<Label htmlFor="annualIncome" className="flex items-center gap-2">
								<TrendingUp className="w-4 h-4 text-[#d71920]" />
								Annual Income
							</Label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<Input
									id="annualIncome"
									type="number"
									placeholder="75000"
									value={formData.annualIncome}
									onChange={(e) => handleChange("annualIncome", e.target.value)}
									className="pl-9"
								/>
							</div>
						</div>

						{/* Employment Status */}
						<div className="space-y-2">
							<Label
								htmlFor="employmentStatus"
								className="flex items-center gap-2"
							>
								<Briefcase className="w-4 h-4 text-[#d71920]" />
								Employment Status
							</Label>
							<Select
								value={formData.employmentStatus}
								onValueChange={(value) =>
									handleChange("employmentStatus", value)
								}
							>
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

						{/* Car Price */}
						<div className="space-y-2">
							<Label htmlFor="carPrice">Estimated Car Price</Label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<Input
									id="carPrice"
									type="number"
									placeholder="35000"
									value={formData.carPrice}
									onChange={(e) => handleChange("carPrice", e.target.value)}
									className="pl-9"
								/>
							</div>
						</div>

						{/* Down Payment */}
						<div className="space-y-2">
							<Label htmlFor="downPayment">Available Down Payment</Label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<Input
									id="downPayment"
									type="number"
									placeholder="5000"
									value={formData.downPayment}
									onChange={(e) => handleChange("downPayment", e.target.value)}
									className="pl-9"
								/>
							</div>
						</div>

						{/* Monthly Budget */}
						<div className="space-y-2">
							<Label htmlFor="monthlyBudget">
								Monthly Budget for Car Payment
							</Label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<Input
									id="monthlyBudget"
									type="number"
									placeholder="500"
									value={formData.monthlyBudget}
									onChange={(e) =>
										handleChange("monthlyBudget", e.target.value)
									}
									className="pl-9"
								/>
							</div>
						</div>

						<Button
							type="submit"
							disabled={!isFormValid()}
							className="w-full bg-[#d71920] hover:bg-[#a01419] text-white py-6 mt-8"
						>
							Get My Recommendations
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
