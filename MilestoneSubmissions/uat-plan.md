Chorify UAT Plan

Feature 1: Create a Chore - Yeyra
User Story: As a user, I want to create chores for my household so members can complete tasks and earn points.
Acceptance Criteria:
1. Access the page using "Create Chore +" in the sidebar
2. Enter a Chore name
3. Set a completion deadline 
4. Assign reward points
5. Post the Chore

Test Case 1: Successful Creation
- Steps: Fill in all required field and click Create Chore
- Expected Result: The chore is posted to the household dashboard
- Status: in progress

Test Case 2: No Chore Name
- Steps: Fill in all required fields and Create Chore
- Expected Result: The chore is posted to the household dashboard. 
- Status: in progress

Feature 2: Chore Dashboard - Yeyra
User Story: As a household member, I want to view household chores so I can keep track of tasks.
Acceptance Criteria:
1. View chores posted by household members.
2. See all info

Test Case 1: View Chores
- Steps: Log in and open the Chore Dashboard.
- Expected Result: Household chores are displayed with details.

Feature 3: Leaderboard and Points

User Story: As a household member, I want to earn points by completing chores so I can track my progress and compare my performance with other household members.

Acceptance Criteria:
1. Users can mark available chores as completed.
2. Completing a chore awards the corresponding point value.
3. Earned points are reflected in the household leaderboard.
4. Users cannot earn points multiple times for completing the same chore.

Test case 1: Earn Points After Completing a Chore.

Preconditions: User is logged in, belongs to a household, and has an available chore assigned to them.

Test Data: (example) Chore: Clean Kitchen. Reward: 15 points. Initial user score: 0 points. Points after completion: 15 points.

User Steps: 
1. Navigate to chore dashboard
2. Locate the assigned Clean Kitchen chore
3. Mark the chore as completed
4. Navigate to the leaderboard

Expected Result:
The chore is marked as completed, the user received 15 points, and the leaderboard reflects the updated score.

Actual Result: Not Run
Status: in progress