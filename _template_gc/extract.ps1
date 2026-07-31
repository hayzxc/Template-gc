$ErrorActionPreference = 'Stop'
$doc = [xml](Get-Content '_template_gc\word\document.xml' -Raw)
$ns = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$ns.AddNamespace('mc', 'http://schemas.openxmlformats.org/markup-compatibility/2006')

$out = New-Object System.Text.StringBuilder
# iterate over body-level paragraphs AND paragraphs inside textboxes (txbxContent), in document order
$paras = $doc.SelectNodes('//w:p[not(ancestor::mc:Fallback)]', $ns)
foreach ($p in $paras) {
  $style = $p.SelectSingleNode('w:pPr/w:pStyle/@w:val', $ns).'#text'
  $jc = $p.SelectSingleNode('w:pPr/w:jc/@w:val', $ns).'#text'
  $indL = $p.SelectSingleNode('w:pPr/w:ind/@w:left', $ns).'#text'
  $indR = $p.SelectSingleNode('w:pPr/w:ind/@w:right', $ns).'#text'
  $before = $p.SelectSingleNode('w:pPr/w:spacing/@w:before', $ns).'#text'
  $line = $p.SelectSingleNode('w:pPr/w:spacing/@w:line', $ns).'#text'
  $inTxbx = if ($p.SelectSingleNode('ancestor::w:txbxContent', $ns)) { '[TXBX]' } else { '' }

  # collect run text with formatting summary
  $runs = $p.SelectNodes('.//w:r', $ns)
  $texts = @()
  foreach ($r in $runs) {
    $t = ($r.SelectNodes('w:t', $ns) | ForEach-Object { $_.InnerText }) -join ''
    if ($r.SelectSingleNode('w:br[@w:type="column"]', $ns)) { $texts += '<COLBREAK>' }
    if ($t -eq '') { continue }
    $sz = $r.SelectSingleNode('w:rPr/w:sz/@w:val', $ns).'#text'
    $font = $r.SelectSingleNode('w:rPr/w:rFonts/@w:ascii', $ns).'#text'
    $i = if ($r.SelectSingleNode('w:rPr/w:i', $ns)) { 'i' } else { '' }
    $b = if ($r.SelectSingleNode('w:rPr/w:b', $ns)) { 'b' } else { '' }
    $u = $r.SelectSingleNode('w:rPr/w:u/@w:val', $ns).'#text'
    $rstyle = $r.SelectSingleNode('w:rPr/w:rStyle/@w:val', $ns).'#text'
    $fmt = (@($font, $sz, $i, $b, $u, $rstyle) | Where-Object { $_ }) -join ','
    $texts += "[$fmt]$t"
  }
  $hasSdt = if ($p.SelectSingleNode('.//w:sdt', $ns)) { '<SDT-PLACEHOLDER>' } else { '' }
  $meta = (@($inTxbx, $style, $jc, $(if($indL){"indL=$indL"}), $(if($indR){"indR=$indR"}), $(if($before){"before=$before"}), $(if($line){"line=$line"})) | Where-Object { $_ }) -join ' '
  [void]$out.AppendLine("P{$meta} :: $($texts -join ' | ') $hasSdt")

  # section break info
  $sect = $p.SelectSingleNode('w:pPr/w:sectPr', $ns)
  if ($sect) {
    $cols = $sect.SelectNodes('w:cols/w:col', $ns) | ForEach-Object { "$($_.GetAttribute('w:w','http://schemas.openxmlformats.org/wordprocessingml/2006/main'))+$($_.GetAttribute('w:space','http://schemas.openxmlformats.org/wordprocessingml/2006/main'))" }
    [void]$out.AppendLine("=== SECTION BREAK cols: $($cols -join ' / ') ===")
  }
}
$out.ToString() | Out-File '_template_gc\structure.txt' -Encoding utf8
Write-Host "done"
