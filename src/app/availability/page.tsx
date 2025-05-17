"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainNav } from "@/components/layout/MainNav";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

type WeekSchedule = {
  [key: number]: DaySchedule; // 0 = Sunday, 1 = Monday, etc.
};

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>({
    0: { enabled: false, timeSlots: [] }, // Sunday
    1: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] }, // Monday
    2: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] }, // Tuesday
    3: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] }, // Wednesday
    4: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] }, // Thursday
    5: { enabled: true, timeSlots: [{ start: "09:00", end: "17:00" }] }, // Friday
    6: { enabled: false, timeSlots: [] }, // Saturday
  });

  const [specialDays, setSpecialDays] = useState<{
    [key: string]: { enabled: boolean; timeSlots: TimeSlot[] };
  }>({});

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleDayToggle = (day: number) => {
    setWeekSchedule({
      ...weekSchedule,
      [day]: {
        ...weekSchedule[day],
        enabled: !weekSchedule[day].enabled,
      },
    });
  };

  const handleAddTimeSlot = (day: number) => {
    const newTimeSlots = [
      ...weekSchedule[day].timeSlots,
      { start: "09:00", end: "17:00" },
    ];
    setWeekSchedule({
      ...weekSchedule,
      [day]: {
        ...weekSchedule[day],
        timeSlots: newTimeSlots,
      },
    });
  };

  const handleRemoveTimeSlot = (day: number, index: number) => {
    const newTimeSlots = [...weekSchedule[day].timeSlots];
    newTimeSlots.splice(index, 1);
    setWeekSchedule({
      ...weekSchedule,
      [day]: {
        ...weekSchedule[day],
        timeSlots: newTimeSlots,
      },
    });
  };

  const handleTimeChange = (
    day: number,
    index: number,
    field: "start" | "end",
    value: string,
  ) => {
    const newTimeSlots = [...weekSchedule[day].timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setWeekSchedule({
      ...weekSchedule,
      [day]: {
        ...weekSchedule[day],
        timeSlots: newTimeSlots,
      },
    });
  };

  const handleSpecialDayToggle = () => {
    if (!selectedDate) return;

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const currentDay = specialDays[dateKey];

    if (currentDay) {
      // Toggle existing special day
      setSpecialDays({
        ...specialDays,
        [dateKey]: {
          ...currentDay,
          enabled: !currentDay.enabled,
        },
      });
    } else {
      // Create new special day
      const dayOfWeek = selectedDate.getDay();
      const defaultTimeSlots = weekSchedule[dayOfWeek].enabled
        ? [...weekSchedule[dayOfWeek].timeSlots]
        : [];

      setSpecialDays({
        ...specialDays,
        [dateKey]: {
          enabled: true,
          timeSlots: defaultTimeSlots,
        },
      });
    }
  };

  const handleAddSpecialTimeSlot = () => {
    if (!selectedDate) return;

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const currentDay = specialDays[dateKey] || { enabled: true, timeSlots: [] };

    setSpecialDays({
      ...specialDays,
      [dateKey]: {
        ...currentDay,
        timeSlots: [...currentDay.timeSlots, { start: "09:00", end: "17:00" }],
      },
    });
  };

  const handleRemoveSpecialTimeSlot = (index: number) => {
    if (!selectedDate) return;

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const currentDay = specialDays[dateKey];
    if (!currentDay) return;

    const newTimeSlots = [...currentDay.timeSlots];
    newTimeSlots.splice(index, 1);

    setSpecialDays({
      ...specialDays,
      [dateKey]: {
        ...currentDay,
        timeSlots: newTimeSlots,
      },
    });
  };

  const handleSpecialTimeChange = (
    index: number,
    field: "start" | "end",
    value: string,
  ) => {
    if (!selectedDate) return;

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const currentDay = specialDays[dateKey];
    if (!currentDay) return;

    const newTimeSlots = [...currentDay.timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };

    setSpecialDays({
      ...specialDays,
      [dateKey]: {
        ...currentDay,
        timeSlots: newTimeSlots,
      },
    });
  };

  const isSpecialDay = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return dateKey in specialDays;
  };

  const getSelectedDaySchedule = () => {
    if (!selectedDate) return null;

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    if (dateKey in specialDays) {
      return specialDays[dateKey];
    }

    const dayOfWeek = selectedDate.getDay();
    return weekSchedule[dayOfWeek];
  };

  const selectedDaySchedule = getSelectedDaySchedule();

  return (
    <div className="min-h-screen bg-background">
      <MainNav isLoggedIn={true} />

      <div className="container py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Availability</h2>
        </div>

        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="special">Special Days</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {weekdays.map((day, index) => (
                    <div key={day} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`day-${index}`}
                            checked={weekSchedule[index].enabled}
                            onCheckedChange={() => handleDayToggle(index)}
                          />
                          <Label
                            htmlFor={`day-${index}`}
                            className="font-medium"
                          >
                            {day}
                          </Label>
                        </div>
                        {weekSchedule[index].enabled && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTimeSlot(index)}
                          >
                            Add Time Slot
                          </Button>
                        )}
                      </div>

                      {weekSchedule[index].enabled && (
                        <div className="space-y-2 pl-8">
                          {weekSchedule[index].timeSlots.map(
                            (slot, slotIndex) => (
                              <div
                                key={slotIndex}
                                className="flex items-center space-x-2"
                              >
                                <Input
                                  type="time"
                                  value={slot.start}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      index,
                                      slotIndex,
                                      "start",
                                      e.target.value,
                                    )
                                  }
                                  className="w-32"
                                />
                                <span>to</span>
                                <Input
                                  type="time"
                                  value={slot.end}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      index,
                                      slotIndex,
                                      "end",
                                      e.target.value,
                                    )
                                  }
                                  className="w-32"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveTimeSlot(index, slotIndex)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" x2="10" y1="11" y2="17" />
                                    <line x1="14" x2="14" y1="11" y2="17" />
                                  </svg>
                                </Button>
                              </div>
                            ),
                          )}
                        </div>
                      )}

                      {index < 6 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="special" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      special: (date) => isSpecialDay(date),
                    }}
                    modifiersClassNames={{
                      special: "bg-primary/20",
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDate
                      ? `${format(selectedDate, "EEEE, MMMM d, yyyy")}`
                      : "Select a date"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="special-day-toggle"
                            checked={selectedDaySchedule?.enabled ?? false}
                            onCheckedChange={handleSpecialDayToggle}
                          />
                          <Label
                            htmlFor="special-day-toggle"
                            className="font-medium"
                          >
                            {isSpecialDay(selectedDate)
                              ? "Special Day Schedule"
                              : "Override Default Schedule"}
                          </Label>
                        </div>
                        {selectedDaySchedule?.enabled && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddSpecialTimeSlot}
                          >
                            Add Time Slot
                          </Button>
                        )}
                      </div>

                      {selectedDaySchedule?.enabled && (
                        <div className="space-y-2">
                          {selectedDaySchedule.timeSlots.length === 0 ? (
                            <p className="text-muted-foreground">
                              No time slots available. Add a time slot to make
                              this day available for bookings.
                            </p>
                          ) : (
                            selectedDaySchedule.timeSlots.map(
                              (slot, slotIndex) => (
                                <div
                                  key={slotIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <Input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) =>
                                      handleSpecialTimeChange(
                                        slotIndex,
                                        "start",
                                        e.target.value,
                                      )
                                    }
                                    className="w-32"
                                  />
                                  <span>to</span>
                                  <Input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) =>
                                      handleSpecialTimeChange(
                                        slotIndex,
                                        "end",
                                        e.target.value,
                                      )
                                    }
                                    className="w-32"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveSpecialTimeSlot(slotIndex)
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                      <line x1="10" x2="10" y1="11" y2="17" />
                                      <line x1="14" x2="14" y1="11" y2="17" />
                                    </svg>
                                  </Button>
                                </div>
                              ),
                            )
                          )}
                        </div>
                      )}

                      {!selectedDaySchedule?.enabled && (
                        <p className="text-muted-foreground">
                          This day is currently unavailable for bookings.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
