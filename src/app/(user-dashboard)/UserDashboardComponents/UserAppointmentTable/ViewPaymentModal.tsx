import UpdateAppointment from "@/api/appointment/updateAppointment";
import PaymentInit from "@/api/payment/paymentinit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

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

const ViewPaymentModal = ({
  appointmentData,
  onModalClose,
}: {
  appointmentData: AppointmentData;
  onModalClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const handleClose = () => {
    onModalClose();
  };

  const [status, setStatus] = useState<string>("");
//   console.log("changeedStatus", status);

  const { mutate, isPending } = useMutation({
    mutationKey: [],
    mutationFn: PaymentInit,
    onSuccess: (response) => {
        console.log("payment success", response);
        
      if (response.statusCode === 200) {
        toast.success("Status successfully Update");
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        onModalClose();
        window.location.replace(`${response.data.paymentGetwaydata.GatewayPageURL}`)
      }
    },
    onError: (error: any) => {
      console.log("The payment error is:", error);
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

  const handlePayNow = async () => {
    const appointmentId = appointmentData?._id;

    await mutate(appointmentData);
  };


  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <h2>View payment details</h2>
      </DialogTrigger>
      <DialogContent className="lg:max-w-[600px] md:max-w-[550px] max-w-[90dvw] rounded-lg">
        <DialogHeader>
          <DialogTitle className="">Patient Details</DialogTitle>
          <Separator className="bg-primary" />
          <DialogDescription>
            <section className="grid grid-cols-10 gap-3 sm:items-center items-start my-2">
              <Label className="text-base font-semibold sm:col-span-4 col-span-6 flex items-center justify-between">
                Name<span>:</span>
              </Label>
              <h2 className="sm:col-span-6 col-span-4 text-gray-300 font-medium text-base text-start">
                {appointmentData?.name}
              </h2>

              <Label className="text-base font-semibold sm:col-span-4 col-span-6 flex items-center justify-between">
                Phone number<span>:</span>
              </Label>
              <h2 className="sm:col-span-6 col-span-4 text-gray-300 font-medium text-base text-start">
                {appointmentData?.phone}
              </h2>

              <Label className="text-base font-semibold sm:col-span-4 col-span-6 flex items-center justify-between">
                Service<span>:</span>
              </Label>
              <h2 className="sm:col-span-6 col-span-4 text-gray-300 font-medium text-base text-start">
                {appointmentData?.service}
              </h2>

              <Label className="text-base font-semibold sm:col-span-4 col-span-6 flex items-center justify-between">
                Appointment Time<span>:</span>
              </Label>
              <h2 className="sm:col-span-6 col-span-4 text-gray-300 font-medium text-base text-start">
                {appointmentData?.appointmentTime}
              </h2>

              <Label className="text-base font-semibold sm:col-span-4 col-span-6 flex items-center justify-between">
                Appointment Date<span>:</span>
              </Label>
              <h2 className="sm:col-span-6 col-span-4 text-gray-300 font-medium text-base text-start">
                {appointmentData?.appointmentDate}
              </h2>

              <Label className="text-base font-semibold sm:col-span-4 col-span-6 flex items-center justify-between">
                Status<span>:</span>
              </Label>
              <div className="sm:col-span-6 col-span-4 text-gray-300 font-medium text-base text-start">
                {appointmentData?.status === "pending" && (
                  <Badge
                    variant="default"
                    className="bg-[#FFE569] hover:bg-[#FFE569] cursor-pointer"
                  >
                    pending
                  </Badge>
                )}
                {appointmentData?.status === "booked" && (
                  <Badge
                    variant="default"
                    className="hover:bg-primary cursor-pointer"
                  >
                    booked
                  </Badge>
                )}
                {appointmentData?.status === "done" && (
                  <Badge
                    variant="default"
                    className="bg-[#297c0b] hover:bg-[#297c0b] text-gray-200 cursor-pointer"
                  >
                    done
                  </Badge>
                )}
                {appointmentData?.status === "failed" && (
                  <Badge variant="destructive" className="cursor-pointer">
                    failed
                  </Badge>
                )}
              </div>
            </section>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={handleClose}>
            Pay Latter
            </Button>
          </DialogClose>

          <Button onClick={handlePayNow} type="submit" className="hover:bg-primary font-semibold">Pay Now</Button>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPaymentModal;
