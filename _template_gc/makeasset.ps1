$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('d:\File Kerja\Template\_template_gc\word\media\image2.png'))
$content = "// QR code image embedded from Template GC.docx (word/media/image2.png).`r`n// Kept as a data URI so the same asset renders in both the server PDF route`r`n// and the client-side <PDFViewer> preview (single layout source, AGENTS.md rule 6).`r`nexport const QR_IMAGE_DATA_URI =`r`n  `"data:image/png;base64,$b64`";`r`n"
[IO.File]::WriteAllText('d:\File Kerja\Template\lib\certificate-assets.ts', $content)
Write-Output "written $((Get-Item 'd:\File Kerja\Template\lib\certificate-assets.ts').Length) bytes"
