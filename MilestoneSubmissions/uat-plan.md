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

Feature 3: Leaderboard and Points - Arianna

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

Feature 4: Sidebar Menu - Cassandra H.

    User Story: As a user, I should be able to click the buttons within the sandwhich on the navigation bar and have it take me to the respective webpage/window.
        Acceptance Criteria: As a user, given the sidebar accordian menu on the left side, and when I click the "sandwhich" icon, it shows all the possible actions I can perfom.
            1. Upon opening the webpage, locate the "sandwhich" button
            2. Click the "sandwhich" button
            3. Select an option within the list of choices for redirection

                Test Case 1: Options are successfully presented
                - Steps: Click "sandwhich" icon on the navigation bar
                - Expected Result: User is presented with working buttons that redirect to different pages
                - Status: In progress

Feature 5: Sidebar Options - Cassandra H.

    User Story: As a user, when opening the sidebar menu I should be able to click an options regarding the action I want fufilled. Upon clicking an option I will be redirected to the appropriate window.
        Acceptance Criteria: As a user when I click an option I will be redirected to the respective window.
            1. Click an action presented within the sidebar
            2. Be redirected to window related to that action

                Test Case 1: Perfom an action
                - Steps: Click "sandwhich" and sidebar menu opens, choose an option you wish to
                    be presented to you
                - Expected Result: The user is taken to the window they expected/desired