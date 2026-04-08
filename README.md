
# Recoflect: Financial Tracking with Emotional Reflection 📊🧠

**Recoflect** is a financial management application designed to help users track their income and expenses while connecting their financial habits to their emotional well-being. By allowing users to reflect on how they feel about each transaction, the app provides deeper insights into spending patterns beyond just the numbers. 💰✨

---

### 🤝 Team Members
* **Azhibek Darkhan**
* **Azimberdiyev Yemelzhan**
* **Tolegen Yersaiyn**

### 🛠️ Tech Stack
* **Frontend:** Angular (using Signals, Standalone Components, and RxJS) 🅰️
* **Backend:** Django 🎸
* **Authentication:** JWT (JSON Web Tokens) with custom HTTP Interceptors 🔐
* **AI Engine:** Integrated LLM for behavioral sentiment analysis 🤖

---

### 🚀 Key Features

#### 1. Home Dashboard 🏠
The landing page provides a high-level summary of the user's current financial status.
* **Current Records:** Displays a summary of income, expenses, and net balance for the current period. 💵
* **Weekly Limit:** A visual progress bar showing how much of the weekly budget has been consumed. ⏳
* **Goal Overview:** A quick look at the progress of the user's primary financial goals. 🎯

#### 2. Expense Management 💸
Users can track their spending with an added layer of psychological reflection.
* **Expense Tracking:** Grid view of all expenses with options to edit or delete. 📋
* **New Expense Form:** * **Category:** Selection from a predefined list (Essentials, Entertainment, etc.). 🏷️
    * **Money Spent:** Numerical input for the amount. 💳
    * **Date:** Optional field (defaults to the current day). 📅
    * **Reflection:** An emotional tag (**Satisfied**, **Unsatisfied**, or **Neutral**) to record feelings regarding the purchase. 😊😐☹️

#### 3. Goal Setting 🏆
A dedicated space to plan for future milestones.
* **Goal Grid:** Displays active goals with visual progress bars indicating completion percentage. 📈
* **New Goal Form:**
    * **Goal Title:** Description of the objective (e.g., "New MacBook"). 🚗
    * **Deadline:** The target date for completion. 🏁
    * **Importance:** Priority levels (**Major**, **Normal**, **Minor**). ⭐

#### 4. User Profile & Security 👤
* **Detailed Analytics:** The Profile page offers a more granular look at the data summarized on the Home page. 🔍
* **Authentication:** Secure login and logout functionality powered by JWT. An HTTP interceptor handles the inclusion of tokens in API requests. 🛡️

#### 5. AI-Powered Emotional Analysis 🧠✨
Recoflect uses Artificial Intelligence to decode your relationship with money.
* **Behavioral Trends:** The AI analyzes the frequency of Happy, Neutral, and Regret reflections to identify if you are prone to "impulse regret."
* **Actionable Advice:** Every analysis concludes with 3-4 sentences of tailored advice to reduce financial stress and increase "joy-per-tenge."
* **Seamless Integration:** With a single click, the backend processes reflection history and returns insights directly to your dashboard.

#### 6. Family Collaboration 👨‍👩‍👧‍👦💰
A centralized hub for managing household finances together through a hierarchical structure.
* **Role-Based Access:** * **Parents:** Act as administrators. They can create a family, generate a **6-character invite code**, add children by username, and set spending limits.
    * **Children:** Can join via code to track their own transactions, but their "Weekly Limit" is managed exclusively by parents to encourage disciplined spending.
* **Family Dashboard:** A split-view interface displaying separate grids for Parents and Children. Each member's card shows their weekly income, expenses, and net balance.
* **The Collective Goal:** A specialized financial target that tracks the combined **Net Balances of Parents only**, allowing for family planning without affecting a child's personal savings.
* **Parental Earnings Tab:** A private analytics view for parents to track their combined household income and plan for long-term investments.

#### 7. AI Parental Guidance 🛡️🧠
A specialized AI layer designed to help parents mentor their children's financial habits.
* **Pattern Detection:** Parents can trigger an AI analysis specifically for a child’s record. The AI scans the child's reflection tags to find hidden trends (e.g., "Your child feels 'Unsatisfied' with 70% of gaming purchases").
* **Parental Advice:** The AI generates 3-4 sentences of guidance, providing a script or talking points to help parents discuss financial literacy and emotional spending with their child.

---

### 🗺️ Project Structure & Navigation

The application utilizes Angular's routing module to navigate between the following pages:
* **Home:** General overview, quick-action buttons, and personal AI insight triggers.
* **Records:** History of all income and expenses.
* **Goals:** Management and tracking of personal financial targets.
* **Family:** Team management, member statistics, and common household goals.
* **Profile:** Detailed user information and statistics.
* **About Us:** Information regarding the project and team.
* **Contacts:** Support and contact information.

---

### 🔌 API Integration

The application interacts with the Django backend through several key triggers:
1. **"all expenses"**: Fetches transaction history and redirects to the Records page.
2. **"all goals"**: Retrieves all active goals and redirects to the Goals page.
3. **"add expense/goal"**: Triggers POST requests to save new records.
4. **"get AI analysis"**: Sends reflection data to the AI engine for personal or parental behavioral reports.
5. **"family management"**: Handles family creation, joining via 6-symbol codes, and parental limit setting.
6. **"profile"**: Calls multiple data APIs during `ngOnInit()` to populate detailed views.


### 🔐 Authentication Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/auth/register/ | Create a new user account. |
| POST | /api/auth/login/ | Obtain JWT Access and Refresh tokens. |
| POST | /api/auth/logout/ | Blacklist the refresh token (if using `rest_framework_simplejwt`). |

---

### 💸 Records (Expenses & Income) Endpoints
*Mapped to your Record model.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/records/ | Get all records for the logged-in user (triggers **"all expenses"**). |
| POST | /api/records/ | Create a new record (triggers "add expense" form submission). |
| GET | /api/records/<uuid> | Fetch details of a single record. |
| PUT/PATCH | /api/records/<uuid> | Edit an existing expense. |
| DELETE | /api/records/<uuid> | Delete an expense. |

---

### 🎯 Goals Endpoints
*Mapped to your Goal model.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/goals/ | List all user goals (triggers "all goals" redirect). |
| POST | /api/goals/ | Create a new goal (triggers "add goal" form submission). |
| GET | /api/goals/<uuid> | Fetch details for a specific goal. |
| PUT/PATCH | /api/goals/<uuid> | Edit goal title, deadline, or amount. |
| DELETE | /api/goals/<uuid> | Delete a goal. |

---

### 📊 Dashboard & Analytics Endpoints
*Mapped to BudgetPeriod and User models. These are typically called in ngOnInit().*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/profile/summary/ | Returns username, net balance, and brief stats for Profile/Home pages. |
| GET | /api/budget/current/ | Fetches the active BudgetPeriod to calculate "This week's limit" bar. |
| GET | /api/categories/ | Returns the list of categories for the NewExpense dropdown. |

---

### 🧠 AI Analysis Endpoint
*This is a custom action that doesn't map directly to a CRUD model but uses Record data.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/analysis/generate/ | Aggregates reflections (Happy/Neutral/Regret) and returns the AI advice. |

---

#### 👨‍👩‍👧‍👦 Family Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/family/create/ | Parent creates a family; returns a 6-symbol invite code. |
| POST | /api/family/join/ | User joins a family using the alphanumeric code. |
| POST | /api/family/add-member/ | Parent adds a child/parent directly by username. |
| GET | /api/family/details/ | Fetches the full list of members, roles, and weekly stats. |
| DELETE | /api/family/members/<uuid> | Parent removes a member from the family. |

#### 🎯 Family Goals & Limits
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/family/goal/ | Create a goal that calculates progress from Parental Net Only. |
| PATCH | /api/family/set-limit/<child_uuid>/ | Parent updates a child's BudgetPeriod limit. |

#### 🧠 Family AI Insights
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/analysis/child/<child_uuid>/ | Generates AI advice for a parent based on a child's reflection data. |
