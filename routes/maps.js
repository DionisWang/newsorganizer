import { Router } from 'express';
const router = Router();
router.get('/', async (req, res) => {
    const timelines= await req.context.models.Timeline.find({user: req.context.user}).select('-user -__v -_id').populate('data','-__v').lean();
    let result = [];
    for(let i=0;i<timelines.length;i++){
        result[i]={};
        result[i].name=timelines[i].name;
        result[i].data=[];
        let cur_data=timelines[i].data;
        let cur_pins=timelines[i].pins;
        for(let j=0;j<cur_data.length;j++){
            let news=cur_data[j];
            let pin= cur_pins[j];
            news.lat= pin.lat;
            news.lng= pin.lng;
            result[i].data[j]=Object.assign({},news);
        }
    }
    return res.send({timelines:result});
});
router.post('/', async (req, res) => {
    if(!req.context.user||!req.body.timeline){
        return;
    }
    let timeline=req.body.timeline;
    if(!timeline.data){
        return;
    }
    let {name,data}=timeline;
    let savename = req.body.savename;
    let sec_check=true;
    let formatted_data=[];
    let formatted_pins=[];
    for(let j=0;j<data.length;j++){
        let news= data[j];
        const exist = await req.context.models.News.findById(news._id);
        if(!exist){
            sec_check=false;
            break;
        }else{
            formatted_data.push(news._id);
            formatted_pins.push({
                _id:news._id,
                lat:news.lat,
                lng:news.lng
            });
        }
    }

    if(sec_check){
        await req.context.models.Timeline.findOne({name:name}, (err,cur_timeline)=>{
            if(err){
                return res.status(500).send({message: err});
            }

            if(cur_timeline){
                cur_timeline.name= savename;
                cur_timeline.data= formatted_data;
                cur_timeline.pins= formatted_pins;
                cur_timeline.markModified('pins');
                cur_timeline.save().then(()=>{res.send({message: "Successfully updated!"})} )
            }else{
                req.context.models.Timeline.create({
                    name: savename,
                    data: formatted_data,
                    pins: formatted_pins,
                    user: req.context.user,
                }).then(()=>{return res.send({message:"Successfully saved!"});})
            }
        })
    }else{
        return res.status(500).send({message: "Timeline Corrupted!"});
    }
});
/*
router.post('/', async (req, res) => {
    if(!req.context.user||!req.body.timelines){
        return;
    }
    console.log(req.body.timelines)
    let timeline=req.body.timelines;
    if(list.length===0){
        return;
    }
    for(let i=0;i<list.length;i++){
        let {name,data}=list[i];
        let sec_check=true;
        let formatted_data=[];
        let formatted_pins=[];
        for(let j=0;j<data.length;j++){
            let news= data[j];
            const exist = await req.context.models.News.findById(news._id);
            if(!exist){
                sec_check=false;
                break;
            }else{
                formatted_data.push(news._id);
                formatted_pins.push({
                    _id:news._id,
                    lat:news.lat,
                    lng:news.lng
                });
            }
        }
        console.log(formatted_data, formatted_pins)

        if(sec_check){
            await req.context.models.Timeline.findOne({name:name}).then((cur_timeline)=>{
                if(cur_timeline){
                    cur_timeline.name= 
                    cur_timeline.data= formatted_data;
                    cur_timeline.pin= formatted_pins;
                    cur_timeline.save().then(()=>{return res.send({message: "Successfully updated!"})} )
                }else{
                    req.context.models.Timeline.create({
                        name: name,
                        data: formatted_data,
                        pins: formatted_pins,
                        user: req.context.user,
                    }).then(()=>{return res.send({message:"Successfully saved!"});})
                }
            })
        }
    }
});
*/
export default router;