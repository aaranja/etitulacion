import React, { Component } from "react";
import { PageHeader, Pagination, Slider, Row, Col, Affix, Space } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

class PDFViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		};
	}

	componentDidMount() {
		this.topDiv = React.createRef();
	}

	componentDidUpdate() {
		if (this.state.loading) {
			if (this.props.document !== null) {
				this.setState({
					loading: false,
					pageNumber: 1,
					numPages: null,
					zoom: 1,
					div: null,
				});
			}
		}
	}

	onDocumentLoadSuccess = ({ numPages }) => {
		this.setState({
			numPages: numPages,
		});
	};

	onChange = (page) => {
		this.setState({
			pageNumber: page,
		});
	};

	onZoom = (zoom) => {
		this.setState({
			zoom: zoom,
		});
	};

	getTopDiv = () => {
		return this.topDiv;
	};

	render() {
		const pagination = () => {
			if (this.state.numPages !== null) {
				var pages = this.state.numPages;
				return (
					<Pagination
						simple
						defaultCurrent={1}
						total={pages * 10}
						onChange={this.onChange}
					/>
				);
			}
		};

		return (
			<div>
				<PageHeader
					ghost={false}
					title={this.props.title}
					onBack={() => {
						this.props.callBack("table", null);
					}}
					/*subTitle="This is a subtitle"*/
				></PageHeader>

				{this.state.loading ? (
					<LoadingOutlined />
				) : (
					<div ref={this.topDiv}>
						<Affix
							offsetTop={20}
							target={() => {
								if (
									this.topDiv !== null &&
									this.topDiv !== undefined
								) {
									return this.topDiv.current;
								}
							}}
							style={{ alignItems: "center" }}
						>
							<Row justify="space-around">
								<Col span={4}></Col>
								<Col span={4}></Col>
								<Col span={4}></Col>
								<Col span={5}>
									<Space direction="vertical">
										{pagination()}
										<div
											style={{
												display: "flex",
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											<Slider
												min={1}
												max={8}
												onChange={this.onZoom}
												style={{
													width: "90%",
												}}
											/>
										</div>
									</Space>
								</Col>
							</Row>
						</Affix>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<Document
								file={this.props.document}
								onLoadSuccess={(value) =>
									this.onDocumentLoadSuccess(value)
								}
							>
								<Page
									scale={this.state.zoom}
									pageNumber={this.state.pageNumber}
								/>
							</Document>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default PDFViewer;
