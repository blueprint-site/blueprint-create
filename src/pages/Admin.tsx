import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {BarChart, LayoutDashboard, Users, Package, FileText, Files} from "lucide-react";
import AdminAddonsTable from "@/components/admin/components/addons/AdminAddonsTable.tsx";
import AddonStatsWrapper from "@/components/admin/components/stats/AddonStatsWrapper.tsx";
import AdminUsersDisplay from "@/components/admin/components/users/AdminUsersDisplay.tsx";


const AdminPage = () => {
    const [activePage, setActivePage] = useState("dashboard");

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64  text-white p-4 flex flex-col space-y-4">
                <h2 className="text-xl font-bold">Admin Panel</h2>
                <div className="flex flex-col space-y-2">
                    <div
                        className={cn(
                            "flex items-center space-x-2 p-2 rounded cursor-pointer",
                            activePage === "dashboard" ? "bg-gray-700" : "hover:bg-gray-800"
                        )}
                        onClick={() => setActivePage("dashboard")}
                    >
                        <LayoutDashboard className="w-5 h-5"/>
                        <span>Dashboard</span>
                    </div>
                    <div
                        className={cn(
                            "flex items-center space-x-2 p-2 rounded cursor-pointer",
                            activePage === "blog" ? "bg-gray-700" : "hover:bg-gray-800"
                        )}
                        onClick={() => setActivePage("blog")}
                    >
                        <Files className="w-5 h-5"/>
                        <span>Blog</span>
                    </div>
                    <div
                        className={cn(
                            "flex items-center space-x-2 p-2 rounded cursor-pointer",
                            activePage === "users" ? "bg-gray-700" : "hover:bg-gray-800"
                        )}
                        onClick={() => setActivePage("users")}
                    >
                        <Users className="w-5 h-5"/>
                        <span>Users</span>
                    </div>
                    <div
                        className={cn(
                            "flex items-center space-x-2 p-2 rounded cursor-pointer",
                            activePage === "stats" ? "bg-gray-700" : "hover:bg-gray-800"
                        )}
                        onClick={() => setActivePage("stats")}
                    >
                        <BarChart className="w-5 h-5"/>
                        <span>Stats</span>
                    </div>
                    <div
                        className={cn(
                            "flex items-center space-x-2 p-2 rounded cursor-pointer",
                            activePage === "addons" ? "bg-gray-700" : "hover:bg-gray-800"
                        )}
                        onClick={() => setActivePage("addons")}
                    >
                        <Package className="w-5 h-5"/>
                        <span>Addons</span>
                    </div>
                    <div
                        className={cn(
                            "flex items-center space-x-2 p-2 rounded cursor-pointer",
                            activePage === "schematics" ? "bg-gray-700" : "hover:bg-gray-800"
                        )}
                        onClick={() => setActivePage("schematics")}
                    >
                        <FileText className="w-5 h-5"/>
                        <span>Schematics</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {activePage === "dashboard" && (
                    <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold">Welcome to the Dashboard</h3>
                            <p>Here you can see an overview of your application.</p>
                        </CardContent>
                    </Card>
                )}

                {activePage === "users" && (
                    <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-6">
                        <AdminUsersDisplay></AdminUsersDisplay>
                    </CardContent>
                    </Card>

                )}

                {activePage === "stats" && (

                        <AddonStatsWrapper />
                )}

                {activePage === "addons" && (
                    <div>
                        <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
                            <CardContent className="p-6">
                                <AdminAddonsTable />
                            </CardContent>
                        </Card>
                    </div>


                )}
                {activePage === "blog" && (
                    <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold">Blog Management</h3>
                            <p>Manage blog inside the app.</p>
                        </CardContent>
                    </Card>
                )}
                {activePage === "schematics" && (
                    <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold">Schematics</h3>
                            <p>Manage and generate schematics for your application.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
