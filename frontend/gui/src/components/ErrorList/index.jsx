import React, { Component } from "react";
import { Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;

export default class ErrorList extends Component {
  constructor(props) {
    super(props);

    // let example = [{
    //   title: "email",
    //   messages: ["tienes mal todo", "contrasena muy corta"],
    // },]
    this.state = {
      errorList: this.getErrorList(this.props.list),
    };
  }

  getErrorList = (dataSource) => {
    let list = [];
    Object.keys(dataSource).map((keyName) => {
      let record = { title: keyName, messages: this.props.list[keyName] };
      list.push(record);
      return null;
    });
    return list;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.list !== prevProps.list) {
      this.setState({
        errorList: this.getErrorList(this.props.list),
      });
    }
  }

  render() {
    const listMessage = (messages) => {
      return messages.map((text, i) => (
        <Paragraph key={i} style={{ margin: 1, paddingLeft: 10 }}>
          <CloseCircleOutlined style={{ color: "red" }} />
          {" " + text}
        </Paragraph>
      ));
    };
    const listItems = (items) => {
      return Object.keys(items).map((keyName) => {
        return (
          <div key={keyName}>
            <Paragraph style={{ margin: 2 }}>
              <Text
                strong
                style={{
                  fontSize: 14,
                }}
              >
                {items[keyName].title}
              </Text>
            </Paragraph>
            {listMessage(items[keyName].messages)}
          </div>
        );
      });
    };

    return <div>{listItems(this.state.errorList)}</div>;
  }
}
