// frontend/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const API = 'http://10.0.0.132:3000';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [role,     setRole]     = useState('parent');
  const [loading,  setLoading]  = useState(false);

  const handleRegister = async () => {
    if (!fullName||!email||!phone||!password||!confirm) {
      Alert.alert('Missing Details', 'Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Minimum 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUid = cred.user.uid;
      const token = await cred.user.getIdToken();

      const response = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firebaseUid, fullName, email,
          phoneNumber: phone, role,
        }),
      });
      if (response.ok) {
        Alert.alert('Welcome!', 'Your account has been created.', [
          { text: 'Continue', onPress: () => navigation.replace('Home') }
        ]);
      }
    } catch (error) {
      let msg = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use')
        msg = 'An account with this email already exists.';
      if (error.code === 'auth/invalid-email')
        msg = 'Please enter a valid email address.';
      Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex:1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container}
        contentContainerStyle={styles.content}>
        <Text style={styles.logo}>SchoolRide</Text>
        <Text style={styles.tagline}>Create your account</Text>

        <Text style={styles.label}>I am a:</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role==='parent' && styles.roleBtnActive]}
            onPress={() => setRole('parent')}>
            <Text style={[styles.roleText,
              role==='parent' && styles.roleTextActive]}>Parent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role==='driver' && styles.roleBtnActive]}
            onPress={() => setRole('driver')}>
            <Text style={[styles.roleText,
              role==='driver' && styles.roleTextActive]}>Driver</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} placeholder='Sipho Ndlovu'
          placeholderTextColor='#475569' value={fullName}
          onChangeText={setFullName} />

        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} placeholder='your@email.com'
          placeholderTextColor='#475569' value={email}
          onChangeText={setEmail} keyboardType='email-address'
          autoCapitalize='none' />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput style={styles.input} placeholder='0821234567'
          placeholderTextColor='#475569' value={phone}
          onChangeText={setPhone} keyboardType='phone-pad' />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder='Minimum 6 characters'
          placeholderTextColor='#475569' value={password}
          onChangeText={setPassword} secureTextEntry />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput style={styles.input} placeholder='Repeat your password'
          placeholderTextColor='#475569' value={confirm}
          onChangeText={setConfirm} secureTextEntry />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleRegister} disabled={loading}>
          {loading
            ? <ActivityIndicator color='white' />
            : <Text style={styles.btnText}>Create Account</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}
          style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:      { flex:1, backgroundColor:'#0a1628' },
  content:        { padding:24, paddingBottom:40 },
  logo:           { fontSize:32, fontWeight:'bold', color:'#F5A623', marginTop:20 },
  tagline:        { fontSize:14, color:'#94a3b8', marginBottom:24 },
  label:          { fontSize:13, color:'#94a3b8', marginBottom:6, fontWeight:'600' },
  input:          { backgroundColor:'#0d2137', color:'white', padding:14,
                    borderRadius:10, marginBottom:16, fontSize:15,
                    borderWidth:1, borderColor:'#1e3a5f' },
  roleRow:        { flexDirection:'row', marginBottom:20, gap:12 },
  roleBtn:        { flex:1, padding:12, borderRadius:10, alignItems:'center',
                    backgroundColor:'#0d2137', borderWidth:1.5,
                    borderColor:'#1e3a5f' },
  roleBtnActive:  { borderColor:'#27ae60', backgroundColor:'#0d3320' },
  roleText:       { color:'#94a3b8', fontWeight:'bold' },
  roleTextActive: { color:'#27ae60' },
  btn:            { backgroundColor:'#27ae60', padding:16, borderRadius:12,
                    alignItems:'center', marginBottom:20, marginTop:8 },
  btnDisabled:    { backgroundColor:'#1a6b3a' },
  btnText:        { color:'white', fontSize:17, fontWeight:'bold' },
  loginContainer: { alignItems:'center' },
  loginText:      { color:'#94a3b8', fontSize:13 },
  loginLink:      { color:'#F5A623', fontWeight:'bold' },
});