const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const patientController = require('../../controllers/patientController')

/**
 * @openapi
 * /patients:
 *   get:
 *     description: Return list of patients, scoped by authorization
 *     responses:
 *       200:
 *         description: Patients returned
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.get('/', patientController.readAll)

/**
 * @openapi
 * /patients/{patientId}:
 *   get:
 *     description: Return one patient, if allowed by authorization
 *     parameters:
 *       - $ref: '#/components/parameters/PatientId'
 *     responses:
 *       200:
 *         description: Patient returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.get('/:patientId', patientController.read)

/**
 * @openapi
 * /patients:
 *   post:
 *     description: Create a new patient depending on authorization
 *     requestBody:
 *       $ref: '#/components/requestBodies/PatientBody'
 *     responses:
 *       201:
 *         description: Patient created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       400:
 *         description: Parameter validation failed
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.post('/', [], patientController.create)

/**
 * @openapi
 * /patients/{patientId}:
 *   put:
 *     description: Update a patient depending on authorization
 *     parameters:
 *       - $ref: '#/components/parameters/PatientId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/PatientBody'
 *     responses:
 *       200:
 *         description: Patient updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Patient'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.put('/:patientId', [], patientController.update)

/**
 * @openapi
 * /patients/{patientId}:
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
router.delete('/:patientId', patientController.destroy)

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
 *         status:
 *           type: string
 *           description: Current patient status (Active/Locked/Deleted)
 *           example: Active
 *         firstname:
 *           type: string
 *           description: Firstname
 *           example: James
 *         lastname:
 *           type: string
 *           description: Lastname
 *           example: Bond
 *         address1:
 *           type: string
 *           description: Address line 1
 *           example: Raffles hotel
 *         address2:
 *           type: string
 *           description: Address line 2
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
 *         email:
 *           type: string
 *           description: Email
 *           example: penthouse@raffles.com
 *         phone:
 *           type: string
 *           description: Phone
 *           example: N/A
 *         gender:
 *           type: string
 *           description: Gender
 *           example: Male
 *         birthDate:
 *           type: string
 *           description: Date of birth for patient (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         comment:
 *           type: string
 *           description: A description of the patient
 *           example: A most secret group
 *         lastLoginAt:
 *           type: string
 *           description: Last login time (UTC time).
 *           example: 2020-07-07T:07:27.007Z
 *         deceaseDate:
 *           type: string
 *           description: Date of death for patient (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         anonymisedAt:
 *           type: string
 *           description: Date when personal data was anonymised (UTC time).
 *           example: 2020-07-07T:07:07.007Z
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
 *               status:
 *                 type: string
 *                 description: Current patient status (Active/Locked/Deleted)
 *                 example: Active
 *               firstname:
 *                 type: string
 *                 description: Firstname
 *                 example: James
 *               lastname:
 *                 type: string
 *                 description: Lastname
 *                 example: Bond
 *               address1:
 *                 type: string
 *                 description: Address line 1
 *                 example: Raffles hotel
 *               address2:
 *                 type: string
 *                 description: Address line 2
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
 *               email:
 *                 type: string
 *                 description: Email
 *                 example: penthouse@raffles.com
 *               phone:
 *                 type: string
 *                 description: Phone
 *                 example: N/A
 *               gender:
 *                 type: string
 *                 description: Gender
 *                 example: Male
 *               birthDate:
 *                 type: string
 *                 description: Date of birth for patient (UTC time).
 *                 example: 2020-07-07T:07:07.007Z
 *               comment:
 *                 type: string
 *                 description: A description of the patient
 *                 example: A most secret group
 *               deceaseDate:
 *                 type: string
 *                 description: Date of death for patient (UTC time).
 *                 example: 2020-07-07T:07:07.007Z
 *
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
