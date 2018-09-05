import React, { Component } from 'react'
import { StyleSheet, Text, View, Vibration, Modal } from 'react-native'
import { Button, Icon } from 'react-native-elements'

export default class DeleteModal extends Component {

  handleExecuteDelete=()=>{
    this.props.executeDelete()
    this.props.setDeleteModalVisible(false)

  }
  
  cancelDelete=()=>{
    this.props.setDeleteModalVisible(false)
  }

  render(){
    return(
      <Modal
          animationType="none"
          visible={this.props.visible}
          transparent={true}
          onRequestClose={()=>this.props.setDeleteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalInner}>
              <Text style={styles.text}>Are you sure you want to delete this image?</Text>
              <Button
                backgroundColor="red"
                onPress={this.handleExecuteDelete}
                buttonStyle={{margin: 10}}
                title='Delete'
              />
                <Button
                backgroundColor="orange"
                onPress={this.cancelDelete}
                buttonStyle={{margin: 10}}
                title='Cancel' 
              />
            </View>
          </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)"

  },
  modalInner: {
    // flex:1,
    backgroundColor: "white",
    padding: 20,
  },
  text: {
    textAlign: 'center'
  }
})