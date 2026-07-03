// frontend/screens/HomeScreen.js
// Placeholder — we build the full home screen in Workbook 2
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SchoolRide</Text>
      <Text style={styles.welcome}>You are logged in! ✅</Text>
      <Text style={styles.sub}>
        Full dashboard coming in Workbook 2
      </Text>
      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#0a1628',
               alignItems:'center', justifyContent:'center', padding:24 },
  logo:      { fontSize:36, fontWeight:'bold', color:'#F5A623', marginBottom:8 },
  welcome:   { fontSize:18, color:'white', marginBottom:12 },
  sub:       { fontSize:13, color:'#94a3b8', marginBottom:40,
               textAlign:'center' },
  btn:       { backgroundColor:'#e74c3c', padding:14,
               borderRadius:12, paddingHorizontal:40 },
  btnText:   { color:'white', fontSize:15, fontWeight:'bold' },
});