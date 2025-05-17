"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  Filter,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  date: Date;
  time: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  notes?: string;
}

export default function BookingsList() {
  // Mock data for bookings
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+1 234 567 890",
      service: "Haircut",
      date: new Date(2023, 5, 15),
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: "2",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "+1 234 567 891",
      service: "Hair Coloring",
      date: new Date(2023, 5, 16),
      time: "2:30 PM",
      status: "pending",
    },
    {
      id: "3",
      customerName: "Mike Johnson",
      customerEmail: "mike@example.com",
      customerPhone: "+1 234 567 892",
      service: "Beard Trim",
      date: new Date(2023, 5, 14),
      time: "11:15 AM",
      status: "completed",
    },
    {
      id: "4",
      customerName: "Sarah Williams",
      customerEmail: "sarah@example.com",
      customerPhone: "+1 234 567 893",
      service: "Full Service",
      date: new Date(2023, 5, 17),
      time: "4:00 PM",
      status: "cancelled",
    },
  ]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(
    undefined,
  );
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Filter bookings based on search term and status filter
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? booking.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Upcoming bookings (confirmed or pending)
  const upcomingBookings = filteredBookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "pending",
  );

  // Past bookings (completed or cancelled)
  const pastBookings = filteredBookings.filter(
    (booking) =>
      booking.status === "completed" || booking.status === "cancelled",
  );

  // Handle booking status change
  const updateBookingStatus = (
    id: string,
    newStatus: "confirmed" | "pending" | "cancelled" | "completed",
  ) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status: newStatus } : booking,
      ),
    );
  };

  // Handle booking reschedule
  const rescheduleBooking = () => {
    if (selectedBooking && rescheduleDate && rescheduleTime) {
      setBookings(
        bookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, date: rescheduleDate, time: rescheduleTime }
            : booking,
        ),
      );
      setIsRescheduleDialogOpen(false);
      setSelectedBooking(null);
      setRescheduleDate(undefined);
      setRescheduleTime("");
    }
  };

  // Handle booking cancellation
  const cancelBooking = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, "cancelled");
      setIsCancelDialogOpen(false);
      setSelectedBooking(null);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Booking table component
  const BookingsTable = ({ bookings }: { bookings: Booking[] }) => (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No bookings found
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.customerName}</div>
                    <div className="text-sm text-gray-500">
                      {booking.customerEmail}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.customerPhone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{format(booking.date, "MMM dd, yyyy")}</span>
                    <span className="text-gray-500">{booking.time}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {booking.status === "pending" && (
                        <DropdownMenuItem
                          onClick={() =>
                            updateBookingStatus(booking.id, "confirmed")
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm
                        </DropdownMenuItem>
                      )}
                      {(booking.status === "pending" ||
                        booking.status === "confirmed") && (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBooking(booking);
                              setRescheduleDate(booking.date);
                              setIsRescheduleDialogOpen(true);
                            }}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsCancelDialogOpen(true);
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </DropdownMenuItem>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <DropdownMenuItem
                          onClick={() =>
                            updateBookingStatus(booking.id, "completed")
                          }
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search bookings..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs for upcoming and past bookings */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <BookingsTable bookings={upcomingBookings} />
            </TabsContent>
            <TabsContent value="past">
              <BookingsTable bookings={pastBookings} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Reschedule Dialog */}
        <Dialog
          open={isRescheduleDialogOpen}
          onOpenChange={setIsRescheduleDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Booking</DialogTitle>
              <DialogDescription>
                Select a new date and time for this booking.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">New Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {rescheduleDate
                        ? format(rescheduleDate, "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={rescheduleDate}
                      onSelect={setRescheduleDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">New Time</label>
                <Select
                  value={rescheduleTime}
                  onValueChange={setRescheduleTime}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                    <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                    <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                    <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                    <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                    <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRescheduleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={rescheduleBooking}
                disabled={!rescheduleDate || !rescheduleTime}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Booking Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                No, Keep It
              </Button>
              <Button variant="destructive" onClick={cancelBooking}>
                Yes, Cancel Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
