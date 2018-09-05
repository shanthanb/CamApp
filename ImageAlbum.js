import React, { Component } from 'react'
import { StyleSheet, Text, Image, ScrollView, View, Vibration, TouchableOpacity } from 'react-native'
import { Permissions, Constants, Camera, FileSystem } from 'expo'
import { Button, Icon } from 'react-native-elements'
import DeleteModal from './DeleteModal'

const pictureSize = 600;

export default class ImageAlbum extends Component {
  state={
    photos:[],
    isDeleteModalOpen: false,
    photoUriToDelete: ""
  }

  componentDidMount() {
    console.log("ImageAlbum::componentDidMount::FileSystem.documentDirectory>>", FileSystem.documentDirectory)
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'photos').then(photos => {
      console.log("photos from fileSystem>>", photos)
      this.setState({
        photos
      })
    })
  }

  setDeleteModalVisible=(bool, photoUri="")=>{
    console.log("You pressed! photoUri>>", photoUri)
    if(bool){
      this.setState({
        isDeleteModalOpen: bool,
        photoUriToDelete:photoUri
      })
    } else {
      this.setState({
        isDeleteModalOpen: bool
      })
    }
  }

  executeDelete=()=>{
    console.log("executeDelete: this.state.photoUriToDelete>>>", this.state.photoUriToDelete)
    FileSystem.deleteAsync(`${FileSystem.documentDirectory}photos/${this.state.photoUriToDelete}`).then(response => {
      console.log("response on delete from fileSystem>>", response)
      const updatedPhotos= this.state.photos.filter(photoUri=>photoUri!==this.state.photoUriToDelete)
      console.log("updatedPhotos on delete from fileSystem>>", updatedPhotos)
      this.setState({
        photos: updatedPhotos,
        photoUriToDelete: ""
      })
    }).catch(err=>console.log("error on delete>>", err))
  }

  render(){
    console.log("photos>>>", this.state.photos)
    return (
      <View
        style={styles.container}
      >
        <DeleteModal
          visible={this.state.isDeleteModalOpen}
          setDeleteModalVisible={(isVisible)=>{this.setDeleteModalVisible(isVisible)}}
          executeDelete={()=>this.executeDelete()}
        />
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View>
            <View style={styles.header}>
              <Icon
                raised
                size={20}
                underlayColor="#c9c9c9"
                name="camera"
                type="font-awesome"
                color="black"
                onPress={this.props.toggleView}
              />
            </View>
            <View>
              <Text style={styles.text}>Image Album</Text>
            </View>
          </View>
          <View style={styles.pictures}>
            {
              this.state.photos.map(photoUri=>{
                console.log("this.state.phots.map:::photoUri>>", photoUri)
                return (
                  <View
                    key={photoUri}
                    style={styles.pictureFrame}
                  >
                    <View>
                      <Text style={styles.text}>
                        {photoUri}
                      </Text>
                    </View>
                    <View style={styles.header}>
                      <Icon
                        raised
                        name="delete-forever"
                        type="MaterialIcons"
                        color="red"
                        onPress={()=>this.setDeleteModalVisible(true, photoUri)}
                      />
                    </View>
                    <View>
                      <View
                        style={styles.pictureWrapper}
                      >
                        <Image
                          style={styles.picture}
                          source={{
                            uri: `${FileSystem.documentDirectory}photos/${photoUri}`,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                )
                
            })
            }
          </View>
        </ScrollView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  pictures: {
    marginTop: 20,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  pictureFrame: {
    marginTop: 10,
    marginBottom: 10
  },
  pictureWrapper: {
    width: pictureSize,
    height: pictureSize,
    margin: 5,
  },
  picture: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    resizeMode: 'contain',
  },
  text: {
    color: 'black',
    textAlign: 'center'
  }
})


