import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { FormData, RecommendationType } from '../components';
import type { CarOption } from './CarSelectionPage';

type PaymentAnalysisPageProps = {
  formData: FormData;
  selectedCar: CarOption | null;
  selectedOption: RecommendationType;
  onBack: () => void;
  onStartOver: () => void;
};

// tooltip horizontally moves with the cursor, fixed vertically above the chart
const HorizontalFixedTooltip = ({ active, payload, label, coordinate }: any) => {
  if (!active || !payload || !payload.length || !coordinate) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, // fixed at the top of the chart area
        left: coordinate.x,
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        padding: '12px 16px',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <p style={{ marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '13px' }}>
          {entry.name}: ${entry.value.toFixed(0)}
        </p>
      ))}
    </div>
  );
};

export default function PaymentAnalysisPage({
  formData,
  selectedCar,
  selectedOption,
  onBack,
  onStartOver,
}: PaymentAnalysisPageProps) {
  const carPrice = selectedCar ? selectedCar.price : parseFloat(formData.carPrice);
  const downPayment = parseFloat(formData.downPayment);
  const creditScore = formData.creditScore;
  const monthlyBudget = parseFloat(formData.monthlyBudget);

  const getInterestRate = (type: RecommendationType): number => {
    const creditNum = parseInt(creditScore);
    if (type === 'purchase') return 0;
    if (type === 'lease') {
      if (creditNum >= 740) return 3.5;
      if (creditNum >= 670) return 5.0;
      if (creditNum >= 580) return 7.0;
      return 9.0;
    }
    if (creditNum >= 740) return 4.5;
    if (creditNum >= 670) return 6.5;
    if (creditNum >= 580) return 9.0;
    return 12.0;
  };

  const leaseRate = getInterestRate('lease') / 100;
  const financeRate = getInterestRate('finance') / 100;
  const financeAmount = carPrice - downPayment;
  const leaseTerm = 36;
  const financeTerm = 60;

  const leaseMonthly =
    (carPrice * 0.6 * (leaseRate / 12 * Math.pow(1 + leaseRate / 12, leaseTerm))) /
    (Math.pow(1 + leaseRate / 12, leaseTerm) - 1);

  const financeMonthly =
    (financeAmount * (financeRate / 12 * Math.pow(1 + financeRate / 12, financeTerm))) /
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

  const maxMonths = Math.max(leaseTerm, financeTerm);
  const chartData = Array.from({ length: maxMonths }, (_, i) => {
    const month = i + 1;
    const leaseTotal = month <= leaseTerm ? leaseMonthly * month : leaseMonthly * leaseTerm;
    const financeTotal = month <= financeTerm ? financeMonthly * month : financeMonthly * financeTerm;
    const purchaseTotal = carPrice;

    return {
      month: `Month ${month}`,
      Lease: leaseTotal,
      Finance: financeTotal,
      'Cash Purchase': purchaseTotal,
    };
  });

  const selectedOptionData = options.find((opt) => opt.type === selectedOption)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-8 text-[#aaaaaa] hover:text-black">
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

        {/* Metrics */}
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
              <p className="text-sm text-[#aaaaaa] mt-1">Including all payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Line Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cost Over Time Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#aaaaaa" />
                <YAxis stroke="#aaaaaa" />
                <Tooltip
                  content={(props) => <HorizontalFixedTooltip {...props} />}
                  cursor={{ stroke: '#d71920', strokeWidth: 2 }}
                />
                <Legend />
                {Object.keys(chartData[0])
                  .filter((key) => key !== 'month')
                  .map((key, i) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={i === 0 ? '#d71920' : i === 1 ? '#000000' : '#888888'}
                      strokeWidth={3}
                      dot={false}
                      strokeDasharray={i === 2 ? '5 5' : undefined}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex gap-4 justify-center">
          <Button onClick={onStartOver} variant="outline" className="px-8">
            Start Over
          </Button>
          <Button className="bg-[#d71920] hover:bg-[#a01419] text-white px-8">Apply Now</Button>
        </div>
      </div>
    </div>
  );
}