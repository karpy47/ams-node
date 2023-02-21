const express = require('express')
const router = express.Router()
const { body } = require('express-validator')
const componentController = require('../../controllers/componentController')

/**
 * @openapi
 * /components:
 *   get:
 *     description: Return list of components, authorization required
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.get('/', componentController.readAll)

/**
 * @openapi
 * /components/{componentId}:
 *   get:
 *     description: Return one component, if allowed by authorization
 *     parameters:
 *       - $ref: '#/components/parameters/ComponentId'
 *     responses:
 *       200:
 *         description: Components returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.get('/:componentId', componentController.read)

/**
 * @openapi
 * /components:
 *   post:
 *     description: Create a new component depending on authorization
 *     requestBody:
 *       $ref: '#/components/requestBodies/ComponentBody'
 *     responses:
 *       201:
 *         description: Component created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       400:
 *         description: Parameter validation failed
 *       403:
 *         description: Permission not granted
 *       500:
 *         description: Internal error
 */
router.post('/', [
  body('dmCode').exists().withMessage('required'),
  body('status').exists().withMessage('required'),
  body('type').exists().withMessage('required')
], componentController.create)
/**
 * @openapi
 * /components/{componentId}:
 *   put:
 *     description: Update a component depending on authorization
 *     parameters:
 *       - $ref: '#/components/parameters/ComponentId'
 *     requestBody:
 *       $ref: '#/components/requestBodies/ComponentBody'
 *     responses:
 *       200:
 *         description: Component updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       403:
 *         description: Permission not granted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error (update failed)
 */
router.put('/:componentId', [
  body('dmCode').exists().withMessage('required'),
  body('status').exists().withMessage('required'),
  body('type').exists().withMessage('required')
], componentController.update)

/**
 * @openapi
 * /components/{componentId}:
 *   delete:
 *     description: Delete a component
 *     parameters:
 *        - $ref: '#/components/parameters/ComponentId'
 *     responses:
 *       200:
 *         description: Component deleted
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    description: Id of deleted component.
 *                    example: 17
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal error
 */
router.delete('/:componentId', componentController.destroy)

module.exports = router

/**
 * @openapi
 * components:
 *   schemas:
 *     Component:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Internal id.
 *           example: 17
 *         dmCode:
 *           type: string
 *           description: Data matrix code of component printed on its label.
 *           example: A11007
 *         status:
 *           type: string
 *           description: Status of component.
 *           example: Active
 *         type:
 *           type: string
 *           description: Type of part
 *           example: Silencer
 *         partRefNo:
 *           type: string
 *           description: Part reference number.
 *           example: 2001344A
  *         manufacturedAt:
 *           type: string
 *           description: Date when manufacturing of component ended (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         discardedAt:
 *           type: string
 *           description: Date when component was finally discarded (UTC time).
 *           example: 2020-07-07T:07:07.007Z
 *         manufactureWiRefNo:
 *           type: string
 *           description: Reference to manufacturing work instruction.
 *           example: 2001343B
 *         signatureManufacturing:
 *           type: string
 *           description: Signature of person responsible for manufacturing.
 *           example: JB
 *         signatureInspection:
 *           type: string
 *           description: Signature of person responsible for inspection after manufacturing.
 *           example: Q
 *         ponumber:
 *           type: string
 *           description: Purchase order numbers related to the component. Commaseparated list.
 *           example: PO-177, PO-007
 *         comment:
 *           type: string
 *           description: Comments related to the component. Text field with newlines.
 *           example: Component has a scratch, but works fine.
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
 *           description: Id of the device that this component belongs to.
 *           example: 77
 */

/**
 * @openapi
 * components:
 *   requestBodies:
 *     ComponentBody:
 *       description: Properties of a component.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [dmCode, status, type]
 *             properties:
 *               dmCode:
 *                 type: string
 *                 description: Data matrix code of component printed on its label.
 *                 example: A11007
 *               status:
 *                 type: string
 *                 description: Status of component.
 *                 example: Active
 *               type:
 *                 type: string
 *                 description: Type of part
 *                 example: Silencer
 *               partRefNo:
 *                 type: string
 *                 description: Part reference number.
 *                 example: 2001344A
 *               manufacturedAt:
 *                 type: string
 *                 description: Date when manufacturing of component ended (UTC time).
 *                 example: 2020-07-07T:07:07.007Z
 *               discardedAt:
 *                 type: string
 *                 description: Date when component was finally discarded (UTC time).
 *                 example: 2020-07-07T:07:07.007Z
 *               manufactureWiRefNo:
 *                 type: string
 *                 description: Reference to manufacturing work instruction.
 *                 example: 2001343B
 *               signatureManufacturing:
 *                 type: string
 *                 description: Signature of person responsible for manufacturing.
 *                 example: JB
 *               signatureInspection:
 *                 type: string
 *                 description: Signature of person responsible for inspection after manufacturing.
 *                 example: Q
 *               ponumber:
 *                 type: string
 *                 description: Purchase order numbers related to the component. Commaseparated list.
 *                 example: PO-177, PO-007
 *               comment:
 *                 type: string
 *                 description: Comments related to the component. Text field with newlines.
 *                 example: Component has a scratch, but works fine.
 *               deviceId:
 *                 type: integer
 *                 description: Id of the device that this component belongs to.
 *                 example: 77
 *
*/

/**
 * @openapi
 * components:
 *   parameters:
 *     ComponentId:
 *       name: componentId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *       description: A component's id
 *       example: 17
 */
