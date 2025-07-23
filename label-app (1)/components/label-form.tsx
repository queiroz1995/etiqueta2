"use client"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { ChangeEvent } from "react"

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

interface BarcodeFormat {
  id: string
  name: string
}

interface LabelFormProps {
  productName: string
  setProductName: (name: string) => void
  productCode: string
  setProductCode: (code: string) => void
  brand: string
  setBrand: (brand: string) => void
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  predefinedLayouts: LabelLayout[]
  selectedLayoutId: string
  setSelectedLayoutId: (id: string) => void
  barcodeFormats: BarcodeFormat[] // Nova prop
  selectedBarcodeFormat: string // Nova prop
  setSelectedBarcodeFormat: (format: string) => void // Nova prop
}

export function LabelForm({
  productName,
  setProductName,
  productCode,
  setProductCode,
  brand,
  setBrand,
  handleImageChange,
  predefinedLayouts,
  selectedLayoutId,
  setSelectedLayoutId,
  barcodeFormats, // Usar nova prop
  selectedBarcodeFormat, // Usar nova prop
  setSelectedBarcodeFormat, // Usar nova prop
}: LabelFormProps) {
  return (
    <form className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="productName">Nome do Produto</Label>
        <Input
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Ex: Camiseta Azul"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="productCode">Código do Produto</Label>
        <Input
          id="productCode"
          value={productCode}
          onChange={(e) => setProductCode(e.target.value)}
          placeholder="Ex: 123456789012"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="brand">Marca</Label>
        <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: Minha Marca" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Foto do Produto</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="labelLayout">Escolher Layout da Etiqueta</Label>
        <Select value={selectedLayoutId} onValueChange={setSelectedLayoutId}>
          <SelectTrigger id="labelLayout">
            <SelectValue placeholder="Selecione um layout" />
          </SelectTrigger>
          <SelectContent>
            {predefinedLayouts.map((layout) => (
              <SelectItem key={layout.id} value={layout.id}>
                {layout.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="barcodeFormat">Formato do Código de Barras</Label>
        <Select value={selectedBarcodeFormat} onValueChange={setSelectedBarcodeFormat}>
          <SelectTrigger id="barcodeFormat">
            <SelectValue placeholder="Selecione um formato" />
          </SelectTrigger>
          <SelectContent>
            {barcodeFormats.map((format) => (
              <SelectItem key={format.id} value={format.id}>
                {format.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  )
}
