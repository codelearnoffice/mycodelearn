import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  profession?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  created_at: string;
}

function ProjectDropdown({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded-2xl shadow-lg bg-gradient-to-tr from-blue-50 to-white transition-transform hover:scale-[1.01]">
      <button
        className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-blue-100/70 rounded-t-2xl transition-colors group"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span className="font-bold text-xl text-blue-900 group-hover:text-blue-700 transition-colors">{project.title}</span>
        <span className="ml-4 text-blue-600 text-sm select-none font-semibold group-hover:underline">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="px-6 pb-5 pt-2 space-y-3 bg-white rounded-b-2xl border-t">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Title:</span>
            <span className="text-gray-900">{project.title}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-semibold text-gray-600">Description:</span>
            <span className="text-gray-800">{project.description}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-600">Created At:</span>
            <span className="text-gray-700">{format(new Date(project.created_at), "PPpp")}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Project Content:</span>
            <pre className="bg-blue-50 p-4 rounded-lg text-gray-800 text-sm whitespace-pre-wrap mt-2 border border-blue-100 max-h-48 overflow-auto">{project.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyAccountPage() {
  // Fetch user info
  const { data: user, isLoading: userLoading, error: userError } = useQuery<User, Error>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
  // Fetch user's projects
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery<Project[], Error>({
    queryKey: ["/api/projects"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Password update form state (hooks must be above any return)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false);

  if (userLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        <span className="ml-2">Loading account...</span>
      </div>
    );
  }

  if (userError) {
    if (userError.message.startsWith("401")) {
      return <div className="text-center mt-10 text-blue-600">You must be logged in to view your account. <a href="/auth" className="underline">Log in</a></div>;
    }
    return <div className="text-red-500 text-center mt-10">Error loading account: {userError.message}</div>;
  }
  if (projectsError) {
    return <div className="text-red-500 text-center mt-10">Error loading projects: {projectsError.message}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-blue-600">You must be logged in to view your account. <a href="/auth" className="underline">Log in</a></div>;
  }


  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg(data.error || "Failed to update password.");
      }
    } catch (err) {
      setPasswordMsg("An error occurred. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-0 md:p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-md border border-blue-100">
      {/* User Info Card */}
      <div className="mb-10 px-6 py-6 rounded-2xl bg-white/80 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-blue-100">
        <div>
          <div className="mb-1 text-lg font-bold text-blue-900 flex items-center gap-2">
            <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold mr-2">User</span>
            {user?.username}
          </div>
          <div className="mb-1 text-gray-700"><span className="font-semibold">Email:</span> {user?.email}</div>
          {user?.fullName && <div className="mb-1 text-gray-700"><span className="font-semibold">Full Name:</span> {user.fullName}</div>}
          {user?.profession && <div className="mb-1 text-gray-700"><span className="font-semibold">Profession:</span> {user.profession}</div>}
        </div>
        <div className="flex flex-col items-end">
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow transition-colors mb-2"
            onClick={() => setShowPasswordForm(v => !v)}
            type="button"
          >
            {showPasswordForm ? "Hide Password Change" : "Change Password"}
          </button>
          {showPasswordForm && (
            <form onSubmit={handlePasswordUpdate} className="space-y-3 bg-blue-50 rounded-lg p-4 mt-2 w-72 shadow border border-blue-100">
              <div>
                <label className="block font-medium mb-1 text-blue-800">Current Password</label>
                <input type="password" className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
              </div>
              <div>
                <label className="block font-medium mb-1 text-blue-800">New Password</label>
                <input type="password" className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div>
                <label className="block font-medium mb-1 text-blue-800">Confirm New Password</label>
                <input type="password" className="w-full border border-blue-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              {passwordMsg && <div className={`text-sm ${passwordMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{passwordMsg}</div>}
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold mt-2" disabled={updating}>{updating ? "Updating..." : "Update Password"}</button>
            </form>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <h2 className="text-2xl font-bold mb-4 text-blue-900">My Projects</h2>
      {projects && projects.length > 0 ? (
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectDropdown key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No projects found.</div>
      )}
    </div>
  );
}
