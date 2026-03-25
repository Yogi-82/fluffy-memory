const nazwaCache = "FloppyFly-v2";

const plikiDoZapisania = [
    "./",
    "./index.html",
    "./sprite/fly.png",            
    "./sprite/pirahna_plant — kopia.png", 
    "./sprite/background_floppy.png",
    "./sprite/settings-icon.png",
    "./sprite/ez_btn.png",
    "./sprite/hrd_btn.png",
    "./sprite/back_btn.png",    
    "./font/Minecraft.ttf",
    "./game.js",
    "./sound/alphix-game-over-417465.mp3",
    "./sound/barka-made-with-Voicemod.mp3",
    "./sound/bithuh-vine-boom-392646.mp3",
    "./sound/DiscoAdamusSigmaBoy & Rastafarianin Mango67 Viral Tiktok (mp3cut.net).mp3",
    "./sound/freesound_community-flappy_whoosh-43099.mp3",
    "./sound/universfield-game-bonus-02-294436.mp3",
    "./sound/universfield-game-over-deep-male-voice-clip-352695.mp3",
    "./sound/moodmode-8-bit-arcade-mode-158814.mp3"

];

self.addEventListener("install", (e) => {
    e.waitUntil(
    caches.open(nazwaCache).then((cache) => {
        return cache.addAll(plikiDoZapisania);
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
    caches.match(e.request).then((response) => {
        return response || fetch(e.request);
    })
    );
});