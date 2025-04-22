import { cn } from "@/lib/utils";

interface HowItWorksStepProps {
  number: number;
  title: string;
  description: string;
  isEven: boolean;
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({
  number,
  title,
  description,
  isEven
}) => {
  return (
    <div className="relative flex flex-col md:flex-row items-center gap-8">
      <div className={cn(
        "md:w-1/2 order-2", 
        isEven ? "md:order-3 text-center md:text-left" : "md:order-1 text-center md:text-right"
      )}>
        {!isEven || (isEven && window.innerWidth < 768) ? (
          <div className="bg-white p-6 rounded-lg shadow-md inline-block">
            <h3 className="text-xl font-bold text-primary">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>
        ) : null}
      </div>
      
      <div className="z-10 order-1 md:order-2">
        <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg">
          <span className="font-bold">{number}</span>
        </div>
      </div>
      
      <div className={cn(
        "md:w-1/2", 
        isEven ? "order-3 md:order-1" : "order-3", 
        "hidden md:block"
      )}>
        {isEven && window.innerWidth >= 768 ? (
          <div className="bg-white p-6 rounded-lg shadow-md inline-block">
            <h3 className="text-xl font-bold text-primary">{title}</h3>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HowItWorksStep;
