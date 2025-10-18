import { Loader2, Car } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <Car className="w-20 h-20 text-[#d71920] mx-auto animate-bounce" />
          <Loader2 className="w-12 h-12 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
        </div>
        <h2 className="mb-4 text-white">Analyzing Your Profile</h2>
        <p className="text-[#bbbbbb]">
          Calculating the best options for your situation...
        </p>
      </div>
    </div>
  );
}
