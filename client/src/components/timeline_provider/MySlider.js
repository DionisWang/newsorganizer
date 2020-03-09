import Nouislider from 'react-nouislider';
import '../node_modules/nouislider/distribute/nouislider.css';

export default function MySlider(props){
    const [range,setRange] = useState([]);
    return(<>
            <Nouislider
                range={{min: min.getTime()-6000, max: max.getTime()+6000}}
                connect={[false,true,false]}
                step={1000}
                start={[props.earliest, props.latest]}
                tooltips
                format= {{ to: this.toFormat, from: Number }}
                onUpdate={(values)=> {
                    let min = new Date(values[0]);
                    let max= new Date(values[1]);
                    setRange([min.toLocaleString(),max.toLocaleString()]);
                    nlist.forEach(info=>{
                        let pin=shown[info._id];
                        if(pin){
                            let pin_date= new Date(info.publishedAt);
                            if(pin_date<min||pin_date>max){
                                pin.setMap(null);
                            }else{
                                pin.setMap(this.googleMap);
                            }
                        }
                    });
                }}
            />
            <p className="Date Range">(Date Filter) From: {this.earliest} to {this.latest}</p>
                
            <p/>
        </>
    )
};