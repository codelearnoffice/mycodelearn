import { Star } from "lucide-react";

interface TestimonialCardProps {
  content: string;
  name: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  content,
  name,
  role
}) => {
  return (
    <div className="bg-neutral p-6 rounded-lg">
      <div className="flex items-center mb-4">
        <div className="text-secondary">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="inline-block w-4 h-4 fill-current" />
          ))}
        </div>
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
