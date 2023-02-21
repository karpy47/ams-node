const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const clinicController = require('../../controllers/clinicController')

/**
 * @openapi
 * /clinics:
 *   get:
 *     description: Return list of clinics, scoped by authorization
 *     responses:
 *       200:
 *         description: Clinics returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Clinic'
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error (read all failed)
 */
router.get('/', clinicController.readAll)

/**
 * @openapi
 * /clinics/{clinicId}:
 *   get:
 *     description: Return one clinic, if allowed by authorization
 *     parameters:
 *       - $ref: '#/components/parameters/ClinicId'
 *     responses:
 *       200:
 *         description: Clinic returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal error (read failed)
 */
router.get('/:clinicId', clinicController.read)

/**
 * @openapi
 * /clinics:
 *   post:
 *     description: Create a new clinic depending on authorization
 *     requestBody:
 *       $ref: '#/components/requestBodies/ClinicBody'
 *     responses:
 *       201:
 *         description: Clinic created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       400:
 *         description: Parameter validation failed
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error (create failed)
 */
router.post('/', [
  body('name').exists().withMessage('required')
], clinicController.create)
/**
 * @openapi
 * /clinics/{clinicId}:
 *   put:
 *     description: Update a clinic depending on authorization
 *     parameters:
 *       - $ref: '#/components/parameters/ClinicId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/ClinicBody'
 *     responses:
 *       200:
 *         description: Clinic updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Clinic'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal error (update failed)
 */
router.put('/:clinicId', [
  body('name').exists().withMessage('required')
], clinicController.update)

/**
 * @openapi
 * /clinics/{clinicId}:
 *   delete:
 *     description: Delete a clinic
 *     parameters:
 *        - $ref: '#/components/parameters/ClinicId'
 *     responses:
 *       200:
 *         description: Clinic deleted
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal error (delete failed)
 */
router.delete('/:clinicId', clinicController.destroy)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     Clinic:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The clinic's id.
 *           example: 17
 *         status:
 *           type: string
 *           description: Current clinic status (Active/Locked/Deleted)
 *           example: Active
 *         name:
 *           type: string
 *           description: The clinic's name.
 *           example: Singapore branch
 *         address1:
 *           type: string
 *           description: Address line 1.
 *           example: Raffles hotel
 *         address2:
 *           type: string
 *           description: Address line 2.
 *           example: 1 Beach Road
 *         postcode:
 *           type: string
 *           description: Postcode
 *           example: 189673
 *         city:
 *           type: string
 *           description: City
 *           example: Singapore
 *         country:
 *           type: string
 *           description: Country
 *           example: SG
 *         phone:
 *           type: string
 *           description: Phone
 *           example: N/A
 *         email:
 *           type: string
 *           description: Email
 *           example: mi6@raffles.com
 *         openHours:
 *           type: string
 *           description: Opening hours
 *           example: "Mon-Thu: 22:00-04:00, Fri-Sat: 22:00-06:00, Sun: Closed"
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     ClinicBody:
 *       description: Properties of a clinic. A clinc belongs to a usergroup.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               status:
 *                 type: string
 *                 description: Current clinic status (Active/Locked/Deleted)
 *                 example: Active
 *               name:
 *                 type: string
 *                 description: The clinic's name.
 *                 example: Singapore branch
 *               address1:
 *                 type: string
 *                 description: Address line 1.
 *                 example: Raffles hotel
 *               address2:
 *                 type: string
 *                 description: Address line 2.
 *                 example: 1 Beach Road
 *               postcode:
 *                 type: string
 *                 description: Postcode
 *                 example: 189673
 *               city:
 *                 type: string
 *                 description: City
 *                 example: Singapore
 *               country:
 *                 type: string
 *                 description: Country
 *                 example: SG
 *               phone:
 *                 type: string
 *                 description: Phone
 *                 example: N/A
 *               email:
 *                 type: string
 *                 description: Email
 *                 example: mi6@raffles.com
 *               openHours:
 *                 type: string
 *                 description: Opening hours
 *                 example: "Mon-Thu: 22:00-04:00, Fri-Sat: 22:00-06:00, Sun: Closed"
 */

/**
 * @openapi
 * components:
 *   parameters:
 *     ClinicId:
 *       name: clinicId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *       description: A clinic's id
 *       example: 17
 */
