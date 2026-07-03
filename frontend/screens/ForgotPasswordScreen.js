// frontend/screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function ForgotPasswordScreen({ navigation }) {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (error) {
      Alert.alert('Error', 'Could not send reset email. Check your address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {sent ? (
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Email Sent!</Text>
          <Text style={styles.successText}>
            Check your inbox for a password reset link.
          </Text>
          <TouchableOpacity style={styles.btn}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.desc}>
            Enter your email and we will send you a reset link.
          </Text>
          <TextInput style={styles.input} placeholder='your@email.com'
            placeholderTextColor='#475569' value={email}
            onChangeText={setEmail} keyboardType='email-address'
            autoCapitalize='none' />
          <TouchableOpacity style={styles.btn}
            onPress={handleReset} disabled={loading}>
            <Text style={styles.btnText}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}
            style={styles.backContainer}>
            <Text style={styles.backText}>← Back to Sign In</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:'#0a1628',
                  padding:24, justifyContent:'center' },
  title:        { fontSize:26, fontWeight:'bold',
                  color:'#F5A623', marginBottom:12 },
  desc:         { color:'#94a3b8', fontSize:14,
                  marginBottom:24, lineHeight:22 },
  input:        { backgroundColor:'#0d2137', color:'white', padding:14,
                  borderRadius:10, marginBottom:16, fontSize:15,
                  borderWidth:1, borderColor:'#1e3a5f' },
  btn:          { backgroundColor:'#27ae60', padding:16,
                  borderRadius:12, alignItems:'center', marginBottom:16 },
  btnText:      { color:'white', fontSize:16, fontWeight:'bold' },
  backContainer:{ alignItems:'center' },
  backText:     { color:'#F5A623', fontSize:13 },
  successBox:   { alignItems:'center' },
  successIcon:  { fontSize:48, marginBottom:16 },
  successTitle: { fontSize:22, fontWeight:'bold',
                  color:'white', marginBottom:8 },
  successText:  { color:'#94a3b8', textAlign:'center',
                  lineHeight:22, marginBottom:24 },
});