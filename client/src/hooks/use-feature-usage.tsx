import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "./use-auth";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "./use-toast";

type FeatureType = "explanation" | "feedback" | "project";

type SaveProjectData = {
  title: string;
  description?: string;
  content: string;
};

export function useFeatureUsage(featureType: FeatureType) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // Query to get usage count (only matters for non-authenticated users)
  const { data, refetch } = useQuery<{ count: number }>({
    queryKey: [`/api/feature-usage/${featureType}/count`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    // Only fetch for non-authenticated users
    enabled: !user,
    // Initialize with 0 for better UX
    initialData: { count: 0 },
  });
  
  // Mutation to track feature usage
  const trackUsageMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest(
        "POST", 
        `/api/feature-usage/${featureType}`,
        {} // Empty body, we just need to track the usage
      );
      return await res.json();
    },
    onSuccess: () => {
      refetch(); // Refetch the count after tracking usage
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation to save a project
  const saveProjectMutation = useMutation({
    mutationFn: async (projectData: SaveProjectData) => {
      setIsSaving(true);
      const res = await apiRequest("POST", "/api/projects", projectData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project saved successfully",
      });
      setIsSaving(false);
      // Invalidate projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving project",
        description: error.message,
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });
  
  // Function to track usage with error handling
  const trackUsage = async () => {
    try {
      await trackUsageMutation.mutateAsync();
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Function to save a project
  const saveProject = async (projectData: SaveProjectData) => {
    try {
      await saveProjectMutation.mutateAsync(projectData);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  return {
    usageCount: data?.count || 0,
    trackUsage,
    saveProject,
    isSaving,
  };
}