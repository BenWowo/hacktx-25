import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Fuel, Gauge, Users, Cog } from 'lucide-react';

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
};

export default function CarSelectionPage({ onSelectCar, formData }: CarSelectionPageProps) {
  const monthlyBudget = parseFloat(formData.monthlyBudget);
  
  const cars: CarOption[] = [
    {
    id: '4runner',
    name: 'Toyota 4Runner',
    model: '2025 SR5',
    price: 44220,
    image: 'https://example.com/2025-4runner.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '20/24 MPG',
      horsepower: '278 HP',
      seats: '5 Seats',
      transmission: '8-speed automatic',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
    ],
  },
  {
    id: 'avalon',
    name: 'Toyota Avalon',
    model: '2025 XLE',
    price: 42900,
    image: 'https://example.com/2025-avalon.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '22/32 MPG',
      horsepower: '301 HP',
      seats: '5 Seats',
      transmission: '8-speed automatic',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Leather-trimmed seats',
      'Apple CarPlay & Android Auto',
      'Premium audio system',
    ],
  },
  {
    id: 'camry',
    name: 'Toyota Camry',
    model: '2025 LE',
    price: 28700,
    image: 'https://example.com/2025-camry.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '28/39 MPG',
      horsepower: '203 HP',
      seats: '5 Seats',
      transmission: '8-speed automatic',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
    ],
  },
  {
    id: 'corolla',
    name: 'Toyota Corolla',
    model: '2025 LE',
    price: 24995,
    image: 'https://example.com/2025-corolla.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '32/41 MPG',
      horsepower: '169 HP',
      seats: '5 Seats',
      transmission: 'CVT',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
    ],
  },
  {
    id: 'corolla_hatchback',
    name: 'Toyota Corolla Hatchback',
    model: '2025 SE',
    price: 23780,
    image: 'https://example.com/2025-corolla-hatchback.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '32/41 MPG',
      horsepower: '169 HP',
      seats: '5 Seats',
      transmission: 'CVT',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
    ],
  },
  {
    id: 'gr_corolla',
    name: 'Toyota GR Corolla',
    model: '2025 Core',
    price: 39995,
    image: 'https://example.com/2025-gr-corolla.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '—',
      horsepower: '300 HP',
      seats: '5 Seats',
      transmission: '6-speed manual / 8-speed automatic',
    },
    features: [
      'All-wheel drive performance system',
      'Sport suspension & upgrades',
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
    ],
  },
  {
    id: 'gr86',
    name: 'Toyota GR86',
    model: '2025 Premium',
    price: 33995,
    image: 'https://example.com/2025-gr86.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '17/24 MPG',
      horsepower: '228 HP',
      seats: '4 Seats',
      transmission: '6-speed manual / automatic',
    },
    features: [
      'Rear-wheel drive',
      'Sport-tuned suspension',
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
    ],
  },
  {
    id: 'crown',
    name: 'Toyota Crown',
    model: '2025 Platinum',
    price: 48900,
    image: 'https://example.com/2025-crown.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '22/31 MPG',
      horsepower: '340 HP',
      seats: '5 Seats',
      transmission: '10-speed automatic',
    },
    features: [
      'Luxury interior',
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'Premium audio system',
    ],
  },
  {
    id: 'mirai',
    name: 'Toyota Mirai',
    model: '2025 XLE Fuel Cell',
    price: 49900,
    image: 'https://example.com/2025-mirai.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '—',
      horsepower: '182 HP',
      seats: '5 Seats',
      transmission: 'Single-speed',
    },
    features: [
      'Fuel cell electric vehicle',
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'Luxury interior',
    ],
  },
  {
    id: 'prius',
    name: 'Toyota Prius',
    model: '2025 LE',
    price: 27995,
    image: 'https://example.com/2025-prius.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '54/50 MPG',
      horsepower: '121 HP',
      seats: '5 Seats',
      transmission: 'CVT',
    },
    features: [
      'Hybrid electric',
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
    ],
  },
  {
    id: 'supra',
    name: 'Toyota Supra',
    model: '2025 3.0 Premium',
    price: 50990,
    image: 'https://example.com/2025-supra.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '22/30 MPG',
      horsepower: '382 HP',
      seats: '2 Seats',
      transmission: '8-speed automatic',
    },
    features: [
      'Rear-wheel drive',
      'Sport-tuned suspension',
      'Apple CarPlay & Android Auto',
      'Luxury interior',
    ],
    {
    id: 'chr',
    name: 'Toyota C-HR',
    model: '2025 XLE',
    price: 28100,
    image: 'https://example.com/2025-chr.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '27/31 MPG',
      horsepower: '184 HP',
      seats: '5 Seats',
      transmission: 'CVT',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
    ],
  },
  {
    id: 'corolla_cross',
    name: 'Toyota Corolla Cross',
    model: '2025 LE',
    price: 24895,
    image: 'https://example.com/2025-corolla-cross.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '31/33 MPG',
      horsepower: '169 HP',
      seats: '5 Seats',
      transmission: 'CVT',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
    ],
  },
  {
    id: 'grand_highlander',
    name: 'Toyota Grand Highlander',
    model: '2025 XLE',
    price: 43995,
    image: 'https://example.com/2025-grand-highlander.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '21/28 MPG',
      horsepower: '265 HP',
      seats: '7 Seats',
      transmission: '8-speed automatic',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
    ],
  },
  {
    id: 'land_cruiser',
    name: 'Toyota Land Cruiser',
    model: '2021 Heritage Edition',
    price: 87490,
    image: 'https://example.com/2021-land-cruiser.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '13/17 MPG',
      horsepower: '381 HP',
      seats: '8 Seats',
      transmission: '8-speed automatic',
    },
    features: [
      'Off-road capability',
      'Toyota Safety Sense 2.0',
      'Leather interior',
      'Premium audio system',
    ],
  },
  {
    id: 'rav4',
    name: 'Toyota RAV4',
    model: '2025 LE',
    price: 29995,
    image: 'https://example.com/2025-rav4.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '27/35 MPG',
      horsepower: '203 HP',
      seats: '5 Seats',
      transmission: '8-speed automatic',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
    ],
  },
  {
    id: 'sequoia',
    name: 'Toyota Sequoia',
    model: '2025 SR5',
    price: 52595,
    image: 'https://example.com/2025-sequoia.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '18/22 MPG',
      horsepower: '381 HP',
      seats: '8 Seats',
      transmission: '10-speed automatic',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
    ],
  },
  {
    id: 'sienna',
    name: 'Toyota Sienna',
    model: '2025 LE',
    price: 39995,
    image: 'https://example.com/2025-sienna.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '36/36 MPG',
      horsepower: '245 HP',
      seats: '7 Seats',
      transmission: 'CVT',
    },
    features: [
      'Hybrid powertrain',
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
    ],
  },
  {
    id: 'venza',
    name: 'Toyota Venza',
    model: '2025 XLE',
    price: 38130,
    image: 'https://example.com/2025-venza.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '40/37 MPG',
      horsepower: '219 HP',
      seats: '5 Seats',
      transmission: 'CVT',
    },
    features: [
      'Hybrid powertrain',
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
    ],
  },
  {
    id: 'bz4x',
    name: 'Toyota bZ4X',
    model: '2025 XLE',
    price: 43410,
    image: 'https://example.com/2025-bz4x.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '—', // electric vehicle
      horsepower: '201 HP',
      seats: '5 Seats',
      transmission: 'Single-speed automatic',
    },
    features: [
      'All-electric SUV',
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
    ],
  
  },
  {
    id: 'tundra',
    name: 'Toyota Tundra',
    model: '2025 SR5',
    price: 42185,
    image: 'https://example.com/2025-tundra.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '17/22 MPG',
      horsepower: '348 HP',
      seats: '5 Seats',
      transmission: '10-speed automatic',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
      'Towing package',
    ],
  },
  {
    id: 'tacoma',
    name: 'Toyota Tacoma',
    model: '2025 SR5',
    price: 29995,
    image: 'https://example.com/2025-tacoma.jpg',
    badge: monthlyBudget < 400 ? 'Best Value' : undefined,
    specs: {
      mpg: '20/23 MPG',
      horsepower: '278 HP',
      seats: '5 Seats',
      transmission: '6-speed manual / automatic',
    },
    features: [
      'Toyota Safety Sense 3.0',
      'Apple CarPlay & Android Auto',
      'LED Headlights',
      'Adaptive Cruise Control',
      'Off-road capable',
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

        <div className="grid md:grid-cols-3 gap-8">
          {cars.map((car) => {
            const estimatedMonthly = (car.price * 0.02).toFixed(0); // Rough estimate

            return (
              <Card
                key={car.id}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {car.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-[#d71920] text-white px-3 py-1">
                      {car.badge}
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
                  <CardDescription className="mb-4">{car.model}</CardDescription>

                  <div className="mb-6">
                    <p className="text-sm text-[#aaaaaa] mb-1">Starting MSRP</p>
                    <p className="text-gray-900">${car.price.toLocaleString()}</p>
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
                      <span className="text-gray-700">{car.specs.horsepower}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-[#d71920]" />
                      <span className="text-gray-700">{car.specs.seats}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Cog className="w-4 h-4 text-[#d71920]" />
                      <span className="text-gray-700">{car.specs.transmission}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <p className="text-sm text-gray-600">Key Features:</p>
                    <ul className="space-y-1">
                      {car.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start">
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
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-[#aaaaaa]">
            All prices are MSRP and may vary by location. Actual payments depend on your financing terms.
          </p>
        </div>
      </div>
    </div>
  );
}
