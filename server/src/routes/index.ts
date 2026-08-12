import { Router } from "express";

type IModuleRoute = {
  path: string;
  route: Router;
};

/**
 * Every feature module registers its router here.
 * Module 1 of the build plan fills this list with auth, users, destinations, hotels,
 * restaurants, transportations, reviews, favorites, trip-plans and reservations.
 */
const moduleRoutes: IModuleRoute[] = [];

const router = Router();

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
