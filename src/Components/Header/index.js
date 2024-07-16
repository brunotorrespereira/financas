
import React from "react";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';


import { Container, ButtonMenu} from './styles';

export default function Header() {
    const navigation = useNavigation();
 return (
   <Container>
    <ButtonMenu onPress={() => navigation.toggleDrawer()}> 
     <Icon name='menu' color='#fff' size={35}/>
     </ButtonMenu>
   </Container>
  );
}

