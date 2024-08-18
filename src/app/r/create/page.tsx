import ProtectedRoute from "@/auth/protected";
import CommunityForm from "@/components/community-form";

export default function RedditCreatePage() {
  return (
    <ProtectedRoute redirectUrl="/r/create">
      <div className="max-w-7xl mx-auto flex flex-col mt-4">
        <CommunityForm />
      </div>
    </ProtectedRoute>
  );
}
