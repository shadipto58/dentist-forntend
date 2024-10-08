import DeleteAppointment from "@/api/appointment/deleteAppointment";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ViewCustomerModal from "./ViewCustomerModal";
import { useState } from "react";
import { format } from "date-fns";
import ViewPaymentModal from "./ViewPaymentModal";
import Spinner from "@/app/components/Spinner/Spinner";

interface AppointmentData {
  // Define the structure of your appointmentData prop here
  _id: string;
  name: string;
  phone: string;
  address: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  message: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ActionButton = ({ apoointment }: { apoointment: AppointmentData }) => {
  // console.log("apoointment", apoointment);
  const queryClient = useQueryClient();
  const [menuOpen,setMenuOpen] = useState<boolean>(false);

  const handleModalClose = () => {
    setMenuOpen(false);
  };

  // get today date
  const today = new Date();
  const appointmentDate = new Date(apoointment.appointmentDate);
  const shouldShowDeleteButton = today < appointmentDate;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  

  const { mutate, isPending } = useMutation({
    mutationKey: [],
    mutationFn: DeleteAppointment,
    onSuccess: (response) => {
      console.log("the res is ", response);

      if (response.statusCode === 200) {
        toast.success("Appointment deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["UserAppointments"] });
        setMenuOpen(false)
        setIsDeleteDialogOpen(false)
      }
    },
    onError: (error: any) => {
      console.log("The Error Appointment is:", error);
      if (error?.response?.status == 409) {
        toast.warning(
          "There is already an appointment with this name and date."
        );
      } else if (error?.response?.status == 500) {
        toast.error("Something went wrong during an appointment");
      } else if (error.request) {
        toast.error("No response received from the server!!");
      } else {
        console.error("Error while sending the request:", error.message);
      }
    },
  });

  const handleDelete = async () => {
    console.log("Delete Appointments", apoointment);
    console.log("Delete button clicked");
    const appointmentId = apoointment._id;
    await mutate({ appointmentId });
  };

  return (
    <>
      <DropdownMenu  onOpenChange={setMenuOpen} open={menuOpen}>
        <DropdownMenuTrigger asChild onClick={()=>setMenuOpen(!menuOpen)}>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 border-none focus-visible:ring-0"
          >
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(apoointment._id)}
          >
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ViewCustomerModal  onModalClose={handleModalClose} appointmentData={apoointment} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <ViewPaymentModal onModalClose={handleModalClose} appointmentData={apoointment} />
          </DropdownMenuItem>
          {shouldShowDeleteButton && (
            <>
            {/* <DropdownMenuItem
              onClick={handleDelete}
              onSelect={(e) => e.preventDefault()}
              className="text-gray-200 bg-[#6a1c1d] focus:bg-[#782c2c] mt-1"
            >
              Delete
            </DropdownMenuItem> */}
            <AlertDialog open={isDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onClick={()=>setIsDeleteDialogOpen(true)}
              onSelect={(e) => e.preventDefault()}
              className="bg-[#6a1c1d] focus:bg-[#782c2c] text-gray-200 font-bold cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this
                  appointment and remove this data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={()=>setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending} className="hover:bg-primary">
                  {isPending ? <><Spinner /> Continue</> : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionButton;
