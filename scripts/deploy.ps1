#!/usr/bin/env pwsh
# deploy.ps1 — Build, commit, and push so cPanel always ships fresh code.
#
# Usage:
#   .\scripts\deploy.ps1
#   .\scripts\deploy.ps1 -Message "My custom commit message"
#
# What it does:
#   1. Runs `npm run build` to produce a fresh .next bundle.
#   2. Stages ALL working-tree changes (source + new .next output).
#   3. Commits with a timestamped message.
#   4. Pushes to origin/main.
#
# After this, go to cPanel > Git Version Control > Manage >
# Pull or Deploy > "Update from Remote" then "Deploy HEAD Commit".

param(
    [string]$Message = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Resolve repo root (the directory containing this script's parent)
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

Write-Host "`n===> Building production bundle..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Fix errors above before deploying."
    exit 1
}

Write-Host "`n===> Staging all changes (source + .next)..." -ForegroundColor Cyan
git add .

$Status = git status --porcelain
if (-not $Status) {
    Write-Host "Nothing new to commit — live site is already up to date." -ForegroundColor Yellow
    exit 0
}

if (-not $Message) {
    $Timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm")
    $Message = "Deploy $Timestamp"
}

Write-Host "`n===> Committing: $Message" -ForegroundColor Cyan
git commit -m $Message

Write-Host "`n===> Pushing to origin/main..." -ForegroundColor Cyan
git push origin main

Write-Host "`n===> Done! Now go to cPanel > Git Version Control > Manage >" -ForegroundColor Green
Write-Host "     Pull or Deploy > 'Update from Remote' then 'Deploy HEAD Commit'." -ForegroundColor Green
