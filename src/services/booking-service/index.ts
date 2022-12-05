import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { forbidden } from "joi";

async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw notFoundError();
  }

  const booking = await bookingRepository.getBooking(userId);

  if (!booking) {
    throw notFoundError();
  }
  const response = {
    id: booking.id,
    Room: booking.Room
  };
  return response;
}

async function postNewBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbidden();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbidden();
  }

  const room = await bookingRepository.findRoomById(roomId);

  if (!room) {
    throw notFoundError();
  }

  if (room.Booking.length === room.capacity) {
    throw forbidden();
  }

  const newBooking = await bookingRepository.postBooking(userId, roomId);
  return newBooking;
}

async function updateBooking(oldBookingId: number, userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbidden();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbidden();
  }

  const oldBooking = await bookingRepository.getBooking(userId);
  if (!oldBooking || oldBooking.id !== oldBookingId) {
    throw forbidden();
  }

  const newRoom = await bookingRepository.findRoomById(roomId);
  if (!newRoom) {
    throw notFoundError();
  }

  if (newRoom.Booking.length >= newRoom.capacity) {
    throw forbidden();
  }

  await bookingRepository.deleteBooking(oldBookingId);
  const newBooking = await bookingRepository.postBooking(userId, roomId);
  return newBooking;
}

const bookingService = {
  getBooking,
  postNewBooking,
  updateBooking
};

export default bookingService;
