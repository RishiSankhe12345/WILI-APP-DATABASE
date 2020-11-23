import * as React from 'react';
import { Text, View, TouchableOpacity} from 'react-native';
import * as permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-bar-code-scanner'
import { TextInput } from 'react-native-paper';
import db from '../config';

export default class BookTransitionScreen extends React.Component {
constructor(){
super()
this.state={hasCameraPermissions:null, scanned:false, scannedBookId:'', scannedStudentId:'', buttonState:'normal', transactionMessage:''}
}
getCameraPermissions=async()=>{
    const {status}= await Permissions.askAsync(Permissions.CAMERA)
    this.setState({hasCameraPermissions:status==="granted"})
}
handleBarCodeScanned=async({type,data})=>{
const{buttonState}=this.state;
if(buttonState==="BookId"){
    this.setState({scanned:true, scannedBookId:data, buttonState:'normal'});
}
else if(buttonState==="StudentId"){
    this.setState({scanned:true, scannedStudentId:data, buttonState:'normal'});
}
}

handleTransaction=async()=>{
    var transactionMessage=null;
    db.collection("books").doc(this.state.scannedBookId).get()
    .then((doc)=>{
        var book=doc.data();
        if(book.bookAvailibility){
this.initiateBookIssue()
transactionMessage="Book Issue"
        }
        else{
            this.initiateBookReturn()
            transactionMessage="Book Return"
        }
    })
    this.setState({transactionMessage:transactionMessage})
}
initiateBookReturn= async()=>{
    db.collection("transactions").add({
        'studentId':this.state.scannedStudentId,
        'bookId':this.state.scannedBookId,
        'date':firebase.firestore.Timestamp.now().toDate(),
        'transactionType':"return"
    })
    db.collection("books").doc(this.state.scannedBookId).update({
        'bookAvailibility':true,
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
        'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
    }) 
    this.setState({scannedStudentId:'', scannedBookId:''})
}

initiateBookIssue= async()=>{
    db.collection("transactions").add({
        'studentId':this.state.scannedStudentId,
        'bookId':this.state.scannedBookId,
        'date':firebase.firestore.Timestamp.now().toDate(),
        'transactionType':"issue"
    })
    db.collection("books").doc(this.state.scannedBookId).update({
        'bookAvailibility':false,
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
        'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
    }) 
    this.setState({scannedStudentId:'', scannedBookId:''})
}

render(){
    const hasCameraPermissions= this.state.hasCameraPermissions,
    const scanned= this.state.scanned,
    const buttonState= this.state.buttonState,

    if(buttonState==='clicked' & hasCameraPermissions){
        return(<BarCodeScanner onBarCodeScanned={scanned? undefined:this.handleBarCodeScanned}
             style={StyleSheet.absoluteFillObject}/>)
    }

else if(buttonState==="normal"){
return(
<View style={styles.container}>
<View>
<Image source={require("./assets/booklogo.jpg")} style={{width:200, height:200}}/>
<Text style={{textAlign:'center', fontSize:30}}>Wily</Text></View>
<View style={styles.inputView}>
<TextInput style={styles.inputBox} placeholder="bookId" value={this.state.scannedBookId}/>
<TouchableOpacity style={styles.scannedButton} onPress={this.getCameraPermissions("BookId")}>
<Text style={styles.buttonText}>
scan
</Text>
</TouchableOpacity>
</View>
<View style={styles.inputView}>
<TextInput style={styles.inputBox} placeholder="studentId" value={this.state.scannedStudentId}/>
<TouchableOpacity style={styles.scannedButton} onPress={this.getCameraPermissions("StudentId")}>
<Text style={styles.buttonText}>
scan
</Text>
</TouchableOpacity>
</View>
<TouchableOpacity style={styles.submitButton} onPress={async()=>{
var transactionMessage= await this.handleTransaction()
}}><Text style={styles.submitButtonText}>Submit</Text></TouchableOpacity>
<Text>hasCameraPermissions===true? this.state.scannedData:"Request Camera Permissions"</Text>
<TouchableOpacity onPress={this.getCameraPermissions}><Text>Issue or Return</Text></TouchableOpacity>
</View>
);
}
}
}

const styles = StyleSheet.create({
container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
displayText:{ fontSize: 15, textDecorationLine: 'underline' },
scanButton:{ backgroundColor: '#2196F3', padding: 10, margin: 10 },
buttonText:{ fontSize: 15, textAlign: 'center', marginTop: 10 }, 
inputView:{ flexDirection: 'row', margin: 20 }, inputBox:{ width: 200, height: 40, borderWidth: 1.5, 
borderRightWidth: 0, fontSize: 20 }, scanButton:{ backgroundColor: '#66BB6A', width: 50, 
borderWidth: 1.5, 
borderLeftWidth: 0},
submitButton:{ backgroundColor: '#FBC02D', 
width: 100, 
height:50 }, 
submitButtonText:{ padding: 10, 
    textAlign: 'center', 
    fontSize: 20, 
    fontWeight:"bold", 
    color: 'white' } })