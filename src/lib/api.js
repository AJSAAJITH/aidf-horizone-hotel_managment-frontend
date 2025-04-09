import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BACKEND_URL = "http://localhost:5000";
const BACKEND_URL = "https://aidf-horizone-hotel-managment-backend.onrender.com";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/`,
    prepareHeaders: async (headers, getState) => {  // Corrected function signature
      const token = await window?.Clerk?.session?.getToken();
      console.log("Clark API Token", token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;  // Return headers
    },
  }),
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => "hotels",
    }),
    getHotelsForSearchQuery: builder.query({
      query: (query) => `hotels/search/retrieve?query=${query}`,
    }),
    getHotelById: builder.query({
      query: (id) => `hotels/${id}`,
    }),
    createHotel: builder.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        body: hotel,
      }),
    }),
    createBooking: builder.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      }),
    }),
    getBookingById: builder.query({
      query: (id) => `bookings/${id}`,

    }),
    getCheckoutSessionStatus: builder.query({
      query: (sessionId) => `payments/session-status?session_id=${sessionId}`,
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useGetHotelsForSearchQueryQuery,
  useCreateHotelMutation,
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useGetCheckoutSessionStatusQuery,
} = api; // Use `api` instead of `API`
