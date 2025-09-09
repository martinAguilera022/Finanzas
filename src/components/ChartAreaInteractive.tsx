import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"

import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ChartAreaInteractiveProps {
  userId: string
  walletId: string
}

export function ChartAreaInteractive({ userId, walletId }: ChartAreaInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("90d")
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

  // Generar datos diarios para el gráfico
  const chartData = React.useMemo(() => {
    const today = new Date()
    let days = 7
    if (timeRange === "30d") days = 30
    else if (timeRange === "90d") days = 90

    const data: { date: string; ingresos: number; gastos: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().slice(0, 10)

      const dailyMovs = movements.filter(mov => mov.createdAt?.toDate().toISOString().slice(0, 10) === dateStr)
      const ingresos = dailyMovs.filter(m => m.type === "Ingreso").reduce((acc, m) => acc + m.amount, 0)
      const gastos = dailyMovs.filter(m => m.type === "Gasto").reduce((acc, m) => acc + m.amount, 0)

      data.push({ date: dateStr, ingresos, gastos })
    }
    return data
  }, [movements, timeRange])

  const chartConfig = {
    ingresos: { label: "Ingresos", color: "#2bd323ff" },
    gastos: { label: "Gastos", color: "#f87171" },
  }

  return (
    <Card className="pt-0 col-span-2 row-span-2">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex sm:items-start sm:justify-between sm:flex-col">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-gray-600 font-medium">Movimientos</CardTitle>
        
        </div>
        <Select value={timeRange} onValueChange={setTimeRange} >
          <SelectTrigger className="flex w-[160px] rounded-lg border-none sm:ml-auto">
            <SelectValue placeholder="Selecciona rango" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none z-10 bg-white">
              <SelectItem value="7d" className="rounded-lg">Últimos 7 días</SelectItem>
            <SelectItem value="90d" className="rounded-lg">Últimos 3 meses</SelectItem>
            <SelectItem value="30d" className="rounded-lg">Últimos 30 días</SelectItem>
          
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.ingresos.color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartConfig.ingresos.color} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig.gastos.color} stopOpacity={0.6} />
                <stop offset="95%" stopColor={chartConfig.gastos.color} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              minTickGap={42}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" })
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => new Date(value).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="ingresos"
              type="natural"
              fill="url(#fillIngresos)"
              stroke={chartConfig.ingresos.color}
              stackId="a"
            />
            <Area
              dataKey="gastos"
              type="natural"
              fill="url(#fillGastos)"
              stroke={chartConfig.gastos.color}
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
