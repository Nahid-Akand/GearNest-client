
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, Package } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [checking, setChecking] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    let active = true;

    const checkPayment = async () => {
      try {
        const response = await api.get("/bookings/my-bookings");
        const bookings = response.data.bookings || [];

        // Stripe's webhook updates the booking after successful payment.
        const paidBooking = bookings.some(
          (booking: {
            paymentStatus?: string;
            status?: string;
          }) => booking.paymentStatus === "paid"
        );

        if (active) {
          setPaymentConfirmed(paidBooking);
        }
      } catch (error) {
        console.error("Payment status check failed:", error);
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    };

    checkPayment();

    return () => {
      active = false;
    };
  }, [user, authLoading, router]);

  if (authLoading || checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 font-semibold">
            Checking your payment...
          </p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-xl sm:p-10">
        {paymentConfirmed ? (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 size={46} />
            </div>

            <h1 className="mt-6 text-3xl font-black">
              Payment Successful!
            </h1>

            <p className="mt-4 leading-7 text-base-content/60">
              Your payment has been confirmed. You can view your
              rental details in your customer dashboard.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-warning">
              <Clock size={46} />
            </div>

            <h1 className="mt-6 text-3xl font-black">
              Payment Processing
            </h1>

            <p className="mt-4 leading-7 text-base-content/60">
              Your checkout has returned successfully, but payment
              confirmation has not reached our server yet. Please
              check your bookings again shortly.
            </p>
          </>
        )}

        <Link
          href="/dashboard/bookings"
          className="btn btn-primary mt-8 w-full"
        >
          <Package size={19} />
          View My Bookings
        </Link>

        <Link
          href="/equipment"
          className="btn btn-outline mt-3 w-full"
        >
          Browse More Equipment
        </Link>
      </div>
    </main>
  );
}
