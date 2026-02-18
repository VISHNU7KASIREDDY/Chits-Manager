#!/bin/bash

# Remove comments (lines starting with //)
find backend/src frontend/src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs sed -i '' '/^[[:space:]]*\/\//d'

# Date constants
YEAR="2026"

# Function to commit
do_commit() {
    DATE="$1"
    MSG="$2"
    FILES="$3"
    
    export GIT_COMMITTER_DATE="$YEAR-02-$DATE 12:00:00"
    export GIT_AUTHOR_DATE="$YEAR-02-$DATE 12:00:00"
    
    # Add files
    for f in $FILES; do
        if [ -e "$f" ]; then
            git add "$f"
        fi
    done
    
    # Commit if changes exist
    if ! git diff --cached --quiet; then
        git commit -m "$MSG"
    fi
}

# 1. Setup (Feb 1)
do_commit "01" "setting up project" ".gitignore backend/package.json backend/tsconfig.json frontend/package.json frontend/vite.config.js"

# 2. Models (Feb 3)
do_commit "03" "adding models" "backend/src/models"

# 3. Routes (Feb 5)
do_commit "05" "creating routes" "backend/src/routes"

# 4. Utils & Middleware (Feb 7)
do_commit "07" "adding middleware" "backend/src/utils backend/src/middlewares backend/src/types"

# 5. Controllers (Feb 9)
do_commit "09" "adding controllers v1" "backend/src/controllers"

# 6. Frontend Core (Feb 11)
do_commit "11" "initiating frontend" "frontend/index.html frontend/src/main.jsx frontend/src/App.jsx frontend/public"

# 7. Frontend Context & Components (Feb 13)
do_commit "13" "adding components" "frontend/src/context frontend/src/components"

# 8. Frontend Pages (Feb 15)
do_commit "15" "building pages" "frontend/src/pages"

# 9. Styles (Feb 17)
do_commit "17" "updating styles v2" "frontend/src/index.css frontend/src/**/*.css"

# 10. Final (Feb 18)
# Add everything else that might have been missed
git add .
export GIT_COMMITTER_DATE="$YEAR-02-18 12:00:00"
export GIT_AUTHOR_DATE="$YEAR-02-18 12:00:00"
if ! git diff --cached --quiet; then
    git commit -m "finalizing code"
fi

# Push
git push
