const express = require("express");
const route = express.Router();
const verifyToken = require("../middlewares/verifyToken.middleman");
const { auth_user, auth_serviceProvider } = require("../controllers/auth.controller");
const check = require("../middlewares/auth.middleman");
const { addService, getServices, getService, orderService, updateStatus, getAllServices, updateService } = require("../controllers/service.controller");
const { upload, search } = require("../controllers/misc.controller");
const { getOrders, getDetails, updateProfile } = require("../controllers/serviceProvider.controller");
const { demandService, acceptDemandedService, getDemandedService, getDemandedServiceForAll } = require("../controllers/demandService.controller");
const { isTest, setTest } = require("../utils/test-login-or-signup");
const get_bookings = require("../controllers/user.controller");

// Auth
route.post("/auth-user", auth_user);
route.post("/auth-service-provider", auth_serviceProvider);

// Service Provider
route.post("/add-service", verifyToken, addService);
route.post("/get-sp", verifyToken, getDetails);
route.post("/get-orders", verifyToken, getOrders);
route.post("/update-status", updateStatus);
route.post("/update-profile", verifyToken, updateProfile);

// Service
route.post("/get-all-services", verifyToken, getAllServices);
route.post("/update-service", updateService);
route.post("/get-services", getServices);
route.post("/get-service", getService);
route.post("/order-service", verifyToken, orderService);

// User
route.post("/get-bookings", verifyToken, get_bookings);

// Demand a Service
route.post("/get-all-demanded-service", getDemandedServiceForAll);
route.post("/get-demanded-service", verifyToken, getDemandedService);
route.post("/demand-a-service", verifyToken, demandService);
route.post("/accept-a-demanded-service", verifyToken, acceptDemandedService);

// Misc
route.post("/upload", upload);
route.post("/search", search);

// Utils
route.get("/is-test-login", isTest);
route.post("/set-test-login", setTest);

module.exports = route;
