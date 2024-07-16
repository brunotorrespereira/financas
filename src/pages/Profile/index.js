

import React, { useContext} from 'react';
import { useNavigation } from '@react-navigation/native'
import Header from '../../Components/Header';

import { AuthContext } from '../../Contexts/auth'

import { Container,Nome,NewLink,NewText,Logout,LogouText } from './styles';


export default function Profile() {
  const navigation = useNavigation();
  
  const {user, signOut} = useContext(AuthContext)

 return (
   <Container>
    <Header/>
    <Nome>
      {user && user.nome}
    </Nome>
    <NewLink onPress={() => navigation.navigate('Registrar')}>
      <NewText>Registrar Gastos</NewText>
    </NewLink>

    <Logout onPress={() => signOut()}>
      <LogouText>Sair</LogouText>
    </Logout>
   </Container>
  );
}