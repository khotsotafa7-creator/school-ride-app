import 'dart:convert';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:http/http.dart' as http;

class ApiService {
  // Change this if your PC IP changes
  static const String baseUrl = "http://10.0.0.132:3000";

  //////////////////////////////////////////////////////
  // LOGIN
  //////////////////////////////////////////////////////

  static Future<Map<String, dynamic>> login(String firebaseUid) async {
    final response = await http.post(
      Uri.parse("$baseUrl/api/auth/login"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "firebaseUid": firebaseUid,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    }

    throw Exception(response.body);
  }

  //////////////////////////////////////////////////////
  // ADD CHILD
  //////////////////////////////////////////////////////

  static Future<Map<String, dynamic>> addChild({
    required String fullName,
    required String grade,

    required String schoolName,
    required String schoolAddress,
    required String schoolSuburb,
    required String schoolCity,
    required String schoolProvince,
    required String postalCode,

    String? gender,
    String? pickupAddress,
    String? dropoffAddress,
    String? allergies,
    String? medicalConditions,
    String? emergencyNotes,
  }) async {
    final user = FirebaseAuth.instance.currentUser;

    if (user == null) {
      throw Exception("User not logged in.");
    }

    final token = await user.getIdToken();

    final response = await http.post(
      Uri.parse("$baseUrl/api/children"),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "fullName": fullName,
        "grade": grade,

        "schoolName": schoolName,
        "schoolAddress": schoolAddress,
        "schoolSuburb": schoolSuburb,
        "schoolCity": schoolCity,
        "schoolProvince": schoolProvince,
        "postalCode": postalCode,

        "gender": gender,
        "pickupAddress": pickupAddress,
        "dropoffAddress": dropoffAddress,
        "allergies": allergies,
        "medicalConditions": medicalConditions,
        "emergencyNotes": emergencyNotes,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200 || response.statusCode == 201) {
      return data;
    }

    throw Exception(data["error"] ?? "Failed to add child.");
  }

  //////////////////////////////////////////////////////
  // GET CHILDREN
  //////////////////////////////////////////////////////

  static Future<List<dynamic>> getChildren() async {
    final user = FirebaseAuth.instance.currentUser;

    if (user == null) {
      throw Exception("User not logged in.");
    }

    final token = await user.getIdToken();

    final response = await http.get(
      Uri.parse("$baseUrl/api/children"),
      headers: {
        "Authorization": "Bearer $token",
      },
    );

    final data = jsonDecode(response.body);
print(response.body);
    if (response.statusCode == 200) {
      return data["children"];
    }

    throw Exception("Failed to load children.");
  }
}