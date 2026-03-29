import { useState } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import AdminLogin from "./AdminLogin";
import { AdminLayout, AdminTab } from "./AdminLayout";
import { AdminOverview } from "./tabs/AdminOverview";
import { AdminProjects } from "./tabs/AdminProjects";
import { AdminMessages } from "./tabs/AdminMessages";
import { AdminGallery } from "./tabs/AdminGallery";
import { AdminNotes } from "./tabs/AdminNotes";
import { AdminProfile } from "./tabs/AdminProfile";
import { AdminCategoryDetails } from "./tabs/AdminCategoryDetails";
import { AdminFamilyFriends } from "./tabs/AdminFamilyFriends";
import AdminMusic from "./tabs/AdminMusic";
import { AdminFavourites } from "./tabs/AdminFavourites";
import { AdminVisitors } from "./tabs/AdminVisitors";

export default function AdminPage() {
  const { isAuthed } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  if (!isAuthed) return <AdminLogin />;

  const renderTab = () => {
    switch (activeTab) {
      case "overview":        return <AdminOverview />;
      case "projects":        return <AdminProjects />;
      case "messages":        return <AdminMessages />;
      case "gallery":         return <AdminGallery />;
      case "categoryDetails": return <AdminCategoryDetails />;
      case "familyFriends":   return <AdminFamilyFriends />;
      case "notes":           return <AdminNotes />;
      case "favourites": return <AdminFavourites />;
      case "visitors":   return <AdminVisitors />;
      case "profile":         return <AdminProfile />;
      case "music":           return <AdminMusic />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTab()}
    </AdminLayout>
  );
}