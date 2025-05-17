import React from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      description:
        "Profesjonalny salon fryzjerski oferujący pełen zakres usług.",
      services: [
        { id: "1", name: "Strzyżenie damskie", duration: 60, price: 120 },
        { id: "2", name: "Strzyżenie męskie", duration: 30, price: 70 },
        { id: "3", name: "Koloryzacja", duration: 120, price: 200 },
        { id: "4", name: "Modelowanie", duration: 45, price: 90 },
      ],
      availableTimeSlots: [
        {
          date: "2024-07-10",
          slots: ["10:00", "11:00", "14:00", "15:00", "16:00"],
        },
        {
          date: "2024-07-11",
          slots: ["09:00", "11:00", "13:00", "15:00", "17:00"],
        },
        { date: "2024-07-12", slots: ["10:00", "12:00", "14:00", "16:00"] },
      ],
    },
    {
      id: "2",
      slug: "auto-serwis",
      name: "Auto Serwis Kowalski",
      logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=auto-serwis",
      description: "Kompleksowe usługi serwisowe dla Twojego samochodu.",
      services: [
        { id: "1", name: "Przegląd techniczny", duration: 60, price: 150 },
        { id: "2", name: "Wymiana opon", duration: 45, price: 100 },
        { id: "3", name: "Wymiana oleju", duration: 30, price: 120 },
        { id: "4", name: "Diagnostyka komputerowa", duration: 60, price: 200 },
      ],
      availableTimeSlots: [
        { date: "2024-07-10", slots: ["08:00", "10:00", "12:00", "14:00"] },
        { date: "2024-07-11", slots: ["09:00", "11:00", "13:00", "15:00"] },
        { date: "2024-07-12", slots: ["08:00", "10:00", "12:00", "14:00"] },
      ],
    },
  ];

  const provider = mockProviders.find((p) => p.slug === slug);
  return provider || null;
}

// Temporary BookingForm component until the actual component is implemented
const BookingForm = ({
  providerId = "",
  services = [],
  availableTimeSlots = [],
}: {
  providerId: string;
  services: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  availableTimeSlots: Array<{ date: string; slots: string[] }>;
}) => {
  const [step, setStep] = React.useState(1);
  const [selectedService, setSelectedService] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [customerInfo, setCustomerInfo] = React.useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would submit the booking to the backend
    alert("Booking submitted successfully!");
    // Reset form
    setStep(1);
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
    setCustomerInfo({ name: "", email: "", phone: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-6">
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Wybierz usługę</h3>
          <div className="grid gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceSelect(service.id)}
                className="p-4 border rounded-md cursor-pointer hover:border-primary flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.duration} min
                  </p>
                </div>
                <p className="font-medium">{service.price} zł</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Wybierz datę</h3>
          <div className="grid gap-3">
            {availableTimeSlots.map((day) => (
              <div
                key={day.date}
                onClick={() => handleDateSelect(day.date)}
                className="p-4 border rounded-md cursor-pointer hover:border-primary"
              >
                <p className="font-medium">
                  {new Date(day.date).toLocaleDateString("pl-PL", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {day.slots.length} dostępnych terminów
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Wróć do wyboru usługi
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Wybierz godzinę</h3>
          <div className="grid grid-cols-3 gap-3">
            {availableTimeSlots
              .find((day) => day.date === selectedDate)
              ?.slots.map((time) => (
                <div
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className="p-3 border rounded-md cursor-pointer hover:border-primary text-center"
                >
                  <p className="font-medium">{time}</p>
                </div>
              ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Wróć do wyboru daty
          </button>
        </div>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-medium">Twoje dane</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Imię i nazwisko
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={customerInfo.name}
                onChange={handleInfoChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={customerInfo.email}
                onChange={handleInfoChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Telefon
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={customerInfo.phone}
                onChange={handleInfoChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90"
            >
              Potwierdź rezerwację
            </button>
          </div>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Wróć do wyboru godziny
          </button>
        </form>
      )}
    </div>
  );
};

export default async function BookingPage({ params }: BookingPageProps) {
  const { slug } = params;
  const provider = await getServiceProvider(slug);

  if (!provider) {
    notFound();
  }

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
              providerId={provider.id}
              services={provider.services}
              availableTimeSlots={provider.availableTimeSlots}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
