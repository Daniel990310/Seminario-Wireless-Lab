<#
  Convierte en Illustrator las piezas de difusion/flyer/ en .ai editables.

  Por COM, sin plugins ni extensiones: Illustrator registra `Illustrator.Application`
  al instalarse (medido en CC 2019, 23.0.3). Cada PDF se abre, se informa cuantos
  marcos de texto trae y con que fuentes, se ordena en capas y grupos con nombre
  (`estructurar.jsx`, con el mapa `<pieza>.mapa.tsv` que deja `npm run flyer`), se
  guarda el .ai junto al PDF y se cierra: al terminar no queda ningun documento abierto.
  Despues se informa que porcentaje del lienzo cambio al ordenar; deberia ser 0.

  Requisito: Crimson Pro, Atkinson Hyperlegible Next y JetBrains Mono instaladas en
  Windows. Sin ellas Illustrator sustituye la fuente y el informe lo delata.

  Uso:  powershell -File scripts/illustrator/abrir-flyer.ps1 [-Rehacer] [pieza ...]
        (sin argumentos, todos los PDF de difusion/flyer/; p. ej. es-carrusel-1)

  UN .ai QUE YA EXISTE NO SE TOCA, salvo con -Rehacer. Los .ai se retocan a mano
  (Daniel, 2026-10-02) y git no los sigue. Con -Rehacer, el .ai anterior se copia antes a
  difusion/ai-anteriores-<fecha>/; si ya hay copia de ese dia se conserva la primera,
  que es la que puede tener retoques.
#>
# `ValueFromRemainingArguments`: con `-File`, varios nombres sueltos no se agrupan en un
# arreglo y solo se procesaba el primero (medido el 2026-10-01).
param(
  [switch]$Rehacer,
  [Parameter(ValueFromRemainingArguments = $true)][string[]]$Piezas
)

$raiz = Resolve-Path (Join-Path $PSScriptRoot '..\..')
if (-not $Piezas) {
  $Piezas = Get-ChildItem (Join-Path $raiz 'difusion\flyer') -Filter *.pdf | ForEach-Object { $_.BaseName }
}
<#
  LAS FUENTES TIENEN QUE ESTAR INSTALADAS PARA TODO EL SISTEMA, no solo para el usuario.
  Illustrator CC 2019 no lee %LOCALAPPDATA%\Microsoft\Windows\Fonts: con ellas instaladas
  asi, el documento abria con «Missing Fonts (5)» (captura de Daniel, 2026-10-01). Y el
  informe del .jsx no lo delataba, porque Illustrator conserva el nombre de la fuente que
  falta en el texto y hasta la lista en `app.textFonts`. Por eso se comprueba aqui, contra
  el registro del sistema, que es lo que Illustrator 2019 si lee.
#>
$requeridas = 'CrimsonPro-Regular', 'CrimsonPro-SemiBold', 'AtkinsonHyperlegibleNext-Regular',
  'AtkinsonHyperlegibleNext-SemiBold', 'JetBrainsMono-Regular', 'JetBrainsMono-SemiBold'
$sistema = (Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts').PSObject.Properties.Value
$faltan = $requeridas | Where-Object { $f = $_; -not ($sistema | Where-Object { $_ -like "*$f.ttf" }) }
if ($faltan) {
  Write-Error ("Faltan para todo el sistema: $($faltan -join ', '). Instalarlas con clic derecho > " +
    "'Instalar para todos los usuarios' (pide administrador) y reiniciar Illustrator.")
  exit 1
}

# Se anteponen las funciones: con `DoJavaScript` el .jsx llega como texto y un `#include`
# relativo no tiene desde donde resolverse.
$jsx = ('unir-renglones.jsx', 'estructurar.jsx', 'abrir-flyer.jsx' |
  ForEach-Object { Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot $_) }) -join "`n"
$temporal = Join-Path $env:TEMP 'flyer-ai'
New-Item -ItemType Directory -Force $temporal | Out-Null
$respaldo = Join-Path $raiz "difusion\ai-anteriores-$(Get-Date -Format yyyy-MM-dd)"
$ai = New-Object -ComObject Illustrator.Application

foreach ($pieza in $Piezas) {
  $pdf = Join-Path $raiz "difusion\flyer\$pieza.pdf"
  if (-not (Test-Path $pdf)) {
    Write-Error "No existe $pdf. Correr antes: npm run build; npm run flyer"
    continue
  }
  $mapa = $pdf -replace '\.pdf$', '.mapa.tsv'
  if (-not (Test-Path $mapa)) {
    Write-Error "No existe $mapa. Correr antes: npm run build; npm run flyer"
    continue
  }
  $rutaAi = $pdf -replace '\.pdf$', '.ai'
  if (Test-Path $rutaAi) {
    if (-not $Rehacer) {
      "$pieza  se deja: el .ai ya existe y puede tener retoques (usar -Rehacer para sobrescribirlo)"
      continue
    }
    New-Item -ItemType Directory -Force $respaldo | Out-Null
    if (-not (Test-Path (Join-Path $respaldo "$pieza.ai"))) { Copy-Item $rutaAi $respaldo }
  }
  # ExtendScript espera barras normales en las rutas de `File`.
  # Si Illustrator se cae a mitad de la tanda (medido el 2026-10-01: «servidor RPC no
  # disponible» tras cuatro piezas), se informa la pieza que fallo, se reconecta —COM
  # vuelve a lanzarlo— y se sigue. El informe se lee de esta pieza, nunca de la anterior.
  try {
    $argumentos = @($pdf, $mapa, "$raiz", $temporal | ForEach-Object { $_.Replace('\', '/') })
    $informe = $ai.DoJavaScript($jsx, $argumentos)
    $cambio = node (Join-Path $PSScriptRoot 'comparar-png.mjs') (Join-Path $temporal "$pieza-antes.png") (Join-Path $temporal "$pieza-despues.png")
    "$pieza  $informe $cambio"
    # RF-29.5: por encima de 0,5 % ordenar movio algo de verdad, no solo el interlineado.
    if ([double]($cambio -replace '^cambio=([\d.]+)%.*$', '$1') -gt 0.5) {
      "$pieza  AVISO ordenar cambio el lienzo: comparar $temporal\$pieza-antes.png con -despues.png"
    }
    # Una fuente que no es de las tres del sitio es una sustitucion de Illustrator: el texto
    # sigue editable pero ya no es el del cartel. Medido con la flecha de «Desliza» (Myriad).
    $ajenas = ($informe -replace '^.*fuentes=', '').Split(',') |
      Where-Object { $_ -and $_ -notmatch '^(CrimsonPro|AtkinsonHyperlegibleNext|JetBrainsMono)-' }
    if ($ajenas) { "$pieza  AVISO fuente sustituida: $($ajenas -join ', ')" }
  } catch {
    "$pieza  FALLO: $($_.Exception.Message)"
    Start-Sleep -Seconds 5
    $ai = New-Object -ComObject Illustrator.Application
  }
}
