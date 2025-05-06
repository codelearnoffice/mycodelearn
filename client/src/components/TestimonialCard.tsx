import { Star } from "lucide-react";

interface TestimonialCardProps {
  content: string;
  name: string;
  role: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  name,
  role,
  rating
}) => {
  return (
    <div className="bg-neutral p-6 rounded-lg border border-gray-300 hover:border-primary transition-colors duration-200">
      <div className="flex items-center mb-4">
        <span className="text-primary font-semibold text-lg">Rating: {rating}</span>
      </div>
      <p className="text-gray-700">{content}</p>
      <div className="mt-6 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
          {name.charAt(0)}
        </div>
        <div className="ml-3">
          <h4 className="font-medium text-primary">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
