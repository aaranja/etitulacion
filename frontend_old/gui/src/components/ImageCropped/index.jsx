import React, { Component } from "react";
import Cropper from "react-easy-crop";
import { Button, Col, Row, Slider } from "antd";
import getCroppedImg from "./cropimage";

class ImageCropped extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.image,
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 4 / 2,
      rotation: 0,
      croppedArea: {},
      croppedAreaPixels: {},
      cropSize: { width: 400, height: 200 },
    };
  }

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({
      croppedArea: croppedArea,
      croppedAreaPixels: croppedAreaPixels,
    });
  };

  onZoomChange = (zoom) => {
    this.setState({ zoom: zoom });
  };

  onRotationChange = (rotation) => {
    this.setState({ rotation: rotation });
  };

  onCropSizeChange = (width, height) => {
    this.setState({ cropSize: { width: width, height: height } });
  };

  onCrop = async () => {
    const croppedImageUrl = await getCroppedImg(
      this.state.image,
      this.state.croppedAreaPixels
    );

    this.props.callBack(
      this.state.crop,
      this.state.zoom,
      this.state.aspect,
      croppedImageUrl
    );
  };

  render() {
    const { image, rotation, crop, zoom, aspect, cropSize } = this.state;
    return (
      <>
        <Row>
          <Col
            style={{
              display: "flex",
              width: 800,
              height: 400,
              justifyContent: "center",
              margin: "auto",
            }}
          >
            <Cropper
              image={image}
              cropSize={cropSize}
              crop={crop}
              zoom={zoom}
              minZoom={0.1}
              aspect={aspect}
              rotation={rotation}
              onCropChange={this.onCropChange}
              onCropComplete={this.onCropComplete}
              onZoomChange={this.onZoomChange}
              onRotationChange={this.onRotationChange}
            />
          </Col>
        </Row>
        <div style={{ margin: 10 }}>
          <Slider
            value={this.state.zoom}
            min={0}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(value) => this.onZoomChange(value / 2)}
            style={{ margin: 20 }}
          >
            <p
              style={{
                fontSize: "medium",
              }}
            >
              Zoom
            </p>
          </Slider>

          <Slider
            value={this.state.rotation}
            min={-180}
            max={180}
            step={10}
            aria-labelledby="Rotation"
            onChange={this.onRotationChange}
            style={{ margin: 20 }}
          >
            <p style={{ fontSize: "medium" }}>Rotar</p>
          </Slider>
          <Slider
            value={this.state.cropSize.width}
            min={10}
            max={1000}
            step={50}
            aria-labelledby="cropw"
            onChange={(value) => {
              this.onCropSizeChange(value, this.state.cropSize.height);
            }}
            style={{ margin: 20 }}
          >
            <p style={{ fontSize: "medium" }}>Anchura de recorte</p>
          </Slider>
          <Slider
            value={this.state.cropSize.height}
            min={10}
            max={1000}
            step={50}
            aria-labelledby="croph"
            onChange={(value) => {
              this.onCropSizeChange(this.state.cropSize.width, value);
            }}
            style={{ margin: 20 }}
          >
            <p style={{ fontSize: "medium" }}>Altura de recorte</p>
          </Slider>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "end",
          }}
        >
          <Button
            onClick={this.props.onCancel}
            style={{
              margin: 10,
            }}
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            onClick={this.onCrop}
            style={{
              margin: 10,
            }}
          >
            Guardar
          </Button>
        </div>
      </>
    );
  }
}

export default ImageCropped;
