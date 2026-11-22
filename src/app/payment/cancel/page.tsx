
"use client";

import Link from "next/link";
import { XCircle, ArrowLeft, Package, CreditCard } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-xl sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-error/10 text-error">
          <XCircle size={46} />
        </div>

        <h1 className="mt-6 text-3xl font-black">
          Payment Cancelled
        </h1>

        <p className="mt-4 leading-7 text-base-content/60">
          Your Stripe checkout was cancelled. Your booking may
          remain pending and unpaid. You can return to your
          dashboard to review your bookings.
        </p>

        <div className="mt-7 rounded-2xl bg-base-200 p-5 text-left">
          <div className="flex items-center gap-3">
            <CreditCard className="text-primary" size={22} />
            <div>
              <p className="font-bold">No payment confirmation</p>
              <p className="text-sm text-base-content/60">
                Your booking is not confirmed until payment succeeds.
              </p>
            </div>
          </div>
        </div>

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
          <ArrowLeft size={18} />
          Browse Equipment
        </Link>
      </div>
    </main>
  );
}
