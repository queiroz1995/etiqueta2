"use client"

import { useEffect, useRef, forwardRef } from "react"
import JsBarcode from "jsbarcode"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LabelLayout {
  id: string
  name: string
  widthMm: number
  heightMm: number
  widthPx: number
  heightPx: number
  paddingPx: number
  imageSizePx: number
  barcodeHeightPx: number
  barcodeWidthFactor: number
  barcodeFontSize: number
  productNameFontSize: string
  brandFontSize: string
  productCodeFontSize: string
}

interface ProductLabelProps {
  productName: string
  productCode: string
  brand: string
  imageUrl: string
  layout: LabelLayout
  barcodeFormat: string
}

// Usar forwardRef para permitir que o componente receba uma ref
export const ProductLabel = forwardRef<HTMLDivElement, ProductLabelProps>(
  ({ productName, productCode, brand, imageUrl, layout, barcodeFormat }, ref) => {
    const barcodeRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
      if (barcodeRef.current && productCode) {
        try {
          JsBarcode(barcodeRef.current, productCode, {
            format: barcodeFormat,
            displayValue: true,
            height: layout.barcodeHeightPx,
            width: layout.barcodeWidthFactor,
            margin: 5,
            fontSize: layout.barcodeFontSize,
            textMargin: 5,
            background: "#ffffff",
            lineColor: "#000000",
          })
        } catch (error) {
          console.error("Error generating barcode:", error)
          if (barcodeRef.current) {
            barcodeRef.current.innerHTML = `<text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="red" fontSize="12">Erro: Código inválido para o formato ${barcodeFormat}</text>`
          }
        }
      }
    }, [productCode, layout, barcodeFormat])

    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-between border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 text-center overflow-hidden"
        style={{
          width: `${layout.widthPx}px`,
          height: `${layout.heightPx}px`,
          padding: `${layout.paddingPx}px`,
        }}
      >
        {imageUrl && (
          <div className="relative flex-shrink-0" style={{ width: layout.imageSizePx, height: layout.imageSizePx }}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={productName || "Imagem do produto"}
              layout="fill"
              objectFit="contain"
              className="rounded-sm"
            />
          </div>
        )}
        <div className="flex-grow flex flex-col justify-center items-center px-2">
          <h3
            className={cn("font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight", layout.productNameFontSize)}
          >
            {productName}
          </h3>
          <p className={cn("text-gray-700 dark:text-gray-300 mb-1", layout.brandFontSize)}>{brand}</p>
          <p className={cn("text-gray-600 dark:text-gray-400", layout.productCodeFontSize)}>Cód: {productCode}</p>
        </div>
        <div className="w-full flex justify-center flex-shrink-0 mt-2">
          <svg ref={barcodeRef} className="w-full h-auto" style={{ maxWidth: layout.widthPx * 0.8 }}></svg>
        </div>
      </div>
    )
  },
)

ProductLabel.displayName = "ProductLabel"
