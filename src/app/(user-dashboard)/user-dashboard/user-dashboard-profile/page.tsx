"use client";
import UpdateUser from "@/api/users/updateUser";
import Spinner from "@/app/components/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/context/UserContext/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";




const formSchema = z.object({
  fullname: z.string().min(2, {
    message: "Fullname must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Email Invalid",
  }),
  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, "Please enter your phone number")
    .refine((phone) => /^01[3-9]\d{8}$/.test(phone), {
      message: "Please enter a valid phone number",
    }),
    avatar: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

const UserDashboardProfile = () => {
  const router = useRouter();
  const { user, setUser, userLoading } = useContext(UserContext);
  console.log("The user is:", user);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [avatarBase64, setAvatarBase64] = useState("");
   // Function to handle logo change
   const handleAvatarImageChange = (event:any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (e) => {
        if (e.target) {
            setAvatarBase64(reader.result as string);
            setPreviewImage(e.target.result as string);
          }
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        setPreviewImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateUser,
    onSuccess: (response) => {
        console.log("response is",response);
        
      if (response.statusCode === 200) {
        toast.success("User successfully updated");
        setPreviewImage(response.data.avatar)
        localStorage.setItem(
            "userData",
            JSON.stringify(response.data)
          );
          setUser(response.data);
      }
    },
    onError: (error: any) => {
      if (error?.response?.status == 409) {
        toast.warning("Username or Email already registered !!");
      } else if (error.request) {
        toast.error("No response received from the server!!");
      } else {
        console.error("Error while sending the request:", error.message);
      }
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {


    const newData = {
        ...data,
        avatar: avatarBase64,
      }
      console.log("The new data is:", newData);
      

    const userId = user?._id;
    if (user && user._id) {
        const userId = user._id;
        await mutate({ data: newData, userId: user._id?.toString() });
      } else {
        console.error("User or user ID is not defined");
      }
    
    // await mutate({ data: data, userId });
  };

  useEffect(() => {
    if (user) {
      setValue("fullname", user?.fullname);
      setValue("email", user?.email);
      if (user?.phone) {
        setValue("phone", user?.phone?.toString());
      }
      if (user?.avatar) {
        setPreviewImage(user?.avatar as string)
      }
      // ... other fields
    }
  }, [user,setValue]);

  return (
    <main>
      <h1 className="text-2xl text-gray-200 font-bold">Profile</h1>
      <p className="text-gray-500 dark:text-gray-400">
        This is how others will see you on the site.
      </p>
      <Separator className="my-4" />
      <section>
        <form
          className="space-y-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <p className="pb-3">Profile Picture</p>
            <Label htmlFor="avatar" className="h-full w-fit">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Uploades Image"
                  height={120}
                  width={120}
                  className="min-w-[120px] h-[120px] rounded-full object-cover object-center"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={120}
                    height={120}
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="#a9ff8a"
                      strokeLinecap="round"
                      strokeWidth={2}
                    >
                      <path
                        strokeDasharray="2 4"
                        strokeDashoffset={6}
                        d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          dur="0.6s"
                          repeatCount="indefinite"
                          values="6;0"
                        ></animate>
                      </path>
                      <path
                        strokeDasharray={30}
                        strokeDashoffset={30}
                        d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          begin="0.1s"
                          dur="0.3s"
                          values="30;0"
                        ></animate>
                      </path>
                      <path
                        strokeDasharray={10}
                        strokeDashoffset={10}
                        d="M12 16v-7.5"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          begin="0.5s"
                          dur="0.2s"
                          values="10;0"
                        ></animate>
                      </path>
                      <path
                        strokeDasharray={6}
                        strokeDashoffset={6}
                        d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"
                      >
                        <animate
                          fill="freeze"
                          attributeName="stroke-dashoffset"
                          begin="0.7s"
                          dur="0.2s"
                          values="6;0"
                        ></animate>
                      </path>
                    </g>
                  </svg>
                </>
              )}
            </Label>
            <Input
              id="avatar"
              {...register("avatar")}
              onChange={handleAvatarImageChange}
              type="file"
              className="appearance-none hidden"
            />
            {errors.avatar?.message && (
              <span className="text-red-500 text-xs">
                {(errors.avatar as FieldError).message}
              </span>
            )}
          </div>

          <div>
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                {...register("fullname")}
                id="fullname"
                name="fullname"
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullname && (
              <span className="text-red-500 text-xs">
                {errors.fullname.message}
              </span>
            )}
          </div>

          <div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                {...register("email")}
                id="email"
                name="email"
                placeholder="Enter your email address"
                type="email"
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                {...register("phone")}
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                type="text"
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-xs">
                {errors.phone.message}
              </span>
            )}
          </div>

          <Button
            className="w-full hover:bg-primary gap-2 justify-center text-black font-bold"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Spinner /> Updating
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </section>
    </main>
  );
};

export default UserDashboardProfile;
