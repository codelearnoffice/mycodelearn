import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";

type SavedProject = {
  id: number;
  title: string;
  description: string;
  content: string;
  createdAt: string;
};

export default function SavedProjectsPage() {
  const { data: projects, isLoading, error } = useQuery<SavedProject[], Error>({
    queryKey: ["/api/projects"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Projects</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">No Saved Projects</h1>
        <p className="text-gray-600 mb-6">
          You haven't saved any project ideas yet. Generate and save project ideas to access them here.
        </p>
        <a 
          href="/project-ideas" 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Generate Project Ideas
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        My Saved Projects
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4">
              <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">{project.title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(project.createdAt), "MMM d, yyyy")}
              </p>
            </div>
            
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                <p className="text-gray-800 text-sm whitespace-pre-wrap line-clamp-4">
                  {project.content}
                </p>
              </div>
            </div>
            
            <div className="px-4 pb-4 flex justify-between">
              <button 
                className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(project.content);
                  alert("Project content copied to clipboard!");
                }}
              >
                Copy Content
              </button>
              
              <button className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1">
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}