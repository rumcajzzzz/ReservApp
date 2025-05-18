"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import { MainNav } from "@/components/layout/MainNav";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Haircut",
      description: "Professional haircut service for all hair types",
      duration: 30,
      price: 35,
    },
    {
      id: "2",
      name: "Hair Coloring",
      description: "Full hair coloring service with premium products",
      duration: 120,
      price: 120,
    },
    {
      id: "3",
      name: "Manicure",
      description: "Professional nail care and polish application",
      duration: 45,
      price: 40,
    },
    {
      id: "4",
      name: "Facial Treatment",
      description: "Rejuvenating facial treatment for all skin types",
      duration: 60,
      price: 75,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Omit<Service, "id">>({
    name: "",
    description: "",
    duration: 30,
    price: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddService = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add service");
      }

      setServices([...services, data.service]);
      setNewService({ name: "", description: "", duration: 30, price: 0 });
      setIsAddDialogOpen(false);
    } catch (err: any) {
      console.error("Error adding service:", err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditService = () => {
    if (!currentService) return;

    setServices(
      services.map((service) =>
        service.id === currentService.id ? currentService : service,
      ),
    );
    setIsEditDialogOpen(false);
    setCurrentService(null);
  };

  const handleDeleteService = () => {
    if (!currentService) return;

    setServices(services.filter((service) => service.id !== currentService.id));
    setIsDeleteDialogOpen(false);
    setCurrentService(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    target: "new" | "current",
  ) => {
    const { name, value } = e.target;

    if (target === "new") {
      setNewService({
        ...newService,
        [name]: name === "duration" || name === "price" ? Number(value) : value,
      });
    } else if (currentService) {
      setCurrentService({
        ...currentService,
        [name]: name === "duration" || name === "price" ? Number(value) : value,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav isLoggedIn={true} />

      <div className="container py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Service List</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.length === 0 ? (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No services found.
                </p>
              ) : (
                filteredServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {service.name}
                        </CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentService(service);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentService(service);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="font-medium">
                            {service.duration}
                          </span>{" "}
                          min
                        </div>
                        <div className="text-lg font-bold">
                          ${service.price}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Add a new service to your business offerings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                value={newService.name}
                onChange={(e) => handleInputChange(e, "new")}
                placeholder="Haircut"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newService.description}
                onChange={(e) => handleInputChange(e, "new")}
                placeholder="Professional haircut service for all hair types"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={newService.duration}
                  onChange={(e) => handleInputChange(e, "new")}
                  min={5}
                  step={5}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newService.price}
                  onChange={(e) => handleInputChange(e, "new")}
                  min={0}
                  step={5}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddService} disabled={!newService.name}>
              Add Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the details of your service.
            </DialogDescription>
          </DialogHeader>
          {currentService && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Service Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={currentService.name}
                  onChange={(e) => handleInputChange(e, "current")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={currentService.description}
                  onChange={(e) => handleInputChange(e, "current")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-duration">Duration (minutes)</Label>
                  <Input
                    id="edit-duration"
                    name="duration"
                    type="number"
                    value={currentService.duration}
                    onChange={(e) => handleInputChange(e, "current")}
                    min={5}
                    step={5}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    value={currentService.price}
                    onChange={(e) => handleInputChange(e, "current")}
                    min={0}
                    step={5}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditService}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          {currentService && (
            <div className="py-4">
              <p className="font-medium">{currentService.name}</p>
              <p className="text-sm text-muted-foreground">
                {currentService.description}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
