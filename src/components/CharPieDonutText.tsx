

import * as React from "react"

import { Label, Pie, PieChart } from "recharts"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import {
  Card,
  CardContent,
  CardDescription,
  
  CardHeader,
  
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartPieDonutInteractiveProps {
  userId: string
  walletId: string
}

// 🔹 Función para generar tonalidades más claras de un color base
function lightenColor(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * percent)
  const g = Math.min(255, ((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * percent)
  const b = Math.min(255, (num & 0xff) + (255 - (num & 0xff)) * percent)
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
}

export function ChartPieDonutInteractive({ userId, walletId }: ChartPieDonutInteractiveProps){
  const [movements, setMovements] = React.useState<any[]>([])

  // Escuchar movimientos de Firebase
  React.useEffect(() => {
    if (!userId || !walletId) return
    const movementsRef = collection(db, "users", userId, "wallets", walletId, "movements")
    const unsub = onSnapshot(movementsRef, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMovements(data)
    })
    return () => unsub()
  }, [userId, walletId])

  // 🔹 Agrupar gastos por categoría y asignar verdes
  const chartData = React.useMemo(() => {
    const categoriasMap: Record<string, number> = {}

    movements
      .filter((m) => m.type === "Gasto")
      .forEach((gasto) => {
        const cat = gasto.category || "Sin categoría"
        categoriasMap[cat] = (categoriasMap[cat] || 0) + gasto.amount
      })

    const categories = Object.entries(categoriasMap)
    const baseGreen = "#008236"

    return categories.map(([category, value], i) => ({
      category,
      value,
      fill: lightenColor(baseGreen, (i / categories.length) * 0.6), // Tonalidades de verde
    }))
  }, [movements])

  const totalGastos = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData])

  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = { value: { label: "Gastos", color: "#008236" } }
    chartData.forEach((item) => {
      config[item.category] = {
        label: item.category,
        color: item.fill,
      }
    })
    return config
  }, [chartData])

  if (chartData.length === 0) return null

  return (
    <Card className="flex flex-col col-span-1 row-span-1">
      <CardHeader className="items-center pb-0">
    
        <CardDescription className="text-gray-600 font-medium">Distribución de tus gastos</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full bg-white max-h-[250px]">
          <PieChart>
            <ChartTooltip
  cursor={false}
  content={
   <ChartTooltipContent
  hideLabel
  className="
    bg-white 
    text-gray-800 
    text-sm 
    flex 
    flex-col 
    items-center 
    justify-center 
    gap-1 
    rounded-lg 
    shadow-md 
    p-2 
    border 
    border-gray-200 
    max-w-[500px] 
    text-center
    sm:flex-row sm:max-w-xs
  "
/>

  }
/>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
          
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          ${totalGastos.toLocaleString("es-AR")}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="text-gray-600 font-medium fill-muted-foreground">
                          Total Gastos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      
    </Card>
  )
}
