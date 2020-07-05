const
  express = require('express'),
  router = express.Router();

/**
 * @typedef Response
 * @property {bool} success.required - A boolean that can be used to check if the operation has errors or not. - eg: false
 * @property {string} code - The code of the error. - eg: not-found
 * @property {string} message - The error's message. - eg: Route not found
 */

/**
 * @typedef Engineer
 * @property {string} name.required - The name of the engineer. - eg: Rares Ailincai
 * @property {Array.<string>} shifts.required - The engineer's shifts. - eg: [1]
 */

/**
 * @route GET /shifts
 * @group Shifts - Operations about shifts.
 * @returns {Array.<Engineer>} 200 - An array of all the engineers.
 * @returns {Response}  403 - Forbidden
 * @returns {Response}  404 - Route not found
 * @returns {Response}  500 - Internal Server Error
 * @returns {Response}  Other - Unexpected error
 * @security Bearer Token
 */
router.get('/shifts', process.loader.utils.AsyncMode.route(process.loader.actions.shiftsGet));

/**
 * @route POST /shifts
 * @group Shifts - Operations about shifts.
 * @param {Array.<String>} engineers.body.required - A list of engineers names to generate a list of shifts.
 * @produces application/json
 * @consumes application/json
 * @returns {Response} 200 - An array of all the engineers.
 * @returns {Response}  400 - Bad Request
 * @returns {Response}  403 - Forbidden
 * @returns {Response}  404 - Route not found
 * @returns {Response}  500 - Internal Server Error
 * @returns {Response}  Other - Unexpected error
 * @security Bearer Token
 */
router.post('/shifts', process.loader.utils.AsyncMode.route(process.loader.actions.shiftsGenerate));

module.exports = router;
