import { Router } from 'express';
const router = Router();
function done(req,res){
    return (req.myData.error)? res.status(400).send(req.myData): res.send(req.myData);
}
/*
router.get('/', async (req, res) => {
    const users = await req.context.models.User.find();
    req.myData.users= users;
    done(req,res);
});

router.get('/:userId', async (req, res) => {
    await req.context.models.User.findById(
        req.params.userId,
    ).then((user)=>{
        req.myData.user=user;
        done(req,res);
    },(err) => {
        req.myData.error= `${err.name}: ${err.message}`,info;
        done(req,res);
    });
});
*/
router.post('/', async (req, res) => {
    if(req.query.signup===''){
        await req.context.models.User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            createdAt: new Date(),
        }).then((newUser)=>{
            console.log(`${newUser.username} has signed up with ${newUser.email} @ ${newUser.createdAt.toLocaleString()}`);
            req.myData.message="You have sucessfully signed up!";
            done(req,res);
        },(err) =>{
            console.log(`${err.name}: ${err.message}`);
            req.myData.error= "Email Already In Use!";
            done(req,res);
        }).then(done(req,res));
    }else if(req.query.login===''){
        await req.context.models.User.findOne({
            email: req.body.email,
        }).then((user)=>{
            if(user!==null){
                user.validatePassword(req.body.password).then((valid)=>{
                    if(valid){
                        var datetime = new Date();
                        console.log(`${user.email} has logged in @ ${datetime.toLocaleString()}`);
                        req.session.user= {
                            email: user.email,
                            anon: false,
                        };
                        let userInfo= {
                            email: user.email,
                            username: user.username,
                            createdAt: user.createdAt,
                            anon: false,
                        };
                        req.myData.info= userInfo;
                        req.myData.message="Login Successful!";
                        done(req,res);
                    }else{
                        req.myData.error= "Login Failed: Incorrect Username/Email or Password!";
                        done(req,res);
                    }
                });
            }else{
                req.myData.error= "Login Failed: Incorrect Username/Email or Password!";
                done(req,res);
            }
        },(err) =>{
            console.log(`${err.name}: ${err.message}`);
            req.myData.error= "Missing Parameters!";
            done(req,res);
        });
    }
});
export default router;