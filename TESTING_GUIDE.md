# Testing Guide

## 🧪 Complete Testing Workflow

### Initial Setup (First Time)

1. **Start the Application**
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:5173`

2. **Setup Admin Account**
   - Navigate to `/admin` or click "Admin Portal"
   - Create admin password: `teacher123` (or your choice)
   - Click "Create Admin Account"

3. **Generate Test Student IDs**
   - Click "Generate Student ID"
   - Create students for each year level:

   **Year 3 Student:**
   - Name: Alice Thompson
   - Year: 3
   - Generated ID: e.g., `STU-Y3-A1B2`

   **Year 5 Student:**
   - Name: Bob Wilson
   - Year: 5
   - Generated ID: e.g., `STU-Y5-C3D4`

   **Year 7 Student:**
   - Name: Charlie Davis
   - Year: 7
   - Generated ID: e.g., `STU-Y7-E5F6`

   ⚠️ **Save these IDs!** You'll need them for student testing.

---

## 📝 Test Scenarios

### Test 1: Admin Portal Functionality

**Objective**: Verify admin can manage students

Steps:
1. Login to admin with password
2. Generate 3 student IDs (one per year level)
3. Verify IDs appear in student table
4. Check student status shows "active"
5. Export data as JSON
6. Deactivate a student
7. Verify deactivated student can't login
8. Reactivate student
9. Delete a student (create a test one first)
10. Verify deleted student is removed

**Expected Results**:
- ✅ All student operations work correctly
- ✅ Analytics update after students take tests
- ✅ JSON export contains all data

---

### Test 2: Student Login and Dashboard

**Objective**: Verify student authentication and dashboard display

Steps:
1. Logout from admin
2. Go to home page
3. Try invalid Student ID → Should show error
4. Try inactive Student ID → Should show error
5. Login with valid active Student ID
6. Verify dashboard shows:
   - Welcome message with student name
   - Tests Completed: 0
   - Average Score: N/A
   - Welcome message for first-time users
7. Logout and re-login → Should remember progress

**Expected Results**:
- ✅ Validation works correctly
- ✅ Dashboard displays student info
- ✅ Session persists across page refreshes

---

### Test 3: Full Mock Test - Year 3

**Objective**: Complete a full test for Year 3

Steps:
1. Login as Year 3 student
2. Click "Full Mock Test"
3. Verify:
   - 35 questions loaded
   - Timer shows 45:00
   - No calculator button (Year 3 doesn't get calculator)
4. Answer mix of questions:
   - Some numeric answers
   - Some multiple choice
5. Test navigation:
   - Click "Next" button
   - Click "Previous" button
   - Click question numbers to jump
6. Verify question navigator shows:
   - Current question highlighted
   - Answered questions marked with ✓
7. Leave some questions unanswered
8. Click "Submit Test"
9. Verify warning about unanswered questions
10. Confirm submission

**Expected Results**:
- ✅ Timer counts down correctly
- ✅ All 35 questions unique
- ✅ Navigation works smoothly
- ✅ Answers are saved

---

### Test 4: Results Page

**Objective**: Verify detailed results display

After submitting test from Test 3:

1. Verify results page shows:
   - Overall score (X/35)
   - Percentage
   - Band score (1-6 for Year 3)
   - Time taken
2. Check Topic Breakdown:
   - Each topic shows correct/total
   - Progress bars display
   - Color coding matches performance
3. Test filters:
   - Click "All" → Shows all 35 questions
   - Click "Correct" → Shows only correct answers
   - Click "Incorrect" → Shows only wrong answers
4. Expand/collapse questions:
   - Click "Expand All"
   - Click "Collapse All"
   - Click individual questions
5. Verify each question shows:
   - Original question text
   - Your answer
   - Correct answer (if wrong)
   - Correct/Incorrect indicator
   - Topic name
6. Click "Return to Dashboard"

**Expected Results**:
- ✅ All data displays correctly
- ✅ Filters work
- ✅ Color coding is appropriate
- ✅ Navigation works

---

### Test 5: Progress Tracking

**Objective**: Verify dashboard updates after tests

After completing one test:

1. Check dashboard shows:
   - Tests Completed: 1
   - Average Score: (your percentage)
   - Current Band: (your band)
   - Topic Performance with bars
   - Recent Tests section
2. Click on recent test → Navigate to results

**Expected Results**:
- ✅ Dashboard updates with test data
- ✅ Statistics are accurate
- ✅ Topic performance calculated correctly

---

### Test 6: Focus Mode Unlock

**Objective**: Verify Focus Mode unlocks after 3 tests

Steps:
1. Login as same student
2. Verify Focus Mode shows "🔒 Locked"
3. Complete 2nd full test
4. Check Focus Mode still locked
5. Complete 3rd full test
6. Verify Focus Mode shows "✓ Unlocked!"
7. Check weak topics are listed (< 70%)
8. Click on a weak topic
9. Verify:
   - 10 questions about that topic
   - 15-minute timer
   - All questions relevant to chosen topic
10. Complete focus test
11. Verify results show "Focus: [Topic Name]"

**Expected Results**:
- ✅ Focus mode locked until 3 tests completed
- ✅ Weak topics identified correctly
- ✅ Focus test generates relevant questions
- ✅ Timer set to 15 minutes

---

### Test 7: Year 7 Calculator

**Objective**: Verify calculator appears for Year 7

Steps:
1. Login as Year 7 student
2. Start Full Mock Test
3. Verify:
   - 48 questions
   - 60-minute timer
4. Answer questions 1-8
5. Verify NO calculator button on Q1-Q8
6. Go to Question 9
7. Verify calculator button appears
8. Click "Calculator"
9. Test calculator operations:
   - Addition: 123 + 456
   - Subtraction: 999 - 234
   - Multiplication: 12 × 34
   - Division: 100 ÷ 5
   - Decimal: 3.14 + 2.86
10. Verify "Clear" button works
11. Close calculator
12. Calculator button remains available on Q9+

**Expected Results**:
- ✅ Calculator only appears from Q9 onwards
- ✅ All operations work correctly
- ✅ Calculator modal can be closed and reopened

---

### Test 8: Timer Expiration

**Objective**: Verify auto-submit when timer expires

Steps:
1. Login as any student
2. Start test
3. Change timer in browser DevTools (optional):
   - Open React DevTools
   - Find Timer component
   - Modify timeLeft to 10 seconds
4. Wait for timer to reach 0:00
5. Verify:
   - Alert shows "Time is up!"
   - Test auto-submits
   - Results page loads

**Alternative** (without DevTools):
- Start test, minimize browser
- Come back after time limit
- Should auto-submit

**Expected Results**:
- ✅ Timer reaches 0:00
- ✅ Auto-submit triggers
- ✅ Results show partial completion

---

### Test 9: Resume Test Feature

**Objective**: Verify test can be resumed after closing browser

Steps:
1. Login as student
2. Start test
3. Answer 5 questions
4. Close browser tab (don't submit)
5. Reopen app
6. Login as same student
7. Click "Full Mock Test"
8. Verify:
   - Resume from Question 6 (where you left off)
   - Previous answers are still there
   - Timer continues from where it was
9. Continue and complete test

**Expected Results**:
- ✅ Test resumes automatically
- ✅ Answers are preserved
- ✅ Progress saved

---

### Test 10: Reset Progress

**Objective**: Verify reset functionality

Steps:
1. Login as student with test history
2. Click "Reset Progress" button
3. Verify confirmation dialog
4. Confirm reset
5. Verify:
   - Tests Completed: 0
   - No topic performance
   - No recent tests
   - Focus mode locked again
6. Student can start fresh test

**Expected Results**:
- ✅ Confirmation required
- ✅ All data cleared
- ✅ Student record preserved (ID and name)
- ✅ Can take new tests

---

## 🎯 Quick Test Checklist

Use this for rapid testing:

**Admin Portal:**
- [ ] Create admin password
- [ ] Generate student IDs
- [ ] View student list
- [ ] Deactivate/activate student
- [ ] Delete student
- [ ] Export data

**Student Portal:**
- [ ] Login validation
- [ ] Dashboard displays correctly
- [ ] Start full test
- [ ] Answer numeric questions
- [ ] Answer multiple choice
- [ ] Navigate between questions
- [ ] Submit test
- [ ] View results
- [ ] Filter results (all/correct/incorrect)
- [ ] Return to dashboard

**Year-Specific:**
- [ ] Year 3: 35 questions, 45 min, no calculator
- [ ] Year 5: 40 questions, 50 min, no calculator
- [ ] Year 7: 48 questions, 60 min, calculator from Q9

**Advanced Features:**
- [ ] Focus mode unlocks after 3 tests
- [ ] Weak topics identified
- [ ] Focus test generates 10 questions
- [ ] Progress tracking accurate
- [ ] Improvement calculation works
- [ ] Band scores calculated correctly

**Timer:**
- [ ] Counts down correctly
- [ ] Changes color at 5 min (yellow)
- [ ] Changes color at 1 min (red, pulsing)
- [ ] Auto-submits at 0:00

**Data Persistence:**
- [ ] Test resume works
- [ ] Progress saves across sessions
- [ ] Multiple students independent
- [ ] Admin data persists

---

## 🐛 Known Behaviors

**By Design:**
- Data stored in browser localStorage (not server)
- Clearing browser data deletes everything
- Each browser/device has separate data
- No cross-device sync
- Admin password stored as base64 (not production-grade security)

---

## 📊 Performance Benchmarks

Expected performance:
- Page load: < 2 seconds
- Test generation: < 1 second
- Navigation: Instant
- Calculator: Instant
- Build size: ~325 KB (gzipped ~95 KB)

---

## 🎓 Sample Test Workflow

**Complete Teacher Workflow (20 minutes):**

1. Setup admin (2 min)
2. Generate 5 student IDs (3 min)
3. Login as Year 3 student (1 min)
4. Complete full test (10 min)
5. Review results (2 min)
6. Check dashboard updates (1 min)
7. Test Year 7 calculator (1 min)

---

**Happy Testing! 🚀**

For issues or questions, refer to README.md or DEPLOYMENT.md
