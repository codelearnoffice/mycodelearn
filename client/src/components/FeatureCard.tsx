import { 
  Code, 
  Bug, 
  Lightbulb,
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  codeExample?: string;
  errorMessage?: string;
  errorExplanation?: string;
  projectExample?: string;
  link: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color,
  codeExample,
  errorMessage,
  errorExplanation,
  projectExample,
  link
}) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'secondary':
        return 'bg-secondary text-secondary';
      case 'error':
        return 'bg-error text-error';
      case 'accent':
        return 'bg-accent text-accent';
      default:
        return 'bg-secondary text-secondary';
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'code':
        return <Code className={`text-${color}`} />;
      case 'bug':
        return <Bug className={`text-${color}`} />;
      case 'lightbulb':
        return <Lightbulb className={`text-${color}`} />;
      default:
        return <Code className={`text-${color}`} />;
    }
  };

  return (
    <div className="feature-card bg-white rounded-lg shadow-lg overflow-hidden">
      <div className={`h-2 bg-${color}`}></div>
      <div className="p-6">
        <div className={`w-12 h-12 rounded-full ${getColorClass(color)} bg-opacity-10 flex items-center justify-center mb-4`}>
          {getIcon(icon)}
        </div>
        <h3 className="text-xl font-bold text-primary">{title}</h3>
        <p className="mt-3 text-gray-600">{description}</p>
        <div className="mt-4 bg-neutral p-3 rounded-md">
          {codeExample && (
            <code className="text-sm font-mono text-primary">
              {codeExample.split('#')[0]} 
              {codeExample.includes('#') && (
                <span className="text-success">
                  # {codeExample.split('#')[1]}
                </span>
              )}
            </code>
          )}
          {errorMessage && (
            <>
              <code className="text-sm font-mono text-error">{errorMessage}</code>
              <p className="text-xs mt-2 text-primary">{errorExplanation}</p>
            </>
          )}
          {projectExample && (
            <p className="text-sm text-primary">
              <span className="font-medium">{projectExample.split(':')[0]}:</span> {projectExample.split(':')[1]}
            </p>
          )}
        </div>
        <a href={link} className={`mt-5 inline-block text-${color} font-medium hover:underline`}>
          Try {title} →
        </a>
      </div>
    </div>
  );
};

export default FeatureCard;
