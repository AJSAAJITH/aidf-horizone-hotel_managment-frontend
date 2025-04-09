import CheckoutForm from '@/components/CheckoutForm';
import { useGetBookingByIdQuery } from '@/lib/api';
import React from 'react'
import { useSearchParams } from 'react-router'

function PaymentPage() {
    const [searchParam, setSearchParam] = useSearchParams();
    const bookingId = searchParam.get("bookingId");
    console.log("Booking id ", bookingId);
    const { data: booking, isLoading: isBookingLoading } = useGetBookingByIdQuery(bookingId);
    console.log("Booking data", booking);
    if (isBookingLoading || !booking) {
        return <div>Loading...</div>
    }

    return (
        <main className="container min-h-screen px-4 py-8 mx-auto">
            <h2 className="text-4xl font-bold">Review Your Booking</h2>
            <div className="mt-4">
                <CheckoutForm bookingId={booking._id} />
            </div>
        </main>
    );
}

export default PaymentPage