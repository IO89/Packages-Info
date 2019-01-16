import { Router, Request, Response } from 'express';
import {listAllPackagesSorted,searchByName} from '../controllers'

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send(listAllPackagesSorted);
});

router.get('/:name', (req: Request, res: Response) => {
    let { name } = req.params;
    const response = searchByName(name);
    res.send(response);
});

export const PackagesRoutes: Router = router;