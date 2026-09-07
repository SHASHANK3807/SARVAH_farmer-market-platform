// app/[locale]/about/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-black tracking-tight text-foreground">About Sarvah</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Decision-support and market linkage platform designed for Maharashtra smallholder farmers.
        </p>
      </div>

      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">What is Sarvah?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Sarvah (सर्वह — Friend of the Market) bridges the critical price discovery gap for smallholder farmers in Maharashtra. Rather than acting as a passive auction bulletin board, it empowers farmers with clear timing advice (<b>WHEN to sell</b>) and direct buyer competition (<b>TO WHOM to sell</b>), eliminating predatory middlemen margins.
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">Real-time Data & Demo Safety Net</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Mandi rates are mapped to Agmarknet daily price records for major Maharashtra APMCs (Latur, Pune, Nashik, Solapur, Nagpur). To prevent demo failure during live hackathon judging, the architecture uses realistic 60-day historical seed data with a seamless fallback pipeline.
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">Marathi-First Localization</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Sarvah was designed Marathi-first. Translations into native Devanagari terminology (क्विंटल, हमीभाव, बाजार समिती, साठवणूक मर्यादा) ensure smallholder farmers can comfortably navigate the interface on mobile devices.
        </CardContent>
      </Card>

      <Card className="shadow-sm border">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">Hackathon Scope & Alignment</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Developed for <b>Smart India Hackathon / Maharashtra State Innovation Society (Problem Statement #26132: Strengthening market linkages and price discovery for farmers)</b>.
        </CardContent>
      </Card>
    </div>
  );
}
