$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
  $doc = $word.Documents.Open("D:\File Kerja\Template\Template GC.docx", $false, $true)
  $doc.SaveAs([ref]"D:\File Kerja\Template\_template_gc\template_reference.pdf", [ref]17)
  $doc.Close($false)
  Write-Host "PDF saved"
} finally {
  $word.Quit()
}
