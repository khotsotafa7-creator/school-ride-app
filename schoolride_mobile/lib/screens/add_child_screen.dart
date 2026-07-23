import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AddChildScreen extends StatefulWidget {
  const AddChildScreen({super.key});

  @override
  State<AddChildScreen> createState() => _AddChildScreenState();
}

class _AddChildScreenState extends State<AddChildScreen> {
  final _formKey = GlobalKey<FormState>();

  final fullName = TextEditingController();
  final grade = TextEditingController();

  final schoolName = TextEditingController();
  final schoolAddress = TextEditingController();
  final schoolSuburb = TextEditingController();
  final schoolCity = TextEditingController();
  final schoolProvince = TextEditingController();
  final postalCode = TextEditingController();

  final pickupAddress = TextEditingController();
  final dropoffAddress = TextEditingController();

  final allergies = TextEditingController();
  final medicalConditions = TextEditingController();
  final emergencyNotes = TextEditingController();

  bool isSaving = false;

  @override
  void dispose() {
    fullName.dispose();
    grade.dispose();
    schoolName.dispose();
    schoolAddress.dispose();
    schoolSuburb.dispose();
    schoolCity.dispose();
    schoolProvince.dispose();
    postalCode.dispose();
    pickupAddress.dispose();
    dropoffAddress.dispose();
    allergies.dispose();
    medicalConditions.dispose();
    emergencyNotes.dispose();

    super.dispose();
  }

  Widget buildField({
    required TextEditingController controller,
    required String label,
    bool required = false,
    int maxLines = 1,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        controller: controller,
        keyboardType: keyboardType,
        maxLines: maxLines,
        validator: required
            ? (value) {
                if (value == null || value.trim().isEmpty) {
                  return "This field is required";
                }
                return null;
              }
            : null,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  Future<void> saveChild() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      isSaving = true;
    });

    try {
      await ApiService.addChild(
        fullName: fullName.text.trim(),
        grade: grade.text.trim(),

        schoolName: schoolName.text.trim(),
        schoolAddress: schoolAddress.text.trim(),
        schoolSuburb: schoolSuburb.text.trim(),
        schoolCity: schoolCity.text.trim(),
        schoolProvince: schoolProvince.text.trim(),
        postalCode: postalCode.text.trim(),

        pickupAddress: pickupAddress.text.trim(),
        dropoffAddress: dropoffAddress.text.trim(),

        allergies: allergies.text.trim(),
        medicalConditions: medicalConditions.text.trim(),
        emergencyNotes: emergencyNotes.text.trim(),
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Child registered successfully."),
          backgroundColor: Colors.green,
        ),
      );

      Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.toString()),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          isSaving = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Register Child"),
        centerTitle: true,
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
                        buildField(
              controller: fullName,
              label: "Child Full Name",
              required: true,
            ),

            buildField(
              controller: grade,
              label: "Grade",
              required: true,
            ),

            const SizedBox(height: 10),

            const Text(
              "School Information",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 15),

            buildField(
              controller: schoolName,
              label: "School Name",
              required: true,
            ),

            buildField(
              controller: schoolAddress,
              label: "School Street Address",
            ),

            buildField(
              controller: schoolSuburb,
              label: "Suburb",
            ),

            buildField(
              controller: schoolCity,
              label: "City",
              required: true,
            ),

            buildField(
              controller: schoolProvince,
              label: "Province",
              required: true,
            ),

            buildField(
              controller: postalCode,
              label: "Postal Code",
              keyboardType: TextInputType.number,
            ),

            const SizedBox(height: 10),

            const Text(
              "Transport Details",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 15),

            buildField(
              controller: pickupAddress,
              label: "Pickup Address",
            ),

            buildField(
              controller: dropoffAddress,
              label: "Drop-off Address",
            ),

            const SizedBox(height: 10),

            const Text(
              "Medical Information",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 15),

            buildField(
              controller: allergies,
              label: "Allergies",
            ),

            buildField(
              controller: medicalConditions,
              label: "Medical Conditions",
            ),

            buildField(
              controller: emergencyNotes,
              label: "Emergency Notes",
              maxLines: 4,
            ),

            const SizedBox(height: 25),

            SizedBox(
              height: 55,
              width: double.infinity,
              child: ElevatedButton(
                onPressed: isSaving ? null : saveChild,
                child: isSaving
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 3,
                          color: Colors.white,
                        ),
                      )
                    : const Text(
                        "Save Child",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
                        SizedBox(
              height: 55,
              width: double.infinity,
              child: ElevatedButton(
                onPressed: isSaving ? null : saveChild,
                child: isSaving
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          strokeWidth: 3,
                          color: Colors.white,
                        ),
                      )
                    : const Text(
                        "Save Child",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}