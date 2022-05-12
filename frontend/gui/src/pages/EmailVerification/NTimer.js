import Timer from 'react-timer-wrapper';
import Timecode from 'react-timecode';
import React from "react";

class NTimer extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            duration:0,
            time: 0,
            expired: false,
        }
    }

    onFinish = ()=>{
        this.setState({
            expired: true,
        })
        this.props.onComplete(true)
    }

    onTimerUpdate = ({time, duration}) =>{
        this.setState({
            time,
            duration,
        });
    }

    render() {
        const {
            time,
            duration,
            expired
        } = this.state;

        return (
            <div>
                <Timer active duration={this.props.duration * 60 * 1000} onTimeUpdate={this.onTimerUpdate} onFinish={this.onFinish} />
                {
                    !expired ? <>Tiempo restante <Timecode time={duration - time} /> </>: <p>{"Tiempo expirado"}</p>
                }
            </div>
        );
    }
}

export default NTimer