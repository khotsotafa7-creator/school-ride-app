import 'package:flutter/material.dart';

class ParentHome extends StatelessWidget {
  const ParentHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Parent Home'),
      ),
      body: const Center(
        child: Text(
          'Welcome Parent',
          style: TextStyle(
            fontSize: 24,
          ),
        ),
      ),
    );
  }
}