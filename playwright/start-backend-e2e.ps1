$ErrorActionPreference = 'Stop'

$storefrontRoot = Split-Path -Parent $PSScriptRoot
$workspaceRoot = Split-Path -Parent $storefrontRoot
$backendRoot = Join-Path $workspaceRoot 'clockwork-tyres-backend'
$databasePath = Join-Path $backendRoot 'database\e2e.sqlite'

if (-not (Test-Path $databasePath)) {
    New-Item -ItemType File -Path $databasePath | Out-Null
}

$env:APP_ENV = 'testing'
$env:APP_URL = 'http://127.0.0.1:8001'
$env:DB_CONNECTION = 'sqlite'
$env:DB_DATABASE = $databasePath
$env:SESSION_DRIVER = 'file'
$env:CACHE_STORE = 'file'
$env:QUEUE_CONNECTION = 'sync'
$env:MAIL_MAILER = 'array'
$env:FILESYSTEM_DISK = 'local'
$env:LOG_CHANNEL = 'single'
$env:APP_DEBUG = 'true'

Push-Location $backendRoot

php artisan migrate:fresh --seed --force

if ($LASTEXITCODE -ne 0) {
    Pop-Location
    exit $LASTEXITCODE
}

php artisan serve --host=127.0.0.1 --port=8001
