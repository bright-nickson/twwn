export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tween Learning — Teaching Tech the African Way</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
<style>
  :root {
    --prussian:  #042E4D;
    --picton:    #0082D4;
    --terra:     #E35336;
    --white:     #EFEFEF;
    --ink:       #0a0f1a;
    --paper:     #f8f7f3;
    --muted:     #5a6272;
    --border:    rgba(4,46,77,0.12);
    --card:      #ffffff;
    --f: 'Archivo', sans-serif;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--f); background: var(--paper); color: var(--ink); overflow-x: hidden; line-height: 1.6; }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.85rem 3rem;
    background: rgba(4,46,77,0.97);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0,130,212,0.2);
  }
  .nav-logo img { height: 38px; width: auto; display: block; }
  .nav-links { display: flex; gap: 2rem; list-style: none; align-items: center; }
  .nav-links a { text-decoration: none; color: rgba(239,239,239,0.75); font-size: .9rem; font-weight: 600; letter-spacing:.02em; transition: color .2s; }
  .nav-links a:hover { color: var(--white); }
  .nav-cta {
    background: var(--terra) !important; color: var(--white) !important;
    padding: .5rem 1.3rem; border-radius: 6px; font-weight: 800 !important;
    transition: background .2s, transform .15s !important; letter-spacing:.03em !important;
  }
  .nav-cta:hover { background: #c9432a !important; transform: translateY(-1px); }
  .hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }
  .hamburger span { display: block; width: 24px; height: 2px; background: var(--white); border-radius: 2px; transition: all .3s; }
  .mobile-menu {
    display: none; position: fixed; top: 64px; left: 0; right: 0; z-index: 199;
    background: var(--prussian); padding: 1.5rem 2rem; flex-direction: column; gap: 1rem;
    border-bottom: 1px solid rgba(0,130,212,0.2);
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a { color: var(--white); text-decoration: none; font-weight: 600; font-size: 1rem; padding: .5rem 0; border-bottom: 1px solid rgba(255,255,255,.08); }

  /* HERO */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
    padding: 9rem 3rem 5rem;
    background: linear-gradient(135deg, var(--prussian) 0%, #06406b 60%, #083d6e 100%);
    position: relative; overflow: hidden;
  }
  .hero-pattern {
    position: absolute; inset: 0; opacity: .04;
    background-image: repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(239,239,239,1) 59px, rgba(239,239,239,1) 60px),
      repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(239,239,239,1) 59px, rgba(239,239,239,1) 60px);
  }
  .hero-glow {
    position: absolute; top: -20%; right: -10%; width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,130,212,.25) 0%, transparent 65%);
    pointer-events: none;
  }
  .hero-glow2 {
    position: absolute; bottom: -10%; left: -5%; width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(227,83,54,.15) 0%, transparent 65%);
    pointer-events: none;
  }
  .hero-content { position: relative; z-index: 1; max-width: 780px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: .5rem;
    background: rgba(0,130,212,.2); border: 1px solid rgba(0,130,212,.4);
    color: #5ec8ff; padding: .35rem 1rem; border-radius: 4px;
    font-size: .78rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    margin-bottom: 1.75rem;
  }
  .live-dot { width: 7px; height: 7px; background: var(--terra); border-radius: 50%; animation: blink 1.4s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .hero h1 {
    font-size: clamp(2.8rem, 6.5vw, 5rem); font-weight: 900;
    line-height: 1.02; letter-spacing: -0.035em; color: var(--white);
    margin-bottom: 1.5rem;
  }
  .hero h1 em { font-style: normal; color: #5ec8ff; }
  .hero-sub {
    font-size: 1.15rem; color: rgba(239,239,239,.65); max-width: 530px;
    margin-bottom: 2.5rem; font-weight: 400; line-height: 1.8;
  }
  .hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 3.5rem; align-items: center; }
  .btn-primary {
    background: var(--terra); color: var(--white);
    padding: .9rem 2.2rem; border-radius: 6px;
    font-family: var(--f); font-weight: 800; font-size: 1rem; letter-spacing:.02em;
    text-decoration: none; border: none; cursor: pointer;
    transition: background .15s, transform .1s, box-shadow .15s;
    display: inline-flex; align-items: center; gap: .5rem;
  }
  .btn-primary:hover { background: #c9432a; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(227,83,54,.45); }
  .btn-outline {
    background: transparent; color: var(--white);
    padding: .9rem 2.2rem; border-radius: 6px;
    font-family: var(--f); font-weight: 700; font-size: 1rem;
    text-decoration: none; border: 2px solid rgba(239,239,239,.35); cursor: pointer;
    transition: all .15s; display: inline-flex; align-items: center; gap: .5rem;
  }
  .btn-outline:hover { border-color: var(--white); background: rgba(255,255,255,.08); transform: translateY(-2px); }
  .hero-stats { display: flex; gap: 3.5rem; flex-wrap: wrap; }
  .stat-num { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.04em; color: var(--white); line-height: 1; }
  .stat-label { font-size: .82rem; color: rgba(239,239,239,.5); font-weight: 400; margin-top: .2rem; }

  /* COUNTDOWN */
  .countdown-bar {
    background: var(--prussian); border-bottom: 3px solid var(--terra);
    padding: 1.1rem 3rem;
    display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap;
  }
  .cd-label {
    font-size: .8rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: var(--terra); display: flex; align-items: center; gap: .4rem;
  }
  .cd-units { display: flex; align-items: center; gap: .75rem; }
  .cd-unit { text-align: center; }
  .cd-num { font-size: 1.9rem; font-weight: 900; line-height: 1; color: var(--white); letter-spacing: -0.04em; display: block; }
  .cd-sep { font-size: 1.4rem; font-weight: 300; color: rgba(239,239,239,.3); margin-bottom: .9rem; }
  .cd-lbl { font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; color: rgba(239,239,239,.4); }
  .cd-note { font-size: .82rem; color: rgba(239,239,239,.45); }

  /* SECTIONS */
  section { padding: 6rem 3rem; }
  .section-label {
    display: inline-block; font-size: .72rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
    color: var(--picton); margin-bottom: .6rem;
  }
  .section-title {
    font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 900;
    letter-spacing: -0.03em; line-height: 1.1; margin-bottom: .9rem;
  }
  .section-sub { font-size: 1.05rem; color: var(--muted); max-width: 520px; margin-bottom: 3rem; line-height: 1.75; }
  .container { max-width: 1200px; margin: 0 auto; }

  /* PROGRAMS */
  #programs { background: var(--prussian); }
  #programs .section-label { color: rgba(94,200,255,.8); }
  #programs .section-title { color: var(--white); }
  #programs .section-sub { color: rgba(239,239,239,.5); }
  .programs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
  .prog-card {
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09);
    border-radius: 16px; padding: 2.5rem; position: relative; overflow: hidden;
    transition: transform .3s, border-color .3s, background .3s;
  }
  .prog-card:hover { transform: translateY(-6px); border-color: rgba(255,255,255,.2); background: rgba(255,255,255,.07); }
  .prog-card::before {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 180px; height: 180px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,130,212,.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .prog-card.cyber::before { background: radial-gradient(circle, rgba(227,83,54,.2) 0%, transparent 70%); }
  .prog-card.soon::before { background: radial-gradient(circle, rgba(0,130,212,.12) 0%, transparent 70%); }
  .prog-badge {
    display: inline-flex; align-items: center; gap: .4rem;
    font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: .28rem .75rem; border-radius: 4px; margin-bottom: 1.4rem;
    background: rgba(0,130,212,.18); color: #5ec8ff;
    border: 1px solid rgba(0,130,212,.3);
  }
  .prog-card.cyber .prog-badge { background: rgba(227,83,54,.18); color: #ff9580; border-color: rgba(227,83,54,.3); }
  .prog-card.soon .prog-badge { background: rgba(239,239,239,.08); color: rgba(239,239,239,.5); border-color: rgba(239,239,239,.15); }
  .prog-title {
    font-size: 1.45rem; font-weight: 900; letter-spacing: -0.025em; color: var(--white);
    margin-bottom: .9rem; line-height: 1.2;
  }
  .prog-desc { font-size: .92rem; color: rgba(239,239,239,.6); margin-bottom: 1.5rem; line-height: 1.75; }
  .prog-skills { display: flex; flex-wrap: wrap; gap: .45rem; margin-bottom: 1.7rem; }
  .skill-pill {
    font-size: .73rem; padding: .28rem .65rem; border-radius: 4px;
    background: rgba(255,255,255,.07); color: rgba(239,239,239,.7);
    border: 1px solid rgba(255,255,255,.1); font-weight: 600;
  }
  .prog-meta { display: flex; flex-direction: column; gap: .45rem; margin-bottom: 2rem; }
  .meta-row { display: flex; align-items: center; gap: .5rem; font-size: .84rem; color: rgba(239,239,239,.48); }
  .meta-icon { font-size: .95rem; }
  .prog-btn {
    width: 100%; padding: .88rem; border-radius: 8px;
    font-family: var(--f); font-weight: 800; font-size: .95rem; letter-spacing: .03em;
    border: none; cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center; gap: .5rem;
  }
  .prog-btn.enroll { background: var(--picton); color: var(--white); }
  .prog-btn.enroll:hover { background: #006bb0; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,130,212,.45); }
  .prog-card.cyber .prog-btn.enroll { background: var(--terra); }
  .prog-card.cyber .prog-btn.enroll:hover { background: #c9432a; box-shadow: 0 8px 24px rgba(227,83,54,.4); }
  .prog-btn.waitlist { background: rgba(239,239,239,.07); color: rgba(239,239,239,.65); border: 1px solid rgba(239,239,239,.15); }
  .prog-btn.waitlist:hover { background: rgba(239,239,239,.13); color: var(--white); transform: translateY(-2px); }

  /* SOCIAL / CONNECT */
  #connect { background: var(--prussian); padding: 3rem; border-top: 1px solid rgba(255,255,255,.07); }
  .connect-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 2rem; max-width: 1200px; margin: 0 auto; }
  .connect-copy { }
  .connect-copy h3 { font-size: 1.3rem; font-weight: 800; color: var(--white); margin-bottom: .3rem; }
  .connect-copy p { font-size: .9rem; color: rgba(239,239,239,.5); }
  .social-links { display: flex; gap: .75rem; flex-wrap: wrap; }
  .social-btn {
    display: inline-flex; align-items: center; gap: .5rem;
    padding: .55rem 1.1rem; border-radius: 6px;
    font-family: var(--f); font-size: .82rem; font-weight: 700; letter-spacing:.03em;
    text-decoration: none; border: 1.5px solid rgba(255,255,255,.5); color: #ffffff;
    background: rgba(255,255,255,.12); transition: all .15s;
  }
  .social-btn:hover { background: rgba(255,255,255,.22); border-color: rgba(255,255,255,.8); transform: translateY(-2px); }
  .social-btn.yt { background: rgba(255,0,0,.18); border-color: rgba(255,80,80,.7); color: #ff8080; }
  .social-btn.yt:hover { background: rgba(255,0,0,.32); border-color: #ff5050; color: #fff; }
  .social-btn.li { background: rgba(0,119,181,.22); border-color: rgba(0,160,220,.7); color: #5bc8f5; }
  .social-btn.li:hover { background: rgba(0,119,181,.38); border-color: #0097d8; color: #fff; }
  .social-btn.ig { background: rgba(225,48,108,.18); border-color: rgba(240,80,140,.65); color: #f58ab4; }
  .social-btn.ig:hover { background: rgba(225,48,108,.32); border-color: #e0508a; color: #fff; }
  .social-btn.tw { background: rgba(29,161,242,.18); border-color: rgba(29,161,242,.7); color: #5ec8ff; }
  .social-btn.tw:hover { background: rgba(29,161,242,.32); border-color: #1da1f2; color: #fff; }
  .social-btn.tt { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.55); color: #e0e0e0; }
  .social-btn.tt:hover { background: rgba(255,255,255,.22); border-color: #fff; color: #fff; }
  .social-btn.fb { background: rgba(24,119,242,.18); border-color: rgba(24,119,242,.7); color: #7aadff; }
  .social-btn.fb:hover { background: rgba(24,119,242,.32); border-color: #1877f2; color: #fff; }

  /* INSTRUCTORS */
  #instructors { background: var(--paper); }
  .instructors-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .instructors-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
  .instr-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 1.75rem;
    display: flex; gap: 1.25rem; align-items: flex-start;
    transition: transform .3s, box-shadow .3s;
  }
  .instr-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(4,46,77,.1); }
  .instr-av {
    width: 60px; height: 60px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; font-weight: 900; color: var(--white);
  }
  .instr-av.ds { background: var(--prussian); }
  .instr-av.cy { background: var(--terra); }
  .instr-name { font-size: 1.05rem; font-weight: 800; margin-bottom: .15rem; color: var(--prussian); }
  .instr-role { font-size: .8rem; color: var(--picton); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: .5rem; }
  .instr-bio { font-size: .88rem; color: var(--muted); line-height: 1.7; }
  .apply-box {
    background: linear-gradient(135deg, var(--prussian) 0%, #073d64 100%);
    border-radius: 16px; padding: 2.5rem; color: var(--white);
  }
  .apply-box h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: .75rem; line-height: 1.2; }
  .apply-box p { color: rgba(239,239,239,.65); font-size: .95rem; line-height: 1.75; margin-bottom: 1rem; }
  .apply-list { list-style: none; margin-bottom: 1.75rem; display: flex; flex-direction: column; gap: .5rem; }
  .apply-list li { font-size: .88rem; color: rgba(239,239,239,.7); padding-left: 1.25rem; position: relative; }
  .apply-list li::before { content: "✓"; position: absolute; left: 0; color: #5ec8ff; font-weight: 700; }
  .apply-btn {
    width: 100%; padding: .9rem; border-radius: 8px;
    background: var(--terra); color: var(--white); border: none; cursor: pointer;
    font-family: var(--f); font-weight: 800; font-size: 1rem; letter-spacing: .03em;
    transition: all .15s; display: flex; align-items: center; justify-content: center; gap: .5rem;
  }
  .apply-btn:hover { background: #c9432a; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(227,83,54,.4); }

  /* TESTIMONIALS */
  #testimonials { background: linear-gradient(160deg, var(--prussian) 0%, #073a60 100%); }
  #testimonials .section-label { color: rgba(94,200,255,.8); }
  #testimonials .section-title { color: var(--white); }
  .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
  .testi-card {
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
    border-radius: 14px; padding: 2rem; transition: transform .2s, border-color .2s;
  }
  .testi-card:hover { transform: translateY(-4px); border-color: rgba(0,130,212,.4); }
  .stars { color: #f5c842; font-size: .85rem; margin-bottom: .75rem; }
  .testi-q { font-size: 2rem; color: var(--terra); line-height: 1; margin-bottom: .5rem; font-family: Georgia, serif; }
  .testi-text { font-size: .92rem; color: rgba(239,239,239,.7); line-height: 1.8; margin-bottom: 1.5rem; font-style: italic; }
  .testi-author { display: flex; align-items: center; gap: .75rem; }
  .testi-av {
    width: 42px; height: 42px; border-radius: 9px;
    font-family: var(--f); font-weight: 800; font-size: .85rem;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,130,212,.25); color: #5ec8ff;
  }
  .testi-name { font-weight: 700; font-size: .9rem; color: var(--white); }
  .testi-role { font-size: .77rem; color: rgba(239,239,239,.4); }

  /* FAQ */
  #faq { background: var(--paper); }
  .faq-list { max-width: 720px; display: flex; flex-direction: column; gap: .6rem; }
  .faq-item { background: var(--card); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .faq-q {
    width: 100%; background: var(--card); padding: 1.2rem 1.5rem;
    text-align: left; border: none; cursor: pointer;
    font-family: var(--f); font-size: .97rem; font-weight: 700; color: var(--prussian);
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    transition: background .15s;
  }
  .faq-q:hover { background: #f0eeea; }
  .faq-icon { font-size: 1.2rem; color: var(--picton); transition: transform .2s; flex-shrink: 0; font-weight: 400; }
  .faq-item.open .faq-icon { transform: rotate(45deg); }
  .faq-a {
    max-height: 0; overflow: hidden; transition: max-height .25s ease, padding .25s ease;
    background: var(--card); font-size: .92rem; color: var(--muted); line-height: 1.8;
    padding: 0 1.5rem;
  }
  .faq-item.open .faq-a { max-height: 300px; padding: 0 1.5rem 1.25rem; }

  /* WAITLIST */
  #waitlist {
    background: linear-gradient(135deg, #e8f4fd 0%, #f0f9f4 100%);
    border-top: 1px solid var(--border);
  }
  .waitlist-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
  .waitlist-copy h2 { color: var(--prussian); }
  .wl-benefits { list-style: none; display: flex; flex-direction: column; gap: .7rem; margin-top: 1.5rem; }
  .wl-benefits li { display: flex; align-items: flex-start; gap: .65rem; font-size: .92rem; color: var(--muted); line-height: 1.5; }
  .wl-benefits li span:first-child { color: var(--picton); font-weight: 800; font-size: 1rem; flex-shrink: 0; }
  .form-group { margin-bottom: 1.1rem; }
  .form-group label { display: block; font-size: .83rem; font-weight: 700; margin-bottom: .4rem; color: var(--prussian); letter-spacing:.02em; }
  .form-group input, .form-group select {
    width: 100%; padding: .78rem 1rem;
    border: 1.5px solid rgba(4,46,77,.2); border-radius: 7px;
    font-family: var(--f); font-size: .93rem; background: white; color: var(--ink);
    outline: none; transition: border-color .2s, box-shadow .2s; appearance: none;
  }
  .form-group input:focus, .form-group select:focus {
    border-color: var(--picton); box-shadow: 0 0 0 3px rgba(0,130,212,.12);
  }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .submit-btn {
    width: 100%; padding: .9rem; border-radius: 8px;
    background: var(--prussian); color: var(--white); border: none; cursor: pointer;
    font-family: var(--f); font-weight: 800; font-size: .97rem; letter-spacing: .03em;
    transition: all .15s; display: flex; align-items: center; justify-content: center; gap: .5rem;
  }
  .submit-btn:hover { background: var(--picton); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,130,212,.35); }
  select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a6272' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem !important; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(4,10,20,.75); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 1.5rem;
    opacity: 0; pointer-events: none; transition: opacity .2s;
  }
  .modal-overlay.active { opacity: 1; pointer-events: all; }
  .modal {
    background: white; border-radius: 18px; max-width: 520px; width: 100%;
    padding: 2.75rem; position: relative; max-height: 90vh; overflow-y: auto;
    transform: translateY(24px) scale(.97); transition: transform .2s;
    box-shadow: 0 40px 100px rgba(4,46,77,.4);
  }
  .modal-overlay.active .modal { transform: translateY(0) scale(1); }
  .modal-close {
    position: absolute; top: 1.25rem; right: 1.25rem;
    background: none; border: 1px solid var(--border); font-size: 1.1rem; cursor: pointer;
    color: var(--muted); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    border-radius: 6px; transition: all .15s;
  }
  .modal-close:hover { background: var(--border); color: var(--prussian); }
  .modal-badge {
    display: inline-block; font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: .28rem .75rem; border-radius: 4px;
    background: rgba(0,130,212,.1); color: var(--picton); margin-bottom: .9rem; border: 1px solid rgba(0,130,212,.2);
  }
  .modal-title { font-size: 1.7rem; font-weight: 900; letter-spacing: -0.03em; color: var(--prussian); margin-bottom: .4rem; }
  .modal-sub { font-size: .92rem; color: var(--muted); margin-bottom: 1.75rem; line-height: 1.65; }
  .modal-submit {
    width: 100%; padding: .88rem; border-radius: 8px;
    background: var(--prussian); color: var(--white); border: none; cursor: pointer;
    font-family: var(--f); font-weight: 800; font-size: .97rem; letter-spacing: .03em;
    transition: all .15s; display: flex; align-items: center; justify-content: center; gap: .5rem;
    margin-top: .5rem;
  }
  .modal-submit:hover { background: var(--picton); transform: translateY(-2px); }
  .modal-submit.terra { background: var(--terra); }
  .modal-submit.terra:hover { background: #c9432a; box-shadow: 0 8px 24px rgba(227,83,54,.4); }
  .success-state {
    text-align: center; padding: 2rem 0;
    flex-direction: column; align-items: center; gap: .9rem; display: none;
  }
  .success-icon { font-size: 3rem; }
  .success-title { font-size: 1.5rem; font-weight: 900; color: var(--prussian); }
  .success-msg { color: var(--muted); font-size: .95rem; max-width: 320px; line-height: 1.65; margin: 0 auto; }
  .success-close { margin-top: .5rem; background: var(--prussian); color: white; border: none; padding: .8rem 2rem; border-radius: 7px; font-family: var(--f); font-weight: 800; cursor: pointer; font-size: .95rem; transition: background .2s; }
  .success-close:hover { background: var(--picton); }

  /* FOOTER */
  footer { background: var(--prussian); color: var(--white); padding: 4.5rem 3rem 2rem; }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,.1); }
  .footer-brand-logo { height: 36px; margin-bottom: 1rem; filter: brightness(0) invert(1); }
  .footer-tagline { font-size: .88rem; color: rgba(239,239,239,.45); max-width: 260px; line-height: 1.65; margin-bottom: 1.25rem; }
  .footer-email { font-size: .85rem; color: rgba(94,200,255,.8); text-decoration: none; font-weight: 600; }
  .footer-email:hover { color: var(--white); }
  .footer-col h4 { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(239,239,239,.35); margin-bottom: 1.1rem; }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: .6rem; }
  .footer-col ul a { text-decoration: none; color: rgba(239,239,239,.6); font-size: .88rem; transition: color .2s; }
  .footer-col ul a:hover { color: var(--white); }
  .footer-social { display: flex; gap: .6rem; flex-wrap: wrap; margin-top: 1rem; }
  .footer-soc {
    width: 34px; height: 34px; border-radius: 7px;
    background: rgba(255,255,255,.14); border: 1.5px solid rgba(255,255,255,.45);
    color: #e8f4ff;
    display: flex; align-items: center; justify-content: center;
    font-size: .95rem; font-weight: 800; transition: all .2s; text-decoration: none;
  }
  .footer-soc:hover { background: var(--picton); border-color: var(--picton); color: #fff; transform: translateY(-2px); }
  .footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
  .footer-copy { font-size: .8rem; color: rgba(239,239,239,.3); }
  .footer-tagline-right { font-size: .8rem; color: rgba(239,239,239,.3); font-style: italic; }

  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity:0; transform: translateY(28px); } to { opacity:1; transform: translateY(0); } }
  .hero-badge { animation: fadeUp .5s ease .1s both; }
  .hero h1   { animation: fadeUp .6s ease .2s both; }
  .hero-sub  { animation: fadeUp .6s ease .35s both; }
  .hero-ctas { animation: fadeUp .6s ease .5s both; }
  .hero-stats { animation: fadeUp .6s ease .65s both; }

  /* RESPONSIVE */
  @media(max-width: 900px) {
    .instructors-wrap, .waitlist-grid { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr 1fr; }
  }
  @media(max-width: 640px) {
    nav { padding: .85rem 1.25rem; }
    .nav-links { display: none; }
    .hamburger { display: flex; }
    section { padding: 4rem 1.25rem; }
    .hero { padding: 7rem 1.25rem 4rem; }
    .countdown-bar { padding: 1rem 1.25rem; flex-direction: column; gap: .6rem; text-align: center; }
    #connect { padding: 2rem 1.25rem; }
    .connect-inner { flex-direction: column; align-items: flex-start; }
    .footer-top { grid-template-columns: 1fr; gap: 2rem; }
    .footer-bottom { flex-direction: column; align-items: flex-start; }
    .hero-stats { gap: 2rem; }
    .form-row { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="#" class="nav-logo"><img src="/logo.png" alt="Tween Learning Logo"></a>
  <ul class="nav-links">
    <li><a href="#programs">Programs</a></li>
    <li><a href="#instructors">Instructors</a></li>
    <li><a href="#testimonials">Stories</a></li>
    <li><a href="#faq">FAQ</a></li>
    <li><a href="#waitlist" class="nav-cta">Join Waitlist</a></li>
  </ul>
  <button class="hamburger" onclick="toggleMobile()" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="mobile-menu" id="mobile-menu">
  <a href="#programs" onclick="closeMobile()">Programs</a>
  <a href="#instructors" onclick="closeMobile()">Instructors</a>
  <a href="#testimonials" onclick="closeMobile()">Stories</a>
  <a href="#faq" onclick="closeMobile()">FAQ</a>
  <a href="#waitlist" onclick="closeMobile()" style="color:#ff9580;font-weight:800">Join Waitlist →</a>
</div>

<!-- HERO -->
<section class="hero">
  <div class="hero-pattern"></div>
  <div class="hero-glow"></div>
  <div class="hero-glow2"></div>
  <div class="hero-content">
    <div class="hero-badge"><span class="live-dot"></span> Now Enrolling — Next Cohorts Open</div>
    <h1>Build real <em>tech skills</em><br>with live training.</h1>
    <p class="hero-sub">Join the next cohorts of Tween Learning and gain practical, career-ready skills in cybersecurity and data science — taught live by industry experts. Teaching tech the African way.</p>
    <div class="hero-ctas">
      <a href="#programs" class="btn-primary">Enroll Now →</a>
      <a href="#waitlist" class="btn-outline">Join the Waitlist</a>
    </div>
    <div class="hero-stats">
      <div>
        <div class="stat-num">8–12</div>
        <div class="stat-label">Weeks per program</div>
      </div>
      <div>
        <div class="stat-num">Live</div>
        <div class="stat-label">Instructor-led sessions</div>
      </div>
      <div>
        <div class="stat-num">85%</div>
        <div class="stat-label">Graduate job placement</div>
      </div>
    </div>
  </div>
</section>

<!-- COUNTDOWN -->
<div class="countdown-bar">
  <div class="cd-label">⚡ Next Cohort Starts In</div>
  <div class="cd-units">
    <div class="cd-unit"><span class="cd-num" id="cd-days">00</span><span class="cd-lbl">Days</span></div>
    <span class="cd-sep">:</span>
    <div class="cd-unit"><span class="cd-num" id="cd-hours">00</span><span class="cd-lbl">Hours</span></div>
    <span class="cd-sep">:</span>
    <div class="cd-unit"><span class="cd-num" id="cd-mins">00</span><span class="cd-lbl">Mins</span></div>
    <span class="cd-sep">:</span>
    <div class="cd-unit"><span class="cd-num" id="cd-secs">00</span><span class="cd-lbl">Secs</span></div>
  </div>
  <div class="cd-note">Limited seats — secure yours today</div>
</div>

<!-- PROGRAMS -->
<section id="programs">
  <div class="container">
    <span class="section-label">Our Programs</span>
    <h2 class="section-title" style="color:var(--white)">Choose your path.</h2>
    <p class="section-sub">Intensive, live cohort-based programs. Real projects. Real mentorship. Real outcomes.</p>
    <div class="programs-grid">

      <!-- Data Science & AI -->
      <div class="prog-card ds">
        <div class="prog-badge">🟢 Enrolling Now</div>
        <div class="prog-title">Data Science &amp; Analytics</div>
        <p class="prog-desc">Master the complete data pipeline — from raw data wrangling to deploying machine learning models — through hands-on projects with real-world datasets.</p>
        <div class="prog-skills">
          <span class="skill-pill">Python</span>
          <span class="skill-pill">Data Analysis</span>
          <span class="skill-pill">Machine Learning</span>
          <span class="skill-pill">NumPy / Pandas</span>
          <span class="skill-pill">Real World Projects</span>
        </div>
        <div class="prog-meta">
          <div class="meta-row"><span class="meta-icon">📅</span> Starts July 14, 2025</div>
          <div class="meta-row"><span class="meta-icon">⏱</span> 10 weeks · Live online sessions</div>
          <div class="meta-row"><span class="meta-icon">👥</span> Cohort size: 25 students max</div>
        </div>
        <button class="prog-btn enroll" onclick="openEnroll('Data Science &amp; Analytics')">Enroll Now →</button>
      </div>

      <!-- Web AppSec -->
      <div class="prog-card cyber">
        <div class="prog-badge">🔴 Enrolling Now</div>
        <div class="prog-title">Web Application Penetration Testing</div>
        <p class="prog-desc">Learn ethical hacking and vulnerability assessment from the ground up. Break, test, and secure real web applications the way professionals do.</p>
        <div class="prog-skills">
          <span class="skill-pill">Ethical Hacking</span>
          <span class="skill-pill">Burp Suite</span>
          <span class="skill-pill">Vulnerability Testing</span>
          <span class="skill-pill">OWASP Top 10</span>
          <span class="skill-pill">Web Security</span>
        </div>
        <div class="prog-meta">
          <div class="meta-row"><span class="meta-icon">📅</span> Starts July 21, 2025</div>
          <div class="meta-row"><span class="meta-icon">⏱</span> 8 weeks · Live online sessions</div>
          <div class="meta-row"><span class="meta-icon">👥</span> Cohort size: 20 students max</div>
        </div>
        <button class="prog-btn enroll" onclick="openEnroll('Web Application Penetration Testing')">Enroll Now →</button>
      </div>

      <!-- Coming Soon -->
      <div class="prog-card soon">
        <div class="prog-badge">🔵 Coming Soon</div>
        <div class="prog-title">Future Tech Program</div>
        <p class="prog-desc">A third cutting-edge program is in development. Join the waitlist to get early-bird access and be the first notified at launch.</p>
        <div class="prog-skills">
          <span class="skill-pill">Cloud Engineering</span>
          <span class="skill-pill">AWS &amp; GCP</span>
          <span class="skill-pill">DevOps</span>
          <span class="skill-pill">More TBA</span>
        </div>
        <div class="prog-meta">
          <div class="meta-row"><span class="meta-icon">📅</span> Launch date: TBA</div>
          <div class="meta-row"><span class="meta-icon">⏱</span> 8–12 weeks · Live online</div>
          <div class="meta-row"><span class="meta-icon">👥</span> Limited early-access spots</div>
        </div>
        <button class="prog-btn waitlist" onclick="openWaitlistModal()">Join Waitlist for This →</button>
      </div>

    </div>
  </div>
</section>

<!-- SOCIAL CONNECT STRIP -->
<div id="connect">
  <div class="connect-inner">
    <div class="connect-copy">
      <h3>Follow Tweentech</h3>
      <p>Stay connected — updates, insights, and community from Ghana to the world.</p>
    </div>
    <div class="social-links">
      <a href="https://twitter.com/Tween_Tech" target="_blank" class="social-btn tw">
        𝕏 Twitter
      </a>
      <a href="https://www.facebook.com/TweenTech" target="_blank" class="social-btn fb">
        Facebook
      </a>
      <a href="https://www.instagram.com/tween_technologies/" target="_blank" class="social-btn ig">
        Instagram
      </a>
      <a href="https://www.linkedin.com/company/tween-tech/" target="_blank" class="social-btn li">
        LinkedIn
      </a>
      <a href="https://www.youtube.com/channel/UC4gh8oEctWuq7fJXUQLL-BQ" target="_blank" class="social-btn yt">
        ▶ YouTube
      </a>
      <a href="https://tiktok.com/@tween_technologies" target="_blank" class="social-btn tt">
        TikTok
      </a>
    </div>
  </div>
</div>

<!-- INSTRUCTORS + APPLY -->
<section id="instructors">
  <div class="container">
    <div class="instructors-wrap">
      <div>
        <span class="section-label">Who You'll Learn From</span>
        <h2 class="section-title">Meet your instructors.</h2>
        <p class="section-sub">Practitioners with real industry experience — not just academics. Our instructors bring the field to you.</p>
        <div class="instructors-grid">
          <div class="instr-card">
            <div class="instr-av ds">EG</div>
            <div>
              <div class="instr-name">Elikplim Gamor</div>
              <div class="instr-role">Data Science &amp; Analytics Lead</div>
              <p class="instr-bio">Data Science and Analytics Lead who transforms complex machine learning research into actionable, industry-ready solutions.</p>
            </div>
          </div>
          <div class="instr-card">
            <div class="instr-av cy">DD</div>
            <div>
              <div class="instr-name">Desmond Dadzie</div>
              <div class="instr-role">Cybersecurity &amp; PenTest Lead</div>
              <p class="instr-bio">Cyber Risk Consultant and Google Product Expert Ambassador with extensive expertise in penetration testing, GRC frameworks, and cloud security across AWS and Google Cloud.</p>
            </div>
          </div>
        </div>
      </div>
      <!-- APPLY BOX -->
      <div class="apply-box">
        <div style="font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(94,200,255,.7);margin-bottom:.6rem;">For Educators</div>
        <h3>Teach on Tween Learning</h3>
        <p>Are you an expert in your field? Join our growing team of instructors and help shape the next generation of African tech talent.</p>
        <ul class="apply-list">
          <li>Competitive instructor compensation</li>
          <li>Flexible live session scheduling</li>
          <li>Full production &amp; onboarding support</li>
          <li>Access to motivated, engaged learners</li>
          <li>Grow your personal brand &amp; network</li>
          <li>Be part of a mission-driven platform</li>
        </ul>
        <button class="apply-btn" onclick="openApply()">Apply to Teach →</button>
        <p style="font-size:.78rem;color:rgba(239,239,239,.35);text-align:center;margin-top:.9rem;">We respond to all applications within 5 business days</p>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section id="testimonials">
  <div class="container">
    <span class="section-label">Early Student Feedback</span>
    <h2 class="section-title">What our students say.</h2>
    <p class="section-sub" style="color:rgba(239,239,239,.5)">From our pilot sessions and preview cohorts.</p>
    <div class="testi-grid">
      <div class="testi-card">
        <div class="stars">★★★★★</div>
        <div class="testi-q">"</div>
        <p class="testi-text">The live sessions felt nothing like pre-recorded courses. Having a real instructor answer questions in real time made a massive difference in how fast I actually understood the material.</p>
        <div class="testi-author">
          <div class="testi-av">KA</div>
          <div>
            <div class="testi-name">Kwame Asante</div>
            <div class="testi-role">Software Developer · Accra, Ghana</div>
          </div>
        </div>
      </div>
      <div class="testi-card">
        <div class="stars">★★★★★</div>
        <div class="testi-q">"</div>
        <p class="testi-text">I went from zero Python knowledge to building a working machine learning classifier in 6 weeks. Real projects, immediate feedback, and a community that keeps you accountable.</p>
        <div class="testi-author">
          <div class="testi-av">ZN</div>
          <div>
            <div class="testi-name">Zara Nkemdirim</div>
            <div class="testi-role">Business Analyst · Lagos, Nigeria</div>
          </div>
        </div>
      </div>
      <div class="testi-card">
        <div class="stars">★★★★★</div>
        <div class="testi-q">"</div>
        <p class="testi-text">Alex's penetration testing course completely changed how I think about web security. Within 4 weeks I'd found my first real vulnerability in a bug bounty program. That's real ROI.</p>
        <div class="testi-author">
          <div class="testi-av">TO</div>
          <div>
            <div class="testi-name">Tobi Osei</div>
            <div class="testi-role">IT Specialist · London, UK</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq">
  <div class="container">
    <span class="section-label">Questions</span>
    <h2 class="section-title">Frequently asked.</h2>
    <p class="section-sub">Everything you need before enrolling.</p>
    <div class="faq-list">
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">How are classes delivered? <span class="faq-icon">+</span></button>
        <div class="faq-a">All sessions are live, instructor-led, and conducted via Zoom. You'll receive recordings, materials via Notion, and hands-on resources through Google Drive.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">Do I need prior experience? <span class="faq-icon">+</span></button>
        <div class="faq-a">No. Our cohorts are designed for motivated beginners and career switchers. A basic familiarity with computers is helpful, but no prior technical experience is required.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">How many students are in each cohort? <span class="faq-icon">+</span></button>
        <div class="faq-a">We intentionally cap cohorts at 16–20 students to ensure every learner gets personalized attention from the instructor.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">Will I receive a certificate? <span class="faq-icon">+</span></button>
        <div class="faq-a">Completion certificates are planned for future cohorts as part of the full Tween Learning platform. For this next cohort, focus is on real skills and portfolio projects you can add directly to your GitHub and CV.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">How do live sessions work? <span class="faq-icon">+</span></button>
        <div class="faq-a">Sessions are held via Zoom, typically 2–3 times per week. Each session is 90–120 minutes covering instruction, live coding or labs, and Q&A. You'll also have access to a private community for peer support between sessions.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">What's the difference between Enrolling and the Waitlist? <span class="faq-icon">+</span></button>
        <div class="faq-a">Enrolling signs you up for one of the two live programs starting this July. The Waitlist is for the upcoming full Tween Learning platform — with async courses, more programs, community tools, and certificates — launching later this year.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">I'm a professional educator — can I teach here? <span class="faq-icon">+</span></button>
        <div class="faq-a">Absolutely! We are actively building our instructor team. Click "Apply to Teach" in the Instructors section or scroll to the instructor application form. We welcome subject-matter experts from any location, especially those with professional industry experience.</div>
      </div>
    </div>
  </div>
</section>

<!-- WAITLIST -->
<section id="waitlist">
  <div class="container">
    <div class="waitlist-grid">
      <div class="waitlist-copy">
        <span class="section-label">Future Platform</span>
        <h2 class="section-title">Get early access.</h2>
        <p class="section-sub" style="margin-bottom:0">The full Tween Learning platform is coming. More courses, async learning, community tools, and certificates — all built the African way.</p>
        <ul class="wl-benefits">
          <li><span>→</span> First access to new programs before public launch</li>
          <li><span>→</span> Founding member pricing (up to 40% off)</li>
          <li><span>→</span> Shape the platform through feedback sessions</li>
          <li><span>→</span> Join a community of ambitious African tech learners</li>
        </ul>
      </div>
      <div>
        <div id="wl-form">
          <div class="form-row">
            <div class="form-group"><label>First Name</label><input type="text" id="wl-fname" placeholder="Kwame"></div>
            <div class="form-group"><label>Last Name</label><input type="text" id="wl-lname" placeholder="Asante"></div>
          </div>
          <div class="form-group"><label>Email Address</label><input type="email" id="wl-email" placeholder="you@example.com" required pattern="[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,}$" title="Please enter a valid email address"></div>
          <div class="form-group">
            <label>Area of Interest</label>
            <select id="wl-interest">
              <option value="">Select an area…</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="CYBERSECURITY">Cybersecurity</option>
              <option value="SOFTWARE_ENGINEERING">Software Engineering</option>
              <option value="CLOUD_COMPUTING">Cloud Computing</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <button class="submit-btn" onclick="submitWaitlist()"><span id="wl-btn-txt">Join the Waitlist →</span></button>
        </div>
        <div id="wl-success" style="display:none;margin-top:1.5rem;padding:2rem;background:rgba(0,130,212,.08);border:1.5px solid rgba(0,130,212,.25);border-radius:12px;">
          <div style="font-size:2.2rem;margin-bottom:.5rem;">🎉</div>
          <div style="font-family:var(--f);font-size:1.15rem;font-weight:800;color:var(--prussian);margin-bottom:.4rem;">You're on the list!</div>
          <div style="color:var(--muted);font-size:.9rem;line-height:1.65;">We'll reach out as the platform takes shape. Keep an eye on your inbox — and follow us on social for updates.</div>
        </div>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <div class="footer-top">
      <div>
        <img src="/logo.png" alt="Tween Learning Logo" class="footer-brand-logo">
        <p class="footer-tagline">Teaching Tech the African Way. Building the next generation of global tech talent from Ghana to the world.</p>
        <p style="color: rgba(239,239,239,.6); font-size: .85rem; margin-bottom: 0.5rem;">Email us at: <a href="mailto:admin@tweentechnologies.com" class="footer-email" style="font-weight: 600;">admin@tweentechnologies.com</a></p>
        <p style="color: rgba(239,239,239,.6); font-size: .85rem; margin: 0.5rem 0;">Contact us via WhatsApp: <a href="https://wa.me/233240547782" class="footer-email" style="font-weight: 600;">+233 240 547 782</a></p>
        <div class="footer-social">
          <a href="https://twitter.com/Tween_Tech" target="_blank" class="footer-soc" title="Twitter">𝕏</a>
          <a href="https://www.facebook.com/TweenTech" target="_blank" class="footer-soc" title="Facebook">f</a>
          <a href="https://www.instagram.com/tween_technologies/" target="_blank" class="footer-soc" title="Instagram">◻</a>
          <a href="https://www.linkedin.com/company/tween-tech/" target="_blank" class="footer-soc" title="LinkedIn">in</a>
          <a href="https://www.youtube.com/channel/UC4gh8oEctWuq7fJXUQLL-BQ" target="_blank" class="footer-soc" title="YouTube">▶</a>
          <a href="https://tiktok.com/@tween_technologies" target="_blank" class="footer-soc" title="TikTok">♪</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Programs</h4>
        <ul>
          <li><a href="#programs">Data Science &amp; Analytics</a></li>
          <li><a href="#programs">Web App PenTest</a></li>
          <li><a href="#programs">Coming Soon</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="https://linktr.ee/tween_technologies" target="_blank">Linktree</a></li>
          <li><a href="/cdn-cgi/l/email-protection#6302070e0a0d23171406060d1706000b0d0c0f0c040a06104d000c0e">Contact Us</a></li>
          <li><a href="#instructors">Teach With Us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Community</h4>
        <ul>
          <li><a href="https://www.linkedin.com/company/tween-tech/" target="_blank">LinkedIn</a></li>
          <li><a href="https://www.youtube.com/channel/UC4gh8oEctWuq7fJXUQLL-BQ" target="_blank">YouTube</a></li>
          <li><a href="#waitlist">Join Waitlist</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span class="footer-copy">© 2025 Tween Technologies. All rights reserved. Accra, Ghana.</span>
      <span class="footer-tagline-right">experience the future…</span>
    </div>
  </div>
</footer>

<!-- ══ ENROLLMENT MODAL ══ -->
<div class="modal-overlay" id="enroll-modal">
  <div class="modal">
    <button class="modal-close" onclick="closeModal('enroll-modal')">✕</button>
    <div class="modal-badge">Enrollment Form</div>
    <h3 class="modal-title" id="enroll-modal-title">Enroll in Program</h3>
    <p class="modal-sub">Fill in your details and we'll confirm your spot and send next steps to your email within 24 hours.</p>
    <div id="enroll-form-body">
      <div class="form-row">
        <div class="form-group"><label>First Name</label><input type="text" id="ef-fname" placeholder="Your first name"></div>
        <div class="form-group"><label>Last Name</label><input type="text" id="ef-lname" placeholder="Your last name"></div>
      </div>
      <div class="form-group"><label>Email Address</label><input type="email" id="ef-email" placeholder="you@example.com" required pattern="[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,}$" title="Please enter a valid email address"></div>
      <div class="form-group">
        <label>Country</label>
        <select id="ef-country">
          <option value="">Select your country…</option>
          <option>Ghana</option><option>Nigeria</option><option>Kenya</option>
          <option>South Africa</option><option>United Kingdom</option>
          <option>United States</option><option>Canada</option>
          <option>Germany</option><option>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label>Your Background</label>
        <select id="ef-bg">
          <option value="">Select your background…</option>
          <option>Complete Beginner</option>
          <option>Student / Currently Studying</option>
          <option>Working Professional (Non-Tech)</option>
          <option>Working Professional (Tech)</option>
          <option>Self-taught / Hobbyist</option>
        </select>
      </div>
      <div class="form-group">
        <label>Program</label>
        <select id="ef-program">
          <option>Data Science &amp; Analytics</option>
          <option>Web Application Penetration Testing</option>
        </select>
      </div>
      <button class="modal-submit terra" onclick="submitEnroll()"><span id="enroll-btn-txt">Submit Enrollment →</span></button>
    </div>
    <div class="success-state" id="enroll-success">
      <div class="success-icon">✅</div>
      <div class="success-title">You're enrolled!</div>
      <p class="success-msg">Check your inbox for a confirmation email with everything you need to prepare for your cohort. Welcome to Tween Learning!</p>
      <button class="success-close" onclick="closeModal('enroll-modal')">Done</button>
    </div>
  </div>
</div>

<!-- ══ WAITLIST MODAL (Coming Soon card) ══ -->
<div class="modal-overlay" id="wl-modal">
  <div class="modal">
    <button class="modal-close" onclick="closeModal('wl-modal')">✕</button>
    <div class="modal-badge">Waitlist</div>
    <h3 class="modal-title">Future Tech Program</h3>
    <p class="modal-sub">This program is in development. Join the waitlist to get early-bird access and be first to know when it launches.</p>
    <div id="wlm-body">
      <div class="form-row">
        <div class="form-group"><label>First Name</label><input type="text" id="wlm-fname" placeholder="First name"></div>
        <div class="form-group"><label>Last Name</label><input type="text" id="wlm-lname" placeholder="Last name"></div>
      </div>
      <div class="form-group"><label>Email Address</label><input type="email" id="wlm-email" placeholder="you@example.com" required pattern="[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,}$" title="Please enter a valid email address"></div>
      <div class="form-group">
        <label>Area of Interest</label>
        <select id="wlm-interest">
          <option value="">Select…</option>
          <option>Artificial Intelligence</option>
          <option>Cybersecurity</option>
          <option>Software Engineering</option>
          <option>Other</option>
        </select>
      </div>
      <button class="modal-submit" onclick="submitWlModal()">Join Waitlist →</button>
    </div>
    <div class="success-state" id="wlm-success">
      <div class="success-icon">🎉</div>
      <div class="success-title">You're on the list!</div>
      <p class="success-msg">We'll notify you as soon as this program launches. Thank you!</p>
      <button class="success-close" onclick="closeModal('wl-modal')">Done</button>
    </div>
  </div>
</div>

<!-- ══ INSTRUCTOR APPLICATION MODAL ══ -->
<div class="modal-overlay" id="apply-modal">
  <div class="modal">
    <button class="modal-close" onclick="closeModal('apply-modal')">✕</button>
    <div class="modal-badge" style="background:rgba(227,83,54,.1);color:var(--terra);border-color:rgba(227,83,54,.25)">Instructor Application</div>
    <h3 class="modal-title">Apply to Teach</h3>
    <p class="modal-sub">Tell us about yourself. Our team will review your application and get back to you within 5 business days.</p>
    <div id="apply-body">
      <div class="form-row">
        <div class="form-group"><label>First Name</label><input type="text" id="ap-fname" placeholder="Your first name"></div>
        <div class="form-group"><label>Last Name</label><input type="text" id="ap-lname" placeholder="Your last name"></div>
      </div>
      <div class="form-group"><label>Email Address</label><input type="email" id="ap-email" placeholder="you@example.com" required pattern="[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,}$" title="Please enter a valid email address"></div>
      <div class="form-group"><label>LinkedIn Profile URL</label><input type="text" id="ap-linkedin" placeholder="linkedin.com/in/yourname"></div>
      <div class="form-group">
        <label>Area of Expertise</label>
        <select id="ap-expertise">
          <option value="">Select your area…</option>
          <option>Data Science &amp; Machine Learning</option>
          <option>Cybersecurity &amp; Ethical Hacking</option>
          <option>Software Engineering</option>
          <option>Web Development</option>
          <option>Cloud Computing</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label>Years of Professional Experience</label>
        <select id="ap-years">
          <option value="">Select…</option>
          <option>1–2 years</option>
          <option>3–5 years</option>
          <option>6–10 years</option>
          <option>10+ years</option>
        </select>
      </div>
      <div class="form-group">
        <label>Have you taught or mentored before?</label>
        <select id="ap-taught">
          <option value="">Select…</option>
          <option>Yes — formally (university / bootcamp)</option>
          <option>Yes — informally (mentoring / workshops)</option>
          <option>No — first time</option>
        </select>
      </div>
      <button class="modal-submit terra" onclick="submitApply()"><span id="ap-btn-txt">Submit Application →</span></button>
    </div>
    <div class="success-state" id="apply-success">
      <div class="success-icon">🙌</div>
      <div class="success-title">Application received!</div>
      <p class="success-msg">Thank you for your interest in teaching with Tween Learning. Our team will review your application and reach out within 5 business days.</p>
      <button class="success-close" onclick="closeModal('apply-modal')">Done</button>
    </div>
  </div>
</div>

<script>
// ── COUNTDOWN ──
const launchDate = new Date('2025-07-14T09:00:00');
function updateCountdown() {
  let diff = launchDate - new Date();
  if (diff <= 0) { ['days','hours','mins','secs'].forEach(id => document.getElementById('cd-'+id).textContent='00'); return; }
  const d = Math.floor(diff/86400000); diff -= d*86400000;
  const h = Math.floor(diff/3600000);  diff -= h*3600000;
  const m = Math.floor(diff/60000);    diff -= m*60000;
  const s = Math.floor(diff/1000);
  document.getElementById('cd-days').textContent  = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(s).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown, 1000);

// ── MODAL HELPERS ──
function openEnroll(prog) {
  document.getElementById('enroll-modal-title').textContent = 'Enroll: ' + prog;
  document.getElementById('ef-program').value = prog;
  document.getElementById('enroll-form-body').style.display = '';
  document.getElementById('enroll-success').style.display = 'none';
  openModal('enroll-modal');
}
function openWaitlistModal() {
  document.getElementById('wlm-body').style.display = '';
  document.getElementById('wlm-success').style.display = 'none';
  openModal('wl-modal');
}
function openApply() {
  document.getElementById('apply-body').style.display = '';
  document.getElementById('apply-success').style.display = 'none';
  openModal('apply-modal');
}
function openModal(id) { document.getElementById(id).classList.add('active'); document.body.style.overflow='hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('active'); document.body.style.overflow=''; }
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if(e.target===o) closeModal(o.id); }));
document.addEventListener('keydown', e => { if(e.key==='Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id)); });

// ── FORM SUBMISSIONS ──
function validateEmail(email) {
  const pattern = /^[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,}$/;
  return pattern.test(email);
}
function submitEnroll() {
  const fname = document.getElementById('ef-fname').value.trim();
  const lname = document.getElementById('ef-lname').value.trim();
  const email = document.getElementById('ef-email').value.trim();
  const country = document.getElementById('ef-country').value.trim();
  const background = document.getElementById('ef-bg').value.trim();
  const program = document.getElementById('ef-program').value.trim();
  
  if (!fname || !lname || !email || !country || !background || !program) { 
    alert('Please fill in all fields.'); return; 
  }
  if (!validateEmail(email)) { 
    alert('Please use the correct email format: user@domain.com (lowercase only, no special characters like + or %)'); return; 
  }
  
  const btn = document.getElementById('enroll-btn-txt'); 
  btn.textContent = 'Submitting…';
  
  fetch('/api/enroll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: fname,
      lastName: lname,
      email: email,
      country: country,
      background: background,
      programName: program
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      document.getElementById('enroll-form-body').style.display='none';
      document.getElementById('enroll-success').style.display='flex';
    } else {
      alert('Error: ' + (data.error || 'Something went wrong'));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Network error. Please try again.');
  })
  .finally(() => {
    btn.textContent = 'Submit Enrollment →';
  });
}
function submitWlModal() {
  const fname = document.getElementById('wlm-fname');
  const lname = document.getElementById('wlm-lname');
  const email = document.getElementById('wlm-email');
  const interestArea = document.getElementById('wlm-interest');
  
  if (!fname || !lname || !email || !interestArea) { 
    alert('Please fill in all fields.'); return; 
  }
  if (!fname.value || !lname.value || !email.value) { 
    alert('Please fill in all fields with valid values.'); return; 
  }
  if (!validateEmail(email.value)) { 
    alert('Please use the correct email format: user@domain.com (lowercase only, no special characters like + or %)'); return; 
  }
  
  const btn = document.getElementById('wlm-btn-txt'); 
  if (btn) btn.textContent = 'Adding…';
  
  fetch('/api/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: fname.value + ' ' + lname.value,
      email: email.value,
      interestArea: interestArea.value || 'OTHER'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const body = document.getElementById('wlm-body');
      const success = document.getElementById('wlm-success');
      if (body) body.style.display='none';
      if (success) success.style.display='flex';
    } else {
      alert('Error: ' + (data.error || 'Something went wrong'));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Network error. Please try again.');
  })
  .finally(() => {
    if (btn) btn.textContent = 'Join Waitlist →';
  });
}
function submitApply() {
  const fname = document.getElementById('ap-fname').value.trim();
  const email = document.getElementById('ap-email').value.trim();
  if (!fname || !email) { alert('Please fill in your name and email.'); return; }
  if (!validateEmail(email)) { alert('Please use the correct email format: user@domain.com (lowercase only, no special characters like + or %)'); return; }
  const btn = document.getElementById('ap-btn-txt'); btn.textContent = 'Submitting…';
  setTimeout(() => { document.getElementById('apply-body').style.display='none'; document.getElementById('apply-success').style.display='flex'; btn.textContent='Submit Application →'; }, 1200);
}
function submitWaitlist() {
  const fname = document.getElementById('wl-fname');
  const lname = document.getElementById('wl-lname');
  const email = document.getElementById('wl-email');
  const interestArea = document.getElementById('wl-interest');
  console.log('Selected interest area:', interestArea?.value); // Debug log
  
  if (!fname || !lname || !email) { 
    alert('Please fill in your name and email.'); return; 
  }
  if (!fname.value || !lname.value || !email.value) { 
    alert('Please fill in all fields with valid values.'); return; 
  }
  if (!validateEmail(email.value)) { 
    alert('Please use the correct email format: user@domain.com (lowercase only, no special characters like + or %)'); return; 
  }
  
  const requestBody = {
    fullName: fname.value + ' ' + lname.value,
    email: email.value,
    interestArea: interestArea?.value || 'OTHER'
  };
  
  console.log('Request body:', JSON.stringify(requestBody, null, 2)); // Debug log
  
  const btn = document.getElementById('wl-btn-txt'); 
  if (btn) btn.textContent = 'Adding you…';
  
  fetch('/api/waitlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const form = document.getElementById('wl-form');
      const success = document.getElementById('wl-success');
      if (form) form.style.display='none';
      if (success) success.style.display='block';
    } else {
      alert('Error: ' + (data.error || 'Something went wrong'));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Network error. Please try again.');
  })
  .finally(() => {
    if (btn) btn.textContent = 'Join Waitlist →';
  });
}

// ── FAQ ──
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── MOBILE MENU ──
function toggleMobile() { document.getElementById('mobile-menu').classList.toggle('open'); }
function closeMobile() { document.getElementById('mobile-menu').classList.remove('open'); }
</script>
</body>
</html>    ` }} />
  )
}
