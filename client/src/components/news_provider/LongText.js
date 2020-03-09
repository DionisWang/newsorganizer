import React, {Component} from 'react';

class LongText extends Component{
    constructor(props){
        super(props);
        this.state={
            showAll:false,
        }
    }
    reveal(){
        this.setState({showAll:!this.state.showAll});
    }
    render(){
        const {content, limit} = this.props;
        if(!content){
            return null;
        }else if(content.length<=limit) {
            // there is nothing more to show
            return <span>{content}</span>;
        }else if(this.state.showAll) {
            // We show the extended text and a link to reduce it
            return (
                <span>
                    {content}
                    <br/>
                    <button style={{textAlign: "center"}} onClick={this.reveal.bind(this)}>Read less</button>
                </span>
            )
        }else{
            const toShow = `${content.substring(0,limit)}... `;
            return(
                <span>
                    {toShow}<button onClick={this.reveal.bind(this)}>Read more</button>
            </span>
            )
        }
    }
}
export default LongText;