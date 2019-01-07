import { Router, Request, Response } from 'express';
import {listAllPackagesSorted} from '../controllers'

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send(listAllPackagesSorted);
});

/*router.get('/:name', (req: Request, res: Response) => {
    let { name } = req.params;
    const response = findPackageName(name);
    res.send(response);
});*/

export const PackagesRoutes: Router = router;