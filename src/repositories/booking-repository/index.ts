import { prisma } from "@/config";
import { Ticket, TicketStatus } from "@prisma/client";

async function getBooking(userId: number) {
  return prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      Room: true,
    }
  });
}

async function postBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId
    }
  });
}

async function findRoomById(roomId: number ) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true
    }
  });
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt">

const bookingRepository = {
  getBooking,
  findRoomById,
  postBooking
};

export default bookingRepository;
