"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookingFormProps {
  providerName?: string;
  services?: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  onSubmit?: (bookingData: BookingData) => void;
}

interface BookingData {
  service: string;
  date: Date | undefined;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

const BookingForm = ({
  providerName = "Service Provider",
  services = [
    { id: "1", name: "Haircut", duration: 30, price: 35 },
    { id: "2", name: "Hair Coloring", duration: 120, price: 120 },
    { id: "3", name: "Manicure", duration: 45, price: 40 },
    { id: "4", name: "Facial Treatment", duration: 60, price: 75 },
  ],
  onSubmit = () => {},
}: BookingFormProps) => {
  const [step, setStep] = useState<number>(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: "",
    date: undefined,
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Mock available time slots
  const availableTimeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
  ];

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(bookingData);
    // Reset form or show confirmation
    setStep(4); // Move to confirmation step
  };

  const updateBookingData = (field: keyof BookingData, value: any) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const getSelectedService = () => {
    return services.find((service) => service.id === bookingData.service);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-background">
      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Book an Appointment with {providerName}
          </CardTitle>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <React.Fragment key={i}>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                      step >= i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {i}
                  </div>
                  {i < 4 && (
                    <div
                      className={cn(
                        "h-1 w-8",
                        step > i ? "bg-primary" : "bg-muted",
                      )}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select a Service</h3>
              <div className="grid gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors",
                      bookingData.service === service.id
                        ? "border-primary bg-primary/10"
                        : "hover:bg-accent",
                    )}
                    onClick={() => updateBookingData("service", service.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {service.duration} min
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${service.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Select Date & Time</h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label className="mb-2 block">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingData.date ? (
                          format(bookingData.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={bookingData.date}
                        onSelect={(date) => updateBookingData("date", date)}
                        initialFocus
                        disabled={(date) => {
                          // Disable past dates and weekends for this example
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return (
                            date < today || date.getDay() === 0 // Sunday
                          );
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="mb-2 block">Time</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={
                          bookingData.time === time ? "default" : "outline"
                        }
                        className="flex items-center justify-center"
                        onClick={() => updateBookingData("time", time)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Information</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={bookingData.name}
                    onChange={(e) => updateBookingData("name", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={bookingData.email}
                    onChange={(e) => updateBookingData("email", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={bookingData.phone}
                    onChange={(e) => updateBookingData("phone", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Any special requests or information..."
                    value={bookingData.notes}
                    onChange={(e) => updateBookingData("notes", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-muted p-6 text-center">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-muted-foreground">
                  Thank you for your booking. We've sent a confirmation to your
                  email.
                </p>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Booking Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Service:</div>
                  <div>{getSelectedService()?.name}</div>

                  <div className="text-muted-foreground">Date:</div>
                  <div>
                    {bookingData.date ? format(bookingData.date, "PPP") : ""}
                  </div>

                  <div className="text-muted-foreground">Time:</div>
                  <div>{bookingData.time}</div>

                  <div className="text-muted-foreground">Name:</div>
                  <div>{bookingData.name}</div>

                  <div className="text-muted-foreground">Email:</div>
                  <div>{bookingData.email}</div>

                  <div className="text-muted-foreground">Phone:</div>
                  <div>{bookingData.phone}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 && step < 4 && (
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          )}

          {step < 3 && (
            <Button
              className="ml-auto"
              onClick={handleNext}
              disabled={
                (step === 1 && !bookingData.service) ||
                (step === 2 && (!bookingData.date || !bookingData.time))
              }
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {step === 3 && (
            <Button
              className="ml-auto"
              onClick={handleSubmit}
              disabled={
                !bookingData.name || !bookingData.email || !bookingData.phone
              }
            >
              Confirm Booking
            </Button>
          )}

          {step === 4 && (
            <Button
              className="mx-auto"
              variant="outline"
              onClick={() => {
                setStep(1);
                setBookingData({
                  service: "",
                  date: undefined,
                  time: "",
                  name: "",
                  email: "",
                  phone: "",
                  notes: "",
                });
              }}
            >
              Book Another Appointment
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingForm;
