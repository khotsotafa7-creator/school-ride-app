import 'package:flutter/material.dart';
import '../services/api_service.dart';

class MyChildrenScreen extends StatefulWidget {
  const MyChildrenScreen({super.key});

  @override
  State<MyChildrenScreen> createState() => _MyChildrenScreenState();
}

class _MyChildrenScreenState extends State<MyChildrenScreen> {
  List<dynamic> children = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadChildren();
  }

  Future<void> loadChildren() async {
    setState(() {
      isLoading = true;
    });

    try {
      final data = await ApiService.getChildren();

      print("Children received: $data");

      if (!mounted) return;

      setState(() {
        children = data;
        isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("My Children"),
        centerTitle: true,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.pushNamed(context, "/add-child");

          if (result == true) {
            loadChildren();
          }
        },
        child: const Icon(Icons.add),
      ),
      body: isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : children.isEmpty
              ? RefreshIndicator(
                  onRefresh: loadChildren,
                  child: ListView(
                    children: const [
                      SizedBox(height: 250),
                      Center(
                        child: Text(
                          "No children added yet.",
                          style: TextStyle(fontSize: 18),
                        ),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: loadChildren,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: children.length,
                    itemBuilder: (context, index) {
                      final child = children[index];

                      return Card(
                        margin: const EdgeInsets.only(bottom: 15),
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: ListTile(
                          leading: CircleAvatar(
                            radius: 28,
                            child: Text(
                              child["fullName"]
                                  .toString()
                                  .substring(0, 1)
                                  .toUpperCase(),
                            ),
                          ),
                          title: Text(
                            child["fullName"] ?? "",
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 6),
                              Text("Grade: ${child["grade"] ?? ""}"),
                              Text("School: ${child["schoolName"] ?? ""}"),
                              Text(
                                "${child["schoolCity"] ?? ""}, ${child["schoolProvince"] ?? ""}",
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}