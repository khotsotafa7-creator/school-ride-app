// frontend/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function LoginScreen({ navigation }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Details', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      let message = 'Something went wrong. Please try again.';
      if (error.code === 'auth/user-not-found')
        message = 'No account found with this email address.';
      if (error.code === 'auth/wrong-password')
        message = 'Incorrect password. Please try again.';
      if (error.code === 'auth/invalid-email')
        message = 'Please enter a valid email address.';
      if (error.code === 'auth/too-many-requests')
        message = 'Too many attempts. Please try again later.';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.logo}>SchoolRide</Text>
      <Text style={styles.tagline}>Welcome back</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder='your@email.com'
        placeholderTextColor='#475569'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        autoCapitalize='none'
        autoCorrect={false}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder='Enter your password'
        placeholderTextColor='#475569'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotContainer}
      >
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color='white' />
          : <Text style={styles.btnText}>Sign In</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.registerContainer}
      >
        <Text style={styles.registerText}>
          Don't have an account?{' '}
          <Text style={styles.registerLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:         { flex:1, backgroundColor:'#0a1628',
                       justifyContent:'center', padding:24 },
  logo:              { fontSize:36, fontWeight:'bold', color:'#F5A623', marginBottom:4 },
  tagline:           { fontSize:15, color:'#94a3b8', marginBottom:32 },
  label:             { fontSize:13, color:'#94a3b8', marginBottom:6, fontWeight:'600' },
  input:             { backgroundColor:'#0d2137', color:'white', padding:14,
                       borderRadius:10, marginBottom:16, fontSize:15,
                       borderWidth:1, borderColor:'#1e3a5f' },
  forgotContainer:   { alignItems:'flex-end', marginBottom:24 },
  forgotText:        { color:'#F5A623', fontSize:13 },
  btn:               { backgroundColor:'#27ae60', padding:16,
                       borderRadius:12, alignItems:'center', marginBottom:20 },
  btnDisabled:       { backgroundColor:'#1a6b3a' },
  btnText:           { color:'white', fontSize:17, fontWeight:'bold' },
  registerContainer: { alignItems:'center' },
  registerText:      { color:'#94a3b8', fontSize:13 },
  registerLink:      { color:'#F5A623', fontWeight:'bold' },
});