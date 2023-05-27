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

// Service
const { add_service, get_services, get_service, order_service, update_status, get_all_services, update_service } = require("../controllers/service.controller")

/** 
 * @Method POST
 * @Route /get-all-services
 * @FOR Service Provider's
 */
route.post("/get-all-services", verifyToken, get_all_services)

/** 
 * @Method POST
 * @Route /update-service
 * @FOR Service Provider's
 */
route.post("/update-service", update_service)

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
route.post("/order-service", verifyToken, order_service)

/** 
 * @Method POST
 * @Route /get-service
 * @FOR Users's
 */
route.post("/get-service", get_service)

// User's

const get_bookings = require("../controllers/user.controller")

/** 
 * @Method POST
 * @Route /get-bookings
 * @FOR Users's
 */
route.post("/get-bookings", verifyToken, get_bookings)

// Misc's
const { upload, search } = require("../controllers/misc.controller")

/**
 * @Method POST
 * @Route /upload
 * @FOR ServiceProvider's && User's
 */
route.post("/upload", upload)

/**
 * @Method POST
 * @Route /search
 * @FOR User's
 */
route.post("/search", search)

// Service Providers
const { getOrders, getDetails, updateProfile } = require("../controllers/serviceProvider.controller")

/** 
* @Method POST
* @Route /add-service
* @FOR ServiceProvider's
*/

route.post("/add-service", verifyToken, add_service)

/**
 * @Method POST
 * @Route /get-sp
 * @FOR ServiceProvider's
 */
route.post("/get-sp", verifyToken, getDetails)
/**
 * @Method POST
 * @Route /get-orders
 * @FOR ServiceProvider's
 */
route.post("/get-orders", verifyToken, getOrders)
/** 
 * @Method POST
 * @Route /update-status
 * @FOR ServiceProviders's
 */
route.post('/update-status', update_status)
/** 
 * @Method POST
 * @Route /update-profile
 * @FOR ServiceProviders's
 */
route.post('/update-profile', verifyToken, updateProfile)
module.exports = route

// Demand a Service
const { acceptDemandedService, demandaService, getDemanedService } = require("../controllers/demandService.controller")

/** 
 * @Method POST
 * @Route /get-demanded-service
 * @FOR User's
 */

route.post("/get-demanded-service",verifyToken, getDemanedService)
/** 
 * @Method POST
 * @Route /demand-a-service
 * @FOR User's
 */
route.post("/demand-a-service",verifyToken, demandaService)
/** 
 * @Method POST
 * @Route /accept-a-demanded-service
 * @FOR Service Provider's
 */
route.post("/accept-a-demanded-service",verifyToken, acceptDemandedService)

// Utils
const { isTest, setTest } = require("../utils/test-login-or-signup")

/** 
 * @Method GET
 * @Route /is-test-login
 * @FOR All's
 */
 route.get('/is-test-login', isTest)
/** 
 * @Method GET
 * @Route /set-test-login
 * @FOR All's
 */
 route.post('/set-test-login', setTest)

