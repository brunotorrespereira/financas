
import React,{ useState,createContext,useEffect} from "react";
import database from '@react-native-firebase/database'; 
import auth from '@react-native-firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [ loading, setLoading] = useState(true);
    const [ loadingAuth, setLoadingAuth ] = useState(false);


    useEffect(() =>{
      async function loadStorage(){
        const storageUser = await AsyncStorage.getItem('Auth_user');

        if(storageUser){
          setUser(JSON.parse(storageUser))
          setLoading(false);
        }
        setLoading(false)
      }
      loadStorage(false);
    },[])

    //Funcao para logar usuario //
    async function signIn(email,password){

     setLoadingAuth(true)

       await auth().signInWithEmailAndPassword(email,password)
       .then(async(value) =>{
          let uid = value.user.uid;
          await database().ref('users').child(uid).once('value')
          .then((snapshot) =>{
            let data ={
              uid: uid,
              nome: snapshot.val().nome,
              email: value.user.email,
            }
            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
          })
       })
       .catch((error) =>{
         alert(error.code);
         setLoadingAuth(false);
       });
    }

    

     // Cadastra Usuario //
    async function signUp(email,password,nome){
    
      setLoadingAuth(true)

     await auth().createUserWithEmailAndPassword(email, password)
     .then(async(value) =>{
      let uid = value.user.uid;
      await database().ref('users').child(uid).set({
        saldo: 0,
        nome: nome,
        
      })
       .then(()=>{
        let data = {
          uid: uid,
          nome: nome,
          email:value.user.email,
        }
        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
       })
     })
     .catch((error) =>{
      alert(error.code);
      setLoadingAuth(false);
    })
  }

  async function storageUser(data){
    await AsyncStorage.setItem('Auth_user', JSON.stringify(data))
  }


async function signOut(){
  await auth().signOut();
  await AsyncStorage.clear()
  .then(() =>{
    setUser(null);
  })
}

    return(
        <AuthContext.Provider value={{signed: !!user,user,loading, signUp,signIn,signOut,
        loadingAuth}}>
          {children}
        </AuthContext.Provider>

        
    )

    
}

export default AuthProvider;







