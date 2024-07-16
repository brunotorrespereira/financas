
import React,{useState,useContext} from 'react';
import { SafeAreaView,Keyboard, TouchableWithoutFeedback,Alert} from 'react-native';
import database from '@react-native-firebase/database'; 
import { format } from 'date-fns';
import { useNavigation} from '@react-navigation/native'
import { AuthContext } from '../../Contexts/auth'


import Header from '../../Components/Header';

import {Background, Input, SubmitButton, SubmitText } from './styles'
import Picker from '../../Components/Picker';


export default function New() {
const navigation = useNavigation();

  const [valor,setValor] = useState('');
  const [tipo, setTipo] = useState('receita');

  const {user: usuario} = useContext(AuthContext);

function handleSubmit(){
 Keyboard.dismiss();
 if(isNaN(parseFloat(valor)) || tipo === null){
  alert( 'Preencha todos os campos');
  return;
 }
Alert.alert(
  'Confirmando dados',
  `Tipo ${tipo} - Valor: ${parseFloat(valor)}`,
  [
    {
    text: 'Cancelar',
    style: 'cancel'
    },
    {
      text: 'Continuar',
      onPress: () => handleAdd()
    }
  ]
)

}

async function handleAdd(){
  let uid = usuario.uid;

  let key = await database().ref('historico').child(uid).push().key;
  await database().ref('historico').child(uid).child(key).set({
    tipo:tipo,
    valor:parseFloat(valor),
    data: format(new Date(), 'dd/MM/yy')
  })

             // Atualizar nosso saldo //
       
    let user = database().ref('users').child(uid);
    await user.once('value').then((snapshot) => {
      let saldo = parseFloat(snapshot.val().saldo);
      

      tipo === 'despesa' ? saldo -= parseFloat(valor) : saldo += parseFloat(valor);

      user.child('saldo').set(saldo);
    });
    
    Keyboard.dismiss();
    setValor('');
    navigation.navigate('Home');

}

 return (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
   <Background>
    <Header/>

    <SafeAreaView style={{alignItems:'center'}}>
    <Input
    placeholder='Valor desejado'
    keyboardType='numeric'
    returnKeyType='next'
    onSubmitEditing={() => Keyboard.dismiss()}
    value={valor}
    onChangeText={(text) => setValor(text)}
    />

   <Picker
   onChange={setTipo}
   tipo={tipo}
   
   />

    <SubmitButton onPress={handleSubmit}>
      <SubmitText>Registrar</SubmitText>
    </SubmitButton>
    </SafeAreaView>
   </Background>
   </TouchableWithoutFeedback>
  );
}