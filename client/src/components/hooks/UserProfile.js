import React, {createContext, useEffect, useReducer} from "react";

const reducer = (prevState, updatedProperty) => ({
    ...prevState,
    ...updatedProperty,
});
async function saver(timelines){
    let savename = window.localStorage.getItem("savename");
    window.localStorage.removeItem("savename");
    let current = +window.localStorage.getItem("cur")||0;
    if(!timelines[current].data){
        alert('Nothing to save');
        return;
    }
    const url = `/api/maps`;
    fetch(url,{
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        referrerPolicy: 'no-referrer', // no-referrer, *client
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            timeline:timelines[current],
            savename: savename,
        }),
    })
    .then(res=> {
        if(res.ok){
            timelines[current].name=savename;
            window.localStorage.setItem("session",JSON.stringify({timelines:timelines}));
        }
        return res.json()
    }).then(body=>{
        alert(body.message);
    }, err =>{
        alert(err);
    });
}

function updater(promise) {
    // Don't modify any promise that has been already modified.
    if (promise.isResolved) return promise;

    // Set initial state
    var isPending = true;
    var isRejected = false;
    var isFulfilled = false;

    // Observe the promise, saving the fulfillment in a closure scope.
    var result = promise.then(
        function(v) {
            isFulfilled = true;
            isPending = false;
            return v; 
        }, 
        function(e) {
            isRejected = true;
            isPending = false;
            throw e; 
        }
    );
    result.isFulfilled = function() { return isFulfilled; };
    result.isPending = function() { return isPending; };
    result.isRejected = function() { return isRejected; };
    return result;
}
if(window.localStorage.getItem("session")===null){
    window.localStorage.setItem("session",JSON.stringify({timelines:[{name:"default"}]}));
}else{
    try{JSON.parse(window.localStorage.getItem("session"))}
    catch{window.localStorage.setItem("session",JSON.stringify({timelines:[{name:"default"}]}))};
}

const initialState={
    user:null,
    maps:JSON.parse(window.localStorage.getItem("session")).timelines,
    isLoaded:false,
    mapLoaded: false,
}
const UserProfile = ({children}) => {
    const [profile, update] = useReducer(reducer,initialState);
    useEffect(()=>{
        try{
            let save = window.localStorage.getItem("save");
            if(save){
                saver(profile.maps);
                window.localStorage.removeItem("save");
            }
        }catch{};
        window.localStorage.setItem("session",JSON.stringify({timelines:profile.maps}));
        if(!profile.isLoaded){
            const updateUser= new Promise ((resolve,reject) =>{
                const url = `/api/`;
                fetch(url,{
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    mode: 'same-origin', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    referrerPolicy: 'no-referrer', // no-referrer, *client
                })
                .then(res=> res.json())
                .then(body=>{
                    if(body.info.anon===false){
                        resolve(body.info);
                    }else{
                        resolve(null);
                    }
                }, err =>{
                    reject(err);
                });
            });
            let get_user= updater(updateUser);
            let checker = setInterval(()=>{
                if(!get_user.isPending()){
                    clearInterval(checker);
                    get_user.then((res)=>{
                        update({
                            user:res,
                            maps:profile.maps,
                            isLoaded: true,
                            mapLoaded: false,
                        });
                    });
                    return;
                }
            },50);
        }else{
            if(profile.user!==null&& !profile.mapLoaded){
                const getTimeline= new Promise ((resolve,reject) =>{
                    const url = `/api/maps`;
                    fetch(url,{
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        mode: 'same-origin', // no-cors, *cors, same-origin
                        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                        credentials: 'same-origin', // include, *same-origin, omit
                        referrerPolicy: 'no-referrer', // no-referrer, *client
                    })
                    .then(res=> res.json())
                    .then(body=>{
                        resolve(body.timelines);
                    }, err =>{
                        reject(err);
                    });
                });
                let user_maps=updater(getTimeline);
                let checker = setInterval(()=>{
                    if(!user_maps.isPending()){
                        clearInterval(checker);
                        user_maps.then((res)=>{
                            let cur= JSON.parse(window.localStorage.getItem("session")).timelines;
                            let exist={};
                            for(let i in cur){
                                exist[cur[i].name]= true;
                            }
                            for(let i in res){
                                if(!exist[res[i].name]){
                                    cur.push(res[i]);
                                }
                            }
                            update({
                                user:profile.user,
                                maps:cur,
                                isLoaded: true,
                                mapLoaded: true,
                            });
                        });
                        return;
                    }
                },50);
            }
        }
    });
    return (
        <Context.Provider value={[profile, update]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default UserProfile;