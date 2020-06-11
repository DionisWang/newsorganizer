import { Router } from 'express';
import axios from 'axios';

async function search(req,res,first){
    let limit = +req.query.limit||9;
    let page = +req.query.page || 1;
    let s= req.query.search || "";
    let offset = +req.query.offset ||0;
    
    page--;
    let start= page*limit-offset;

    let news = await req.context.models.News.find({ title: { $regex: s, $options: "i" } }).sort({publishedAt: -1}).skip(start).limit(limit);
    console.log(`Searched for ${s|| "current"}: ${news.length} results`);
    if(news.length<limit&&first){
        console.log("Weird search...")
        return searchNews(s,req.context.models).then(()=>{return search(req,res,false)});
    }else{
        return news;
    }
}
const router = Router();
router.get('/', (req, res) => {
    search(req,res,true).then((news)=>{
        res.send({articles:news});
    });
});
const searchNews= async (s,models) =>{
    console.log(`API accessed for search term: ${s}`);
    let res = await axios.get(`http://newsapi.org/v2/everything?q=${s}&apiKey=${process.env.NEWS_API_KEY}`)
        .catch((err)=>{
            console.log("API access failed!");
        });
    if(!res){return;};
    let data=res.data;
    let articles = data.articles || [];
    for(let i =0; i<articles.length;i++){
        let c = articles[i];
        c.source=c.source.name;
        let timestamp = new Date(c["publishedAt"]).getTime();
        let temp = new models.News({
            articleID: timestamp+c.source,
            source: c.source,
            author: c.author,
            title: c.title,
            description: c.description,
            url: c.url,
            urlToImage: c.urlToImage,
            publishedAt: c.publishedAt,
            content: c.content,
        });
        await temp.save(function(error,result) {});
    }
    console.log(`Finished updating database with term: ${s}`)
    return;
    }
export default router;