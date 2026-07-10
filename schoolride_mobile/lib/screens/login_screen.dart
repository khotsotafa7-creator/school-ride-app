import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/api_service.dart';

import 'parent_home.dart';
import 'driver_home.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}


class _LoginScreenState extends State<LoginScreen> {

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  bool loading = false;


  Future<void> login() async {

    print("LOGIN BUTTON PRESSED");


    setState(() {
      loading = true;
    });


    try {


      UserCredential credential =
          await FirebaseAuth.instance.signInWithEmailAndPassword(

        email: emailController.text.trim(),

        password: passwordController.text.trim(),

      );


      String firebaseUid = credential.user!.uid;


      print("Firebase UID: $firebaseUid");



      // Get backend response
      final response =
          await ApiService.login(firebaseUid);



      print(response);



      final role = response["user"]["role"];



      print("USER ROLE: $role");



      if (role == "PARENT") {


        Navigator.pushReplacement(

          context,

          MaterialPageRoute(

            builder: (context) =>
               const ParentHome()

          ),

        );


      } else if (role == "DRIVER") {


        Navigator.pushReplacement(

          context,

          MaterialPageRoute(

            builder: (context) =>
            const DriverHome()    

          ),

        );


      } else {


        ScaffoldMessenger.of(context).showSnackBar(

          const SnackBar(

            content:
                Text("Unknown user role"),

          ),

        );

      }



      print("Login completed successfully.");



    } catch (e) {


      print("Login failed: $e");


      ScaffoldMessenger.of(context).showSnackBar(

        SnackBar(

          content:
              Text(e.toString()),

        ),

      );


    }



    if (mounted) {

      setState(() {

        loading = false;

      });

    }


  }



  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(

        title:
            const Text('School Ride Login'),

      ),


      body: Padding(

        padding:
            const EdgeInsets.all(24),


        child:
            Column(

          mainAxisAlignment:
              MainAxisAlignment.center,


          children: [


            TextField(

              controller:
                  emailController,


              decoration:
                  const InputDecoration(

                labelText:
                    'Email',

                border:
                    OutlineInputBorder(),

              ),

            ),



            const SizedBox(height:20),



            TextField(

              controller:
                  passwordController,


              obscureText:
                  true,


              decoration:
                  const InputDecoration(

                labelText:
                    'Password',

                border:
                    OutlineInputBorder(),

              ),

            ),



            const SizedBox(height:30),



            SizedBox(

              width:
                  double.infinity,


              child:
                  ElevatedButton(

                onPressed:
                    loading ? null : login,


                child:
                    loading

                        ? const CircularProgressIndicator()

                        : const Text('Login'),

              ),

            ),

          ],

        ),

      ),

    );

  }

}

