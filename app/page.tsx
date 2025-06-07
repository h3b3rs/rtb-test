import { FormularioPropostaSimplificado } from "@/components/formulario-proposta-simplificado"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">RTB Hydro</h1>
        <p className="text-muted-foreground">Sistema de Geração de Propostas Técnicas</p>
      </div>
      <FormularioPropostaSimplificado />
    </main>
  )
}
