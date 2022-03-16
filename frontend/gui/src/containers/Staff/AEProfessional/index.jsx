import React, {Component} from "react";
import {Card, PageHeader} from "antd";
import DateList from "./DateList";

class AEProfessional extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        window.history.pushState(
            "aep-date/",
            "Acta de examen profesional",
            `/home/services/aep-dates/`
        );
    }

    render() {
        return (
            <>
                <PageHeader
                    ghost={false}
                    title="Fechas de asistencia al acto de recepción profesional"
                />
                <Card
                    bordered={false}
                    style={{
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    <DateList callBack={this.props.callBack}/>
                </Card>
            </>
        );
    }
}

export default AEProfessional;
