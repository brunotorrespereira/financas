
    
  import React,{useContext, useState, useEffect} from "react";         
  import { Alert, TouchableOpacity, Platform} from "react-native";
  import database from '@react-native-firebase/database'; 
  import { format, isPast } from 'date-fns'

  import { AuthContext } from "../../Contexts/auth";
  import Header from "../../Components/Header";
  import HistoricoList from "../../Components/HistoricoList";

  
  import Icon from 'react-native-vector-icons/MaterialIcons'
  import DatePicker from "../../Components/DatePicker";

import { Background, Container, Nome, Saldo, Title,List,Area } from "./styles";


   export default function Home(){
   const [ historico, setHistorico ] = useState([]);
   const [saldo, setSaldo] = useState(0);


   const {user} = useContext(AuthContext);
   const uid = user && user.uid;

   const [ newDate, setNewDate] = useState(new Date());
   const [ show, setShow] = useState(false);


useEffect(() => {
async function loadList(){
 await database().ref('users').child(uid).on('value',(snapshot) => {
  setSaldo(snapshot.val().saldo);
 });

 await database().ref('historico')
 .child(uid)
 .orderByChild('data')
 .equalTo(format(newDate,"dd/MM/yy"))
 .limitToLast(10).on('value',(snapshot) => {
    setHistorico([]);

    snapshot.forEach((childItem) => {
      let list = {
        key: childItem.key,
        tipo: childItem.val().tipo,
        valor: childItem.val().valor,
        data: childItem.val().data
      };

      setHistorico(oldArray => [...oldArray, list].reverse());
    })
  })

}
loadList();
},[newDate])

function handleDelete(data){
  if(isPast(new Date(data.data))){
    alert('voce nao pode excluir um registro antigo');
    return;
  }
  Alert.alert(
    'Cuidado Atenção',
    `Você deseja excluir ${data.tipo} - Valor${data.valor}`,
    [
      {
        text: 'Cancelar',
        style: 'Cancel'
      },
      {
        text: 'Continuar',
        onPress: () => handleDeleteSuccess(data)
      }
    ]
  )
}

 async function handleDeleteSuccess(data){
   await database().ref('historico')
   .child(uid).child(data.key).remove()
   .then( async () =>{
    let saldoAtual = saldo;
    data.tipo === 'despesa' ? saldoAtual += parseFloat(data.valor) 
    : saldoAtual -= parseFloat(data.valor);

    await database().ref('users').child(uid)
    .child('saldo').set(saldoAtual);
   })
   .catch((error) => {
      console.log(error);
   })
}

function handleShowPicker(){
setShow(true)
}

function handleClose(){
  setShow(false);
}


const onChange = (date) => {
  setShow(Platform.OS === 'ios');
  setNewDate(date);
  console.log(date);
}
    return(
   <Background>
    <Header/>
    <Container>
      <Nome>{user && user.nome}</Nome>
      <Saldo>R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g,'$1.')}</Saldo>
    </Container>

     <Area>
     <TouchableOpacity onPress={handleShowPicker}>
      <Icon name="event" color="#fff" size={30}/>
     </TouchableOpacity>

    <Title>Ultimas Movimentações</Title>
    </Area>

    <List
    showsVerticalScrollIndicator={false}
    data={historico}
    keyExtractor={ item => item.key}
    renderItem={({item}) => (<HistoricoList data={item} deleteItem={handleDelete}/>)}
     />

     {show && (
      <DatePicker
      onClose={handleClose}
      date={newDate}
      onChange={onChange}
      
      
      />
     )}

   </Background>
  )
}



