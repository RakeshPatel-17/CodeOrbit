import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../lib/useApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";

type Donor = {
  id: string;
  donorCode: string;
  fullName: string;
  mobileNumber?: string;
  area?: string;
  status: string;
};

export default function Donors() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fetchApi = useApi();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: donors, isLoading } = useQuery<Donor[]>({
    queryKey: ["donors", search],
    queryFn: () => fetchApi(`/donors?q=${encodeURIComponent(search)}`),
  });

  const createDonor = useMutation({
    mutationFn: (newDonor: Record<string, unknown>) => fetchApi("/donors", {
      method: "POST",
      body: JSON.stringify(newDonor)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setIsDialogOpen(false);
      toast({ title: "Donor added successfully" });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Error adding donor", description: message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createDonor.mutate({
      fullName: formData.get("fullName"),
      mobileNumber: formData.get("mobileNumber"),
      address: formData.get("address"),
      area: formData.get("area"),
      remarks: formData.get("remarks"),
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Donors</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ Add New Donor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Donor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" name="mobileNumber" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input id="area" name="area" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input id="remarks" name="remarks" />
              </div>
              <Button type="submit" disabled={createDonor.isPending} className="w-full">
                {createDonor.isPending ? "Saving..." : "Save Donor"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex gap-4">
        <Input 
          placeholder="Search by name, code, or mobile..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : donors?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-slate-500">No donors found.</TableCell></TableRow>
            ) : (
              donors?.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell className="font-medium text-blue-600">{donor.donorCode}</TableCell>
                  <TableCell className="font-bold">{donor.fullName}</TableCell>
                  <TableCell>{donor.mobileNumber || "-"}</TableCell>
                  <TableCell>{donor.area || "-"}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      {donor.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
