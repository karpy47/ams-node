const express = require('express')
const router = express.Router()
const eventLogController = require('../../controllers/eventLogController')

/**
 * @openapi
 * /event-log:
 *   get:
 *     description: Return list of event logs, authorization required
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventLog'
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.get('/', eventLogController.readAll)

/**
 * @openapi
 * /event-log/{eventLogId}:
 *   get:
 *     description: Return one event log, if allowed by authorization
 *     parameters:
 *       - $ref: '#/components/parameters/EventLogId'
 *     responses:
 *       200:
 *         description: Event log returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventLog'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.get('/:eventLogId', eventLogController.read)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     EventLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Internal id.
 *           example: 77
 *         type:
 *           type: string
 *           description: Type of event that happened.
 *           example: Login
 *         message:
 *           type: string
 *           description: Message about the event.
 *           example: Successfull login
 *         sourceType:
 *           type: string
 *           description: Source type that initiated event.
 *           example: User
 *         sourceId:
 *           type: number
 *           description: Source id that initiated event.
 *           example: 77
 *         createdAt:
 *           type: string
 *           description: Time of creation (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     EventLogId:
 *       name: eventLogId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *       description: An event log's id
 *       example: 17
 */
