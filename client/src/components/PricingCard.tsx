import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  link: string;
  highlight: boolean;
  badge?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  cta,
  link,
  highlight,
  badge
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-lg overflow-hidden",
      highlight && "border-2 border-secondary transform md:scale-105"
    )}>
      {badge && (
        <div className="bg-secondary text-white text-center py-2 text-sm font-medium">
          {badge}
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary">{title}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-bold text-primary">{price}</span>
          <span className="ml-1 text-gray-500">/month</span>
        </div>
        <p className="mt-4 text-gray-600">{description}</p>
        <ul className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-success mt-0.5 mr-2" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={cn(
            "mt-8 w-full",
            highlight 
              ? "bg-secondary text-white hover:bg-secondary/90"
              : "bg-white border border-secondary text-secondary hover:bg-secondary hover:text-white"
          )}
          asChild
        >
          <a href={link}>{cta}</a>
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
