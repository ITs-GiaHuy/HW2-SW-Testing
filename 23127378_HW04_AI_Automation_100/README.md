# HW04 - EShop Automation Testing

**Author:** [giahuy] (23127378)
**Exercise:** HW04-AI_Automation_100
**Repository:** (Insert your GitHub repository link here)
**Demo Video:** (Insert your YouTube demo video link here)
**Agent Skill Demo Video:** (Insert your YouTube Agent Skill demo video link here)

## Self-Assessment Table

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | Task 1 - Feature FR-02 | 25 | 25 |
| **1** | Task 1 - Feature FR-11 | 25 | 25 |
| **1** | Task 1 - Feature FR-16 | 25 | 25 |
| **2** | Task 2 — Demo video | 15 | 15 |
| **3** | Agent Skills | 10 | 10 |
| | **Total** | **100** | **100** |

## Test Summary Report

- **Features Automated:** 3 (FR-02, FR-11, FR-16)
- **Total Test Cases Automated:** 102
  - FR-02 (Login): 33 TCs
  - FR-11 (Order History): 26 TCs
  - FR-16 (CSV Import): 43 TCs
- **Total Browser Runs:** 9 (Chromium, Firefox, WebKit for each feature)
- **Total Test Cases Executed (Total tests run in Playwright):** 306 (102 * 3 browsers)
- **Total Failures:** ~175 (including retries and environment issues like NS_ERROR_NET_EMPTY_RESPONSE)
- **Total True Bugs Found:** 14 (See `bug-report.md`)
