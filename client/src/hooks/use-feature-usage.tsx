import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type FeatureType = "explanation" | "feedback" | "project";

export function useFeatureUsage(featureType: FeatureType) {
  const { toast } = useToast();
  
  const { data: usageData, isLoading } = useQuery<{count: number}, Error>({
    queryKey: [`/api/feature-usage/${featureType}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const trackUsageMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/track-usage", { featureType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/feature-usage/${featureType}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error tracking usage",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const saveProjectMutation = useMutation({
    mutationFn: async ({ title, description, content }: { title: string, description: string, content: string }) => {
      const res = await apiRequest("POST", "/api/save-project", { title, description, content });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Project saved",
        description: "The project has been saved to your account",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save project",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  return {
    usageCount: usageData?.count || 0,
    isLoading,
    trackUsage: trackUsageMutation.mutate,
    saveProject: saveProjectMutation.mutate,
    isSaving: saveProjectMutation.isPending,
  };
}