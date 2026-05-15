param($path)
$ids = Select-String -Path $path -Pattern "id: '(.*?)'" | ForEach-Object { $_.Matches.Groups[1].Value }
$dupes = $ids | Group-Object | Where-Object { $_.Count -gt 1 }
if ($dupes) {
    $dupes | ForEach-Object { Write-Output ('Duplicate: ' + $_.Name + ' Count: ' + $_.Count) }
} else {
    Write-Output ('No duplicate IDs. Total: ' + $ids.Count + ', Unique: ' + ($ids | Sort-Object -Unique).Count)
}
