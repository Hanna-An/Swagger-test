const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");

const idLength = 8;

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The username
 *         password:
 *           type: string
 *           description: The password
 *       example:
 *         username: user@example.com
 *         password: m4dppKdClZotApjDb7cGI/LfrNqENiN98I2N/Vs3N0w=
 *         id: 4ac9b61b-2e22-4f25-89b2-64c354fc10f1
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The users managing API
  */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

router.get("/", (req, res) => {
	const users = req.app.login_users.get("users");

	res.send(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The user was not found
 */

router.get("/:id", (req, res) => {
  const user = req.app.login_users.get("users").find({ id: req.params.id }).value();

  if(!user){
    res.sendStatus(404)
  }

	res.send(user);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
	try {
		const user = {
			id: nanoid(idLength),
			...req.body,
		};

    req.app.login_users.get("users").push(user).write();
    
    res.send(user)
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Update the user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", (req, res) => {
	try {
		req.app.login_users
			.get("users")
			.find({ id: req.params.id })
			.assign(req.body)
			.write();

		res.send(req.app.login_users.get("users").find({ id: req.params.id }));
	} catch (error) {
		return res.status(500).send(error);
	}
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 * 
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

router.delete("/:id", (req, res) => {
	req.app.login_users.get("users").remove({ id: req.params.id }).write();

	res.sendStatus(200);
});

module.exports = router;