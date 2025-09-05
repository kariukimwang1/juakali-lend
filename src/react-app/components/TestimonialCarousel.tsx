import { useState, useEffect } from 'react';
import { useTestimonials } from '@/react-app/hooks/useTestimonials';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function TestimonialCarousel() {
  const { testimonials, loading } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading || testimonials.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'retailer': return 'text-blue-600 bg-blue-100';
      case 'lender': return 'text-green-600 bg-green-100';
      case 'supplier': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'retailer': return 'Retailer';
      case 'lender': return 'Lender';
      case 'supplier': return 'Supplier';
      default: return 'User';
    }
  };

  return (
    <div className="relative bg-white rounded-2xl p-8 shadow-xl overflow-hidden animate-fade-in-up">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Success Stories</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="transition-all duration-500 ease-in-out">
          <div className="flex items-start space-x-6 mb-6">
            <div className="relative">
              <img
                src={currentTestimonial.image_url}
                alt={currentTestimonial.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="absolute -top-2 -right-2">
                <Quote className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  {currentTestimonial.name}
                </h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUserTypeColor(currentTestimonial.user_type)}`}>
                  {getUserTypeLabel(currentTestimonial.user_type)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">{currentTestimonial.business_name}</p>
              <p className="text-sm text-gray-500">{currentTestimonial.location}</p>
              
              <div className="flex items-center space-x-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < currentTestimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <blockquote className="text-gray-700 text-lg leading-relaxed italic mb-6">
            "{currentTestimonial.testimonial_text}"
          </blockquote>

          {/* Pagination dots */}
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
