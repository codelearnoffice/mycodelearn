import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";

type SavedProject = {
  id: number;
  title: string;
  description: string;
  content: string;
  created_at: string;
};

import { useEffect } from "react";
import { useLocation } from "wouter";

import React, { useState } from "react";

function ProjectDropdown({ project }: { project: SavedProject }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 cursor-pointer flex justify-between items-center" onClick={() => setOpen((o) => !o)}>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{project.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(project.created_at), "MMM d, yyyy")}
          </p>
        </div>
        <span className="ml-4 text-blue-600 text-sm select-none">{open ? "Hide" : "Show"}</span>
      </div>
      {open && (
        <div className="p-4 space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Title:</span>
            <span className="ml-2 text-gray-900">{project.title}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Description:</span>
            <span className="ml-2 text-gray-800">{project.description}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Created At:</span>
            <span className="ml-2 text-gray-700">{format(new Date(project.created_at), "PPpp")}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Project Idea Content:</span>
            <pre className="bg-gray-50 p-3 rounded-md text-gray-800 text-sm whitespace-pre-wrap mt-1">{project.content}</pre>
          </div>
          <div className="flex justify-between pt-2">
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
      )}
    </div>
  );
}

export default function SavedProjectsPage() {
  // Data fetching logic for saved projects
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
          <ProjectDropdown key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}