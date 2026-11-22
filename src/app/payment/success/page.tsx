
"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, loading: authLoading } = useAuth();

  const sessionId = searchParams.get("session_id");

  const [checking, setChecking] = useState(true);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Checking your payment..."
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    let active = true;

    const checkPayment = async () => {
      if (!sessionId) {
        setStatusMessage("Payment session ID was not found.");
        setChecking(false);
        return;
      }

      try {
        // Retry because Stripe webhook processing may take a few seconds.
        for (let attempt = 0; attempt < 12; attempt++) {
          if (!active) return;

          try {
            const response = await api.get(
              `/payments/status/${encodeURIComponent(sessionId)}`
            );

            if (response.data.paymentConfirmed === true) {
              if (active) {
                setPaymentConfirmed(true);
                setStatusMessage("Your payment has been confirmed.");
              }

              return;
            }

            if (
              response.data.checkoutStatus === "expired" ||
              response.data.stripePaymentStatus === "unpaid" &&
                response.data.checkoutStatus === "complete"
            ) {
              if (active) {
                setStatusMessage(
                  "Your payment has not been completed."
                );
              }

              return;
            }
          } catch (error) {
            console.error("Payment status check failed:", error);
          }

          // Wait 2 seconds before checking again.
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (active) {
          setStatusMessage(
            "Your payment is still being processed. Please check your bookings shortly."
          );
        }
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
  }, [user, authLoading, router, sessionId]);

  if (authLoading || (checking && user)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-base-200 px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />

          <p className="mt-4 font-semibold">
            {statusMessage}
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
              Your payment has been confirmed successfully.
              Your equipment booking is now confirmed.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-warning">
              {sessionId ? (
                <Clock size={46} />
              ) : (
                <AlertCircle size={46} />
              )}
            </div>

            <h1 className="mt-6 text-3xl font-black">
              {sessionId
                ? "Payment Processing"
                : "Payment Session Not Found"}
            </h1>

            <p className="mt-4 leading-7 text-base-content/60">
              {statusMessage}
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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-base-200">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
