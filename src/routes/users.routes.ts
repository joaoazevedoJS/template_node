import { Router } from 'express';

import Authorization from '../middleware/Authorization';

import UsersController from '../controller/UsersController';

const usersRoutes = Router();

const usersController = new UsersController();

usersRoutes.post('/', usersController.create);
usersRoutes.get('/', Authorization, usersController.read);

export default usersRoutes;
