const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const deviceController = require('../../controllers/deviceController')

/**
 * @openapi
 * /devices:
 *   get:
 *     description: Return list of devices, authorization required
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.get('/', deviceController.readAll)

/**
 * @openapi
 * /devices/{deviceId}:
 *   get:
 *     description: Return one device, if allowed by authorization
 *     parameters:
 *       - $ref: '#/components/parameters/DeviceId'
 *     responses:
 *       200:
 *         description: Devices returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.get('/:deviceId', deviceController.read)

/**
 * @openapi
 * /devices:
 *   post:
 *     description: Create a new device depending on authorization
 *     requestBody:
 *       $ref: '#/components/requestBodies/DeviceBody'
 *     responses:
 *       201:
 *         description: Device created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Parameter validation failed
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.post('/', [
  body('modelRefNo').exists().withMessage('required')
], deviceController.create)
/**
 * @openapi
 * /devices/{deviceId}:
 *   put:
 *     description: Update a device depending on authorization
 *     parameters:
 *       - $ref: '#/components/parameters/DeviceId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/DeviceBody'
 *     responses:
 *       200:
 *         description: Device updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error (update failed)
 */
router.put('/:deviceId', [
  body('serialNo').exists().withMessage('required')
], deviceController.update)

/**
 * @openapi
 * /devices/{deviceId}:
 *   delete:
 *     description: Delete a device
 *     parameters:
 *        - $ref: '#/components/parameters/DeviceId'
 *     responses:
 *       200:
 *         description: Device deleted
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    description: Id of deleted device.
 *                    example: 17
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.delete('/:deviceId', deviceController.destroy)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Internal id.
 *           example: 17
 *         serialNo:
 *           type: string
 *           description: Serial number of device printed on its label.
 *           example: 17
 *         modelRefNo:
 *           type: string
 *           description: Device model number printed on its label.
 *           example: 2001294B
 *         manufacturedAt:
 *           type: string
 *           description: Date when manufacturing of device ended (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         manufactureWiRefNo:
 *           type: string
 *           description: Reference to manufacturing work instruction.
 *           example: 2001343
 *         signatureManufacturing:
 *           type: string
 *           description: Signature of person responsible for manufacturing.
 *           example: JB
 *         signatureInspection:
 *           type: string
 *           description: Signature of person responsible for inspection after manufacturing.
 *           example: Q
 *         comment:
 *           type: string
 *           description: Comments related to the device. Text field with newlines.
 *           example: Active device working fine
 *         firstUseAt:
 *           type: string
 *           description: First time the device was used (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         lastUseAt:
 *           type: string
 *           description: Last time the device was known to be used (UTC time).
 *           example: 2020-07-07T:07:07.007Z
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
 *   requestBodies:
 *     DeviceBody:
 *       description: Properties of a device.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serialNo]
 *             properties:
 *               serialNo:
 *                 type: string
 *                 description: Serial number of device printed on its label.
 *                 example: 17
 *               modelRefNo:
 *                 type: string
 *                 description: Device model number printed on its label.
 *                 example: 2001294B
 *               manufacturedAt:
 *                 type: string
 *                 description: Date when manufacturing of device ended (UTC time).
 *                 example: 2020-07-07T:07:07.007Z
 *               manufactureWiRefNo:
 *                 type: string
 *                 description: Serial number of device printed on its label.
 *                 example: 17
 *               signatureManufacturing:
 *                 type: string
 *                 description: Signature of person responsible for manufacturing.
 *                 example: JB
 *               signatureInspection:
 *                 type: string
 *                 description: Signature of person responsible for inspection after manufacturing.
 *                 example: Q
 *               comment:
 *                 type: string
 *                 description: Comments related to the device. Text field with newlines.
 *                 example: Active device working fine
 *               firstUseAt:
 *                 type: string
 *                 description: First time the device was used (UTC time).
 *                 example: 2020-07-07T:07:07.007Z
 *               lastUseAt:
 *                 type: string
 *                 description: Last time the device was known to be used (UTC time).
 *                 example: 2020-07-07T:07:07.007Z
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     DeviceId:
 *       name: deviceId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *       description: A device's id
 *       example: 17
 */
