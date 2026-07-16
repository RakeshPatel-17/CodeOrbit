import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../lib/useApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";

type Donor = {
  id: string;
  donorCode: string;
  fullName: string;
};

type Donation = {
  id: string;
  donorCode: string;
  donorName: string;
  amount: number;
  months: string[];
  paymentMode: string;
  status: string;
  createdAt: string;
};

export default function Donations() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [donorSearch, setDonorSearch] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const fetchApi = useApi();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: donations, isLoading } = useQuery<Donation[]>({
    queryKey: ["donations"],
    queryFn: () => fetchApi("/donations"),
  });

  const { data: donorResults } = useQuery<Donor[]>({
    queryKey: ["donors-search", donorSearch],
    queryFn: () => fetchApi(`/donors?q=${encodeURIComponent(donorSearch)}`),
    enabled: donorSearch.length > 1,
  });

  const createDonation = useMutation({
    mutationFn: (newDonation: Record<string, unknown>) => fetchApi("/donations", {
      method: "POST",
      body: JSON.stringify(newDonation)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setIsDialogOpen(false);
      setSelectedDonor(null);
      setDonorSearch("");
      toast({ title: "Donation added successfully" });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Error adding donation", description: message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDonor) {
      toast({ title: "Please select a donor", variant: "destructive" });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const monthsStr = formData.get("months") as string;
    const months = monthsStr.split(",").map(m => m.trim()).filter(Boolean);

    createDonation.mutate({
      donorId: selectedDonor.id,
      amount: Number(formData.get("amount")),
      months,
      paymentMode,
      referenceNumber: formData.get("referenceNumber"),
      remarks: formData.get("remarks"),
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Donations</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>+ New Donation</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Record New Donation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Search Donor</Label>
                <div className="relative">
                  <Input 
                    placeholder="Search by code or name..." 
                    value={selectedDonor ? `${selectedDonor.donorCode} - ${selectedDonor.fullName}` : donorSearch}
                    onChange={(e) => {
                      setSelectedDonor(null);
                      setDonorSearch(e.target.value);
                    }}
                  />
                  {!selectedDonor && donorSearch.length > 1 && donorResults && (
                    <div className="absolute z-10 w-full bg-white border border-slate-200 mt-1 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {donorResults.map(d => (
                        <div 
                          key={d.id} 
                          className="p-2 hover:bg-slate-50 cursor-pointer text-sm"
                          onClick={() => setSelectedDonor(d)}
                        >
                          <span className="font-bold text-blue-600">{d.donorCode}</span> - {d.fullName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input id="amount" name="amount" type="number" required min="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="months">Months</Label>
                  <Input id="months" name="months" placeholder="e.g. Jan-2024, Feb-2024" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Online Transfer">Online Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMode !== "Cash" && (
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Reference / Txn Number</Label>
                  <Input id="referenceNumber" name="referenceNumber" required />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input id="remarks" name="remarks" />
              </div>

              <Button type="submit" disabled={createDonation.isPending || !selectedDonor} className="w-full">
                {createDonation.isPending ? "Processing..." : "Submit Donation"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Months</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>
            ) : donations?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-slate-500">No donations found.</TableCell></TableRow>
            ) : (
              donations?.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="whitespace-nowrap">{new Date(txn.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="font-bold">{txn.donorName}</div>
                    <div className="text-xs text-slate-500">{txn.donorCode}</div>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-green-700">₹{txn.amount}</TableCell>
                  <TableCell>{txn.paymentMode}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {txn.months.map(m => (
                        <span key={m} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{m}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${txn.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {txn.status}
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
