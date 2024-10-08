"use client";
import Login from "@/api/user/login";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserContext } from "@/context/UserContext/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Spinner from "../components/Spinner/Spinner";
import Cookies from 'js-cookie';

const formSchema = z.object({
    email: z.string().email({
        message: "Email Invalid",
    }),
    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
});
type FormData = z.infer<typeof formSchema>;

const LoginPage = () => {
    const router = useRouter();
    const { setUser } = useContext(UserContext);

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({ resolver: zodResolver(formSchema) });

    const { mutate, isPending } = useMutation({
        mutationFn: Login,
        onSuccess: (response) => {
            console.log("response", response);

            if (response.statusCode === 200) {
                toast.success("User successfully Login");

                localStorage.setItem(
                    "userData",
                    JSON.stringify(response.data.loggedInUser)
                );
                localStorage.setItem(
                    "accessToken",
                    JSON.stringify(response?.data?.accessToken)
                );
                localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(response?.data?.refreshToken)
                );
                // Set cookie using document.cookie
                const accessToken = response.data.accessToken;
                //const expires = new Date();
                //expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // Cookie expires in 7 days

                //document.cookie = `middlewareToken=${accessToken}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
                Cookies.set('middlewareToken', `${accessToken}`)
                setUser(response.data.loggedInUser);
                router.push("/");
            }
        },
        onError: (error: any) => {
            if (
                error?.response?.status == 400 ||
                error?.response?.status == 401
            ) {
                toast.warning("Email or Password don't match !!");
            } else if (error.request) {
                toast.error("No response received from the server!!");
            } else {
                console.error(
                    "Error while sending the request:",
                    error.message
                );
            }
        },
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        await mutate(data);
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
            <Card className="w-full max-w-md dark:bg-black">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Login
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div>
                            <div className="space-y-2">
                                <Label htmlFor="email-username">
                                    Email{" "}
                                    <span className="text-red-600">*</span>
                                </Label>
                                <Input
                                    id="email-username"
                                    placeholder="Enter your email"
                                    {...register("email")}
                                    type="text"
                                    className="focus:border-primary h-11"
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">
                                        Password{" "}
                                        <span className="text-red-600">*</span>
                                    </Label>
                                    <Link
                                        className="text-sm underline"
                                        href="/forgot-password"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    type="password"
                                    className="focus:border-primary h-11"
                                />
                            </div>
                            {errors.password && (
                                <span className="text-red-500 text-xs">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <Button
                            className="w-full hover:bg-primary gap-2 justify-center font-bold text-black"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Spinner /> Login
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                        <Button
                            className="flex items-center gap-2 w-full"
                            variant="outline"
                        >
                            Login with Google
                        </Button>
                        <div className="flex items-center justify-center">
                            <div className="text-sm text-gray-500 dark:text-white">
                                Don&apos;t have an account?
                                <Link
                                    className="font-medium underline"
                                    href="/signup"
                                >
                                    {""} Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
