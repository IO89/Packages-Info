import { Router, Request, Response } from 'express';
import {listAllPackagesSorted} from '../controllers'

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send(listAllPackagesSorted);
});

export const PackagesRoutes: Router = router;