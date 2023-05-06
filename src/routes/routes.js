const express = require("express")

// Middleware's Universal
const verifyToken = require("../middlewares/verifyToken.middleman")

const route = express.Router()

// Auth
const { auth_user, auth_serviceProvider } = require("../controllers/auth.controller")
const check = require("../middlewares/auth.middleman")
/**
* @Method POST
* @Route /auth-user
* @FOR User's
*/

route.post("/auth-user", auth_user)
/** 
* @Method POST
* @Route /auth-service-provider
* @FOR ServiceProvider's
*/

route.post("/auth-service-provider", auth_serviceProvider)

// Add Service
const { add_service, get_services, get_service, order_service } = require("../controllers/service.controller")
/** 
* @Method POST
* @Route /auth-service-provider
* @FOR ServiceProvider's
*/
route.post("/add-service", verifyToken, add_service)
/** 
 * @Method POST
 * @Route /get-services
 * @FOR Users's
 */
route.post("/get-services", get_services)

/** 
 * @Method POST
 * @Route /get-service
 * @FOR Users's
 */
route.post("/get-service", get_service)
/** 
 * @Method POST
 * @Route /order-service
 * @FOR Users's
 */
route.post("/order-service",verifyToken, order_service)
/** 
 * @Method POST
 * @Route /get-service
 * @FOR Users's
 */

route.post("/get-service", get_service)

/** 
 * @Method POST
 * @Route /get-bookings
 * @FOR Users's
 */
const get_bookings = require("../controllers/user.controller")
route.post("/get-bookings",verifyToken, get_bookings)

// Misc's
const upload = require("../controllers/misc.controller")
/**
 * @Method POST
 * @Route /upload
 * @FOR ServiceProvider's && User's
 */
route.post("/upload", upload)

// Service Providers
const {getOrders, getDetails} = require("../controllers/serviceProvider.controller")
/**
 * @Method POST
 * @Route /get-sp
 * @FOR ServiceProvider's
 */
route.post("/get-sp", verifyToken, getDetails)
/**
 * @Method POST
 * @Route /get-sp
 * @FOR ServiceProvider's
 */
route.post("/get-orders",verifyToken, getOrders)

module.exports = route