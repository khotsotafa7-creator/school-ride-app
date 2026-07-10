import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {

  // Your PC IP
  static const String baseUrl = 'http://10.0.0.132:3000';


  static Future<Map<String, dynamic>> login(String firebaseUid) async {

    final response = await http.post(

      Uri.parse('$baseUrl/api/auth/login'),

      headers: {
        'Content-Type': 'application/json',
      },

      body: jsonEncode({

        'firebaseUid': firebaseUid,

      }),

    );


    if (response.statusCode == 200) {

      print("Login successful");

      print(response.body);


      return jsonDecode(response.body);


    } else {

      print("Login failed");

      print(response.body);


      throw Exception(
        "Login failed: ${response.body}",
      );

    }

  }

}

