Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)\s*=\s*(.*)\s*$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        Set-Item -Path "Env:$name" -Value $value
    }
}
# Load environment variables from .env file
# This script reads the .env file and sets environment variables in PowerShell