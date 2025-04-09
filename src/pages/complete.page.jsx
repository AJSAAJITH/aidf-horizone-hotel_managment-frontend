import { useGetCheckoutSessionStatusQuery } from '@/lib/api';
import React from 'react'
import { useSearchParams, Link, Navigate } from 'react-router'
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

function Completepayment() {
    const [searchParam, setsearchParam] = useSearchParams();
    const session_id = searchParam.get('session_id');
    // console.log("session_id", session_id);
    const { data, isLoading, isError } = useGetCheckoutSessionStatusQuery(session_id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-2xl p-6 mx-auto text-center bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-red-600">
                    Something went wrong
                </h2>
                <p className="mb-4">
                    We couldn't process your payment information. Please try again or
                    contact support.
                </p>
                <Button asChild className="mt-6">
                    <Link to={`/booking/payment?bookingId=${data?.bookingId || ""}`}>
                        Return to Payment Page
                    </Link>
                </Button>
            </div>
        );
    }

    if (data?.status === "open") {
        return <Navigate to={`/booking/payment?bookingId=${data?.bookingId}`} />;
    }

    if (data?.status === "complete") {
        // Format dates
        const checkInDate = new Date(data.booking.checkIn);
        const checkOutDate = new Date(data.booking.checkOut);
        const formattedCheckIn = format(checkInDate, "MMM dd, yyyy");
        const formattedCheckOut = format(checkOutDate, "MMM dd, yyyy");

        // Calculate number of nights
        const nights = Math.round(
            (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
        );

        return (
            <section
                id="success"
                className="max-w-3xl p-6 mx-auto my-8 bg-white rounded-lg shadow-md"
            >
                <div className="flex justify-center mb-4 text-green-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>

                <h2 className="mb-4 text-2xl font-bold text-center">
                    Booking Confirmed!
                </h2>
                {/* <p className="mb-4 text-center">
              Your payment has been processed successfully. A confirmation email
              will be sent to{" "}
              <span className="font-semibold">{data.customer_email}</span>.
            </p>
             */}
                <p className="mb-4 text-center">
                    Your payment has been processed successfully.
                </p>
                {/* Hotel Info Card */}
                <div className="mt-6 overflow-hidden border rounded-lg">
                    <div className="relative h-48">
                        {data.hotel.image && (
                            <img
                                src={data.hotel.image}
                                alt={data.hotel.name}
                                className="object-cover w-full h-full"
                            />
                        )}
                    </div>
                    <div className="p-4 bg-gray-50">
                        <h3 className="text-xl font-bold">{data.hotel.name}</h3>
                        <p className="mb-2 text-gray-600">{data.hotel.location}</p>
                        {data.hotel.rating && (
                            <div className="flex items-center mb-2">
                                <span className="mr-1 text-yellow-500">★</span>
                                <span>{data.hotel?.rating}</span>
                                {data.hotel.reviews && (
                                    <span className="ml-1 text-sm text-gray-500">
                                        ({data.hotel.reviews} reviews)
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking Details */}
                <div className="pt-4 mt-6 border-t">
                    <h3 className="mb-2 text-lg font-semibold">Booking Details:</h3>
                    <div className="p-4 rounded-md bg-gray-50">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-600">Booking ID</p>
                                <p className="font-medium">
                                    {data.booking._id || data.bookingId}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Room Count</p>
                                <p className="font-medium">{data.booking.rooms_count}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Check-in Date</p>
                                <p className="font-medium">{formattedCheckIn}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Check-out Date</p>
                                <p className="font-medium">{formattedCheckOut}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Duration</p>
                                <p className="font-medium">
                                    {nights} {nights === 1 ? "night" : "nights"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Price</p>
                                <p className="font-medium">${data.hotel.price} per night</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Payment Method</p>
                                <p className="font-medium capitalize">
                                    {data.booking.paymentMethod.replace("_", " ").toLowerCase()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Payment Status</p>
                                <p className="font-medium text-green-600">
                                    {data.booking.paymentStatus}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-6 border-t">
                    <h3 className="mb-2 text-lg font-semibold">What happens next?</h3>
                    <ul className="pl-5 space-y-1 list-disc">
                        {/* <li>
                  You'll receive a confirmation email with your booking details
                </li> */}
                        <li>Present your booking ID upon arrival at the hotel</li>
                        <li>Check-in time starts at 2:00 PM on {formattedCheckIn}</li>
                        <li>Check-out time is before 12:00 PM on {formattedCheckOut}</li>
                    </ul>
                </div>

                <div className="mt-6 text-sm text-center text-gray-600">
                    <p>
                        If you have any questions, please contact{" "}
                        <a
                            href="mailto:bookings@example.com"
                            className="text-blue-600 hover:underline"
                        >
                            bookings@example.com
                        </a>
                    </p>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    {/* <Button asChild>
                <Link to="/bookings">View My Bookings</Link>
              </Button> */}
                    <Button asChild variant="outline">
                        <Link to="/">Return to Home</Link>
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <div className="max-w-2xl p-6 mx-auto text-center bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Payment Status Unknown</h2>
            <p className="mb-4">
                We couldn't determine the status of your payment. If you completed a
                booking, please check your email for confirmation.
            </p>
            <Button asChild className="mt-6">
                <Link to="/">Return to Home</Link>
            </Button>
        </div>
    )
}

export default Completepayment