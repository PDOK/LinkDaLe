import React, {Component} from 'react';
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
class InfoBar extends Component {
    constructor(){
        super();
    }
    renderProgress(){
        if(this.props.processing){
            return(
                <CircularProgress
                    style={{
                        margin: 'auto',
                        position:'absolute',
                        top:'50%',
                        left:'50%',
                        transform: 'translate(-50%,-50%)'
                    }}
                    size={100}
                />
            )
        }
    }
    render(){
        return(
            <div style={{position:'relative', width:'100%',minHeight:'100%', height:'100%'}}>
                <Paper>
                    <div style={{width:'100%%' }}>
                        <div style={{width:'100%'}}>
                            <RaisedButton
                                label='download'
                                disabled={this.props.processing}
                                style={{
                                    margin:'30px',
                                    width:'40%',
                                    float:'left'

                                }}
                            />
                        </div>
                        <div style={{width:'100%'}}>
                        <RaisedButton
                            label='publish'
                            disabled={true}
                            style={{
                                margin:'30px',
                                width:'40%',
                                float:'right'

                            }}
                        />
                        </div>

                    </div>
                    <div style={
                        {
                            paddingTop:'80px',
                            minHeight:'700px',
                        }
                    }>
                        <p>
                            {/*{this.props.sparql}*/}
                            {this.renderProgress()}
                        </p>
                    </div>

                </Paper>
            </div>
        )
    }
}
export default InfoBar