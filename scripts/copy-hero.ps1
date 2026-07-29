param(
  [string]$Source = "C:\Users\Chanuka Dinath\AppData\Local\CapCut\Videos\0729.mp4",
  [string]$Dest = "$PSScriptRoot\..\public\hero.mp4"
)

if (!(Test-Path -Path $Source)) {
  Write-Error "Source file not found: $Source"
  exit 1
}

$destDir = Split-Path -Parent $Dest
if (!(Test-Path -Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

Copy-Item -Path $Source -Destination $Dest -Force
Write-Host "Copied $Source -> $Dest"