import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';
import { Permissions, Constants, Camera, FileSystem } from 'expo';
import { Button } from 'react-native-elements'
import ImageAlbum from './ImageAlbum'
import uuidv1 from 'uuid/v1'

export default class CameraExample extends Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    showImageAlbum: true
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
      console.log(e, 'Directory exists');
    });
  }

  flipCamera=()=>{

    this.setState({
      type: this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    });

  }

  takePicture = async ()=>{
    if (this.camera) {
      const photoId = uuidv1()
      Vibration.vibrate();
      this.camera.takePictureAsync().then(data => {
        FileSystem.moveAsync({
          from: data.uri,
          to: `${FileSystem.documentDirectory}photos/Photo_${photoId}.jpg`,
        }).catch((err)=>{
          console.log("something went wrong!!", err)
        });
      });
    }
  };

  toggleView=()=>{
    this.setState({
      showImageAlbum: !this.state.showImageAlbum
    })
  }

  renderCamera() {
    return (
      <Camera
        ref={(camera)=>this.camera=camera}
        style={styles.camera}
        type={this.state.type}
        ratio="16:9"
      >
        <View
          style={styles.container}>
          <Button
            raised
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
            title={"Flip"}
            onPress={this.flipCamera}
          />
          <Button
            raised
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
            title={"SNAP"}
            onPress={this.takePicture}
          />
          <Button
            raised
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
            title={"Album"}
            onPress={this.toggleView}
          />
        </View>
      </Camera>
    )
  }

  renderImageAlbum(){
    return <ImageAlbum toggleView={this.toggleView} />
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {
            this.state.showImageAlbum? this.renderImageAlbum():this.renderCamera()
          }
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  camera: {
    flex:1
  },
  container: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'green',
    width: 100
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 15
  }
})
