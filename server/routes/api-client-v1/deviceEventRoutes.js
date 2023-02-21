const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const deviceEventController = require('../../controllers/deviceEventController')

/**
 * @openapi
 * /device-events:
 *   get:
 *     description: Return list of device events, scoped by authorization
 *     responses:
 *       200:
 *         description: Device events returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeviceEvent'
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.get('/', deviceEventController.readAll)

/**
 * @openapi
 * /device-events/{deviceEventId}:
 *   get:
 *     description: Return one device event, if allowed by authorization
 *     parameters:
 *       - $ref: '#/components/parameters/DeviceEventId'
 *     responses:
 *       200:
 *         description: Device event returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceEvent'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.get('/:deviceEventId', deviceEventController.read)

/**
 * @openapi
 * /device-events:
 *   post:
 *     description: Create a new device event depending on authorization
 *     requestBody:
 *       $ref: '#/components/requestBodies/DeviceEventBody'
 *     responses:
 *       201:
 *         description: Device event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceEvent'
 *       400:
 *         description: Parameter validation failed
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.post('/', [
  body('type').exists().withMessage('required'),
  body('eventAt').exists().withMessage('required')
], deviceEventController.create)

/**
 * @openapi
 * /device-events/{deviceEventId}:
 *   put:
 *     description: Update a device event depending on authorization
 *     parameters:
 *       - $ref: '#/components/parameters/DeviceEventId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/DeviceEventBody'
 *     responses:
 *       200:
 *         description: Device event updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceEvent'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.put('/:deviceEventId', [
  body('type').exists().withMessage('required'),
  body('eventAt').exists().withMessage('required')
], deviceEventController.update)

/**
 * @openapi
 * /device-events/{deviceEventId}:
 *   delete:
 *     description: Delete a device event
 *     parameters:
 *        - $ref: '#/components/parameters/DeviceEventId'
 *     responses:
 *       200:
 *         description: Device event deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.delete('/:deviceEventId', deviceEventController.destroy)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     DeviceEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Id of device event.
 *           example: 17
 *         type:
 *           type: string
 *           description: Type of event.
 *           example: Repair
 *         eventAt:
 *           type: string
 *           description: Timestamp of event (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         part:
 *           type: string
 *           description: Part involved in event
 *           example: Pump motor assembly
 *         description:
 *           type: string
 *           description: A description of the event
 *           example: Replaced part A for part B
 *         signature:
 *           type: string
 *           description: Signature of person reporting event
 *           example: JB
 *         comment:
 *           type: string
 *           description: Comments related to the event
 *           example: Repair was made in office
 *         createdAt:
 *           type: string
 *           description: Time of creation (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         updatedAt:
 *           type: string
 *           description: Timestamp of latest update (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         deviceId:
 *           type: integer
 *           description: Id of the device related to this event.
 *           example: 77
 *         componentId:
 *           type: integer
 *           description: Id of the component related to this event.
 *           example: 17
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     DeviceEventBody:
 *       description: Properties of a device event.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, eventAt]
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of event.
 *                 example: Repair
 *               eventAt:
 *                 type: string
 *                 description: Timestamp of event (UTC time).
 *                 example: 2020-07-07T:07:07.007Z
 *               part:
 *                 type: string
 *                 description: Part involved in event
 *                 example: Pump motor assembly
 *               description:
 *                 type: string
 *                 description: A description of the event
 *                 example: Replaced part A for part B
 *               signature:
 *                 type: string
 *                 description: Signature of person reporting event
 *                 example: JB
 *               comment:
 *                 type: string
 *                 description: Comments related to the event
 *                 example: Repair was made in office
 *               deviceId:
 *                 type: integer
 *                 description: Id of the device related to this event.
 *                 example: 77
 *               componentId:
 *                 type: integer
 *                 description: Id of the component related to this event.
 *                 example: 17
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     DeviceEventId:
 *       name: deviceEventId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *       description: A device event's id
 *       example: 17
 */
