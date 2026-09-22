-----------------------------------
USER REGISTRATION & ONBOARDING
-----------------------------------

Create a beautiful, multi-step dating profile registration experience.

The registration process should feel simple, modern, friendly, and mobile-first.

Do NOT put all fields on one screen.

Use a 5-step onboarding flow with:
- Progress indicator
- Back button
- Continue button
- Skip button for optional fields
- Form validation
- Smooth Framer Motion page transitions
- Auto-save onboarding progress
- Clear error messages
- Loading states
- Success animation

-----------------------------------
STEP 1 — CREATE ACCOUNT
-----------------------------------

Title:
“Let’s get you started.”

Fields:

- Full Name
- Email Address
- Password
- Confirm Password
- Date of Birth

Requirements:

- Email must be valid
- Password must meet minimum security requirements
- Password confirmation must match
- User must be 18 years or older
- Show password strength indicator
- Show/hide password button
- Accept Terms of Service
- Accept Privacy Policy

Optional:
- Continue with Google

Button:
“Create Account”

After successful registration:
Automatically continue to Step 2.

-----------------------------------
STEP 2 — ABOUT YOU
-----------------------------------

Title:
“Tell us a little about yourself.”

Fields:

Gender:
- Male
- Female
- Non-binary
- Prefer not to say

Location:
- City
- Country

Do NOT expose exact GPS coordinates publicly.

Allow location permission for distance-based matching, but only display approximate distance to other users.

Profile Photos:

- Upload 2–6 photos
- First photo becomes the primary profile photo
- Drag to reorder photos
- Delete photo
- Set primary photo
- Image preview
- Upload progress
- File validation

Bio:

“Tell people what makes you, you.”

Allow a short bio with a character limit.

Languages:
Allow selecting multiple languages.

-----------------------------------
STEP 3 — INTERESTS & PERSONALITY
-----------------------------------

Title:
“What are you into?”

Create attractive selectable interest chips.

Categories:

Travel
Music
Movies
Books
Gaming
Food
Photography
Fitness
Sports
Technology
Art
Fashion
Cooking
Nature
Dancing
Writing
Coffee
Pets
Adventure
Reading

Allow multiple selections.

Show:

“Choose at least 5 interests.”

Add personality questions.

Example:

“My ideal weekend is...”

Options:
- Relaxing at home
- Exploring the city
- Traveling
- Going out with friends
- Trying something new

“I’m usually...”

- Introverted
- Somewhere in between
- Extroverted

“People would describe me as...”

- Curious
- Funny
- Calm
- Adventurous
- Creative
- Ambitious
- Caring
- Social

Make these questions optional but visually engaging.

-----------------------------------
STEP 4 — DATING PREFERENCES
-----------------------------------

Title:
“Who are you looking for?”

Interested in:

- Men
- Women
- Everyone

Relationship goal:

- Long-term relationship
- Short-term relationship
- Casual dating
- Friendship
- Still figuring it out

Preferred age:

Use a dual range slider.

Example:
22 — 30

Preferred distance:

- 5 km
- 10 km
- 25 km
- 50 km
- 100 km+

Add:

“Show people within my preferred distance.”

Lifestyle preferences can be optional:

Smoking:
- Never
- Sometimes
- Regularly
- No preference

Drinking:
- Never
- Sometimes
- Regularly
- No preference

Pets:
- Have pets
- Love pets
- Not interested
- No preference

Education:
Optional

Profession:
Optional

Do not make optional lifestyle fields required.

-----------------------------------
STEP 5 — PROFILE PREVIEW
-----------------------------------

Title:

“Your profile is ready.”

Show a beautiful live profile preview exactly as it will appear in Discover.

Display:

Profile photo
Name
Age
Location
Bio
Interests
Relationship goal
Languages

Example:

Sarah
24 · Kolkata

“Weekend traveler, coffee lover and amateur photographer.”

[Travel] [Coffee] [Photography] [Music]

92% potential compatibility

Add buttons:

“Edit Profile”
“Complete Profile”

Primary CTA:

“Start Discovering →”

After clicking:

Navigate to the Discover page.

-----------------------------------
PROFILE COMPLETION
-----------------------------------

Calculate a profile completion percentage.

Example:

Profile strength
85%

✓ Profile photo
✓ Basic information
✓ Bio
✓ Interests
✓ Dating preferences
○ Add another photo

Show profile completion inside the Profile page.

-----------------------------------
VALIDATION
-----------------------------------

Implement proper validation for:

- Required fields
- Email format
- Password strength
- Password confirmation
- Age 18+
- Minimum interests
- Required gender selection
- Required dating preferences
- Image file type
- Image size
- Bio character limit

Display friendly inline validation messages.

Do not use browser alert().

Use modern toast notifications and inline messages.

-----------------------------------
AUTHENTICATION
-----------------------------------

Registration must connect to the backend.

Use:

- Secure password hashing
- JWT authentication
- Protected routes
- Refresh/session handling
- Email verification
- Secure authentication state

Never store plain-text passwords.

Never expose authentication secrets in frontend code.

-----------------------------------
DATABASE FIELDS
-----------------------------------

Create appropriate database models for:

USER

- id
- full_name
- email
- password_hash
- date_of_birth
- gender
- role
- status
- email_verified
- created_at
- updated_at

PROFILE

- id
- user_id
- bio
- city
- country
- latitude
- longitude
- primary_photo
- profile_completion
- relationship_goal

PROFILE_PHOTOS

- id
- user_id
- image_url
- position
- is_primary
- created_at

INTERESTS

- id
- name
- category

USER_INTERESTS

- user_id
- interest_id

PREFERENCES

- user_id
- interested_in
- min_age
- max_age
- max_distance

LIFESTYLE

- user_id
- smoking
- drinking
- pets
- education
- profession

PERSONALITY

- user_id
- introvert_extrovert
- weekend_preference
- personality_traits

LANGUAGES

- id
- name

USER_LANGUAGES

- user_id
- language_id

-----------------------------------
UI/UX
-----------------------------------

The onboarding screen should feel like a premium dating application.

Use:

- Full-screen layout
- Large typography
- Beautiful profile imagery
- Gradient background
- Glassmorphism cards
- Rounded controls
- Animated progress indicator
- Smooth transitions
- Framer Motion
- ReactBits effects where appropriate

Use a progress indicator:

01 Account
02 About You
03 Interests
04 Preferences
05 Profile

On mobile:
- Full-screen onboarding
- Large touch targets
- Sticky Continue button
- Bottom-sheet style selectors where appropriate
- Swipe-friendly interest chips
- Responsive photo uploader

Make the entire registration experience feel quick and enjoyable rather than like a long form.

IMPORTANT:
Only collect information that is necessary or useful for dating/profile matching. Keep sensitive or optional information optional and clearly explain why it is requested.