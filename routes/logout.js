import { Router } from 'express';
import uuidv4 from 'uuid/v4';

const router = Router();
router.get('/', async (req, res) => {
    var datetime = new Date();
    if(!req.session.user.anon){
        console.log(`${req.session.user.email} has logged off @ ${datetime.toLocaleString()}`)
        req.session.user={
            email:uuidv4(),
            anon: true,
        };
        req.myData.info={
            username: null,
            anon: true
        };
        res.send({message: "You have sucessfully logged off!"});
    }else{
        res.send({message: "You are not logged in..."});
    }
});

export default router;