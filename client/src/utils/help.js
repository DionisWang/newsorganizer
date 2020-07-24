export function lastUpdated(publishedAt){
    let now = new Date();
    let pub = new Date(publishedAt);
    let ms = now.getTime()-pub.getTime();
    let sec = Math.floor(ms/1000);
    let min = Math.floor(sec/60);
    let hrs = Math.floor(min/60);
    let days = Math.floor(hrs/24);
    let months = Math.floor(days/30);
    let years = Math.floor(months/12);
    if(sec<60){
        if(sec===1){
            return "a second ago";
        }else{
            return Math.floor(sec) + " seconds ago";
        }
    }else if(min<60){
        if(min===1){
            return "a minute ago";
        }else{
            return Math.floor(min) + " minutes ago";
        }
    }else if(hrs<24){
        if(hrs===1){
            return "an hour ago";
        }else{
            return Math.floor(hrs) + " hours ago";
        }
    }else if(days<30){
        if(days===1){
            return "a day ago";
        }else{
            return Math.floor(days) + " days ago";
        }
    }else if(months<12){
        if(months===1){
            return "a month ago";
        }else{
            return Math.floor(months) + " months ago";
        }
    }else{
        if(years===1){
            return "a year ago";
        }else{
            return Math.floor(years) + " years ago";
        }
    }

}
export function fixTitle(title){
    let titles_list= title.split(' - ');
    let newspaper= titles_list[titles_list.length-1];
    let fixed_title="";
    for(let i=0; i<titles_list.length-1;i++){
        fixed_title+=titles_list[i];
    }
    return {newspaper,fixed_title}
}

export function removeDupMerge(a1,a2) {
    let exists = {};
    a1.forEach(i=>exists[i._id]=true);
    a2.forEach(i=>{
        if(!exists[i._id]){
            a1.push(i);
        }
    });
    return a1;
};