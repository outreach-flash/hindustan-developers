# Git Workflow Guide (Custom SSH Identity)

This document provides instructions for staging, committing, and pushing changes using a custom SSH key and Git identity for this project.

---

## Quick Reference Commands

### 1. Stage Changes
Stage all modified and new files:
```bash
git add .
```

### 2. Commit with Custom Identity
Commit using the specific Git user name and email (`Bhadraksh Bhargava` / `outreach@sol4you.in`):
```bash
git -c user.name="Bhadraksh Bhargava" -c user.email="outreach@sol4you.in" commit -m "Your commit message here"
```

### 3. Push using Custom SSH Key
Push to `main` branch using the `id_ed25519_sol4you` SSH key:
```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_sol4you -o IdentitiesOnly=yes" git push origin main
```

---

## Alternative: Permanent Local Config (Recommended)

To avoid typing the identity flags for every command, configure them permanently for this local repository:

### Step 1: Set Local User Identity
```bash
git config user.name "Bhadraksh Bhargava"
git config user.email "outreach@sol4you.in"
```

### Step 2: Set Local SSH Key
```bash
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_sol4you -o IdentitiesOnly=yes"
```

### Simplified Workflow (After local config)
Once configured, standard Git commands will automatically use your custom SSH identity:
```bash
git add .
git commit -m "Your commit message here"
git push origin main
```
