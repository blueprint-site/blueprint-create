/**
 * Environmental impact calculations and facts for image compression
 */

interface EcoImpact {
  co2Saved: number; // in grams
  treeDays: number; // equivalent tree absorption days
  smartphoneCharges: number; // equivalent phone charges saved
  message: string;
  funFact: string;
}

/**
 * Calculate environmental impact of file size reduction
 * Based on average data center energy consumption and carbon footprint
 */
export function calculateEcoImpact(originalSize: number, compressedSize: number): EcoImpact {
  const savedBytes = originalSize - compressedSize;
  const savedMB = savedBytes / (1024 * 1024);
  
  // CO2 calculations based on data center averages
  // Average: 0.5g CO2 per MB stored per year
  // Transfer: 0.2g CO2 per MB transferred
  const storageCO2PerYear = savedMB * 0.5;
  const transferCO2 = savedMB * 0.2 * 10; // Assume 10 downloads average
  const totalCO2Saved = storageCO2PerYear + transferCO2;
  
  // Equivalent calculations
  const treeDays = totalCO2Saved / 60; // Tree absorbs ~60g CO2 per day
  const smartphoneCharges = totalCO2Saved / 8.8; // One charge = ~8.8g CO2
  
  // Get random eco message
  const message = getRandomEcoMessage(savedMB, totalCO2Saved);
  const funFact = getRandomEcoFact();
  
  return {
    co2Saved: Math.round(totalCO2Saved * 10) / 10,
    treeDays: Math.round(treeDays * 10) / 10,
    smartphoneCharges: Math.round(smartphoneCharges),
    message,
    funFact
  };
}

/**
 * Get a random eco-friendly message based on savings
 */
function getRandomEcoMessage(savedMB: number, co2Saved: number): string {
  const messages = [
    `🌱 Nice! You've saved ${co2Saved.toFixed(1)}g of CO2 - that's like planting a tiny digital tree!`,
    `🌍 Your compression saved ${savedMB.toFixed(1)}MB - Mother Earth says thank you!`,
    `♻️ Eco-warrior mode: ${co2Saved.toFixed(1)}g CO2 saved! Every byte counts!`,
    `🌿 You just gave the planet a little hug by saving ${savedMB.toFixed(1)}MB!`,
    `🌳 Your compressed image saves as much CO2 as a tree absorbs in ${(co2Saved/60).toFixed(1)} days!`,
    `⚡ Compression complete! You saved enough energy to charge a phone ${Math.round(co2Saved/8.8)} times!`,
    `🦋 Small action, big impact: ${co2Saved.toFixed(1)}g CO2 saved for future generations!`,
    `🌊 Every drop counts! Your ${savedMB.toFixed(1)}MB savings helps reduce data center cooling needs!`,
    `☁️ Less cloud storage = clearer skies! ${co2Saved.toFixed(1)}g CO2 saved!`,
    `🚴 Your compression is equivalent to biking instead of driving for ${(co2Saved/20).toFixed(1)} minutes!`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get a random fun environmental fact
 */
function getRandomEcoFact(): string {
  const facts = [
    "💡 Did you know? If everyone compressed their images, we could power a city for a year!",
    "🌐 Fun fact: The internet uses about 10% of global electricity - every compressed image helps!",
    "📱 A single email generates 4g of CO2 - your compressed image just offset several emails!",
    "🏢 Data centers use 200 TWh per year - that's more than Argentina's entire country!",
    "🌡️ Compressed images = cooler planet! Data centers need massive cooling systems.",
    "🎮 Gaming for 1 hour uses less energy than storing 1GB of data for a year!",
    "🌲 One tree absorbs 22kg of CO2 per year - every bit of compression adds up!",
    "💾 The world stores 64 zettabytes of data - imagine if it was all compressed!",
    "🚗 Streaming 1 hour of video = driving 1 mile. Compression reduces this impact!",
    "🐝 Even bees would approve - less server heat means healthier ecosystems!",
    "☕ Your compression saved enough energy to brew a cup of coffee!",
    "🌻 If the internet was a country, it would rank 6th in electricity usage!",
    "🎯 Pro tip: WebP format can reduce file sizes by 25-35% compared to JPEG!",
    "🦜 Nature fact: Digital storage has a real carbon footprint - you're helping reduce it!",
    "🌈 Every 1MB saved prevents 20g of CO2 over its lifetime in the cloud!",
    "🎨 Artists rejoice: Compressed images load faster AND save the planet!",
    "🔋 Your image compression could power an LED bulb for 30 minutes!",
    "🌺 Hawaii could be powered for 2 hours with the energy saved if everyone compressed photos!",
    "📊 Studies show 90% of uploaded images are never viewed again - but still use energy!",
    "🍃 Green computing: Your small action joins millions making a real difference!"
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}

/**
 * Format eco impact as a toast message
 */
export function formatEcoToast(
  originalSize: number,
  compressedSize: number,
  fileCount: number = 1
): { title: string; description: string } {
  const impact = calculateEcoImpact(originalSize, compressedSize);
  
  const title = fileCount > 1 
    ? `🌍 ${fileCount} images compressed sustainably!`
    : "🌍 Image compressed sustainably!";
    
  const savedMB = (originalSize - compressedSize) / (1024 * 1024);
  
  const descriptions = [
    `Saved ${savedMB.toFixed(1)}MB and ${impact.co2Saved}g CO2! ${impact.funFact}`,
    `${impact.message}\n${impact.funFact}`,
    `You saved energy for ${impact.smartphoneCharges} phone charges! ${impact.funFact}`,
    `That's like a tree working for ${impact.treeDays} days! ${impact.funFact}`
  ];
  
  return {
    title,
    description: descriptions[Math.floor(Math.random() * descriptions.length)]
  };
}

/**
 * Get a loading message while compressing
 */
export function getCompressionLoadingMessage(): string {
  const messages = [
    "🌱 Optimizing for the planet...",
    "♻️ Reducing digital carbon footprint...",
    "🌍 Making the internet a bit greener...",
    "🌿 Compressing with love for Earth...",
    "⚡ Saving energy, one pixel at a time...",
    "🌳 Digital trees are being planted...",
    "☁️ Lightening the cloud's load...",
    "🦋 Creating a butterfly effect of savings...",
    "🌊 Making waves in sustainable tech...",
    "🌻 Growing a greener internet..."
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}