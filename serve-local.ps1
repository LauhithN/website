param(
    [int]$Port = 4173,
    [string]$Root = (Get-Location).Path,
    [string]$LogPath = "serve-local.log"
)

$ErrorActionPreference = 'Stop'

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    Add-Content -Path $LogPath -Value "[$timestamp] $Message"
}

try {
    if (-not (Test-Path $Root -PathType Container)) {
        throw "Root path not found: $Root"
    }

    "" | Set-Content -Path $LogPath
    Write-Log "Starting server on http://localhost:$Port/ root=$Root"

    $listener = [System.Net.HttpListener]::new()
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()
    Write-Log "Listener started"

    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
        } catch {
            Write-Log "GetContext failed: $($_.Exception.Message)"
            break
        }

        try {
            $requestPath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($requestPath)) {
                $requestPath = 'index.html'
            }

            $safePath = $requestPath -replace '/', '\\'
            $fullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $safePath))
            $rootFull = [System.IO.Path]::GetFullPath($Root)

            if (-not $fullPath.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
                $context.Response.StatusCode = 403
                $context.Response.OutputStream.Close()
                Write-Log "403 $requestPath"
                continue
            }

            if (Test-Path $fullPath -PathType Container) {
                $fullPath = Join-Path $fullPath 'index.html'
            }

            if (-not (Test-Path $fullPath -PathType Leaf)) {
                $context.Response.StatusCode = 404
                $bytes = [Text.Encoding]::UTF8.GetBytes('Not Found')
                $context.Response.ContentType = 'text/plain; charset=utf-8'
                $context.Response.ContentLength64 = $bytes.Length
                $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
                $context.Response.OutputStream.Close()
                Write-Log "404 $requestPath"
                continue
            }

            $ext = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
            $contentType = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.json' { 'application/json; charset=utf-8' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                '.jpeg' { 'image/jpeg' }
                '.gif'  { 'image/gif' }
                '.svg'  { 'image/svg+xml' }
                '.pdf'  { 'application/pdf' }
                '.ico'  { 'image/x-icon' }
                default { 'application/octet-stream' }
            }

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $context.Response.StatusCode = 200
            $context.Response.ContentType = $contentType
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $context.Response.OutputStream.Close()
            Write-Log "200 $requestPath ($contentType)"
        } catch {
            Write-Log "Request failed: $($_.Exception.Message)"
            try {
                if ($context.Response -and $context.Response.OutputStream) {
                    $context.Response.StatusCode = 500
                    $bytes = [Text.Encoding]::UTF8.GetBytes('Internal Server Error')
                    $context.Response.ContentType = 'text/plain; charset=utf-8'
                    $context.Response.ContentLength64 = $bytes.Length
                    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
                    $context.Response.OutputStream.Close()
                }
            } catch {
                Write-Log "Failed sending 500: $($_.Exception.Message)"
            }
            continue
        }
    }
} catch {
    Write-Log "Fatal: $($_.Exception.Message)"
    throw
}
