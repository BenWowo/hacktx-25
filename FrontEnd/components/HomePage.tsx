import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';

type HomePageProps = {
  onGetStarted: () => void;
};

export default function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-black">Toyota.</h1>
          <nav className="hidden md:flex gap-8">
            <button className="text-[#aaaaaa] hover:text-black transition-colors">Features</button>
            <button className="text-[#aaaaaa] hover:text-black transition-colors">Finance</button>
            <button className="text-[#aaaaaa] hover:text-black transition-colors">Support</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#aaaaaa] hover:text-black transition-colors px-4 py-2">
            Log in
          </button>
          <Button
            onClick={onGetStarted}
            className="bg-black hover:bg-gray-900 text-white rounded-full px-6"
          >
            Get started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative flex items-center justify-center px-8 py-20 overflow-hidden">
        {/* Floating Car Images */}
        <div className="absolute left-[10%] top-[20%] w-72 h-48 rounded-2xl overflow-hidden shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-500">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1727376609759-fd61ab47fe7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lvdGElMjBjYXIlMjAzZCUyMHJlbmRlcnxlbnwxfHx8fDE3NjA4MjIxMDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Toyota Car"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute right-[10%] top-[15%] w-80 h-52 rounded-2xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
          <div className="w-full h-full bg-gradient-to-br from-[#d71920] to-[#a01419] flex items-center justify-center">
            <div className="text-white text-center p-8">
              <p className="text-sm opacity-90 mb-2">Starting from</p>
              <p className="text-4xl mb-2">$25,000</p>
              <p className="text-sm opacity-90">Multiple options available</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-12">
          <h1 className="text-7xl md:text-8xl mb-8 leading-tight">
            <span className="text-black">Your car,</span>
            <br />
            <span className="text-black">full control,</span>
            <br />
            <span className="text-[#d71920]">
              anytime.
            </span>
          </h1>
          
          <p className="text-[#aaaaaa] mb-12 max-w-md mx-auto">
            Single platform for all your car financing decisions
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-black hover:bg-gray-900 text-white rounded-full px-8 py-6"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 border-[#bbbbbb] hover:border-black"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
