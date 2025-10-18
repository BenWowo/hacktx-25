import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, CheckCircle2, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { FormData, RecommendationType } from '../App';
import type { CarOption } from './CarSelectionPage';

type PaymentAnalysisPageProps = {
  formData: FormData;
  selectedCar: CarOption | null;
  selectedOption: RecommendationType;
  onBack: () => void;
  onStartOver: () => void;
};

export default function PaymentAnalysisPage({ 
  formData, 
  selectedCar, 
  selectedOption,
  onBack,
  onStartOver 
}: PaymentAnalysisPageProps) {
  const carPrice = selectedCar ? selectedCar.price : parseFloat(formData.carPrice);
  const downPayment = parseFloat(formData.downPayment);
  const creditScore = formData.creditScore;
  const monthlyBudget = parseFloat(formData.monthlyBudget);

  // Calculate interest rates based on credit score
  const getInterestRate = (type: RecommendationType): number => {
    const creditNum = parseInt(creditScore);
    
    if (type === 'purchase') return 0; // Cash purchase has no interest
    
    if (type === 'lease') {
      if (creditNum >= 740) return 3.5;
      if (creditNum >= 670) return 5.0;
      if (creditNum >= 580) return 7.0;
      return 9.0;
    }
    
    // Finance
    if (creditNum >= 740) return 4.5;
    if (creditNum >= 670) return 6.5;
    if (creditNum >= 580) return 9.0;
    return 12.0;
  };

  // Calculate payment details for each option
  const leaseRate = getInterestRate('lease') / 100;
  const financeRate = getInterestRate('finance') / 100;
  
  const financeAmount = carPrice - downPayment;
  const leaseTerm = 36; // months
  const financeTerm = 60; // months
  
  // Monthly payment calculations
  const leaseMonthly = (carPrice * 0.6 * (leaseRate / 12 * Math.pow(1 + leaseRate / 12, leaseTerm))) / 
    (Math.pow(1 + leaseRate / 12, leaseTerm) - 1);
  
  const financeMonthly = (financeAmount * (financeRate / 12 * Math.pow(1 + financeRate / 12, financeTerm))) / 
    (Math.pow(1 + financeRate / 12, financeTerm) - 1);

  const options = [
    {
      type: 'lease',
      name: 'Lease',
      monthlyPayment: leaseMonthly,
      interestRate: getInterestRate('lease'),
      term: leaseTerm,
      totalPaid: leaseMonthly * leaseTerm + downPayment * 0.1,
      upfront: downPayment * 0.1,
    },
    {
      type: 'finance',
      name: 'Finance',
      monthlyPayment: financeMonthly,
      interestRate: getInterestRate('finance'),
      term: financeTerm,
      totalPaid: financeMonthly * financeTerm + downPayment,
      upfront: downPayment,
    },
    {
      type: 'purchase',
      name: 'Cash Purchase',
      monthlyPayment: 0,
      interestRate: 0,
      term: 0,
      totalPaid: carPrice,
      upfront: carPrice,
    },
  ];

  // Chart data
  const monthlyComparisonData = options.map(opt => ({
    name: opt.name,
    'Monthly Payment': opt.monthlyPayment || 0,
    'Interest Rate': opt.interestRate,
  }));

  const totalCostData = options.map(opt => ({
    name: opt.name,
    'Total Cost': opt.totalPaid,
    'Upfront': opt.upfront,
  }));

  // Get reasons for recommendation
  const getRecommendationReasons = (): string[] => {
    const reasons: string[] = [];
    const creditNum = parseInt(creditScore);
    const downPaymentPercent = (downPayment / carPrice) * 100;

    if (selectedOption === 'lease') {
      reasons.push(`Your monthly budget of $${monthlyBudget.toFixed(0)} aligns well with lower monthly lease payments`);
      if (downPaymentPercent < 15) {
        reasons.push('Lower upfront cost required with minimal down payment');
      }
      reasons.push('Flexibility to upgrade to a newer model every 2-3 years');
      if (creditNum >= 670) {
        reasons.push('Your good credit score qualifies you for competitive lease rates');
      }
    } else if (selectedOption === 'finance') {
      reasons.push('Build equity in your vehicle over time');
      reasons.push('No mileage restrictions - perfect for your lifestyle');
      if (downPaymentPercent >= 15 && downPaymentPercent < 30) {
        reasons.push('Your down payment reduces the total amount financed');
      }
      if (creditNum >= 670) {
        reasons.push(`Your credit score of ${creditScore} qualifies you for favorable interest rates`);
      }
      reasons.push('Full ownership after 5 years with asset value');
    } else {
      reasons.push('Zero interest payments - save thousands over the loan term');
      reasons.push('Immediate full ownership with no monthly obligations');
      if (downPaymentPercent >= 80) {
        reasons.push('Your strong financial position supports a cash purchase');
      }
      reasons.push('Maximum negotiating power with dealers');
      reasons.push('No credit requirements or approval process');
    }

    return reasons;
  };

  const selectedOptionData = options.find(opt => opt.type === selectedOption)!;
  const reasons = getRecommendationReasons();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 text-[#aaaaaa] hover:text-black"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Options
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#d71920] text-white px-4 py-2 mb-4">
            {selectedOptionData.name} - Recommended
          </Badge>
          <h1 className="mb-3 text-gray-900">Payment Analysis</h1>
          <p className="text-[#aaaaaa]">
            Here's why {selectedOptionData.name.toLowerCase()} is the best option for you
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#aaaaaa] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#d71920]" />
                Monthly Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">
                {selectedOptionData.monthlyPayment > 0 
                  ? `$${selectedOptionData.monthlyPayment.toFixed(2)}/mo`
                  : '$0/mo'}
              </p>
              <p className="text-sm text-[#aaaaaa] mt-1">
                {selectedOptionData.term > 0 ? `${selectedOptionData.term} months` : 'No payments'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#aaaaaa] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#d71920]" />
                Interest Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{selectedOptionData.interestRate.toFixed(2)}% APR</p>
              <p className="text-sm text-[#aaaaaa] mt-1">
                {selectedOptionData.interestRate === 0 ? 'No interest' : 'Based on your credit'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#aaaaaa] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d71920]" />
                Total Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">${selectedOptionData.totalPaid.toFixed(0)}</p>
              <p className="text-sm text-[#aaaaaa] mt-1">
                Including all payments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Payment Comparison Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Monthly Payment Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#aaaaaa" />
                <YAxis stroke="#aaaaaa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="Monthly Payment" fill="#d71920" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Interest Rate" fill="#000000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Total Cost Comparison Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Total Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={totalCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#aaaaaa" />
                <YAxis stroke="#aaaaaa" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `$${value.toFixed(0)}`}
                />
                <Legend />
                <Bar dataKey="Total Cost" fill="#d71920" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Upfront" fill="#bbbbbb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Why This Option */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why {selectedOptionData.name} Works for You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#d71920] mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Side-by-Side Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-900">Option</th>
                    <th className="text-left py-3 px-4 text-gray-900">Monthly</th>
                    <th className="text-left py-3 px-4 text-gray-900">Interest Rate</th>
                    <th className="text-left py-3 px-4 text-gray-900">Term</th>
                    <th className="text-left py-3 px-4 text-gray-900">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {options.map((option) => (
                    <tr 
                      key={option.type}
                      className={`border-b border-gray-100 ${
                        option.type === selectedOption ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {option.name}
                          {option.type === selectedOption && (
                            <Badge className="bg-[#d71920] text-white text-xs">Best</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {option.monthlyPayment > 0 
                          ? `$${option.monthlyPayment.toFixed(2)}`
                          : '$0'}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {option.interestRate.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {option.term > 0 ? `${option.term} months` : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        ${option.totalPaid.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onStartOver}
            variant="outline"
            className="px-8"
          >
            Start Over
          </Button>
          <Button
            className="bg-[#d71920] hover:bg-[#a01419] text-white px-8"
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}
