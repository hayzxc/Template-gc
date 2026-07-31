$x = [xml](Get-Content '_template_gc\word\document.xml' -Raw)
$sw = New-Object System.IO.StringWriter
$xw = New-Object System.Xml.XmlTextWriter($sw)
$xw.Formatting = 'Indented'
$x.WriteContentTo($xw)
$sw.ToString() | Out-File '_template_gc\document_pretty.xml' -Encoding utf8
(Get-Item '_template_gc\document_pretty.xml').Length
