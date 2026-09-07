// lib/recommendation/engine.ts
// The rules engine. Returns SELL_NOW / WAIT_3_DAYS / WAIT_2_WEEKS / HOLD
// with reasoning in English and Marathi, factoring in price percentile, trend, seasonality, and storage.

import type {
  RecommendationResult, RecommendationAction, PricePoint, Crop, District,
} from "@/lib/types";

interface RecommendInput {
  crop: Crop;
  district: District;
  history: PricePoint[];      // 60 days, sorted ascending by date
  hasStorage?: boolean;       // whether farmer has storage/warehouse (defaults to true)
  needCashImmediately?: boolean; // farmer needs liquidity urgently
}

export function recommend(input: RecommendInput): RecommendationResult {
  const { history, hasStorage = true, needCashImmediately = false } = input;
  if (history.length < 8) {
    return {
      action: "HOLD",
      confidence: 0.3,
      reasoning: ["Not enough price history to make a recommendation."],
      reasoningMr: ["शिफारस करण्यासाठी पुरेसा भाव इतिहास नाही."],
      currentPrice: history.at(-1)?.pricePerQuintal ?? 0,
      percentile: 50,
      trend7d: "flat",
      seasonalityHint: "Unknown",
    };
  }

  const current = history.at(-1)!.pricePerQuintal;
  const sorted = [...history.map((p) => p.pricePerQuintal)].sort((a, b) => a - b);
  const rank = sorted.findIndex((p) => p === current);
  const percentile = Math.round((rank / (sorted.length - 1)) * 100);

  // 7-day trend: compare today vs 7 days ago
  const sevenDaysAgo = history.at(-8)?.pricePerQuintal ?? current;
  const trendPct = ((current - sevenDaysAgo) / sevenDaysAgo) * 100;
  const trend7d: "up" | "down" | "flat" =
    trendPct > 2 ? "up" : trendPct < -2 ? "down" : "flat";

  // Seasonality hint
  const month = new Date(history.at(-1)!.date).getMonth();
  const seasonalityHint = getSeasonalityHint(input.crop, month);

  // Build reasoning
  const reasoning: string[] = [];
  const reasoningMr: string[] = [];

  // Rule 1: Percentile
  if (percentile >= 80) {
    reasoning.push(
      `Today's price (₹${current.toLocaleString("en-IN")}) is in the top 20% of the last 60 days.`
    );
    reasoningMr.push(
      `आजचा भाव (₹${current.toLocaleString("en-IN")}) गेल्या 60 दिवसांत सर्वात वरच्या 20% मध्ये आहे.`
    );
  } else if (percentile <= 30) {
    reasoning.push(
      `Today's price is in the bottom 30% — consider waiting.`
    );
    reasoningMr.push(
      `आजचा भाव तळाच्या 30% मध्ये आहे — थांबण्याचा विचार करा.`
    );
  } else {
    reasoning.push(`Today's price is in the middle range.`);
    reasoningMr.push(`आजचा भाव मध्यम श्रेणीत आहे.`);
  }

  // Rule 2: Trend
  if (trend7d === "up") {
    reasoning.push(
      `Price has risen ${trendPct.toFixed(1)}% in the last 7 days — trend is positive.`
    );
    reasoningMr.push(
      `गेल्या 7 दिवसांत भाव ${trendPct.toFixed(1)}% वाढला — ट्रेंड सकारात्मक आहे.`
    );
  } else if (trend7d === "down") {
    reasoning.push(
      `Price has fallen ${Math.abs(trendPct).toFixed(1)}% in the last 7 days — consider selling before it drops further.`
    );
    reasoningMr.push(
      `गेल्या 7 दिवसांत भाव ${Math.abs(trendPct).toFixed(1)}% घसरला — आणखी घसरण्यापूर्वी विक्री करा.`
    );
  } else {
    reasoning.push(`Price is stable over the last 7 days.`);
    reasoningMr.push(`गेल्या 7 दिवसांत भाव स्थिर आहे.`);
  }

  // Rule 3: Seasonality
  reasoning.push(seasonalityHint.en);
  reasoningMr.push(seasonalityHint.mr);

  // Decide action
  let action: RecommendationAction;
  let confidence: number;
  let storageWarning = false;

  if (percentile >= 80 && trend7d !== "up") {
    action = "SELL_NOW";
    confidence = 0.85;
  } else if (percentile >= 80 && trend7d === "up") {
    action = "WAIT_3_DAYS";
    confidence = 0.7;
  } else if (percentile <= 30 && trend7d === "down") {
    action = "WAIT_2_WEEKS";
    confidence = 0.65;
  } else if (percentile <= 30 && trend7d === "up") {
    action = "WAIT_3_DAYS";
    confidence = 0.7;
  } else if (trend7d === "down" && percentile >= 50) {
    action = "SELL_NOW";
    confidence = 0.7;
  } else {
    action = "HOLD";
    confidence = 0.5;
  }

  // Storage / Liquidity constraint adjustment (SIH PS #26132)
  if (!hasStorage && (action === "WAIT_2_WEEKS" || action === "WAIT_3_DAYS")) {
    storageWarning = true;
    if (percentile >= 45) {
      action = "SELL_NOW";
      confidence = 0.8;
      reasoning.unshift(
        "⚠️ Storage constraint active: Holding without proper storage risks moisture/pest loss. Sell now at current rate."
      );
      reasoningMr.unshift(
        "⚠️ साठवणूक मर्यादा: साठवणूक सोय नसल्याने माल रोखून ठेवल्यास नासाडी होण्याचा धोका आहे. सध्याच्या दरात विक्री करा."
      );
    } else {
      reasoning.unshift(
        "⚠️ Limited storage: Consider pooling with local FPO warehouse to avoid distress sale."
      );
      reasoningMr.unshift(
        "⚠️ मर्यादित साठवणूक: पडत्या भावात विक्री टाळण्यासाठी स्थानिक FPO गोदामात साठा करण्याचा विचार करा."
      );
    }
  }

  // Liquidity constraint adjustment (SIH PS #26132)
  if (needCashImmediately && action !== "SELL_NOW") {
    action = "SELL_NOW";
    confidence = 0.9;
    reasoning.unshift(
      "⚡ Urgent liquidity needed: Cash flow requirements take precedence. Recommend selling now or requesting FPO advance credit."
    );
    reasoningMr.unshift(
      "⚡ तातडीची पैशांची गरज: रोख रकमेची निकड महत्त्वाची आहे. त्वरित विक्री करा किंवा FPO आगाऊ कर्जाचा पर्याय तपासा."
    );
  }

  return {
    action,
    confidence,
    reasoning,
    reasoningMr,
    currentPrice: current,
    percentile,
    trend7d,
    seasonalityHint: seasonalityHint.en,
    storageWarning,
  };
}

function getSeasonalityHint(crop: Crop, month: number): { en: string; mr: string } {
  // month: 0 = Jan, 11 = Dec
  if (crop === "onion" && (month === 7 || month === 8)) {
    return {
      en: "Onion prices typically spike in Aug-Sep due to lean supply.",
      mr: "ऑगस्ट-सप्टेंबरमध्ये कांद्याचे भाव सहसा वाढतात कारण पुरवठा कमी असतो.",
    };
  }
  if (crop === "tur" && (month === 10 || month === 11)) {
    return {
      en: "Tur harvest in Oct-Nov usually lowers prices.",
      mr: "ऑक्टोबर-नोव्हेंबरमध्ये तूर काढणी सहसा भाव कमी करते.",
    };
  }
  if (crop === "soybean" && (month === 8 || month === 9)) {
    return {
      en: "Soybean prices often firm up in Sep-Oct as supply tightens.",
      mr: "सप्टेंबर-ऑक्टोबरमध्ये सोयाबीनचे भाव सहसा वाढतात कारण पुरवठा कमी होतो.",
    };
  }
  return {
    en: "No strong seasonal signal for this period.",
    mr: "या काळात कोणतेही मजबूत हंगामी संकेत नाहीत.",
  };
}
