import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus from "http-status";
import { number } from "joi";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === "UnauthorizerError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    } else {
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = Number(req.body.roomId);

  try {
    const newBooking = await bookingService.postNewBooking(userId, roomId);

    return res.status(httpStatus.OK).send(newBooking);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === "UnauthorizerError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    } else {
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId = Number(req.body.roomId);
  const oldBookingId = Number(req.params.bookingId);

  try {
    const newBooking = await bookingService.updateBooking(oldBookingId, userId, roomId);

    return res.status(httpStatus.OK).send(newBooking);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === "UnauthorizerError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "BadRequestError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    } else {
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
