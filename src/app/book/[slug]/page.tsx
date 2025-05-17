"use client";

import React from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookingForm from "@/components/booking/BookingForm";

interface BookingPageProps {
  params: {
    slug: string;
  };
}

// Mock service provider data
async function getServiceProvider(slug: string) {
  // This would be replaced with actual data fetching from Supabase
  // For now, we'll return mock data for demonstration purposes
  const mockProviders = [
    {
      id: "1",
      slug: "salon-ania",
      name: "Salon Ania",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=salon-ania",
      description: "Professional hair salon offering a full range of services.",
      services: [
        { id: "1", name: "Women's Haircut", duration: 60, price: 120 },
        { id: "2", name: "Men's Haircut", duration: 30, price: 70 },
        { id: "3", name: "Hair Coloring", duration: 120, price: 200 },
        { id: "4", name: "Hair Styling", duration: 45, price: 90 },
      ],
    },
    {
      id: "2",
      slug: "auto-service",
      name: "Kowalski Auto Service",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=auto-serwis",
      description: "Comprehensive service solutions for your vehicle.",
      services: [
        { id: "1", name: "Technical Inspection", duration: 60, price: 150 },
        { id: "2", name: "Tire Change", duration: 45, price: 100 },
        { id: "3", name: "Oil Change", duration: 30, price: 120 },
        { id: "4", name: "Computer Diagnostics", duration: 60, price: 200 },
      ],
    },
  ];

  const provider = mockProviders.find((p) => p.slug === slug);
  return provider || null;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = params;
  const provider = await getServiceProvider(slug);

  if (!provider) {
    notFound();
  }

  const handleBookingSubmit = (bookingData: any) => {
    console.log("Booking submitted:", bookingData);
    // In a real application, this would send the data to your backend
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-primary/10">
                <img
                  src={provider.logo}
                  alt={provider.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  {provider.name}
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  {provider.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <BookingForm
              providerName={provider.name}
              services={provider.services}
              onSubmit={handleBookingSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
