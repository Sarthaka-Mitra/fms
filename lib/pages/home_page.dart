import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

import 'quick_analysis_page.dart';
import 'profile_page.dart';
import 'catalog_page.dart';
import 'report_page.dart';
import 'reminder_section.dart'; // ✅ NEW IMPORT

class HomePage extends StatefulWidget {
  static final ValueNotifier<int> tabNotifier = ValueNotifier<int>(0);

  const HomePage({super.key});

  static void setTab(int index) {
    tabNotifier.value = index;
  }

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final List<GlobalKey<NavigatorState>> _navigatorKeys =
  List.generate(5, (_) => GlobalKey<NavigatorState>());

  void _onItemTapped(int index) {
    if (HomePage.tabNotifier.value == index) {
      _navigatorKeys[index].currentState?.popUntil((route) => route.isFirst);
    } else {
      HomePage.setTab(index);
    }
  }

  Future<bool> _onWillPop() async {
    final currentNavigator =
    _navigatorKeys[HomePage.tabNotifier.value].currentState!;
    if (currentNavigator.canPop()) {
      currentNavigator.pop();
      return false;
    }
    return true;
  }

  Widget _buildOffstageNavigator(int index, Widget child) {
    return Offstage(
      offstage: HomePage.tabNotifier.value != index,
      child: Navigator(
        key: _navigatorKeys[index],
        onGenerateRoute: (_) => MaterialPageRoute(builder: (_) => child),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: HomePage.tabNotifier,
      builder: (context, selectedIndex, _) {
        return WillPopScope(
          onWillPop: _onWillPop,
          child: Scaffold(
            backgroundColor: const Color(0xFF0D0B2D),
            body: Stack(
              children: [
                _buildOffstageNavigator(0, HomeMainContent()),
                _buildOffstageNavigator(1, QuickAnalysisPage()),
                _buildOffstageNavigator(2, ReportPage()),
                _buildOffstageNavigator(3, CatalogPage()),
                _buildOffstageNavigator(4, ProfilePage()),
              ],
            ),
            bottomNavigationBar: BottomNavigationBar(
              backgroundColor: const Color(0xFF0D0B2D),
              selectedItemColor: Colors.white,
              unselectedItemColor: Colors.white38,
              type: BottomNavigationBarType.fixed,
              currentIndex: selectedIndex,
              onTap: _onItemTapped,
              items: const [
                BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
                BottomNavigationBarItem(
                    icon: Icon(Icons.swap_horiz), label: 'Transactions'),
                BottomNavigationBarItem(
                    icon: Icon(Icons.bar_chart), label: 'Analysis'),
                BottomNavigationBarItem(
                    icon: Icon(Icons.payment), label: 'Catalog'),
                BottomNavigationBarItem(
                    icon: Icon(Icons.person), label: 'Profile'),
              ],
            ),
          ),
        );
      },
    );
  }
}

class RotatingQuoteWidget extends StatefulWidget {
  const RotatingQuoteWidget({super.key});

  @override
  _RotatingQuoteWidgetState createState() => _RotatingQuoteWidgetState();
}

class _RotatingQuoteWidgetState extends State<RotatingQuoteWidget> {
  final List<String> _quotes = [
    "Stay focused and consistent!",
    "Small steps lead to big changes.",
    "Track your money, shape your future.",
    "Discipline is the bridge to financial freedom.",
    "A budget is telling your money where to go.",
    "Save now, enjoy later.",
    "Wealth grows when habits change."
  ];

  int _currentIndex = 0;
  late final Timer _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(Duration(seconds: 5), (_) {
      setState(() {
        _currentIndex = (_currentIndex + 1) % _quotes.length;
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: Duration(milliseconds: 500),
      child: Text(
        '"${_quotes[_currentIndex]}"',
        key: ValueKey(_currentIndex),
        style: TextStyle(
          color: Colors.white70,
          fontStyle: FontStyle.italic,
          fontSize: 14,
        ),
      ),
    );
  }
}

// New Widget for Daily Streak
class DailyStreakTrackerWidget extends StatelessWidget {
  const DailyStreakTrackerWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Placeholder data - in a real app, this would come from user data
    int currentStreak = 5;
    bool hasActiveGoal = true; // Example: user is working towards a saving goal

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      decoration: BoxDecoration(
        color: const Color(0xFF1F1B4A).withOpacity(0.5), // Subtle background
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.local_fire_department_rounded, color: Colors.orangeAccent, size: 20),
          const SizedBox(width: 8),
          Text(
            '$currentStreak Day Streak!',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
          if (hasActiveGoal) ...[
            const SizedBox(width: 16),
            Icon(Icons.star_border_rounded, color: Colors.yellowAccent, size: 20),
            const SizedBox(width: 4),
            Text(
              'Goal Active',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 13,
              ),
            ),
          ]
        ],
      ),
    );
  }
}

// New Widget for Mini Quiz/Poll
class MiniQuizWidget extends StatefulWidget {
  const MiniQuizWidget({Key? key}) : super(key: key);

  @override
  _MiniQuizWidgetState createState() => _MiniQuizWidgetState();
}

class _MiniQuizWidgetState extends State<MiniQuizWidget> {
  String question = "What's a good way to start saving?";
  List<String> options = ["Cut all fun spending", "Automate small transfers", "Invest in high-risk stocks", "Wait for a raise"];
  int correctAnswerIndex = 1;
  int? selectedOptionIndex;
  bool answered = false;
  bool _showQuizContent = true; // Added to control visibility for animation

  void _selectAnswer(int index) {
    if (!answered) {
      setState(() {
        selectedOptionIndex = index;
        answered = true; // This will immediately show the feedback in the UI
      });

      // After a delay (for the user to read the feedback), make the whole card disappear.
      Future.delayed(const Duration(seconds: 3), () { // Total time feedback is visible
        if (mounted) {
          setState(() {
            _showQuizContent = false; // This will trigger AnimatedSwitcher to hide the widget
          });
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 500),
      transitionBuilder: (Widget child, Animation<double> animation) {
        return FadeTransition(
          opacity: animation,
          child: SizeTransition(
            sizeFactor: animation,
            axis: Axis.vertical,
            child: child,
          ),
        );
      },
      child: _showQuizContent
          ? Container(
              key: const ValueKey('quiz_visible'), // Key for AnimatedSwitcher
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF1F1B4A), // Consistent card color
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.25),
                    spreadRadius: 0,
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "💡 Quick Quiz:",
                    style: TextStyle(
                      color: Colors.lightBlueAccent,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    question,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...options.asMap().entries.map((entry) {
                    int idx = entry.key;
                    String text = entry.value;
                    Color? tileColor;
                    Color borderColor = Colors.transparent;
                    IconData? trailingIcon;

                    if (answered) {
                      if (idx == correctAnswerIndex) {
                        tileColor = Colors.green.withOpacity(0.3);
                        borderColor = Colors.green;
                        trailingIcon = Icons.check_circle_outline;
                      } else if (idx == selectedOptionIndex) {
                        tileColor = Colors.red.withOpacity(0.3);
                        borderColor = Colors.red;
                        trailingIcon = Icons.highlight_off;
                      }
                    }

                    return Card(
                      elevation: 0,
                      color: tileColor ?? const Color(0xFF0D0B2D).withOpacity(0.5),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                        side: BorderSide(color: borderColor, width: 1.5),
                      ),
                      margin: const EdgeInsets.symmetric(vertical: 4),
                      child: ListTile(
                        title: Text(text, style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 14)),
                        onTap: () => _selectAnswer(idx),
                        trailing: trailingIcon != null ? Icon(trailingIcon, color: borderColor) : null,
                        dense: true,
                      ),
                    );
                  }).toList(),
                  if (answered)
                    Padding(
                      padding: const EdgeInsets.only(top: 12.0),
                      child: Text(
                        selectedOptionIndex == correctAnswerIndex ? "Correct! Great job!" : "Good try! The best answer was '${options[correctAnswerIndex]}'.",
                        style: TextStyle(
                          color: selectedOptionIndex == correctAnswerIndex ? Colors.greenAccent : Colors.orangeAccent,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                ],
              ),
            )
          : SizedBox.shrink(key: const ValueKey('quiz_hidden')), // Empty box when hidden
    );
  }
}

class HomeMainContent extends StatelessWidget {
  const HomeMainContent({super.key});
  
  Stream<String> _getUserName() {
    return FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser?.uid ?? '')
        .snapshots()
        .map((doc) => doc.data()?['full_name'] ?? 'User');
  }

  Stream<List<Map<String, dynamic>>> _getTransactions() {
    return FirebaseFirestore.instance
        .collection('transactions')
        .where('uid', isEqualTo: FirebaseAuth.instance.currentUser?.uid ?? '')
        .snapshots()
        .map((snap) => snap.docs.map((e) => e.data()).toList());
  }

  Stream<Map<String, dynamic>?> _getSavingsGoal() {
    return FirebaseFirestore.instance
        .collection('savings')
        .where('uid', isEqualTo: FirebaseAuth.instance.currentUser?.uid ?? '')
        .limit(1)
        .snapshots()
        .map((snap) => snap.docs.isNotEmpty ? snap.docs.first.data() : null);
  }

  @override
  Widget build(BuildContext context) {

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async {
          // Add your refresh logic here (e.g., force setState or reload Firebase data)
          // This will also cause FinancialFortuneGame to rebuild if its key is used correctly
          await Future.delayed(Duration(milliseconds: 500));
          // Access the state via the GlobalKey and call a method to reset it.
          // Ensure _loadCanPlay is public or create a specific public reset method.
          FinancialFortuneGame.financialFortuneGameKey.currentState?. _loadCanPlay();
        },
        backgroundColor: const Color(0xFF0D0B2D),
        color: Colors.lightBlueAccent,
        child: SingleChildScrollView(
          physics: AlwaysScrollableScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // User Greeting and Rotating Quote
                StreamBuilder<String>(
                  stream: _getUserName(),
                  builder: (_, snapshot) {
                    final name = snapshot.data ?? 'User';
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Hello, $name!',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        RotatingQuoteWidget(),
                      ],
                    );
                  },
                ),
                const SizedBox(height: 16), // Spacing after greeting

                // Daily Streak Tracker
                DailyStreakTrackerWidget(),
                const SizedBox(height: 20),


                // Financial Insights Banner
                Container(
                  height: 145, // Increased height from 140 to 145
                  child: InsightsBannerCarousel(),
                ),

                const SizedBox(height: 24),

                // Mini Quiz Widget
                MiniQuizWidget(),
                const SizedBox(height: 24),

                StreamBuilder<List<Map<String, dynamic>>>(
                  stream: _getTransactions(),
                  builder: (_, snapshot) {
                    final transactions = snapshot.data ?? [];
                    double monthlyExpense = 0;
                    double incomeThisMonth = 0;

                    final now = DateTime.now();
                    for (var tx in transactions) {
                      DateTime txTime = (tx['timestamp'] as Timestamp).toDate();
                      if (txTime.month == now.month && txTime.year == now.year) {
                        final amount = (tx['amount'] ?? 0).toDouble();
                        if (tx['type'] == 'expense') {
                          monthlyExpense += amount;
                        } else if (tx['type'] == 'income') {
                          incomeThisMonth += amount;
                        }
                      }
                    }

                    String alert;
                    if (monthlyExpense > 20000) {
                      alert = '🚨 High Alert: You\'ve spent over ₹20,000 this month!';
                    } else if (monthlyExpense > 15000) {
                      alert = '⚠️ Careful! You\'re nearing ₹20k in monthly expenses.';
                    } else if (monthlyExpense > 10000) {
                      alert = '🧾 Heads up: Expenses crossed ₹10k this month.';
                    } else {
                      alert = '✅ All good! You\'re spending wisely this month.';
                    }

                    String details =
                        'Expenses: ₹${monthlyExpense.toStringAsFixed(0)} | Income: ₹${incomeThisMonth.toStringAsFixed(0)}';

                    return _buildCard(
                      title: 'Smart Alerts + Warnings',
                      content: '$alert\n$details', // Changed from '\\n' to '\n'
                      icon: Icons.notifications_active_outlined,
                      iconColor: Colors.orangeAccent,
                    );
                  },
                ),

                const SizedBox(height: 16),

                StreamBuilder<Map<String, dynamic>?>(
                  stream: _getSavingsGoal(),
                  builder: (_, snapshot) {
                    final data = snapshot.data;
                    if (data == null) {
                      return _buildCard(
                        title: 'Budget Goal Progress',
                        content: 'No budget goal set. Add one in Catalog.',
                        icon: Icons.account_balance_wallet_outlined,
                        iconColor: Colors.tealAccent[200],
                      );
                    }
                    final double targetAmount = data['amount']?.toDouble() ?? 1;
                    final Map<String, dynamic>? duration = data['duration'] as Map<String, dynamic>?;

                    // Calculate total days from duration
                    int totalDays = 1;
                    if (duration != null) {
                      final unit = duration['unit'] as String? ?? 'months';
                      final value = duration['value'] as int? ?? 1;
                      if (unit == 'months') {
                        totalDays = (value * 30); // approx 30 days per month
                      } else if (unit == 'years') {
                        totalDays = (value * 365); // approx 365 days per year
                      }
                    }

                    final DateTime startDate = (data['timestamp'] as Timestamp).toDate();
                    final DateTime now = DateTime.now();

                    final int elapsedDays = now.difference(startDate).inDays.clamp(0, totalDays);

                    final double amountSaved = data['transfer']?.toDouble() ?? 0;

                    final double timeProgress = elapsedDays / totalDays;
                    final double amountProgress = (amountSaved / targetAmount).clamp(0.0, 1.0);

                    final double combinedProgress = (timeProgress + amountProgress) / 2;
                    final progressPercent = (combinedProgress * 100).clamp(0, 100);

                    return _buildCard(
                      title: 'Budget Goal Progress',
                      content: 'Progress: ${progressPercent.toStringAsFixed(1)}%',
                      icon: Icons.account_balance_wallet_outlined,
                      iconColor: Colors.tealAccent[200],
                      child: LinearProgressIndicator(
                        value: combinedProgress.clamp(0.0, 1.0),
                        color: Colors.greenAccent,
                        backgroundColor: Colors.white12.withOpacity(0.5),
                        minHeight: 8, // Make progress bar a bit thicker
                        borderRadius: BorderRadius.circular(4), // Rounded ends for the progress bar
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16),

                StreamBuilder<List<Map<String, dynamic>>>(
                  stream: _getTransactions(),
                  builder: (_, snapshot) {
                    final txns = snapshot.data ?? [];
                    double saved = 0;
                    for (var tx in txns) {
                      if (tx['type'] == 'income') {
                        saved += (tx['amount'] ?? 0).toDouble();
                      }
                    }
                    String milestone = 'Total Saved: ₹${saved.toStringAsFixed(2)}';
                    return _buildCard(
                      title: 'Financial Milestones',
                      content: milestone,
                      icon: Icons.emoji_events_outlined,
                      iconColor: Colors.amberAccent,
                    );
                  },
                ),
                const SizedBox(height: 24),

                // Financial Fortune Game
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1F1B4A),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        spreadRadius: 1,
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: FinancialFortuneGame(key: FinancialFortuneGame.financialFortuneGameKey), // Assign the key here
                ),
                
                const SizedBox(height: 16),

                // Reminder Section
                ReminderSection(uid: FirebaseAuth.instance.currentUser?.uid ?? ''),  // pass current user UID here
              ],
            ),
          ),
        ),
      ),
    );
  }




  Widget _buildCard({
    required String title,
    required String content,
    Widget? child,
    IconData? icon,
    Color? iconColor,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20), // Increased padding
      decoration: BoxDecoration(
        color: const Color(0xFF1F1B4A), // Existing card color
        borderRadius: BorderRadius.circular(20), // More rounded corners
        boxShadow: [ // Add subtle shadow for depth
          BoxShadow(
            color: Colors.black.withOpacity(0.25),
            spreadRadius: 0,
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (icon != null) ...[
                Icon(icon, color: iconColor ?? Colors.white70, size: 28),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    color: Colors.white, // Brighter title
                    fontWeight: FontWeight.bold,
                    fontSize: 18, // Slightly larger title
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12), // Increased spacing
          Padding(
            padding: EdgeInsets.only(left: icon != null ? 40 : 0), // Indent content if icon exists
            child: Text(
              content,
              style: TextStyle(
                color: Colors.white.withOpacity(0.85), // Slightly brighter content
                fontSize: 15, // Slightly larger content
                height: 1.4, // Improve readability
              ),
            ),
          ),
          if (child != null) ...[
            const SizedBox(height: 16), // Increased spacing
            Padding(
              padding: EdgeInsets.only(left: icon != null ? 40 : 0), // Indent child if icon exists
              child: child,
            ),
          ]
        ],
      ),
    );
  }
}

class InsightsBannerCarousel extends StatefulWidget {
  const InsightsBannerCarousel({Key? key}) : super(key: key);

  @override
  _InsightsBannerCarouselState createState() => _InsightsBannerCarouselState();
}

class _InsightsBannerCarouselState extends State<InsightsBannerCarousel> {
  final PageController _pageController = PageController(viewportFraction: 0.9); // Show part of next/prev cards
  int _currentPage = 0;
  Timer? _timer;

  final List<Map<String, dynamic>> _bannerItems = [
    {
      'title': 'Smart Saving Tip',
      'content': 'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
      'icon': Icons.lightbulb_outline_rounded,
      'gradientColors': [Color(0xFF6A5ACD), Color(0xFF8A2BE2)], // Indigo to BlueViolet
      'pattern': (Canvas canvas, Size size) { // Subtle diagonal lines pattern
        final paint = Paint()
          ..color = Colors.white.withOpacity(0.05)
          ..strokeWidth = 1;
        for (double i = -size.height; i < size.width; i += 10) {
          canvas.drawLine(Offset(i, 0), Offset(i + size.height, size.height), paint);
        }
      },
    },
    {
      'title': 'Did You Know?',
      'content': 'Automating your savings can significantly boost your financial goals.',
      'icon': Icons.psychology_alt_rounded,
      'gradientColors': [Color(0xFF00CED1), Color(0xFF20B2AA)], // DarkTurquoise to LightSeaGreen
      'pattern': (Canvas canvas, Size size) { // Subtle circle pattern
        final paint = Paint()..color = Colors.white.withOpacity(0.05);
        for (double i = 0; i < size.width; i += 20) {
          for (double j = 0; j < size.height; j += 20) {
            canvas.drawCircle(Offset(i, j), 2, paint);
          }
        }
      },
    },
    {
      'title': 'Quick Financial Win',
      'content': 'Review one subscription today. Can you save by cancelling or downgrading?',
      'icon': Icons.savings_rounded,
      'gradientColors': [Color(0xFFFF7F50), Color(0xFFFFA07A)], // Coral to LightSalmon
      'pattern': (Canvas canvas, Size size) { // Subtle wave pattern
        final paint = Paint()
          ..color = Colors.white.withOpacity(0.05)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1.5;
        final path = Path();
        for (double i = 0; i < size.width; i += 20) {
          path.moveTo(i, size.height / 2);
          path.quadraticBezierTo(i + 10, size.height / 2 - 10, i + 20, size.height / 2);
          path.quadraticBezierTo(i + 30, size.height / 2 + 10, i + 40, size.height / 2);
        }
        canvas.drawPath(path, paint);
      },
    },
  ];

  @override
  void initState() {
    super.initState();
    // Add a short delay before starting auto-scroll to ensure PageView is built
    Future.delayed(Duration(milliseconds: 300), () {
      if (mounted) { // Check if the widget is still in the tree
        _startAutoScroll();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _startAutoScroll() {
    if (_bannerItems.length <= 1) return; // No need to scroll if only one item

    _timer = Timer.periodic(Duration(seconds: 5), (timer) {
      if (!mounted) { // If the widget is disposed, cancel timer
        timer.cancel();
        return;
      }
      if (_pageController.hasClients) {
        if (_currentPage < _bannerItems.length - 1) {
          _pageController.nextPage(
            duration: Duration(milliseconds: 700), // Smoother transition
            curve: Curves.easeInOutCubic, // More elegant curve
          );
        } else {
          _pageController.animateToPage(
            0,
            duration: Duration(milliseconds: 700),
            curve: Curves.easeInOutCubic,
          );
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_bannerItems.isEmpty) {
      return SizedBox(height: 140, child: Center(child: Text("No insights available.", style: TextStyle(color: Colors.white54))));
    }
    return Column(
      children: [
        SizedBox( // Explicitly define height for PageView container
          height: 120, // Adjusted height for the banner cards
          child: PageView.builder(
            controller: _pageController,
            itemCount: _bannerItems.length,
            onPageChanged: (index) {
              if (mounted) {
                setState(() {
                  _currentPage = index;
                });
              }
            },
            itemBuilder: (context, index) {
              final item = _bannerItems[index];
              return Container(
                margin: EdgeInsets.symmetric(horizontal: 6, vertical: 4), // spacing between cards
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: item['gradientColors'] as List<Color>,
                  ),
                  borderRadius: BorderRadius.circular(18), // Slightly less rounded
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 8,
                      offset: Offset(0, 4),
                    ),
                  ],
                ),
                child: ClipRRect( // Clip the pattern to the rounded corners
                  borderRadius: BorderRadius.circular(18),
                  child: CustomPaint(
                    painter: _BannerPatternPainter(item['pattern'] as Function(Canvas, Size)),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0), // Adjusted padding
                      child: Row(
                        children: [
                          Icon(
                            item['icon'] as IconData,
                            color: Colors.white.withOpacity(0.9),
                            size: 36, // Slightly smaller icon
                          ),
                          SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  item['title'] as String,
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16, // Adjusted font size
                                    fontWeight: FontWeight.bold,
                                    shadows: [Shadow(color: Colors.black26, blurRadius: 2, offset: Offset(1,1))],
                                  ),
                                ),
                                SizedBox(height: 6),
                                Text(
                                  item['content'] as String,
                                  style: TextStyle(
                                    color: Colors.white.withOpacity(0.85),
                                    fontSize: 13, // Adjusted font size
                                    height: 1.3,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        SizedBox(height: 10), // Spacing before dots
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_bannerItems.length, (index) {
            return AnimatedContainer( // Animate dot size/color change
              duration: Duration(milliseconds: 300),
              margin: EdgeInsets.symmetric(horizontal: 4), // Spacing between dots
              width: _currentPage == index ? 12 : 8, // Active dot is larger
              height: _currentPage == index ? 12 : 8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _currentPage == index
                    ? Colors.white
                    : Colors.white.withOpacity(0.5),
                boxShadow: _currentPage == index ? [
                  BoxShadow(color: Colors.white.withOpacity(0.5), blurRadius: 4, spreadRadius: 1)
                ] : [],
              ),
            );
          }),
        ),
      ],
    );
  }
}

// Custom Painter for banner patterns
class _BannerPatternPainter extends CustomPainter {
  final Function(Canvas canvas, Size size) patternDrawer;
  _BannerPatternPainter(this.patternDrawer);

  @override
  void paint(Canvas canvas, Size size) {
    patternDrawer(canvas, size);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}


class FinancialFortuneGame extends StatefulWidget {
  // Constructor now accepts a Key
  const FinancialFortuneGame({Key? key}) : super(key: key);

  // Static key for accessing state if needed from outside, though direct state manipulation is often better avoided.
  // For resetting on refresh, we will rely on the key passed to the constructor changing, or direct method call if state is managed higher up.
  static final GlobalKey<_FinancialFortuneGameState> financialFortuneGameKey = GlobalKey<_FinancialFortuneGameState>();

  @override
  _FinancialFortuneGameState createState() => _FinancialFortuneGameState();
}

class _FinancialFortuneGameState extends State<FinancialFortuneGame> with SingleTickerProviderStateMixin {
  bool _canPlay = true;
  String _fortune = '';
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation; // For the coin
  late Animation<double> _rotationAnimation; // For a subtle spin

  String _preFlipContent = ''; // To hold the message before flipping
  final List<String> _preFlipMessages = [
    "What wisdom awaits today?",
    "Tap the coin for your financial insight!",
    "Unlock today's fortune...",
    "Awaiting your tap...",
    "Curious about your financial tip?"
  ];

  final List<String> _fortunes = [
    "Invest in yourself first, it has the highest returns!",
    "A penny saved is a penny earned. Keep it up!",
    "Financial freedom comes from small, consistent choices. You're on the right track!",
    "The best investment today is in your own financial education. Learn something new!",
    "Your savings rate matters more than your investment returns. Focus on saving more!",
    "Pay yourself first - make saving automatic and effortless.",
    "Wealth is what you don\\'t spend. Think before you buy!",
    "Time in the market beats timing the market. Stay patient!",
    "Your future self will thank you for saving today. Keep going!",
    "The best time to start saving was yesterday. The second best is today. Start now!",
  ];


  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 600), // Slightly longer for a smoother feel
    );

    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.elasticOut, // Bouncy effect
      ),
    );
    
    _rotationAnimation = Tween<double>(begin: 0.0, end: 0.1).animate( // Subtle rotation
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeInOut, // Smooth rotation
      )
    );

    _loadCanPlay();
    _setPreFlipMessage(); // Set initial pre-flip message
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _loadCanPlay() async {
    // In a real app, load from SharedPreferences
    // For now, simulate daily limit
    // final DateTime now = DateTime.now(); // Removed unused variable
    // Placeholder: Assume last played was yesterday to allow play on first load
    // final prefs = await SharedPreferences.getInstance();
    // final lastPlayedString = prefs.getString('lastFortuneDate');
    // For demonstration, we'll always allow play on initState or widget rebuild if key changes.
    // This simulates the reset behavior you want on refresh.
    
    if (mounted) {
      setState(() {
        _canPlay = true;
        _fortune = ''; // Clear previous fortune
        _setPreFlipMessage(); // Set a new pre-flip message on reset
        if (_animationController.isAnimating) {
          _animationController.stop();
        }
        _animationController.reset(); // Reset animation controller
      });
    }
  }

  void _setPreFlipMessage() {
    final random = Random();
    _preFlipContent = _preFlipMessages[random.nextInt(_preFlipMessages.length)];
  }

  void _playGame() {
    if (!_canPlay || !mounted) return;
    
    final random = Random();
    setState(() {
      _canPlay = false;
      // Select a random fortune
      _fortune = _fortunes[random.nextInt(_fortunes.length)];
      // _preFlipContent is not cleared here, AnimatedSwitcher will handle the transition
    });
    
    _animationController.forward(from: 0.0).then((_) {
      // Reset animation for next time or a subtle idle animation
       if (mounted) _animationController.reverse();
    });
    
    // In a real app, save today's date to SharedPreferences
    // SharedPreferences.getInstance().then((prefs) => prefs.setString('lastFortuneDate', DateTime.now().toIso8601String()));
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: _playGame,
          child: RotationTransition(
            turns: _rotationAnimation,
            child: ScaleTransition(
              scale: _scaleAnimation,
              child: Container(
                width: 90, // Slightly smaller coin
                height: 90,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: _canPlay 
                            ? [Colors.amber[300]!, Colors.amber[700]!] 
                            : [Colors.grey[600]!, Colors.grey[800]!], // Grey out if cannot play
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: _canPlay ? Colors.amber.withOpacity(0.6) : Colors.black.withOpacity(0.4),
                      blurRadius: 12,
                      spreadRadius: 2,
                      offset: Offset(0,2)
                    ),
                  ],
                  border: Border.all(color: _canPlay ? Colors.white.withOpacity(0.5) : Colors.grey[500]!, width: 2)
                ),
                child: Center(
                  child: Text(
                    '₹',
                    style: TextStyle(
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                      color: _canPlay ? Colors.white : Colors.white54,
                      shadows: [Shadow(color: Colors.black.withOpacity(0.3), blurRadius: 3, offset: Offset(1,1))]
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 15),
        AnimatedSwitcher(
          duration: const Duration(milliseconds: 500),
          transitionBuilder: (Widget child, Animation<double> animation) {
            return FadeTransition(opacity: animation, child: child);
          },
          child: Text(
            _fortune.isEmpty ? _preFlipContent : _fortune,
            key: ValueKey(_fortune.isEmpty ? _preFlipContent : _fortune), // Key changes with content
            textAlign: TextAlign.center,
            style: TextStyle(
              color: _fortune.isEmpty ? Colors.white.withOpacity(0.7) : Colors.amber[100],
              fontSize: 16,
              fontWeight: _fortune.isEmpty ? FontWeight.normal : FontWeight.w500,
              fontStyle: FontStyle.italic,
              height: 1.4,
            ),
          ),
        ),
      ],
    );
  }
}




