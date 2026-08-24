# Student Association Management System

> **Source of truth note:** This file is a translated, restructured English version of the original Vietnamese source document `specification.docx`. It is intended as the primary reference for AI tools and developers going forward. The original `.docx` is preserved unchanged for audit/history purposes. All business terms in the [Glossary](#glossary--terminology-mapping) require human verification by someone fluent in the domain (a member of the Student Association), since translation of organizational/administrative terms can be ambiguous.

## 1. Overview

A management platform for **Student Sub-Associations (Chi hội sinh viên — CHSV)** under the **Student Association (Hội Sinh Viên)** of **Can Tho University**.

### Purpose
1. Let the **Executive Committee (BCH)** manage images and documents (plans, invoices, official documents) for each activity/event, organized by **term of office (nhiệm kỳ)** — improving management productivity.
2. Let **Members (Hội viên)** view organized, structured information about the sub-association they belong to.
3. Serve as a promotional space for sub-association activities, an achievement/record archive, and recognition of member contributions.

## 2. User Roles

| Role | English | Vietnamese | Description |
|---|---|---|---|
| 1 | Executive Committee | BCH (Ban Chấp Hành) | Governing/leadership body of each Student Sub-Association. Has elevated permissions (create/manage activities, members, badges, forum moderation, funds, quotas). |
| 2 | Sub-Association Member | Hội viên chi hội | A student or alumnus who is a member of a sub-association. Regular user permissions (view own data, participate in forum, etc.). |
| 3 | System Administrator | Quản trị hệ thống | Full technical/system-level administration (not detailed further in source doc — **needs clarification**). |

> ⚠️ **Needs clarification:** The source document does not specify granular permission boundaries between BCH and System Administrator, nor whether permissions differ across sub-associations (e.g., can one sub-association's BCH see another sub-association's data?). Assume **no cross-sub-association visibility** unless stated otherwise; confirm with stakeholder.

## 3. Functional Requirements

### 3.1 Personal Information Management (Quản lý thông tin cá nhân)
Applies to: all authenticated users (Member, BCH).

- View / update personal profile information.
- View list of activities the user has participated in.
- View questions/posts (forum content) the user has created.
- View badges (huy hiệu) earned.

### 3.2 Activity / Event Management (Quản lý hoạt động)
Applies to: primarily BCH (create/edit/delete); Members can view.

- Create / edit / delete an activity (event).
- Select an **activity type**, one of:
  - Volunteer activity (hoạt động tình nguyện)
  - Organizational activity (hoạt động tổ chức)
  - Regular meeting (họp lệ)
  - Experience-sharing session (chia sẻ kinh nghiệm)
- Attach activity images.
- Attach organizational documents (plan, budget estimate, etc.) — **visible to BCH only**.

### 3.3 Member Management (Quản lý hội viên)
Applies to: BCH.

- View list of members.
- View a member's activity history (activities participated in).
- Sort the member list by number of activities participated in (members with more participation ranked higher).
- Mark a member as a **core/key member** ("hội viên nòng cốt").
- Award badges/medals to members — informal/morale-boosting recognition, performed by BCH.

### 3.4 Achievement Management (Quản lý thành tích)
Applies to: BCH.

**Badges (Huy hiệu):**
- BCH creates a new badge type (example given in source: "Hội viên tiêu biểu T10" — "Outstanding Member, October").
- Assign a badge to a member.
- Remove a badge from a member.

### 3.5 Feedback Management (Quản lý ý kiến đóng góp, phản hồi)
Applies to: all authenticated users (submitting); BCH (presumably reviewing — **not explicit in source, needs clarification**).

- Create a piece of feedback/suggestion.
- Select a topic/category for the feedback.
- Enter feedback content (free text).

> ⚠️ **Needs clarification:** Source doc doesn't state who reviews/responds to feedback, or whether there's a status workflow (e.g., open/resolved).

### 3.6 Forum Management (Quản lý diễn đàn)
Applies to: all authenticated users (posting/commenting); BCH (moderation).

- Create a question/post.
- Post topics can include: sub-association activities, university-wide activities, student life, etc. (open-ended list per source).
- Any logged-in user can comment on posts.
- BCH can moderate: approve a post for publishing, hide a post, or delete a post.

### 3.7 Utilities (Tiện ích)

**Sub-association info page:**
- Introduction, slogan, recurring/annual activities.
- Total member count.
- Current BCH roster.
- Contact information.

**Quota tracking (Kiểm tra chỉ tiêu)** — *BCH only*:
- Number of quotas/targets completed, based on activities organized, shown as a percentage or similar metric.
- ⚠️ **Needs clarification:** What defines a "quota" (chỉ tiêu)? Likely an annual target number of activities set by the higher-level Student Association — needs confirmation on source/unit of these targets.

**Fund tracking (Kiểm tra quỹ)** — *BCH only*:
- Starting fund balance for the new term of office.
- Fund spent, broken down per activity.
- Remaining fund balance.

**Document/print generation (Tạo bản in)** — *BCH only*:
- Select a document template (plan, budget proposal, official document/văn kiện, etc.).
- Fill in required information.
- Export as a **Word** or **PDF** file.

## 4. Non-Functional Requirements

- **Ease of use:** the system should be intuitive/easy to use.
- **Visual style:** youthful, eye-catching UI, aligned with Can Tho University's visual identity/branding.
- **Responsive design:** must support both desktop and mobile screen sizes.

## 5. Open Questions / Ambiguities

These items were unclear or underspecified in the original document and should be confirmed with the stakeholder (Student Association representative) before implementation:

1. Exact permission model — what exactly can each role (BCH, Member, System Admin) do vs. not do, especially edge cases (e.g., can a Member edit their own submitted activity? Can BCH from Sub-Association A see Sub-Association B's data?).
2. Feedback workflow — is there a response/resolution process, and who owns it?
3. Definition and data source of "quota" (chỉ tiêu) — set by whom, over what time period, measured how?
4. Forum post approval — is pre-approval required before a post is publicly visible, or is moderation after-the-fact (hide/delete only)?
5. Term of office (nhiệm kỳ) data model — how activities/data are partitioned across terms, and what happens to historical data when a new term starts (e.g., does BCH roster/permissions roll over?).
6. Badge/medal system — is this purely cosmetic/gamification, or tied to any tangible benefit?
7. Branding assets — no specific Can Tho University brand guidelines (colors, logos, fonts) were included in the source document.

## 6. Glossary / Terminology Mapping

> **⚠️ Human verification required.** These are business/domain terms translated from Vietnamese. A native-speaking stakeholder familiar with Vietnamese student-association structures should confirm accuracy before these terms are used as canonical naming in code, database schemas, or UI copy.

| English Term | Vietnamese Term | Notes |
|---|---|---|
| Student Association | Hội Sinh Viên | The top-level/parent organization at Can Tho University. |
| Student Sub-Association | Chi hội sinh viên (CHSV) | A sub-unit/chapter under the Student Association. |
| Executive Committee | Ban Chấp Hành (BCH) | Leadership/management body of each sub-association. |
| Member / Sub-Association Member | Hội viên (chi hội) | Regular member — current student or alumnus. |
| Term of office | Nhiệm kỳ | The time period (e.g., academic year or committee term) that activity data is partitioned by. |
| Core member / Key member | Hội viên nòng cốt | A member flagged as especially active/central. |
| Activity / Event | Hoạt động | Generic term for an organized event. |
| Volunteer activity | Hoạt động tình nguyện | One of four activity type categories. |
| Organizational activity | Hoạt động tổ chức | One of four activity type categories. |
| Regular meeting | Họp lệ | One of four activity type categories — routine/periodic meeting. |
| Experience-sharing session | Chia sẻ kinh nghiệm | One of four activity type categories. |
| Badge | Huy hiệu | Digital recognition/achievement marker, e.g. "Outstanding Member, October." |
| Medal | Huy chương | Similar to badge — informal recognition award. |
| Feedback / Contribution / Suggestion | Ý kiến đóng góp, phản hồi | Combined term in source — may represent one or two distinct concepts (suggestion vs. response) — **needs clarification**. |
| Forum | Diễn đàn | Discussion/posting area within the system. |
| Post / Question | Câu hỏi (bài viết) | Source uses "câu hỏi" (question) and "bài viết" (post) interchangeably. |
| Quota / Target | Chỉ tiêu | Performance target, likely tied to number of activities organized per term. |
| Fund | Quỹ | The sub-association's financial account/balance. |
| Document template / Print template | Mẫu tài liệu / Bản in | Templates for generating official documents (plans, budgets, official records). |
| Plan | Kế hoạch | Document type — activity planning document. |
| Budget estimate | Dự trù kinh phí | Document type — cost estimation document. |
| Official document / Record | Văn kiện | Document type — formal/official organizational document. |
| System Administrator | Quản trị hệ thống | Technical administrator role. |
| Can Tho University | Đại học Cần Thơ | The university this Student Association belongs to. |

## 7. Source Document

- Original file: `specification.docx` (Vietnamese, unmodified, retained as historical source of truth for the original wording).
- This file (`specification.md`) supersedes it as the working reference for development going forward. Any discrepancy between the two should be resolved by re-consulting the original `.docx` and updating this file accordingly.
