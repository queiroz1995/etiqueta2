"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { ProductLabel } from "@/components/product-label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LabelForm } from "@/components/label-form"

interface ProductData {
  productName: string
  productCode: string
  brand: string
  imageUrl: string
}

interface LabelLayout {
  id: string
  name: string
  widthMm: number
  heightMm: number
  widthPx: number // Largura em pixels para visualização (aprox. 96 DPI)
  heightPx: number // Altura em pixels para visualização (aprox. 96 DPI)
  paddingPx: number
  imageSizePx: number
  barcodeHeightPx: number
  barcodeWidthFactor: number
  barcodeFontSize: number
  productNameFontSize: string
  brandFontSize: string
  productCodeFontSize: string
}

// Definição dos layouts predefinidos
const predefinedLayouts: LabelLayout[] = [
  {
    id: "standard",
    name: "Padrão (100x150mm)",
    widthMm: 100,
    heightMm: 150,
    widthPx: 378, // 100mm * 96dpi / 25.4mm/inch
    heightPx: 567, // 150mm * 96dpi / 25.4mm/inch
    paddingPx: 16,
    imageSizePx: 128,
    barcodeHeightPx: 60,
    barcodeWidthFactor: 2,
    barcodeFontSize: 14,
    productNameFontSize: "text-xl",
    brandFontSize: "text-base",
    productCodeFontSize: "text-sm",
  },
  {
    id: "medium",
    name: "Média (75x100mm)",
    widthMm: 75,
    heightMm: 100,
    widthPx: 283, // 75mm * 96dpi / 25.4mm/inch
    heightPx: 378, // 100mm * 96dpi / 25.4mm/inch
    paddingPx: 12,
    imageSizePx: 96,
    barcodeHeightPx: 50,
    barcodeWidthFactor: 1.8,
    barcodeFontSize: 12,
    productNameFontSize: "text-lg",
    brandFontSize: "text-base",
    productCodeFontSize: "text-sm",
  },
  {
    id: "small",
    name: "Pequena (50x75mm)",
    widthMm: 50,
    heightMm: 75,
    widthPx: 189,
    heightPx: 283,
    paddingPx: 8,
    imageSizePx: 64,
    barcodeHeightPx: 40,
    barcodeWidthFactor: 1.5,
    barcodeFontSize: 10,
    productNameFontSize: "text-base",
    brandFontSize: "text-sm",
    productCodeFontSize: "text-xs",
  },
  {
    id: "large",
    name: "Grande (150x200mm)",
    widthMm: 150,
    heightMm: 200,
    widthPx: 567,
    heightPx: 756,
    paddingPx: 24,
    imageSizePx: 192,
    barcodeHeightPx: 80,
    barcodeWidthFactor: 2.5,
    barcodeFontSize: 18,
    productNameFontSize: "text-2xl",
    brandFontSize: "text-lg",
    productCodeFontSize: "text-base",
  },
]

// Formatos de código de barras suportados pelo JsBarcode
const barcodeFormats = [
  { id: "EAN13", name: "EAN-13" },
  { id: "CODE128", name: "Code 128" },
  { id: "CODE39", name: "Code 39" },
  // QR Code não é suportado por JsBarcode, exigiria outra biblioteca
  // { id: "QRCODE", name: "QR Code" },
]

export default function HomePage() {
  const [productName, setProductName] = useState("Nome do Produto")
  const [productCode, setProductCode] = useState("123456789012")
  const [brand, setBrand] = useState("Sua Marca")
  const [imageUrl, setImageUrl] = useState("/placeholder.svg?height=100&width=100")
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>(predefinedLayouts[0].id)
  const [selectedBarcodeFormat, setSelectedBarcodeFormat] = useState<string>(barcodeFormats[0].id)

  const currentLayout = predefinedLayouts.find((layout) => layout.id === selectedLayoutId) || predefinedLayouts[0]

  const labelRef = useRef<HTMLDivElement>(null)

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setImageUrl(URL.createObjectURL(file))
    } else {
      setImageUrl("/placeholder.svg?height=100&width=100")
    }
  }

  const handlePrint = () => {
    if (labelRef.current) {
      const printContent = labelRef.current.cloneNode(true) as HTMLElement

      const printWindow = window.open("", "_blank")

      if (printWindow) {
        printWindow.document.open()
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Etiqueta do Produto</title>
            <style>
              @page {
                size: ${currentLayout.widthMm}mm ${currentLayout.heightMm}mm; /* Define o tamanho da página para impressão */
                margin: 0;
              }
              body {
                margin: 0;
                -webkit-print-color-adjust: exact; /* Garante que as cores de fundo sejam impressas */
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 0; /* Remover padding do body */
              }
              .product-label-print {
                width: ${currentLayout.widthMm}mm; /* Tamanho fixo para impressão */
                height: ${currentLayout.heightMm}mm;
                box-shadow: none;
                border: none;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                padding: ${currentLayout.paddingPx}px;
                background-color: white;
                color: black; /* Garante texto preto para impressão */
                box-sizing: border-box; /* Inclui padding e border no width/height */
              }
              .product-label-print:last-child {
                page-break-after: auto; /* Não quebra página após a última etiqueta */
              }
              .product-label-print img {
                max-width: ${currentLayout.imageSizePx}px;
                max-height: ${currentLayout.imageSizePx}px;
                object-fit: contain;
              }
              .product-label-print h3 {
                font-size: ${currentLayout.productNameFontSize.replace("text-", "")}px; /* Converte tailwind para px */
                font-weight: bold;
                line-height: 1.25;
                margin-bottom: 4px;
                color: black;
              }
              .product-label-print p {
                font-size: ${currentLayout.brandFontSize.replace("text-", "")}px;
                margin-bottom: 4px;
                color: black;
              }
              .product-label-print p:last-of-type {
                font-size: ${currentLayout.productCodeFontSize.replace("text-", "")}px;
              }
              .product-label-print svg {
                width: 100%;
                max-width: ${currentLayout.widthPx * 0.8}px; /* Ajuste para o barcode */
                height: auto;
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
          </html>
        `)
        printWindow.document.close()
      } else {
        alert(
          "Não foi possível abrir a janela de impressão. Verifique se os pop-ups estão bloqueados no seu navegador.",
        )
      }
    }
  }

  return (
    <main className="flex flex-col lg:flex-row items-start justify-center min-h-screen p-4 md:p-8 gap-8 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md lg:sticky lg:top-8">
        <CardHeader>
          <CardTitle>Criar Etiqueta</CardTitle>
        </CardHeader>
        <CardContent>
          <LabelForm
            productName={productName}
            setProductName={setProductName}
            productCode={productCode}
            setProductCode={setProductCode}
            brand={brand}
            setBrand={setBrand}
            handleImageChange={handleImageChange}
            predefinedLayouts={predefinedLayouts}
            selectedLayoutId={selectedLayoutId}
            setSelectedLayoutId={setSelectedLayoutId}
            barcodeFormats={barcodeFormats}
            selectedBarcodeFormat={selectedBarcodeFormat}
            setSelectedBarcodeFormat={setSelectedBarcodeFormat}
          />
        </CardContent>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Pré-visualização das Etiquetas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center p-4">
          <div id="printable-label-container" className="mb-4">
            <ProductLabel
              productName={productName}
              productCode={productCode}
              brand={brand}
              imageUrl={imageUrl}
              layout={currentLayout}
              barcodeFormat={selectedBarcodeFormat}
              ref={labelRef}
            />
          </div>
          <Button onClick={handlePrint} className="w-full">
            Imprimir Etiqueta
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
