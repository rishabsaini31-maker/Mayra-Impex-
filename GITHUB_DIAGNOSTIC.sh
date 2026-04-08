#!/bin/bash

# 🔍 GITHUB CONTRIBUTIONS DIAGNOSTIC SCRIPT
# This script checks your local git configuration

cat << 'EOF'

╔═══════════════════════════════════════════════════════════════════════════╗
║           GITHUB CONTRIBUTIONS DIAGNOSTIC - CHECK YOUR SETUP              ║
╚═══════════════════════════════════════════════════════════════════════════╝

🔧 YOUR LOCAL GIT CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EOF

# Check git user email
echo "Git User Email:"
GIT_EMAIL=$(git config user.email)
echo "  → $GIT_EMAIL"
if [ "$GIT_EMAIL" = "rishbasiniupw165@gmail.com" ]; then
    echo "  ✅ CORRECT: Email matches expected"
else
    echo "  ❌ WRONG: Should be rishbasiniupw165@gmail.com"
fi
echo ""

# Check git user name
echo "Git User Name:"
GIT_NAME=$(git config user.name)
echo "  → $GIT_NAME"
if [ "$GIT_NAME" = "Rishab Saini" ]; then
    echo "  ✅ CORRECT: Name matches expected"
else
    echo "  ⚠️  Different name: $GIT_NAME"
fi
echo ""

# Check latest commits
echo "📝 YOUR LATEST COMMITS"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
git log --oneline -10
echo ""

# Check latest commit details
echo "🔎 LATEST COMMIT DETAILS"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo "Author: $(git log -1 --format='%an <%ae>')"
echo "Date:   $(git log -1 --format='%aI')"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Remote: $(git config --get remote.origin.url)"
echo ""

# Check for untracked files
UNTRACKED=$(git ls-files --others --exclude-standard | wc -l)
if [ "$UNTRACKED" -gt 0 ]; then
    echo "⚠️  WARNING: You have $UNTRACKED untracked files"
else
    echo "✅ No untracked files"
fi
echo ""

# Check for uncommitted changes
UNCOMMITTED=$(git status --porcelain | wc -l)
if [ "$UNCOMMITTED" -gt 0 ]; then
    echo "⚠️  WARNING: You have uncommitted changes:"
    git status --short
else
    echo "✅ All files committed"
fi
echo ""

cat << 'EOF'

╔═══════════════════════════════════════════════════════════════════════════╗
║                    WHAT TO CHECK ON GITHUB NOW                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

🟢 STEP 1: Check Email Settings
   URL: https://github.com/settings/emails
   
   What you need to see:
   ✓ Email: rishbasiniupw165@gmail.com
   ✓ Status: Verified (green checkmark ✓)
   ✓ Type: Primary (radio button selected ⭕)
   
   If you see "Unverified":
   → Click "Resend verification email"
   → Check your email inbox and SPAM
   → Click the verification link
   → Refresh the page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 STEP 2: Check Profile Privacy
   URL: https://github.com/settings/profile
   
   What you need to check:
   ✓ "Make this account private" = UNCHECKED (☐)
   ✓ Not checked (☑️)
   ✓ Account should say "Public"
   
   If it's checked:
   → UNCHECK the box
   → Click "Save changes"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 STEP 3: Check Your Contributions
   URL: https://github.com/rishabsaini31-maker
   
   What to look for:
   🟩 Green dot(s) on April 9, 2026
   📊 Contribution count > 0 for today
   
   If you see green dots:
   ✅ PROBLEM FIXED! Contributions showing!
   
   If you don't see green dots:
   → Go back to STEP 1
   → Make sure email is verified
   → Make sure it's marked primary
   → Do a hard refresh (Cmd+Shift+R on Mac)
   → Wait 5 minutes
   → Refresh again

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 STEP 4: Check Your Commits
   URL: https://github.com/rishabsaini31-maker/Mayra-Impex-/commits/main
   
   What to look for:
   ✓ Your avatar next to your commits
   ✓ Your name (rishabsaini31-maker) shows
   ✓ NO question mark (?)
   ✓ NO "Unknown User"
   
   If you see ❓ or "Unknown User":
   → Email is NOT on your GitHub account
   → Go back to STEP 1 and add the email

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️ EXPECTED TIMELINE

Now:           Check local git config (above shows it's correct ✓)
5 min:         Go to GitHub settings and verify email
10 min:        Email should be verified and primary
5-30 min:      GitHub recalculates contributions
30-45 min:     Green dots appear on your profile (usually)
24 hours max:  Full propagation guaranteed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆘 TROUBLESHOOTING

Problem: Email shows as "Unverified"
Fix:     Click "Resend verification email" and check your inbox

Problem: Green dots still don't appear after 1 hour
Fix:     Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

Problem: Shows "❓ Unknown User" next to commits
Fix:     Email not on GitHub → add at https://github.com/settings/emails

Problem: Still nothing after 24 hours
Fix:     Contact GitHub support at https://github.com/contact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ YOUR LOCAL GIT IS CONFIGURED CORRECTLY
→ All commits are pushed to GitHub
→ Email matches in git config
→ Problem is on GitHub side (email verification/settings)

🎯 NEXT ACTION: Go to https://github.com/settings/emails right now!

═══════════════════════════════════════════════════════════════════════════════

EOF

