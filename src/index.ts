export interface Env {
  AI: Ai;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
  };
}

/* ===== ACID-VISION APP (embedded) ===== */
const APP_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#030308">
<title>ACID-VISION // Neural AI & Generative Diffusion Studio</title>
<style>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap");
:root{
  --acid-green:#39ff14; --acid-lime:#ccff00; --neon-pink:#ff007f;
  --cyber-blue:#00f3ff; --dark-bg:#030308; --panel-bg:rgba(10,15,25,.94);
  --font-display:'Orbitron','Segoe UI',system-ui,sans-serif;
  --font-mono:'Share Tech Mono',ui-monospace,'SF Mono',Menlo,Consolas,monospace;
}
*{box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent;}
body{margin:0;padding:0;background-color:var(--dark-bg);font-family:var(--font-mono);
  color:#fff;overflow-x:hidden;display:flex;flex-direction:column;align-items:center;min-height:100vh;}
body::before{content:" ";display:block;position:fixed;inset:0;
  background:linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,.25) 50%) 0 0/100% 4px,
             linear-gradient(90deg,rgba(255,0,0,.06),rgba(0,255,0,.02),rgba(0,0,255,.06)) 0 0/6px 100%;
  z-index:999;pointer-events:none;}
.mobile-frame{width:100%;max-width:480px;min-height:100vh;
  background:radial-gradient(circle at center top,#111827 0%,#030308 100%);
  border:2px solid var(--acid-green);box-shadow:0 0 35px rgba(57,255,20,.3);
  display:flex;flex-direction:column;position:relative;overflow-x:hidden;}
header{padding:12px 15px;border-bottom:2px dashed var(--acid-green);display:flex;
  justify-content:space-between;align-items:center;background:rgba(0,0,0,.85);z-index:10;}
.logo{font-family:var(--font-display);font-weight:900;font-size:1rem;color:var(--acid-green);
  text-shadow:0 0 10px var(--acid-green);letter-spacing:1.5px;}
.status-badge{font-size:.65rem;padding:3px 6px;background:rgba(255,0,127,.2);
  border:1px solid var(--neon-pink);color:var(--neon-pink);border-radius:4px;animation:pulse 1.5s infinite;}
@keyframes pulse{0%{opacity:.6}50%{opacity:1;box-shadow:0 0 10px var(--neon-pink)}100%{opacity:.6}}
.mode-tabs{display:flex;border-bottom:1px solid rgba(0,243,255,.3);background:rgba(2,4,8,.9);}
.tab-btn{flex:1;padding:10px;text-align:center;font-family:var(--font-display);font-size:.72rem;
  color:#64748b;background:transparent;border:none;cursor:pointer;transition:.2s;letter-spacing:1px;}
.tab-btn.active{color:var(--cyber-blue);background:rgba(0,243,255,.1);
  border-bottom:2px solid var(--cyber-blue);box-shadow:inset 0 -2px 10px rgba(0,243,255,.2);}
.main-content{padding:16px;flex:1;display:flex;flex-direction:column;gap:14px;}
.view-section{display:none;flex-direction:column;gap:14px;}
.view-section.active{display:flex;}
.collapsible-field{border:2px dashed var(--cyber-blue);background:rgba(0,243,255,.05);
  border-radius:12px;overflow:hidden;transition:.3s;}
.collapsible-field.expanded{background:rgba(0,243,255,.08);
  box-shadow:0 0 20px rgba(0,243,255,.25);border-style:solid;}
.field-header{padding:22px 20px;text-align:center;cursor:pointer;transition:.25s;position:relative;}
.field-header:hover{background:rgba(0,243,255,.12);}
.field-header .f-icon{font-size:2rem;margin-bottom:8px;display:block;filter:drop-shadow(0 0 8px currentColor);}
.field-header .f-title{font-family:var(--font-display);font-size:.82rem;letter-spacing:1px;font-weight:700;}
.field-header .f-sub{font-size:.62rem;color:#64748b;margin-top:5px;letter-spacing:.4px;}
.field-header .f-chevron{position:absolute;top:50%;right:18px;transform:translateY(-50%);
  font-size:1.1rem;color:#64748b;transition:.3s;}
.collapsible-field.expanded .field-header .f-chevron{transform:translateY(-50%) rotate(180deg);color:var(--acid-green);}
.field-header.upload-variant .f-icon{color:var(--cyber-blue);text-shadow:0 0 12px var(--cyber-blue);}
.field-header.upload-variant .f-title{color:#cbd5e1;}
.field-header.sdxl-variant .f-icon{color:var(--neon-pink);text-shadow:0 0 12px var(--neon-pink);}
.field-header.sdxl-variant .f-title{color:var(--neon-pink);text-shadow:0 0 8px rgba(255,0,127,.5);}
.field-header.dev-variant .f-icon{color:var(--acid-lime);text-shadow:0 0 12px var(--acid-lime);}
.field-header.dev-variant .f-title{color:var(--acid-lime);text-shadow:0 0 8px rgba(204,255,0,.5);}
.field-body{display:none;padding:0 16px 16px;flex-direction:column;gap:12px;}
.collapsible-field.expanded .field-body{display:flex;}
.upload-zone-simple{position:relative;cursor:pointer;}
.upload-zone-simple input{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;cursor:pointer;}
.preview-container{display:none;flex-direction:column;gap:12px;}
.canvas-box{position:relative;width:100%;height:220px;background:#000;border:1px solid var(--acid-green);
  border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;}
.canvas-box img{max-width:100%;max-height:100%;object-fit:contain;}
.control-group{display:flex;flex-direction:column;gap:6px;background:var(--panel-bg);
  border:1px solid rgba(0,243,255,.3);padding:10px;border-radius:8px;}
.control-label{font-size:.7rem;color:var(--cyber-blue);letter-spacing:1px;text-transform:uppercase;}
.options-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
.options-grid.two{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;}
.options-grid.models{grid-template-columns:repeat(2,1fr);gap:7px;}
.opt-btn{background:rgba(0,0,0,.6);border:1px solid #334155;padding:7px 4px;text-align:center;
  font-size:.65rem;border-radius:4px;cursor:pointer;transition:.2s;color:#94a3b8;}
.opt-btn.active{border-color:var(--acid-green);color:var(--acid-green);background:rgba(57,255,20,.1);
  box-shadow:0 0 8px rgba(57,255,20,.2);}
.opt-btn.model-btn{padding:9px 6px;font-size:.68rem;display:flex;flex-direction:column;
  align-items:center;gap:3px;line-height:1.25;}
.opt-btn.model-btn .m-icon{font-size:1.05rem;}
.opt-btn.model-btn .m-name{font-family:var(--font-display);letter-spacing:.5px;font-weight:700;}
.opt-btn.model-btn .m-desc{font-size:.55rem;color:#64748b;letter-spacing:.3px;}
.opt-btn.model-btn.active .m-desc{color:rgba(57,255,20,.7);}
.cyber-btn{background:linear-gradient(45deg,var(--acid-green),var(--cyber-blue));border:none;color:#000;
  font-family:var(--font-display);font-weight:700;padding:12px 18px;font-size:.78rem;border-radius:6px;
  cursor:pointer;box-shadow:0 0 15px rgba(57,255,20,.4);transition:.2s;text-transform:uppercase;
  letter-spacing:1.5px;text-align:center;width:100%;}
.cyber-btn:hover{transform:translateY(-2px);box-shadow:0 0 25px var(--acid-green);
  background:linear-gradient(45deg,var(--acid-lime),var(--acid-green));}
.cyber-btn:active{transform:translateY(0) scale(.99);}
.cyber-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.cyber-btn.secondary{background:transparent;border:1px solid var(--neon-pink);color:var(--neon-pink);
  box-shadow:0 0 10px rgba(255,0,127,.2);}
.cyber-btn.secondary:hover{background:rgba(255,0,127,.2);box-shadow:0 0 20px var(--neon-pink);color:#fff;}
.dashboard{display:none;flex-direction:column;gap:12px;}
.section-title{font-family:var(--font-display);font-size:.72rem;color:var(--acid-lime);
  border-left:3px solid var(--acid-lime);padding-left:8px;letter-spacing:1px;}
.comparison-wrapper{position:relative;width:100%;height:230px;background:#000;
  border:2px solid var(--neon-pink);border-radius:8px;overflow:hidden;touch-action:none;}
.compare-img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;}
.enhanced-layer{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;
  clip-path:polygon(50% 0,100% 0,100% 100%,50% 100%);}
.enhanced-layer img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;max-width:none;}
.slider-handle{position:absolute;top:0;bottom:0;left:50%;width:3px;background:var(--neon-pink);
  box-shadow:0 0 15px var(--neon-pink);z-index:20;pointer-events:none;}
.slider-handle::after{content:"◀ COMPARE ▶";position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);background:#000;color:var(--neon-pink);padding:4px 8px;
  font-size:8px;font-family:var(--font-display);border:1px solid var(--neon-pink);
  border-radius:4px;white-space:nowrap;}
.badge-tag{position:absolute;bottom:8px;padding:2px 6px;font-size:.6rem;border-radius:3px;z-index:10;}
.badge-orig{left:8px;background:rgba(0,0,0,.7);color:#94a3b8;border:1px solid #475569;}
.badge-enh{right:8px;background:rgba(255,0,127,.3);color:var(--neon-pink);border:1px solid var(--neon-pink);}
.cyber-card{background:linear-gradient(135deg,#0b0f19 0%,#1a0524 100%);border:2px solid var(--cyber-blue);
  border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:8px;box-shadow:0 0 20px rgba(0,243,255,.15);}
.card-header{display:flex;justify-content:space-between;align-items:center;
  border-bottom:1px dashed var(--cyber-blue);padding-bottom:6px;}
.card-title{font-family:var(--font-display);font-size:.72rem;color:var(--cyber-blue);}
.card-score{font-family:var(--font-display);font-size:.9rem;color:var(--acid-green);text-shadow:0 0 10px var(--acid-green);}
.card-body{font-size:.7rem;color:#cbd5e1;display:flex;flex-direction:column;gap:3px;}
.prompt-input{width:100%;height:96px;background:#050811;border:1px solid var(--cyber-blue);
  border-radius:6px;color:#fff;padding:10px;font-family:var(--font-mono);font-size:.85rem;
  resize:none;outline:none;box-shadow:inset 0 0 10px rgba(0,243,255,.1);}
.prompt-input:focus{border-color:var(--acid-green);box-shadow:0 0 10px rgba(57,255,20,.3);}
.tag-chips{display:flex;flex-wrap:wrap;gap:5px;min-height:24px;}
.chip{font-size:.6rem;padding:3px 7px;border-radius:10px;letter-spacing:.5px;
  background:rgba(0,243,255,.1);border:1px solid rgba(0,243,255,.5);color:var(--cyber-blue);}
.chip.sub{background:rgba(57,255,20,.1);border-color:rgba(57,255,20,.5);color:var(--acid-green);}
.chip.env{background:rgba(255,0,127,.1);border-color:rgba(255,0,127,.5);color:var(--neon-pink);}
.chip.mood{background:rgba(168,85,247,.12);border-color:rgba(168,85,247,.5);color:#c084fc;}
.chip.style{background:rgba(255,209,102,.12);border-color:rgba(255,209,102,.5);color:#ffd166;}
.chip.col{width:18px;height:18px;padding:0;border-radius:50%;border:2px solid rgba(255,255,255,.6);}
.mini-row{display:flex;gap:8px;align-items:center;}
.mini-input{flex:1;background:#050811;border:1px solid rgba(0,243,255,.35);border-radius:5px;
  color:#fff;padding:7px 9px;font-family:var(--font-mono);font-size:.72rem;outline:none;}
.mini-input:focus{border-color:var(--acid-green);}
.enhance-toggle{display:flex;align-items:center;justify-content:space-between;gap:10px;
  background:var(--panel-bg);border:1px solid rgba(57,255,20,.35);padding:10px 12px;border-radius:8px;}
.enhance-toggle .lbl{font-size:.68rem;color:var(--acid-green);letter-spacing:.5px;font-family:var(--font-display);}
.enhance-toggle .sub{font-size:.58rem;color:#64748b;margin-top:2px;}
.switch{position:relative;width:44px;height:22px;background:#1e293b;border-radius:22px;
  border:1px solid #334155;cursor:pointer;transition:.2s;flex-shrink:0;}
.switch::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;
  background:#64748b;border-radius:50%;transition:.2s;}
.switch.on{background:rgba(57,255,20,.25);border-color:var(--acid-green);}
.switch.on::after{left:24px;background:var(--acid-green);box-shadow:0 0 8px var(--acid-green);}
.generation-output-box{position:relative;width:100%;min-height:260px;background:#000;
  border:2px solid var(--acid-green);border-radius:8px;display:flex;align-items:center;
  justify-content:center;overflow:hidden;box-shadow:0 0 20px rgba(57,255,20,.2);}
.generation-output-box img{max-width:100%;max-height:100%;object-fit:contain;display:block;}
.placeholder-text{color:#475569;font-family:var(--font-display);font-size:.72rem;
  text-align:center;padding:0 20px;line-height:1.6;}
.terminal{background:#020408;border:1px solid rgba(57,255,20,.3);border-radius:6px;padding:8px;
  font-size:.65rem;height:110px;overflow-y:auto;color:var(--acid-green);
  display:flex;flex-direction:column;gap:2px;}
.log-line{opacity:.9;}
.loader-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(3,3,8,.96);
  display:none;flex-direction:column;align-items:center;justify-content:center;z-index:100;gap:20px;}
.spinner{width:60px;height:60px;border:3px solid rgba(0,243,255,.2);border-top:3px solid var(--cyber-blue);
  border-radius:50%;animation:spin 1s linear infinite;box-shadow:0 0 15px var(--cyber-blue);}
@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
.loader-text{font-family:var(--font-display);font-size:.72rem;color:var(--cyber-blue);
  letter-spacing:2px;text-align:center;padding:0 20px;line-height:1.7;}
.progress-bar-container{width:80%;height:6px;background:#1e293b;border-radius:3px;overflow:hidden;
  border:1px solid var(--cyber-blue);}
.progress-bar{width:0%;height:100%;background:var(--acid-green);
  box-shadow:0 0 10px var(--acid-green);transition:width .1s linear;}
footer{padding:8px;text-align:center;font-size:.6rem;color:#64748b;border-top:1px solid #1e293b;background:#010204;}
</style>
</head>
<body>
<div class="mobile-frame">
  <header>
    <div class="logo">ACID-VISION // v11.5</div>
    <div class="status-badge" id="sys-status">SYSTEM READY</div>
  </header>
  <div class="mode-tabs">
    <button class="tab-btn active" id="tabUpscale">⚡ UPGRADE &amp; SCAN</button>
    <button class="tab-btn" id="tabGenerator">🌌 AI DIFFUSION</button>
  </div>
  <div class="main-content">

    <div class="view-section active" id="viewUpscale">
      <div class="collapsible-field" id="fieldUpload">
        <div class="field-header upload-variant" id="fieldUploadHeader">
          <span class="f-icon">🛸</span>
          <div class="f-title">UPLOAD IMAGE FOR STABLE UPSCALE</div>
          <div class="f-sub">PNG · JPG · RAW Neural Feed</div>
          <div class="f-chevron">▼</div>
        </div>
        <div class="field-body">
          <div class="upload-zone-simple">
            <input type="file" id="fileInput" accept="image/*">
            <button class="cyber-btn" id="pickImageBtn" style="pointer-events:none;">📁 CHOOSE IMAGE FILE</button>
          </div>
          <div class="preview-container" id="previewContainer">
            <div class="section-title">INPUT BUFFER PREVIEW</div>
            <div class="canvas-box"><img id="sourceImage" alt="Source"></div>
            <div class="control-group">
              <div class="control-label">Neural Engine Model</div>
              <div class="options-grid" id="engineOptions">
                <div class="opt-btn active" data-val="stable">Stable AI v2</div>
                <div class="opt-btn" data-val="latent">Latent 4x</div>
                <div class="opt-btn" data-val="cyberhd">Cyber HD</div>
              </div>
            </div>
            <div class="control-group">
              <div class="control-label">Alien &amp; Cyber Style Filter</div>
              <div class="options-grid" id="filterOptions">
                <div class="opt-btn active" data-val="Normal">Standard</div>
                <div class="opt-btn" data-val="Cyberpunk">Cyberpunk</div>
                <div class="opt-btn" data-val="Acid Matrix">Acid Matrix</div>
              </div>
            </div>
            <button class="cyber-btn" id="analyzeBtn">RUN STABLE AI &amp; ALIEN SCAN</button>
            <button class="cyber-btn secondary" id="resetBtn">UPLOAD NEW IMAGE</button>
          </div>
          <div class="dashboard" id="dashboard">
            <div class="section-title">TOUCH COMPARISON (ORIGINAL vs STABLE AI 4K)</div>
            <div class="comparison-wrapper" id="comparisonWrapper">
              <img id="compareOrigImg" class="compare-img" alt="Original">
              <div class="enhanced-layer" id="enhancedLayer"><img id="compareEnhImg" alt="Enhanced"></div>
              <div class="slider-handle" id="sliderHandle"></div>
              <div class="badge-tag badge-orig">ORIGINAL</div>
              <div class="badge-tag badge-enh">STABLE AI 4K</div>
            </div>
            <div class="section-title">ALIEN TENSOR ARTIFACT SCANNER</div>
            <div class="cyber-card">
              <div class="card-header">
                <span class="card-title">CLASSIFIED ANALYSIS CARD</span>
                <span class="card-score" id="scoreBadge">--%</span>
              </div>
              <div class="card-body">
                <div id="cardAlloy">Target Alloy: analyzing…</div>
                <div id="cardThreat">Threat Level: analyzing…</div>
                <div id="cardClarity">Texture Clarity: analyzing…</div>
                <div id="cardDominant">Dominant Spectrum: analyzing…</div>
              </div>
            </div>
            <div class="section-title">AI NEURAL TENSOR LOGS</div>
            <div class="terminal" id="terminalLogs"></div>
            <button class="cyber-btn" id="downloadBtn">DOWNLOAD STABLE 4K IMAGE</button>
            <button class="cyber-btn secondary" id="rebtn">PROCESS ANOTHER IMAGE</button>
          </div>
        </div>
      </div>

      <div class="collapsible-field" id="fieldSDXL">
        <div class="field-header sdxl-variant" id="fieldSDXLHeader">
          <span class="f-icon">🎨</span>
          <div class="f-title">SDXL HIGH-QUALITY ENGINE</div>
          <div class="f-sub">FLUX.1 Schnell on Cloudflare GPU · real AI render</div>
          <div class="f-chevron">▼</div>
        </div>
        <div class="field-body">
          <div class="control-group">
            <div class="control-label">SDXL Prompt</div>
            <textarea class="prompt-input" id="sdxlPrompt" style="height:80px;" placeholder="Describe what you want to render…">An ancient alien temple hidden in a jungle, glowing runes, cinematic lighting, hyper detailed, masterpiece</textarea>
          </div>
          <div class="control-group">
            <div class="control-label">SDXL Output Format</div>
            <div class="options-grid" id="sdxlAspectOptions">
              <div class="opt-btn active" data-val="1:1">1:1 Square</div>
              <div class="opt-btn" data-val="4:5">4:5 Portrait</div>
              <div class="opt-btn" data-val="16:9">16:9 Wide</div>
            </div>
          </div>
          <div class="control-group">
            <div class="control-label">SDXL Seed</div>
            <div class="mini-row">
              <input class="mini-input" id="sdxlSeedInput" placeholder="Seed (empty = auto random)" inputmode="numeric">
              <div class="opt-btn" id="sdxlVariantBtn" style="min-width:92px">🎲 VARIANT</div>
            </div>
          </div>
          <div class="enhance-toggle" id="sdxlEnhanceToggle">
            <div>
              <div class="lbl">⚡ SDXL PROMPT ENHANCER</div>
              <div class="sub">injects masterpiece + HD keywords</div>
            </div>
            <div class="switch on" id="sdxlEnhanceSwitch"></div>
          </div>
          <button class="cyber-btn" id="sdxlGenerateBtn">⚡ GENERATE WITH SDXL HD</button>
          <div class="generation-output-box" id="sdxlOutputBox" style="min-height:240px;">
            <div class="placeholder-text" id="sdxlPlaceholder">READY FOR SDXL HD RENDER…<br><span style="color:#334155;font-size:.62rem">Enter a prompt · generate with Cloudflare FLUX.1.</span></div>
            <img id="sdxlGeneratedImg" style="display:none;" alt="SDXL Artwork">
          </div>
          <div class="terminal" id="sdxlLogs" style="height:100px;"></div>
          <button class="cyber-btn secondary" id="sdxlDownloadBtn" style="display:none;">DOWNLOAD SDXL HD IMAGE</button>
        </div>
      </div>

      <div class="collapsible-field" id="fieldDev">
        <div class="field-header dev-variant" id="fieldDevHeader">
          <span class="f-icon">💎</span>
          <div class="f-title">SDXL LIGHTNING ENGINE — ULTRA HD</div>
          <div class="f-sub">SDXL Lightning on Cloudflare GPU · aspect ratio + negative prompt</div>
          <div class="f-chevron">▼</div>
        </div>
        <div class="field-body">
          <div class="control-group">
            <div class="control-label">Dev Prompt</div>
            <textarea class="prompt-input" id="devPrompt" style="height:80px;" placeholder="Describe the ultra-quality image…">A cinematic portrait of a futuristic warrior with glowing armor, dramatic lighting, ultra detailed, masterpiece, 8k</textarea>
          </div>
          <div class="control-group">
            <div class="control-label">Dev Output Format</div>
            <div class="options-grid" id="devAspectOptions">
              <div class="opt-btn active" data-val="1:1">1:1 Square</div>
              <div class="opt-btn" data-val="4:5">4:5 Portrait</div>
              <div class="opt-btn" data-val="16:9">16:9 Wide</div>
            </div>
          </div>
          <div class="control-group">
            <div class="control-label">Dev Seed</div>
            <div class="mini-row">
              <input class="mini-input" id="devSeedInput" placeholder="Seed (empty = auto random)" inputmode="numeric">
              <div class="opt-btn" id="devVariantBtn" style="min-width:92px">🎲 VARIANT</div>
            </div>
          </div>
          <div class="enhance-toggle" id="devEnhanceToggle">
            <div>
              <div class="lbl">💎 DEV PROMPT ENHANCER</div>
              <div class="sub">injects cinematic + ultra HD keywords</div>
            </div>
            <div class="switch on" id="devEnhanceSwitch"></div>
          </div>
          <button class="cyber-btn" id="devGenerateBtn">💎 GENERATE WITH SDXL LIGHTNING</button>
          <div class="generation-output-box" id="devOutputBox" style="min-height:240px;">
            <div class="placeholder-text" id="devPlaceholder">READY FOR FLUX DEV RENDER…<br><span style="color:#334155;font-size:.62rem">Ultra quality mode · slower but sharper.</span></div>
            <img id="devGeneratedImg" style="display:none;" alt="Dev Artwork">
          </div>
          <div class="terminal" id="devLogs" style="height:100px;"></div>
          <button class="cyber-btn secondary" id="devDownloadBtn" style="display:none;">DOWNLOAD DEV IMAGE</button>
        </div>
      </div>
    </div>

    <div class="view-section" id="viewGenerator">
      <div class="section-title">AI DIFFUSION PROMPT MATRIX — REAL IMAGES</div>
      <textarea class="prompt-input" id="promptInput" placeholder="Describe anything…">A lonely samurai standing on a neon Tokyo rooftop at night, rain, cinematic lighting, hyper detailed</textarea>
      <div class="control-group">
        <div class="control-label">Live Prompt Analyzer (NLP)</div>
        <div class="tag-chips" id="tagChips"><span class="chip">type something…</span></div>
      </div>
      <div class="control-group">
        <div class="control-label">🎯 AI Model Engine</div>
        <div class="options-grid models" id="aiEngineOptions">
          <div class="opt-btn model-btn active" data-val="flux"><span class="m-icon">🎨</span><span class="m-name">FLUX</span><span class="m-desc">balanced</span></div>
          <div class="opt-btn model-btn" data-val="turbo"><span class="m-icon">⚡</span><span class="m-name">TURBO</span><span class="m-desc">fast</span></div>
          <div class="opt-btn model-btn" data-val="gptimage"><span class="m-icon">📷</span><span class="m-name">GPT IMAGE</span><span class="m-desc">photoreal</span></div>
          <div class="opt-btn model-btn" data-val="qwen-image"><span class="m-icon">🌌</span><span class="m-name">QWEN</span><span class="m-desc">ultra detail</span></div>
          <div class="opt-btn model-btn" data-val="grok-imagine"><span class="m-icon">🚀</span><span class="m-name">GROK</span><span class="m-desc">creative</span></div>
          <div class="opt-btn model-btn" data-val="ideogram-v4-turbo"><span class="m-icon">✍️</span><span class="m-name">IDEOGRAM</span><span class="m-desc">text</span></div>
        </div>
      </div>
      <div class="control-group">
        <div class="control-label">Output Format</div>
        <div class="options-grid" id="aspectOptions">
          <div class="opt-btn active" data-val="1:1">1:1 Square</div>
          <div class="opt-btn" data-val="4:5">4:5 Portrait</div>
          <div class="opt-btn" data-val="16:9">16:9 Wide</div>
        </div>
      </div>
      <div class="control-group">
        <div class="control-label">Seed Control</div>
        <div class="mini-row">
          <input class="mini-input" id="seedInput" placeholder="Seed (empty = auto random)" inputmode="numeric">
          <div class="opt-btn" id="variantBtn" style="min-width:92px">🎲 VARIANT</div>
        </div>
      </div>
      <div class="enhance-toggle" id="enhanceToggle">
        <div>
          <div class="lbl">⚡ AUTO PROMPT ENHANCER</div>
          <div class="sub">adds cinematic keywords</div>
        </div>
        <div class="switch on" id="enhanceSwitch"></div>
      </div>
      <button class="cyber-btn" id="generateBtn">⚡ GENERATE REAL AI IMAGE</button>
      <div class="section-title">GENERATED MASTERPIECE OUTPUT</div>
      <div class="generation-output-box" id="genOutputBox">
        <div class="placeholder-text" id="genPlaceholder">READY FOR AI DIFFUSION…</div>
        <img id="generatedImg" style="display:none;" alt="Generated Artwork">
      </div>
      <div class="terminal" id="genLogs"></div>
      <button class="cyber-btn secondary" id="downloadGenBtn" style="display:none;">DOWNLOAD GENERATED IMAGE</button>
    </div>
  </div>

  <div class="loader-overlay" id="loaderOverlay">
    <div class="spinner"></div>
    <div class="loader-text" id="loaderText">RUNNING AI DIFFUSION PIPELINE…</div>
    <div class="progress-bar-container"><div class="progress-bar" id="progressBar"></div></div>
  </div>
  <footer>ACID-VISION v11.5 // CLOUDFLARE FLUX.1 + MULTI-MODEL</footer>
</div>

<script>
(function(){
"use strict";
const $ = id => document.getElementById(id);
const API_URL = "";  // same origin now — no CORS

/* ============ MATH ============ */
function hashStr(s){let h=2166136261>>>0;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const lerp=(a,b,t)=>a+(b-a)*t;
function hexToRgb(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255];}
function rgba(hex,a){const c=hexToRgb(hex);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')';}

/* ============ MODELS (Pollinations for mode 2) ============ */
const MODELS = {
  'flux':{name:'Flux',icon:'🎨',pollinationsName:'flux',enhancer:'default'},
  'turbo':{name:'Turbo',icon:'⚡',pollinationsName:'turbo',enhancer:'none'},
  'gptimage':{name:'GPT Image',icon:'📷',pollinationsName:'gptimage',enhancer:'photoreal'},
  'qwen-image':{name:'Qwen Image',icon:'🌌',pollinationsName:'qwen-image',enhancer:'masterpiece'},
  'grok-imagine':{name:'Grok Imagine',icon:'🚀',pollinationsName:'grok-imagine',enhancer:'creative'},
  'ideogram-v4-turbo':{name:'Ideogram',icon:'✍️',pollinationsName:'ideogram-v4-turbo',enhancer:'textual'}
};

/* ============ ENHANCERS ============ */
const ENHANCERS = {
  none: p => p,
  default: p => /realistic|photo|photorealistic|8k|4k|hyper|cinematic/i.test(p) ? p : p+', highly detailed, sharp focus, cinematic lighting, 8k',
  photoreal: p => p+', photorealistic, hyperrealistic, cinematic lighting, depth of field, professional photography, sharp focus, award-winning, 8k uhd, masterpiece',
  masterpiece: p => p+', masterpiece, ultra detailed, intricate details, epic composition, dramatic lighting, volumetric light, 8k, cinematic, hyper detailed, trending on artstation, award winning',
  creative: p => p+', surreal imagination, unexpected angle, vivid dreamlike atmosphere, wildly creative, artistic masterpiece',
  textual: p => p+', crisp clear details, high contrast, sharp lines, professional poster design, vivid colors',
  dev: p => p+', masterpiece, best quality, ultra detailed, 8k uhd, cinematic lighting, volumetric light, ray tracing, octane render, intricate details, sharp focus, dramatic composition, professional photography'
};
function enhancePrompt(prompt,key,enabled){
  if(!enabled) return prompt;
  const fn = ENHANCERS[key] || ENHANCERS.default;
  return fn(prompt.trim());
}

/* ============ LEXICON ============ */
const SUBJECTS=[['alien',['alien','extraterrestrial','ufo','xenomorph','martian','فضایی','بیگانه','موجود فضایی']],['robot',['robot','android','cyborg','mech','ربات','سایبورگ']],['humanoid',['man','woman','warrior','soldier','girl','boy','hero','samurai','ninja','king','queen','انسان','زن','مرد','جنگجو','سامورایی']],['face',['portrait','face','closeup','headshot','چهره','پرتره','صورت']],['vehicle',['car','vehicle','motorcycle','truck','tank','ماشین','خودرو','موتور']],['spaceship',['spaceship','starship','rocket','mothership','spacecraft','سفینه','موشک','فضاپیما']],['creature',['wolf','cat','dog','lion','tiger','bird','horse','dragon','snake','monster','گرگ','گربه','شیر','ببر','اژدها','مار','هیولا']],['tower',['building','tower','temple','castle','pyramid','ساختمان','برج','معبد','قلعه','هرم']],['tree',['tree','forest','jungle','plant','flower','درخت','جنگل','گل']],['abstract',['abstract','pattern','geometric','fractal','انتزاعی','هندسی','الگو']]];
const ENVIRONMENTS=[['city',['city','urban','street','metropolis','tokyo','alley','شهر','خیابان','کوچه']],['space',['space','galaxy','nebula','cosmos','universe','stars','planet','کهکشان','فضا','سیاره','ستاره']],['desert',['desert','dune','sand','کویر','بیابان','شن']],['ocean',['ocean','sea','water','underwater','beach','lake','اقیانوس','دریا','آب','ساحل']],['forest',['forest','jungle','woods','جنگل','بیشه']],['mountain',['mountain','peak','cliff','valley','کوه','قله','صخره','دره']],['ruins',['ruins','abandoned','wasteland','خرابه','ویران','متروک']],['interior',['room','interior','lab','laboratory','اتاق','آزمایشگاه','داخل']],['snow',['snow','ice','winter','frozen','برف','یخ','زمستان']],['sky',['sky','clouds','آسمان','ابر']]];
const MOODS=[['neon',['neon','glowing','glow','نئون','درخشان']],['night',['night','dark','midnight','شب','تاریک']],['day',['day','sunny','daylight','روز','آفتابی']],['sunset',['sunset','dusk','golden hour','غروب','طلوع']],['cinematic',['cinematic','movie','dramatic','epic','سینمایی','دراماتیک','حماسی']],['fog',['fog','mist','haze','smoke','مه','دود']],['rain',['rain','storm','thunder','باران','طوفان','رعد']],['fire',['fire','flame','burning','آتش','شعله']],['ethereal',['dream','ethereal','mystical','magic','رؤیا','جادویی','روحانی']]];
const STYLES=[['cyberpunk',['cyberpunk','sci fi','futuristic','dystopian','سایبرپانک','آینده','علمی تخیلی']],['realistic',['realistic','photorealistic','photo','8k','4k','واقعی','فوتورئال','عکس']],['anime',['anime','manga','cartoon','comic','انیمه','مانگا','کارتون']],['painting',['oil painting','watercolor','painting','نقاشی','رنگ روغن','آبرنگ']],['lowpoly',['low poly','voxel','pixel art','8 bit','پیکسل','وکسل']],['surreal',['surreal','surrealism','dreamlike','سورئال','فراواقعی']],['vaporwave',['vaporwave','synthwave','retrowave','نئون رترو']]];
const COLORS=[['#39ff14',['green','acid green','lime','سبز','سبز نئونی']],['#00f3ff',['blue','cyan','azure','آبی','فیروزه']],['#ff2d2d',['red','crimson','قرمز','سرخ']],['#a855f7',['purple','violet','بنفش','ارغوانی']],['#ff007f',['pink','magenta','صورتی','سرخابی']],['#ffd166',['gold','yellow','amber','طلایی','زرد']],['#ff7a00',['orange','نارنجی']],['#ffffff',['white','silver','سفید','نقره']],['#0f172a',['black','dark','سیاه','تیره']],['#14b8a6',['teal','turquoise','فیروزه ای']]];

function compile(list){var out=[];for(var i=0;i<list.length;i++){var name=list[i][0];var words=[];for(var j=0;j<list[i][1].length;j++){var w=list[i][1][j];if(/[a-z]/i.test(w)){words.push(new RegExp('(^|[^a-z0-9])'+w+'([^a-z0-9]|$)','i'));}else{words.push(w);}}out.push([name,words]);}return out;}
const C_SUBJ=compile(SUBJECTS),C_ENV=compile(ENVIRONMENTS),C_MOOD=compile(MOODS),C_STYLE=compile(STYLES),C_COL=compile(COLORS);
function normalizePrompt(raw){return ' '+String(raw||'').toLowerCase().replace(/[،,.\-_/\\()\[\]{}:;!?"'«»#*]/g,' ').replace(/\s+/g,' ')+' ';}
function matchList(t,list,out,bucket){for(let i=0;i<list.length;i++){const name=list[i][0],words=list[i][1];for(let j=0;j<words.length;j++){const w=words[j];const ok=(typeof w==='string')?(t.indexOf(w)>=0):w.test(t);if(ok){out[bucket].push(name);out.tags.push(name);break;}}}}
function analyze(raw){const t=normalizePrompt(raw);const res={subjects:[],envs:[],moods:[],styles:[],colors:[],tags:[]};matchList(t,C_SUBJ,res,'subjects');matchList(t,C_ENV,res,'envs');matchList(t,C_MOOD,res,'moods');matchList(t,C_STYLE,res,'styles');for(let i=0;i<C_COL.length;i++){const words=C_COL[i][1];for(let j=0;j<words.length;j++){const w=words[j];const ok=(typeof w==='string')?(t.indexOf(w)>=0):w.test(t);if(ok){res.colors.push(C_COL[i][0]);res.tags.push('color');break;}}}return res;}

/* ============ FALLBACK ============ */
function renderFallback(canvas,prompt,variant){const ctx=canvas.getContext('2d');const W=canvas.width,H=canvas.height;const seed=hashStr(prompt+'::'+variant+'::'+W+'x'+H);const rng=mulberry32(seed);const pal=['#00f3ff','#39ff14','#ff007f','#a855f7','#ffd166'];const S=Math.min(W,H);ctx.fillStyle='#02030a';ctx.fillRect(0,0,W,H);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<6;i++){const x=rng()*W,y=rng()*H,r=S*(0.2+rng()*0.5);const c=pal[Math.floor(rng()*pal.length)];const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(c,0.22));g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}for(let i=0;i<300;i++){const x=rng()*W,y=rng()*H,r=rng()*1.6+0.3;ctx.fillStyle=rgba('#ffffff',0.2+rng()*0.8);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}ctx.restore();const vg=ctx.createRadialGradient(W/2,H/2,S*0.25,W/2,H/2,S*0.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.6)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);return {seed:seed};}

/* ============ CLOUDFLARE — same origin ============ */
async function generateWithCloudflare(prompt, model){
  const res = await fetch(API_URL || location.origin, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({prompt:prompt, model: model || "schnell"})
  });
  if(!res.ok){let txt="";try{txt=await res.text();}catch(e){}throw new Error("HTTP "+res.status+" "+txt.slice(0,200));}

  const contentType = res.headers.get("Content-Type");
  // حالت Dreamshaper: پاسخ مستقیم تصویر است
  if (contentType && contentType.startsWith("image/")) {
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  // حالت FLUX: پاسخ JSON با base64
  const data = await res.json();
  if(!data.ok||!data.image) throw new Error(data.error||"No image");
  return data.image;
}

/* ============ POLLINATIONS ============ */
function buildPollinationsURL(prompt,aspect,seed,modelName,variant){
  const dims={'1:1':[1024,1024],'4:5':[896,1120],'16:9':[1280,720]}[aspect]||[1024,1024];
  const seedVal=(seed!=null&&!isNaN(seed))?seed:variant;
  const params=new URLSearchParams({width:String(dims[0]),height:String(dims[1]),seed:String(seedVal),model:modelName,nologo:'true',enhance:'true',safe:'false',private:'true',_t:String(Date.now())});
  return 'https://image.pollinations.ai/prompt/'+encodeURIComponent(prompt)+'?'+params.toString();
}
function generateWithPollinations(prompt,aspect,seed,modelName,variant){
  return new Promise((resolve,reject)=>{
    const url=buildPollinationsURL(prompt,aspect,seed,modelName,variant);
    const img=new Image();img.crossOrigin='anonymous';let finished=false;
    const timeout=setTimeout(()=>{if(finished)return;finished=true;img.src='';reject(new Error('TIMEOUT'));},90000);
    img.onload=()=>{if(finished)return;finished=true;clearTimeout(timeout);resolve({url:url,img:img});};
    img.onerror=()=>{if(finished)return;finished=true;clearTimeout(timeout);reject(new Error('LOAD_ERROR'));};
    img.src=url;
  });
}

/* ============ IMAGE ENHANCER ============ */
function enhanceImage(img,engineKey,filterKey){
  const scaleMap={stable:2,latent:3,cyberhd:3};const sharpenMap={stable:0.34,latent:0.52,cyberhd:0.78};
  const scale=scaleMap[engineKey]||2;const amount=sharpenMap[engineKey]||0.4;
  let sw=img.naturalWidth||img.width,sh=img.naturalHeight||img.height;
  const maxDim=1800;const fit=Math.min(scale,maxDim/Math.max(sw,sh));
  const tw=Math.max(2,Math.round(sw*fit)),th=Math.max(2,Math.round(sh*fit));
  const base=document.createElement('canvas');base.width=tw;base.height=th;
  const bctx=base.getContext('2d');bctx.imageSmoothingEnabled=true;bctx.imageSmoothingQuality='high';
  bctx.drawImage(img,0,0,tw,th);
  const tiny=document.createElement('canvas');tiny.width=Math.max(1,Math.round(tw/14));tiny.height=Math.max(1,Math.round(th/14));
  const tctx=tiny.getContext('2d');tctx.imageSmoothingEnabled=true;tctx.imageSmoothingQuality='high';tctx.drawImage(base,0,0,tiny.width,tiny.height);
  const blur=document.createElement('canvas');blur.width=tw;blur.height=th;
  const blctx=blur.getContext('2d');blctx.imageSmoothingEnabled=true;blctx.imageSmoothingQuality='high';blctx.drawImage(tiny,0,0,tw,th);
  const out=document.createElement('canvas');out.width=tw;out.height=th;const octx=out.getContext('2d');octx.drawImage(base,0,0);
  const hp=document.createElement('canvas');hp.width=tw;hp.height=th;const hctx=hp.getContext('2d');
  hctx.drawImage(base,0,0);hctx.globalCompositeOperation='difference';hctx.drawImage(blur,0,0);
  octx.save();octx.globalCompositeOperation='lighter';octx.globalAlpha=amount;octx.drawImage(hp,0,0);octx.restore();
  if(filterKey==='Cyberpunk'){
    octx.save();octx.globalCompositeOperation='soft-light';octx.fillStyle='rgba(90,20,180,0.35)';octx.fillRect(0,0,tw,th);octx.restore();
    octx.save();octx.globalCompositeOperation='screen';octx.fillStyle='rgba(255,0,127,0.10)';octx.fillRect(0,0,tw,th);octx.fillStyle='rgba(0,243,255,0.10)';octx.fillRect(0,0,tw,th);octx.restore();
    octx.save();octx.globalAlpha=0.07;octx.fillStyle='#000';for(let y=0;y<th;y+=3)octx.fillRect(0,y,tw,1);octx.restore();
  } else if(filterKey==='Acid Matrix'){
    octx.save();octx.globalCompositeOperation='soft-light';octx.fillStyle='rgba(10,80,20,0.45)';octx.fillRect(0,0,tw,th);octx.restore();
    octx.save();octx.globalCompositeOperation='screen';octx.fillStyle='rgba(57,255,20,0.13)';octx.fillRect(0,0,tw,th);octx.restore();
    octx.save();octx.globalAlpha=0.08;octx.fillStyle='#000';for(let y=0;y<th;y+=3)octx.fillRect(0,y,tw,1);octx.restore();
  } else {
    octx.save();octx.globalCompositeOperation='overlay';octx.fillStyle='rgba(128,128,128,0.10)';octx.fillRect(0,0,tw,th);octx.restore();
  }
  const imgData=octx.getImageData(0,0,tw,th);const d=imgData.data;
  for(let i=0;i<d.length;i+=4){const n=(Math.random()-0.5)*7;d[i]=Math.max(0,Math.min(255,d[i]+n));d[i+1]=Math.max(0,Math.min(255,d[i+1]+n));d[i+2]=Math.max(0,Math.min(255,d[i+2]+n));}
  octx.putImageData(imgData,0,0);
  const vg2=octx.createRadialGradient(tw/2,th/2,Math.min(tw,th)*0.28,tw/2,th/2,Math.max(tw,th)*0.72);
  vg2.addColorStop(0,'rgba(0,0,0,0)');vg2.addColorStop(1,'rgba(0,0,0,0.38)');
  octx.fillStyle=vg2;octx.fillRect(0,0,tw,th);
  return out;
}

function analyzeImageStats(canvas){
  const w=72,h=72;const c=document.createElement('canvas');c.width=w;c.height=h;
  const cx=c.getContext('2d');cx.drawImage(canvas,0,0,w,h);const d=cx.getImageData(0,0,w,h).data;
  let sum=0,sum2=0,satSum=0,rs=0,gs=0,bs=0;const n=w*h;const lum=new Float32Array(n);
  for(let i=0,p=0;i<d.length;i+=4,p++){const r=d[i],g=d[i+1],b=d[i+2];const L=0.2126*r+0.7152*g+0.0722*b;lum[p]=L;sum+=L;sum2+=L*L;rs+=r;gs+=g;bs+=b;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);satSum+=mx===0?0:(mx-mn)/mx;}
  const mean=sum/n;const variance=Math.max(0,sum2/n-mean*mean);const std=Math.sqrt(variance);const sat=satSum/n;
  let edge=0;for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;const gx=-lum[i-w-1]-2*lum[i-1]-lum[i+w-1]+lum[i-w+1]+2*lum[i+1]+lum[i+w+1];const gy=-lum[i-w-1]-2*lum[i-w]-lum[i-w+1]+lum[i+w-1]+2*lum[i+w]+lum[i+w+1];edge+=Math.sqrt(gx*gx+gy*gy);}edge=edge/(n*4);
  return {mean:mean,std:std,sat:sat,edge:edge,r:rs/n,g:gs/n,b:bs/n};
}
function statsToCard(st){
  let spectrum='NEUTRAL';const r=st.r,g=st.g,b=st.b;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
  if(mx-mn<12)spectrum=st.mean>128?'ACHROMATIC / BRIGHT':'ACHROMATIC / DARK';
  else if(r>=g&&r>=b)spectrum=g>b?'WARM GOLD-ORANGE':'MAGENTA-CRIMSON';
  else if(g>=r&&g>=b)spectrum=b>r?'COOL CYAN-TEAL':'ACID GREEN-LIME';
  else spectrum=r>g?'VIOLET-BLUE':'CYBER BLUE';
  const alloys=['Unknown Extraterrestrial Composite','Crystalline Titanium Lattice','Bio-Synthetic Polymer Weave','Quantum-Forge Adamantine','Obsidian Carbon Nanotube','Ferro-Fluid Nanite Alloy'];
  const alloyIdx=Math.floor((st.edge*7+st.sat*13+st.std*3)%alloys.length);
  const threatLevels=['OMEGA // MAXIMUM CONTAINMENT','BETA // ELEVATED SIGNAL','ALPHA // STABLE','GAMMA // TRACE ANOMALY','DELTA // DORMANT'];
  const tIdx=Math.min(4,Math.floor(st.edge/8+st.sat*2));
  const clarity=st.std>60?'HYPER-SHARP SUPER RESOLUTION':st.std>38?'HIGH-FIDELITY TENSOR RECONSTRUCTION':'LATENT DETAIL RECOVERY MODE';
  const score=Math.max(72,Math.min(99.9,78+st.std*0.16+st.sat*8+Math.min(st.edge,40)*0.22));
  return {alloy:alloys[alloyIdx],threat:threatLevels[tIdx],clarity:clarity,spectrum:spectrum,score:score.toFixed(1)};
}

/* ============ UI ============ */
const el={
  tabUpscale:$('tabUpscale'),tabGenerator:$('tabGenerator'),viewUpscale:$('viewUpscale'),viewGenerator:$('viewGenerator'),sysStatus:$('sys-status'),
  fieldUpload:$('fieldUpload'),fieldUploadHeader:$('fieldUploadHeader'),fieldSDXL:$('fieldSDXL'),fieldSDXLHeader:$('fieldSDXLHeader'),
  fieldDev:$('fieldDev'),fieldDevHeader:$('fieldDevHeader'),
  fileInput:$('fileInput'),previewContainer:$('previewContainer'),sourceImage:$('sourceImage'),analyzeBtn:$('analyzeBtn'),resetBtn:$('resetBtn'),
  dashboard:$('dashboard'),compareOrigImg:$('compareOrigImg'),compareEnhImg:$('compareEnhImg'),enhancedLayer:$('enhancedLayer'),
  sliderHandle:$('sliderHandle'),comparisonWrapper:$('comparisonWrapper'),scoreBadge:$('scoreBadge'),cardAlloy:$('cardAlloy'),
  cardThreat:$('cardThreat'),cardClarity:$('cardClarity'),cardDominant:$('cardDominant'),terminalLogs:$('terminalLogs'),
  downloadBtn:$('downloadBtn'),rebtn:$('rebtn'),
  sdxlPrompt:$('sdxlPrompt'),sdxlAspectOptions:$('sdxlAspectOptions'),sdxlSeedInput:$('sdxlSeedInput'),sdxlVariantBtn:$('sdxlVariantBtn'),
  sdxlEnhanceSwitch:$('sdxlEnhanceSwitch'),sdxlGenerateBtn:$('sdxlGenerateBtn'),sdxlPlaceholder:$('sdxlPlaceholder'),
  sdxlGeneratedImg:$('sdxlGeneratedImg'),sdxlDownloadBtn:$('sdxlDownloadBtn'),sdxlLogs:$('sdxlLogs'),
  devPrompt:$('devPrompt'),devAspectOptions:$('devAspectOptions'),devSeedInput:$('devSeedInput'),devVariantBtn:$('devVariantBtn'),
  devEnhanceSwitch:$('devEnhanceSwitch'),devGenerateBtn:$('devGenerateBtn'),devPlaceholder:$('devPlaceholder'),
  devGeneratedImg:$('devGeneratedImg'),devDownloadBtn:$('devDownloadBtn'),devLogs:$('devLogs'),
  promptInput:$('promptInput'),tagChips:$('tagChips'),aspectOptions:$('aspectOptions'),seedInput:$('seedInput'),variantBtn:$('variantBtn'),
  generateBtn:$('generateBtn'),aiEngineOptions:$('aiEngineOptions'),enhanceSwitch:$('enhanceSwitch'),genPlaceholder:$('genPlaceholder'),
  generatedImg:$('generatedImg'),downloadGenBtn:$('downloadGenBtn'),genLogs:$('genLogs'),
  loaderOverlay:$('loaderOverlay'),loaderText:$('loaderText'),progressBar:$('progressBar')
};

const state={
  engine:'stable',filter:'Normal',aspect:'1:1',aiEngine:'flux',enhance:true,variant:0,
  sdxlAspect:'1:1',sdxlEnhance:true,sdxlVariant:0,sdxlGeneratedURL:null,
  devAspect:'1:1',devEnhance:true,devVariant:0,devGeneratedURL:null,
  sourceImg:null,enhancedCanvas:null,generatedURL:null,generatedCanvas:null
};

function runLoader(text,minMs,task){
  return new Promise((resolve)=>{
    el.loaderOverlay.style.display='flex';el.loaderText.textContent=text;el.progressBar.style.width='0%';
    let p=0;const iv=setInterval(()=>{p=Math.min(94,p+Math.random()*5+1);el.progressBar.style.width=p+'%';},140);
    const t0=performance.now();
    const finish=(result)=>{const elapsed=performance.now()-t0;const wait=Math.max(0,minMs-elapsed);
      setTimeout(()=>{clearInterval(iv);el.progressBar.style.width='100%';setTimeout(()=>{el.loaderOverlay.style.display='none';resolve(result);},240);},wait);};
    if(task.length>=1)task(finish);else setTimeout(()=>{let r=null;try{r=task();}catch(e){}finish(r);},60);
  });
}

el.tabUpscale.addEventListener('click',()=>{el.tabUpscale.classList.add('active');el.tabGenerator.classList.remove('active');el.viewUpscale.classList.add('active');el.viewGenerator.classList.remove('active');});
el.tabGenerator.addEventListener('click',()=>{el.tabGenerator.classList.add('active');el.tabUpscale.classList.remove('active');el.viewGenerator.classList.add('active');el.viewUpscale.classList.remove('active');});
el.fieldUploadHeader.addEventListener('click',()=>el.fieldUpload.classList.toggle('expanded'));
el.fieldSDXLHeader.addEventListener('click',()=>el.fieldSDXL.classList.toggle('expanded'));
el.fieldDevHeader.addEventListener('click',()=>el.fieldDev.classList.toggle('expanded'));

function wireOptions(containerId,key){const box=$(containerId);if(!box)return;box.addEventListener('click',(e)=>{const t=e.target.closest('.opt-btn');if(!t||!t.dataset.val)return;Array.prototype.forEach.call(box.querySelectorAll('.opt-btn'),b=>b.classList.remove('active'));t.classList.add('active');state[key]=t.dataset.val;});}
wireOptions('engineOptions','engine');wireOptions('filterOptions','filter');wireOptions('aspectOptions','aspect');wireOptions('aiEngineOptions','aiEngine');wireOptions('sdxlAspectOptions','sdxlAspect');wireOptions('devAspectOptions','devAspect');

el.enhanceSwitch.addEventListener('click',()=>{state.enhance=!state.enhance;el.enhanceSwitch.classList.toggle('on',state.enhance);logLine(el.genLogs,'Enhancer → '+(state.enhance?'ON':'OFF'));});
el.sdxlEnhanceSwitch.addEventListener('click',()=>{state.sdxlEnhance=!state.sdxlEnhance;el.sdxlEnhanceSwitch.classList.toggle('on',state.sdxlEnhance);logLine(el.sdxlLogs,'Enhancer → '+(state.sdxlEnhance?'ON':'OFF'));});
el.devEnhanceSwitch.addEventListener('click',()=>{state.devEnhance=!state.devEnhance;el.devEnhanceSwitch.classList.toggle('on',state.devEnhance);logLine(el.devLogs,'Enhancer → '+(state.devEnhance?'ON':'OFF'));});

function setStatus(txt){el.sysStatus.textContent=txt;}
function logLine(container,text){const d=document.createElement('div');d.className='log-line';d.textContent='> '+text;container.appendChild(d);container.scrollTop=container.scrollHeight;}
function typeLogs(container,lines,delay){container.innerHTML='';lines.forEach((l,i)=>{setTimeout(()=>logLine(container,l),i*delay);});}

/* ===== MODE 1 — UPLOADER ===== */
el.fileInput.addEventListener('change',(e)=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;
  const reader=new FileReader();
  reader.onload=(ev)=>{const img=new Image();img.onload=()=>{state.sourceImg=img;el.sourceImage.src=ev.target.result;el.compareOrigImg.src=ev.target.result;el.previewContainer.style.display='flex';el.dashboard.style.display='none';el.fieldUpload.classList.add('expanded');setStatus('IMAGE LOADED');};img.src=ev.target.result;};
  reader.readAsDataURL(f);
});
el.resetBtn.addEventListener('click',()=>{el.previewContainer.style.display='none';el.dashboard.style.display='none';el.fileInput.value='';setStatus('SYSTEM READY');});
el.rebtn.addEventListener('click',()=>{el.dashboard.style.display='none';el.previewContainer.style.display='none';el.fileInput.value='';setStatus('SYSTEM READY');});

el.analyzeBtn.addEventListener('click',()=>{
  if(!state.sourceImg)return;setStatus('PROCESSING…');
  runLoader('RUNNING STABLE DIFFUSION & ALIEN SCAN…',1900,()=>{const out=enhanceImage(state.sourceImg,state.engine,state.filter);state.enhancedCanvas=out;const stats=analyzeImageStats(out);return {canvas:out,stats:stats};})
  .then((res)=>{if(!res)return;el.compareEnhImg.src=res.canvas.toDataURL('image/png');
    const card=statsToCard(res.stats);el.scoreBadge.textContent=card.score+'%';
    el.cardAlloy.textContent='Target Alloy: '+card.alloy;el.cardThreat.textContent='Threat Level: '+card.threat;
    el.cardClarity.textContent='Texture Clarity: '+card.clarity;el.cardDominant.textContent='Dominant Spectrum: '+card.spectrum;
    el.dashboard.style.display='flex';setSlider(50);
    typeLogs(el.terminalLogs,['Stable AI Neural pipeline linked.','Engine: '+state.engine+'.','Filter: '+state.filter+'.','Edge energy: '+res.stats.edge.toFixed(2)+'.','Contrast: '+res.stats.std.toFixed(2)+'.','Scan complete — '+card.score+'% confidence.'],190);
    setStatus('SCAN COMPLETE');});
});

function setSlider(pct){const p=Math.max(0,Math.min(100,pct));el.enhancedLayer.style.clipPath='polygon('+p+'% 0, 100% 0, 100% 100%, '+p+'% 100%)';el.sliderHandle.style.left=p+'%';}
let dragging=false;
function pointerPct(e){const r=el.comparisonWrapper.getBoundingClientRect();const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;return (x/r.width)*100;}
el.comparisonWrapper.addEventListener('pointerdown',(e)=>{dragging=true;setSlider(pointerPct(e));});
window.addEventListener('pointermove',(e)=>{if(dragging)setSlider(pointerPct(e));});
window.addEventListener('pointerup',()=>{dragging=false;});
window.addEventListener('pointercancel',()=>{dragging=false;});
el.downloadBtn.addEventListener('click',()=>{if(!state.enhancedCanvas)return;const a=document.createElement('a');a.download='acid-vision-4k-'+Date.now()+'.png';a.href=state.enhancedCanvas.toDataURL('image/png');a.click();});

/* ===== SDXL via same-origin Worker (schnell) ===== */
el.sdxlVariantBtn.addEventListener('click',()=>{state.sdxlVariant=Math.floor(Math.random()*999999);el.sdxlSeedInput.value=state.sdxlVariant;logLine(el.sdxlLogs,'Seed randomized → '+state.sdxlVariant);});

el.sdxlGenerateBtn.addEventListener('click',()=>{
  const raw=(el.sdxlPrompt.value||'').trim();if(!raw){el.sdxlPrompt.focus();return;}
  const seedTxt=el.sdxlSeedInput.value.trim();
  if(seedTxt&&!isNaN(parseInt(seedTxt,10)))state.sdxlVariant=parseInt(seedTxt,10);
  else state.sdxlVariant=(state.sdxlVariant+1)%1000000;
  let finalPrompt=raw;
  if(state.sdxlEnhance)finalPrompt=enhancePrompt(finalPrompt,'masterpiece',true);

  setStatus('SDXL RENDERING…');el.sdxlGenerateBtn.disabled=true;
  el.sdxlGeneratedImg.style.display='none';el.sdxlDownloadBtn.style.display='none';
  el.sdxlPlaceholder.style.display='block';
  el.sdxlPlaceholder.innerHTML='CONNECTING TO CLOUDFLARE FLUX.1 SCHNELL…<br><span style="color:#334155;font-size:.62rem">GPU-accelerated render · usually 2–6 seconds</span>';

  const A=analyze(raw);const detected=A.tags.filter(t=>t!=='color').length;
  logLine(el.sdxlLogs,'→ Dispatching to Cloudflare FLUX.1 schnell…');
  logLine(el.sdxlLogs,'Prompt tokens: '+detected+' semantic anchors.');
  if(state.sdxlEnhance)logLine(el.sdxlLogs,'⚡ Enhancer: +'+(finalPrompt.length-raw.length)+' chars.');
  logLine(el.sdxlLogs,'Endpoint: '+location.origin);

  const t0=performance.now();
  runLoader('CLOUDFLARE FLUX.1 SCHNELL — RENDERING…',800,(done)=>{
    generateWithCloudflare(finalPrompt, 'schnell')
      .then((dataURL)=>{done({ok:true,dataURL:dataURL,elapsed:((performance.now()-t0)/1000).toFixed(1)});})
      .catch((err)=>{console.warn('Cloudflare failed:',err);logLine(el.sdxlLogs,'❌ '+err.message);done({ok:false,error:err.message,elapsed:((performance.now()-t0)/1000).toFixed(1),prompt:raw});});
  }).then((res)=>{
    el.sdxlGenerateBtn.disabled=false;
    if(res.ok){
      state.sdxlGeneratedURL=res.dataURL;el.sdxlGeneratedImg.src=res.dataURL;
      el.sdxlGeneratedImg.style.display='block';el.sdxlPlaceholder.style.display='none';el.sdxlDownloadBtn.style.display='block';
      logLine(el.sdxlLogs,'✓ Render received in '+res.elapsed+'s.');
      logLine(el.sdxlLogs,'Engine: Cloudflare FLUX.1 schnell.');
      logLine(el.sdxlLogs,'Output buffered. Ready to download.');
      setStatus('SDXL COMPLETE');
    } else {
      logLine(el.sdxlLogs,'⚠ Error ('+res.error+').');
      logLine(el.sdxlLogs,'→ Falling back to offline procedural renderer…');
      const c=document.createElement('canvas');c.width=1024;c.height=1024;
      renderFallback(c,res.prompt,state.sdxlVariant);state.sdxlGeneratedURL=c.toDataURL('image/png');
      el.sdxlGeneratedImg.src=state.sdxlGeneratedURL;el.sdxlGeneratedImg.style.display='block';
      el.sdxlPlaceholder.style.display='none';el.sdxlDownloadBtn.style.display='block';
      logLine(el.sdxlLogs,'✓ Fallback render complete.');
      setStatus('SDXL FALLBACK');
    }
  });
});
el.sdxlDownloadBtn.addEventListener('click',()=>{const a=document.createElement('a');a.download='acid-vision-schnell-'+state.sdxlVariant+'.png';if(state.sdxlGeneratedURL){a.href=state.sdxlGeneratedURL;a.click();}});

/* ===== DEV via same-origin Worker (flux-1-dev) ===== */
el.devVariantBtn.addEventListener('click',()=>{state.devVariant=Math.floor(Math.random()*999999);el.devSeedInput.value=state.devVariant;logLine(el.devLogs,'Seed randomized → '+state.devVariant);});

el.devGenerateBtn.addEventListener('click',()=>{
  const raw=(el.devPrompt.value||'').trim();if(!raw){el.devPrompt.focus();return;}
  const seedTxt=el.devSeedInput.value.trim();
  if(seedTxt&&!isNaN(parseInt(seedTxt,10)))state.devVariant=parseInt(seedTxt,10);
  else state.devVariant=(state.devVariant+1)%1000000;
  let finalPrompt=raw;
  if(state.devEnhance)finalPrompt=enhancePrompt(finalPrompt,'dev',true);

  setStatus('DEV RENDERING…');el.devGenerateBtn.disabled=true;
  el.devGeneratedImg.style.display='none';el.devDownloadBtn.style.display='none';
  el.devPlaceholder.style.display='block';
  el.devPlaceholder.innerHTML='CONNECTING TO FLUX.1 DEV ENGINE…<br><span style="color:#334155;font-size:.62rem">Ultra HD mode · may take 10–30 seconds</span>';

  const A=analyze(raw);const detected=A.tags.filter(t=>t!=='color').length;
  logLine(el.devLogs,'→ Dispatching to SDXL Lightning (ultra HD)…');
  logLine(el.devLogs,'Prompt tokens: '+detected+' semantic anchors.');
  if(state.devEnhance)logLine(el.devLogs,'💎 Dev enhancer: +'+(finalPrompt.length-raw.length)+' chars.');
  logLine(el.devLogs,'Endpoint: '+location.origin);

  const t0=performance.now();
  runLoader('FLUX.1 DEV — ULTRA HD RENDERING…',1500,(done)=>{
    generateWithCloudflare(finalPrompt, 'dev')
      .then((dataURL)=>{done({ok:true,dataURL:dataURL,elapsed:((performance.now()-t0)/1000).toFixed(1)});})
      .catch((err)=>{console.warn('FLUX Dev failed:',err);logLine(el.devLogs,'❌ '+err.message);done({ok:false,error:err.message,elapsed:((performance.now()-t0)/1000).toFixed(1),prompt:raw});});
  }).then((res)=>{
    el.devGenerateBtn.disabled=false;
    if(res.ok){
      state.devGeneratedURL=res.dataURL;el.devGeneratedImg.src=res.dataURL;
      el.devGeneratedImg.style.display='block';el.devPlaceholder.style.display='none';el.devDownloadBtn.style.display='block';
      logLine(el.devLogs,'✓ Render received in '+res.elapsed+'s.');
      logLine(el.devLogs,'Engine: Cloudflare SDXL Lightning.');
      logLine(el.devLogs,'Output buffered. Ready to download.');
      setStatus('DEV COMPLETE');
    } else {
      logLine(el.devLogs,'⚠ Error ('+res.error+').');
      logLine(el.devLogs,'→ Falling back to offline procedural renderer…');
      const c=document.createElement('canvas');c.width=1024;c.height=1024;
      renderFallback(c,res.prompt,state.devVariant);state.devGeneratedURL=c.toDataURL('image/png');
      el.devGeneratedImg.src=state.devGeneratedURL;el.devGeneratedImg.style.display='block';
      el.devPlaceholder.style.display='none';el.devDownloadBtn.style.display='block';
      logLine(el.devLogs,'✓ Fallback render complete.');
      setStatus('DEV FALLBACK');
    }
  });
});
el.devDownloadBtn.addEventListener('click',()=>{const a=document.createElement('a');a.download='acid-vision-dev-'+state.devVariant+'.png';if(state.devGeneratedURL){a.href=state.devGeneratedURL;a.click();}});

/* ===== MODE 2 — Pollinations multi-model ===== */
const TAG_LABELS={alien:'ALIEN',robot:'ROBOT',humanoid:'HUMANOID',face:'PORTRAIT',vehicle:'VEHICLE',spaceship:'SPACECRAFT',creature:'CREATURE',tower:'ARCHITECTURE',tree:'FLORA',abstract:'ABSTRACT',city:'CITY',space:'DEEP SPACE',desert:'DESERT',ocean:'OCEAN',forest:'FOREST',mountain:'MOUNTAINS',ruins:'RUINS',interior:'INTERIOR',snow:'SNOW/ICE',sky:'SKY',neon:'NEON',night:'NIGHT',day:'DAYLIGHT',sunset:'SUNSET',cinematic:'CINEMATIC',fog:'FOG',rain:'RAIN',fire:'FIRE',ethereal:'ETHEREAL',cyberpunk:'CYBERPUNK',realistic:'PHOTOREAL',anime:'ANIME',painting:'PAINTING',lowpoly:'LOWPOLY',surreal:'SURREAL',vaporwave:'VAPORWAVE'};
const SUBJ_SET={alien:1,robot:1,humanoid:1,face:1,vehicle:1,spaceship:1,creature:1,tower:1,tree:1,abstract:1};
const ENV_SET={city:1,space:1,desert:1,ocean:1,forest:1,mountain:1,ruins:1,interior:1,snow:1,sky:1};
const MOOD_SET={neon:1,night:1,day:1,sunset:1,cinematic:1,fog:1,rain:1,fire:1,ethereal:1};
const STYLE_SET={cyberpunk:1,realistic:1,anime:1,painting:1,lowpoly:1,surreal:1,vaporwave:1};

function refreshChips(){
  const A=analyze(el.promptInput.value);el.tagChips.innerHTML='';const seen={};let count=0;
  A.tags.forEach((t)=>{if(seen[t])return;seen[t]=1;if(t==='color')return;let cls='chip';if(SUBJ_SET[t])cls+=' sub';else if(ENV_SET[t])cls+=' env';else if(MOOD_SET[t])cls+=' mood';else if(STYLE_SET[t])cls+=' style';const s=document.createElement('span');s.className=cls;s.textContent=TAG_LABELS[t]||t.toUpperCase();el.tagChips.appendChild(s);count++;});
  A.colors.forEach((c)=>{const s=document.createElement('span');s.className='chip col';s.style.background=c;el.tagChips.appendChild(s);count++;});
  if(count===0){const s=document.createElement('span');s.className='chip';s.textContent='GENERIC COMPOSITION';el.tagChips.appendChild(s);}
}
el.promptInput.addEventListener('input',refreshChips);
el.variantBtn.addEventListener('click',()=>{state.variant=Math.floor(Math.random()*999999);el.seedInput.value=state.variant;logLine(el.genLogs,'Seed → '+state.variant);});

el.generateBtn.addEventListener('click',()=>{
  const raw=(el.promptInput.value||'').trim();if(!raw){el.promptInput.focus();return;}
  const seedTxt=el.seedInput.value.trim();let seed=null;
  if(seedTxt&&!isNaN(parseInt(seedTxt,10))){seed=parseInt(seedTxt,10);state.variant=seed;}
  else state.variant=(state.variant+1)%1000000;
  const model=MODELS[state.aiEngine]||MODELS['flux'];
  const finalPrompt=enhancePrompt(raw,model.enhancer,state.enhance);
  setStatus('DIFFUSING…');el.generateBtn.disabled=true;
  el.generatedImg.style.display='none';el.downloadGenBtn.style.display='none';
  el.genPlaceholder.style.display='block';
  el.genPlaceholder.innerHTML='CONNECTING TO AI DIFFUSION NETWORK…<br><span style="color:#334155;font-size:.62rem">'+model.icon+' '+model.name+' engine · '+(state.enhance?'enhanced':'raw')+' prompt</span>';
  logLine(el.genLogs,'→ Dispatching…');
  logLine(el.genLogs,'Model: '+model.icon+' '+model.name);
  logLine(el.genLogs,'Aspect: '+state.aspect+' | Seed: '+state.variant);
  const t0=performance.now();
  runLoader('AI DIFFUSION — '+model.name.toUpperCase()+' — GENERATING…',1500,(done)=>{
    generateWithPollinations(finalPrompt,state.aspect,seed,model.pollinationsName,state.variant)
      .then((result)=>{done({ok:true,result:result,elapsed:((performance.now()-t0)/1000).toFixed(1)});})
      .catch((err)=>{done({ok:false,error:err.message,elapsed:((performance.now()-t0)/1000).toFixed(1),prompt:raw});});
  }).then((res)=>{
    el.generateBtn.disabled=false;
    if(res.ok){
      state.generatedURL=res.result.url;state.generatedCanvas=null;
      el.generatedImg.src=res.result.url;el.generatedImg.style.display='block';
      el.genPlaceholder.style.display='none';el.downloadGenBtn.style.display='block';
      logLine(el.genLogs,'✓ Image in '+res.elapsed+'s.');setStatus('RENDER COMPLETE');
    } else {
      logLine(el.genLogs,'⚠ '+res.error+'. Falling back…');
      const dims={'1:1':[1024,1024],'4:5':[896,1120],'16:9':[1280,720]}[state.aspect];
      const c=document.createElement('canvas');c.width=dims[0];c.height=dims[1];
      renderFallback(c,res.prompt,state.variant);state.generatedCanvas=c;state.generatedURL=null;
      el.generatedImg.src=c.toDataURL('image/png');el.generatedImg.style.display='block';
      el.genPlaceholder.style.display='none';el.downloadGenBtn.style.display='block';
      setStatus('FALLBACK MODE');
    }
  });
});
el.downloadGenBtn.addEventListener('click',()=>{const a=document.createElement('a');a.download='acid-vision-'+state.aiEngine+'-'+state.variant+'.png';
  if(state.generatedURL){fetch(state.generatedURL).then(r=>r.blob()).then(blob=>{const url=URL.createObjectURL(blob);a.href=url;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}).catch(()=>window.open(state.generatedURL,'_blank'));}
  else if(state.generatedCanvas){a.href=state.generatedCanvas.toDataURL('image/png');a.click();}
});

refreshChips();
logLine(el.genLogs,'AI Diffusion Engine v11.5 online.');
logLine(el.genLogs,'6 engines loaded via Pollinations.');
logLine(el.sdxlLogs,'SDXL HD Engine — Cloudflare FLUX.1 Schnell online.');
logLine(el.devLogs,'FLUX Dev Engine — Cloudflare FLUX.1 Dev online.');
setStatus('SYSTEM READY');
})();
</script>
</body>
</html>`;

/* ===== WORKER HANDLER ===== */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method === "GET") {
      return new Response(APP_HTML, {
        headers: { "Content-Type": "text/html;charset=UTF-8", ...corsHeaders() },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders() });
    }

        try {
      const body = await request.json() as any;
      const prompt = (body.prompt || "").trim();
      const modelKey = (body.model || "schnell").toLowerCase();

      if (!prompt) {
        return new Response(JSON.stringify({ ok: false, error: "Empty prompt" }), {
          status: 400,
          headers: { ...corsHeaders(), "Content-Type": "application/json" },
        });
      }

      let modelName = "@cf/black-forest-labs/flux-1-schnell";
      let params: any = { prompt: prompt.slice(0, 2048), steps: 4 };

      if (modelKey === "dev") {
        modelName = "@cf/lykon/dreamshaper-8-lcm";
        params = {
          prompt: prompt.slice(0, 2048),
          negative_prompt: "blurry, low quality, distorted, ugly, deformed, bad anatomy",
          num_steps: 8,
          guidance: 7.5,
          width: 1024,
          height: 1024,
        };
      }

      const response = await env.AI.run(modelName as any, params);

      // ✨ اصلاح اصلی: پاسخ‌های باینری را مستقیم به Response تبدیل کن
      if (response instanceof ReadableStream) {
        return new Response(response, {
          headers: { ...corsHeaders(), "Content-Type": "image/jpeg" },
        });
      }

      // برای پاسخ‌های JSON (مثل FLUX Schnell)
      let imageBase64 = "";
      if (response instanceof Response) {
        const buf = await response.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        imageBase64 = btoa(binary);
      } else if (response && (response as any).image) {
        imageBase64 = (response as any).image;
      } else if (response && (response as any).data && (response as any).data[0] && (response as any).data[0].image) {
        imageBase64 = (response as any).data[0].image;
      } else {
        throw new Error("Unexpected AI response: " + JSON.stringify(response).slice(0, 200));
      }

      if (imageBase64.indexOf("data:image") === 0) {
        imageBase64 = imageBase64.split(",")[1] || imageBase64;
      }

      return new Response(
        JSON.stringify({
          ok: true,
          image: "data:image/jpeg;base64," + imageBase64,
          model: modelKey,
        }),
        {
          status: 200,
          headers: { ...corsHeaders(), "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ ok: false, error: err?.message || String(err) }),
        {
          status: 500,
          headers: { ...corsHeaders(), "Content-Type": "application/json" },
        }
      );
    }
