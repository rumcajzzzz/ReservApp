"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingsList from "@/components/dashboard/BookingsList";
import {
  CalendarIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/layout/MainNav";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard statistics
  const stats = {
    totalBookings: 24,
    pendingBookings: 5,
    confirmedBookings: 16,
    cancelledBookings: 3,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <MainNav />

      {/* Dashboard Layout */}
      <div className="container grid grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar Navigation */}
        <aside className="hidden md:block">
          <nav className="grid gap-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "bookings" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("bookings")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Bookings
            </Button>
            <Button
              variant={activeTab === "customers" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("customers")}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Customers
            </Button>
            <Link href="/services" className="mt-2">
              <Button variant="ghost" className="w-full justify-start">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Services
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <TabsList className="md:hidden">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalBookings}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All time bookings
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.pendingBookings}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting confirmation
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Confirmed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.confirmedBookings}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upcoming appointments
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Cancelled
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.cancelledBookings}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cancelled bookings
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingsList limit={5} showFilters={false} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>All Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingsList showFilters={true} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    View and manage your customer information.
                  </p>
                  {/* Customer management would go here */}
                  <div className="mt-6 text-center py-10">
                    <p className="text-muted-foreground">
                      Customer management features coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
