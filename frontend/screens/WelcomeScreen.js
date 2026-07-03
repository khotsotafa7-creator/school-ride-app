// frontend/screens/WelcomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SchoolRide</Text>
      <Text style={styles.tagline}>Safe transport for your child</Text>
      <Text style={styles.sub}>Africa's most trusted school transport network</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1, backgroundColor:'#0a1628',
                alignItems:'center', justifyContent:'center', padding:24 },
  logo:       { fontSize:42, fontWeight:'bold', color:'#F5A623', marginBottom:8 },
  tagline:    { fontSize:16, color:'white', marginBottom:8, textAlign:'center' },
  sub:        { fontSize:12, color:'#94a3b8', marginBottom:60, textAlign:'center' },
  button:     { backgroundColor:'#27ae60', paddingVertical:16,
                paddingHorizontal:60, borderRadius:30 },
  buttonText: { color:'white', fontSize:18, fontWeight:'bold' },
});