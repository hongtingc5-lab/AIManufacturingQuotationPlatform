# 编辑目录 → 上推目录同步（勿在编辑目录里 git 操作）
# 编辑：D:\zhizao\zhizao\react\marketing-react
# 上推：D:\zhizao\zhizao\react\marketing-react-main  （仓库根目录 = React 工程，不含其它栏目）

$ErrorActionPreference = "Stop"
$Edit = "D:\zhizao\zhizao\react\marketing-react"
$PushRoot = "D:\zhizao\zhizao\react\marketing-react-main"
$Proxy = "http://127.0.0.1:7897"
$Branch = "feat/marketing-react"

if (-not (Test-Path (Join-Path $PushRoot ".git"))) {
  throw "上推目录不是 git 仓库：$PushRoot"
}

robocopy $Edit $PushRoot /E /IS /XD node_modules dist .git .vite __pycache__ /XF *.local /NFL /NDL /NJH /NJS /nc /ns /np
if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }

Set-Location $PushRoot
git checkout $Branch 2>$null
if ($LASTEXITCODE -ne 0) { git checkout -b $Branch }

git status -sb
Write-Host ""
Write-Host "接下来手动执行（确认 diff 后）："
Write-Host "  git add --all"
Write-Host "  git commit -m `"your message`""
Write-Host "  git -c http.proxy=$Proxy -c https.proxy=$Proxy push -u origin $Branch"
