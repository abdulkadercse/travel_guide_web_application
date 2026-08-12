import { Router } from "express";
import { authRoutes } from "@/modules/auth/auth.route";
import { userRoutes } from "@/modules/user/user.route";
import { destinationRoutes } from "@/modules/destination/destination.route";
import { hotelRoutes } from "@/modules/hotel/hotel.route";
import { transportationRoutes } from "@/modules/transportation/transportation.route";
import { reviewRoutes } from "@/modules/review/review.route";
import { favoriteRoutes } from "@/modules/favorite/favorite.route";
import { tripPlanRoutes } from "@/modules/tripPlan/tripPlan.route";
import { reservationRoutes } from "@/modules/reservation/reservation.route";
import { uploadRoutes } from "@/modules/upload/upload.route";

type IModuleRoute = {
  path: string;
  route: Router;
};

const moduleRoutes: IModuleRoute[] = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/destinations", route: destinationRoutes },
  { path: "/hotels", route: hotelRoutes },
  { path: "/transportations", route: transportationRoutes },
  { path: "/reviews", route: reviewRoutes },
  { path: "/favorites", route: favoriteRoutes },
  { path: "/trip-plans", route: tripPlanRoutes },
  { path: "/reservations", route: reservationRoutes },
  { path: "/upload", route: uploadRoutes },
];

const router = Router();

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
