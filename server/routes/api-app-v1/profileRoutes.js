const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const profileController = require('../../controllers/profileController')

/**
 * @openapi
 * /profile:
 *   get:
 *     description: Return full profile of logged in patient
 *     responses:
 *       200:
 *         description: Profile returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileFull'
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.get('/', profileController.readProfile)

/**
 * @openapi
 * /profile:
 *   put:
 *     description: Update a patient depending on authorization
 *     requestBody:
 *       $ref: '#/components/requestBodies/PatientBody'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.put('/', profileController.updateProfile)

/**
 * @openapi
 * /profile:
 *   delete:
 *     description: Delete profile
 *     responses:
 *       200:
 *         description: Profile deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.delete('/', profileController.destroyProfile)

/**
 * @openapi
 * /profile/device:
 *   get:
 *     description: Return attached device of logged in patient
 *     responses:
 *       200:
 *         description: Profile devices returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.get('/device', profileController.readProfileDevice)

/**
* @openapi
* /profile/device:
*   post:
*     description: Create a device for logged in patient
*     requestBody:
*       $ref: '#/components/requestBodies/PatientBody'
*     responses:
*       200:
*         description: Device created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Patient'
*       404:
*         description: Not found
*       500:
*         description: Internal error
*/
router.post('/device', [
  body('serialNo', 'required').exists()
], profileController.createProfileDevice)

/**
* @openapi
* /profile/device:
*   delete:
*     description: Delete a patient
*     parameters:
*        - $ref: '#/components/parameters/PatientId'
*     responses:
*       200:
*         description: Patient deleted
*       404:
*         description: Not found
*       500:
*         description: Internal error
*/
router.delete('/device', profileController.deleteProfileDevice)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The patient id.
 *           example: 17
 *         firstname:
 *           type: string
 *           description: The patient's first name.
 *           example: James
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     PatientBody:
 *       description: Properties of a patient. A patient may be connected to a clinic.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: The patient's name.
 *                 example: MI6
 *               description:
 *                 type: string
 *                 description: A description of the patient
 *                 example: A most secret group
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     PatientId:
 *       name: patientId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *       description: A patient's id
 *       example: 17
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The device id.
 *           example: 17
 *     ProfileFull:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The users id.
 *           example: 17
 */
